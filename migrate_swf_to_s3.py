"""Migrate SWF files from Google Cloud Storage to an S3 bucket."""

import argparse
import logging
import os
from typing import Iterable

from google.cloud import storage
import boto3


def _migrate(
    gcs_client: storage.Client,
    s3_client,
    gcs_bucket: str,
    s3_bucket: str,
    prefix: str = "",
    dry_run: bool = False,
    skip_existing: bool = False,
) -> None:
    """Internal helper used so we can inject clients for testing."""
    bucket = gcs_client.bucket(gcs_bucket)
    blobs: Iterable = gcs_client.list_blobs(bucket, prefix=prefix)
    from tqdm import tqdm

    for blob in tqdm(list(blobs)):
        if skip_existing:
            try:
                s3_client.head_object(Bucket=s3_bucket, Key=blob.name)
                logging.info("skip %s", blob.name)
                continue
            except Exception:
                pass
        if dry_run:
            logging.info("would upload %s", blob.name)
            continue
        data = blob.download_as_bytes()
        content_type = blob.content_type or "application/x-shockwave-flash"
        s3_client.put_object(
            Bucket=s3_bucket,
            Key=blob.name,
            Body=data,
            ContentType=content_type,
        )
        logging.info("uploaded %s", blob.name)


def migrate(
    gcs_bucket: str | None,
    s3_bucket: str | None,
    prefix: str = "",
    dry_run: bool = False,
    skip_existing: bool = False,
) -> None:
    if gcs_bucket is None:
        gcs_bucket = os.environ.get("GCS_BUCKET")
    if s3_bucket is None:
        s3_bucket = os.environ.get("S3_BUCKET")
    gcs_client = storage.Client()
    s3_client = boto3.client("s3")
    _migrate(
        gcs_client,
        s3_client,
        gcs_bucket,
        s3_bucket,
        prefix,
        dry_run=dry_run,
        skip_existing=skip_existing,
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="copy swf files from gcs to s3")
    parser.add_argument("gcs_bucket", nargs="?")
    parser.add_argument("s3_bucket", nargs="?")
    parser.add_argument("--prefix", default="")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--skip-existing", action="store_true")
    args = parser.parse_args()
    migrate(
        args.gcs_bucket,
        args.s3_bucket,
        args.prefix,
        dry_run=args.dry_run,
        skip_existing=args.skip_existing,
    )
