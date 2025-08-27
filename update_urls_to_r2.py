#!/usr/bin/env python3
"""
Update URLs in the codebase to use R2 instead of Google Cloud Storage
"""

import os
import re

# URL mappings
URL_MAPPINGS = {
    'https://addictingwordgamesstatic.addictingwordgames.com/': 'https://addictingwordgamesstatic.addictingwordgames.com/',
    'https://addictingwordgamesstatic.addictingwordgames.com/games/': 'https://addictingwordgamesstatic.addictingwordgames.com/games/',
}

def update_file(filepath, dry_run=False):
    """Update URLs in a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes_made = False
        
        for old_url, new_url in URL_MAPPINGS.items():
            if old_url in content:
                content = content.replace(old_url, new_url)
                changes_made = True
                print(f"✓ Found and replaced URLs in: {filepath}")
        
        if changes_made and not dry_run:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
        elif changes_made and dry_run:
            print(f"[DRY RUN] Would update: {filepath}")
        
        return changes_made
    except Exception as e:
        print(f"✗ Error updating {filepath}: {str(e)}")
        return False

def find_files_to_update():
    """Find all Python, JavaScript, HTML, and CSS files"""
    extensions = ['.py', '.js', '.html', '.css', '.jsx', '.ts', '.tsx']
    files = []
    
    for root, dirs, filenames in os.walk('.'):
        # Skip virtual env and node_modules
        dirs[:] = [d for d in dirs if d not in ['.env', 'node_modules', '.git', '__pycache__']]
        
        for filename in filenames:
            if any(filename.endswith(ext) for ext in extensions):
                files.append(os.path.join(root, filename))
    
    return files

def main(dry_run=False):
    """Main function to update all URLs"""
    print("Searching for files to update...")
    files = find_files_to_update()
    print(f"Found {len(files)} files to check")
    
    updated_count = 0
    for filepath in files:
        if update_file(filepath, dry_run):
            updated_count += 1
    
    print(f"\n{'=' * 50}")
    print(f"Update Summary:")
    print(f"  Files updated: {updated_count}")
    
    if dry_run:
        print("\n[DRY RUN] No files were actually modified.")
        print("Run without --dry-run to apply changes.")
    else:
        print("\n✓ URL updates complete!")
        print("Your app will now use the R2 bucket for static assets.")

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Update URLs from GCS to R2')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be changed without actually changing')
    
    args = parser.parse_args()
    main(dry_run=args.dry_run)