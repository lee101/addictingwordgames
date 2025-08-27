#!/usr/bin/env python3
"""
Sync images from Google Cloud Storage to Cloudflare R2
"""

import os
import sys
import json
import boto3
from google.cloud import storage as gcs
from concurrent.futures import ThreadPoolExecutor, as_completed
import hashlib
import mimetypes

# Configuration
GCS_BUCKETS = [
    'wordgames',
    'games.addictingwordgames.com'
]

# R2 Configuration - Update these with your actual values
R2_ACCOUNT_ID = os.environ.get('R2_ACCOUNT_ID', 'f76d25b8b86cfa5638f43016510d8f77')
# Use AWS CLI credentials if R2 credentials not set
import subprocess
try:
    # Get AWS credentials from AWS CLI config
    aws_creds = subprocess.run(['aws', 'configure', 'get', 'aws_access_key_id'], 
                              capture_output=True, text=True)
    aws_secret = subprocess.run(['aws', 'configure', 'get', 'aws_secret_access_key'], 
                               capture_output=True, text=True)
    R2_ACCESS_KEY_ID = os.environ.get('R2_ACCESS_KEY_ID', aws_creds.stdout.strip())
    R2_SECRET_ACCESS_KEY = os.environ.get('R2_SECRET_ACCESS_KEY', aws_secret.stdout.strip())
except:
    R2_ACCESS_KEY_ID = os.environ.get('R2_ACCESS_KEY_ID', '')
    R2_SECRET_ACCESS_KEY = os.environ.get('R2_SECRET_ACCESS_KEY', '')
R2_BUCKET_NAME = 'addictingwordgamesstatic'
R2_CUSTOM_DOMAIN = 'addictingwordgamesstatic.addictingwordgames.com'

# Set Google credentials
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'secrets/google-credentials.json'

def get_r2_client():
    """Create R2 client using boto3"""
    return boto3.client(
        's3',
        endpoint_url=f'https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com',
        aws_access_key_id=R2_ACCESS_KEY_ID,
        aws_secret_access_key=R2_SECRET_ACCESS_KEY,
        region_name='auto'
    )

def get_file_hash(content):
    """Calculate MD5 hash of content"""
    return hashlib.md5(content).hexdigest()

def sync_blob(gcs_client, r2_client, bucket_name, blob_name, dry_run=False):
    """Sync a single blob from GCS to R2"""
    try:
        # Get GCS blob
        bucket = gcs_client.bucket(bucket_name)
        blob = bucket.blob(blob_name)
        
        if not blob.exists():
            print(f"Skipping non-existent blob: {bucket_name}/{blob_name}")
            return False
        
        # Determine the R2 key path
        if bucket_name == 'wordgames':
            r2_key = blob_name
        else:
            # For games.addictingwordgames.com, preserve the path structure
            r2_key = f"games/{blob_name}"
        
        # Check if already exists in R2 with same content
        try:
            r2_obj = r2_client.head_object(Bucket=R2_BUCKET_NAME, Key=r2_key)
            r2_etag = r2_obj.get('ETag', '').strip('"')
            
            # Download GCS content to check hash
            gcs_content = blob.download_as_bytes()
            gcs_hash = get_file_hash(gcs_content)
            
            if r2_etag == gcs_hash:
                print(f"✓ Already synced: {r2_key}")
                return True
        except r2_client.exceptions.NoSuchKey:
            # File doesn't exist in R2, need to upload
            gcs_content = blob.download_as_bytes()
        except Exception as e:
            gcs_content = blob.download_as_bytes()
        
        if dry_run:
            print(f"[DRY RUN] Would upload: {bucket_name}/{blob_name} -> {r2_key}")
            return True
        
        # Upload to R2
        content_type = blob.content_type or mimetypes.guess_type(blob_name)[0] or 'application/octet-stream'
        
        r2_client.put_object(
            Bucket=R2_BUCKET_NAME,
            Key=r2_key,
            Body=gcs_content,
            ContentType=content_type,
            CacheControl='public, max-age=31536000'  # 1 year cache
        )
        
        print(f"✓ Uploaded: {bucket_name}/{blob_name} -> {r2_key}")
        return True
        
    except Exception as e:
        print(f"✗ Error syncing {bucket_name}/{blob_name}: {str(e)}")
        return False

def list_all_blobs(gcs_client, bucket_name, prefix=None):
    """List all blobs in a GCS bucket"""
    bucket = gcs_client.bucket(bucket_name)
    return list(bucket.list_blobs(prefix=prefix))

def main(dry_run=False, specific_bucket=None):
    """Main sync function"""
    
    # Validate R2 credentials
    if not all([R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY]):
        print("Error: R2 credentials not set. Please set the following environment variables:")
        print("  - R2_ACCOUNT_ID")
        print("  - R2_ACCESS_KEY_ID")
        print("  - R2_SECRET_ACCESS_KEY")
        sys.exit(1)
    
    # Initialize clients
    print("Initializing clients...")
    gcs_client = gcs.Client()
    r2_client = get_r2_client()
    
    # Test R2 connection
    try:
        r2_client.head_bucket(Bucket=R2_BUCKET_NAME)
        print(f"✓ Connected to R2 bucket: {R2_BUCKET_NAME}")
    except Exception as e:
        print(f"Error: Cannot access R2 bucket '{R2_BUCKET_NAME}': {str(e)}")
        print("Make sure the bucket exists and credentials are correct.")
        sys.exit(1)
    
    buckets_to_sync = [specific_bucket] if specific_bucket else GCS_BUCKETS
    
    total_synced = 0
    total_failed = 0
    
    for bucket_name in buckets_to_sync:
        print(f"\nSyncing bucket: {bucket_name}")
        
        try:
            # List all blobs
            blobs = list_all_blobs(gcs_client, bucket_name)
            print(f"Found {len(blobs)} objects in {bucket_name}")
            
            # Sync blobs in parallel
            with ThreadPoolExecutor(max_workers=10) as executor:
                futures = []
                for blob in blobs:
                    if blob.name.endswith('/'):
                        continue  # Skip directories
                    
                    future = executor.submit(
                        sync_blob, 
                        gcs_client, 
                        r2_client, 
                        bucket_name, 
                        blob.name,
                        dry_run
                    )
                    futures.append(future)
                
                # Process results
                for future in as_completed(futures):
                    if future.result():
                        total_synced += 1
                    else:
                        total_failed += 1
                        
        except Exception as e:
            print(f"Error accessing bucket {bucket_name}: {str(e)}")
            continue
    
    print(f"\n{'=' * 50}")
    print(f"Sync Summary:")
    print(f"  Successfully synced: {total_synced}")
    print(f"  Failed: {total_failed}")
    
    if not dry_run:
        print(f"\nYour files are now available at:")
        print(f"  https://{R2_CUSTOM_DOMAIN}/")
        print(f"\nExample URLs:")
        print(f"  - Word games: https://{R2_CUSTOM_DOMAIN}/[image-name]")
        print(f"  - SWF games: https://{R2_CUSTOM_DOMAIN}/games/[game-name]")

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Sync GCS buckets to Cloudflare R2')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be synced without actually syncing')
    parser.add_argument('--bucket', help='Sync only a specific bucket')
    
    args = parser.parse_args()
    main(dry_run=args.dry_run, specific_bucket=args.bucket)