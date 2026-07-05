# Addicting Word Games

Addicting Word Games uses Twitter Bootstrap, JQuery and Python running on the Google app engine.

http://www.addictingwordgames.com is a puzzle games portal.

## Featured Games

**Infinite Wordle** (`/wordle`) - Classic word-guessing game with unlimited plays. Guess the 5-letter word with color-coded feedback.

**Word Phzzle** (`/word-phzzle`) - Unscramble words with TTS support! Features difficulty levels and dark mode.

**Word Jumble** (`/word-jumble`) - Fast-paced word unscrambling with timer, lives system, and auto-scaling difficulty.

**Typing Game** (`/typing-game`) - Catch falling letters before they hit the bottom! Test your typing speed.

## Setup

```bash
pip install -r requirements.txt
gunicorn -b :5050 main:app
```

Run:
```bash
GOOGLE_APPLICATION_CREDENTIALS=secrets/google-credentials.json  gunicorn -k gthread -b :8891 main:app --timeout 120 --workers 2 --threads 1
``` 

## SQLite Support

The project now includes simple SQLite models located in `sqlite_models.py`.
To migrate existing Google Cloud Datastore (NDB) data into SQLite run:

```bash
source .venv/bin/activate
python migrate_ndb_to_sqlite.py YOUR_GCP_PROJECT_ID --db wordgames.db
```
The SQLite path can also be set using the `WORDGAMES_DB` environment variable.
A helper CLI `sqlite_cli.py` is provided for quick inspection of tables:

```bash
python sqlite_cli.py users --limit 5 --db wordgames.db
```

## Flash SWF Migration

Old Flash games stored in Google Cloud Storage can be copied into an S3/R2 bucket using `migrate_swf_to_s3.py`:

```bash
python migrate_swf_to_s3.py games.addictingwordgames.com addictionwordgamesstatic.addictingwordgames.com
```
Use `--prefix` to limit which objects are copied. The script supports `--dry-run`
and `--skip-existing` flags for safer migrations. Bucket names may also be
provided via the `GCS_BUCKET` and `S3_BUCKET` environment variables.

## Flash Content Storage

Crawled Flash metadata is stored through the `flash_models.FlashGame` NDB
entity. Binary SWF payloads and thumbnails are downloaded and written to the
configured S3 bucket via `flash_storage.FlashAssetStorage` which records the
checksum, MIME type, and storage path for each asset.

### Configuration

Set the following environment variables (or adjust them in `app.yaml`) so the
storage helper can reach your bucket and AWS credentials:

- `FLASH_STORAGE_BUCKET` – destination bucket (e.g. R2 or S3)
- `FLASH_STORAGE_PREFIX` – prefix under which assets will be written
- `FLASH_STORAGE_REGION` – AWS region for the S3 endpoint
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` – credentials with write access

### CLI Utilities

Use `flash_cli.py` to inspect Flash metadata stored in Datastore:

```bash
python flash_cli.py list --limit 5
python flash_cli.py get 4b8de0c3...
```

Filtering by tag is supported via `--tag`.

