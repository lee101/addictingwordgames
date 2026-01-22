# Addicting Word Games

[![Python 3.11](https://img.shields.io/badge/python-3.11-blue.svg?logo=python&logoColor=white)](https://www.python.org/downloads/)
[![License: ISC](https://img.shields.io/badge/license-ISC-green.svg)](https://opensource.org/licenses/ISC)
[![pytest](https://img.shields.io/badge/testing-pytest-yellow.svg?logo=pytest&logoColor=white)](https://pytest.org/)
[![Docker](https://img.shields.io/badge/docker-supported-blue.svg?logo=docker&logoColor=white)](https://www.docker.com/)
[![GitHub](https://img.shields.io/github/stars/lee101/addictingwordgames?style=social)](https://github.com/lee101/addictingwordgames)
[![Website](https://img.shields.io/badge/website-addictingwordgames.com-brightgreen.svg)](http://www.addictingwordgames.com)

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

