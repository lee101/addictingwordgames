

Addicting Word Games uses Twitter Bootstrap, JQuery and Python running on the Google app engine.

http://www.addictingwordgames.com is a puzzle games portal.

pip install -r requirements.txt 
gunicorn -b :5050 main:app

Run:
GOOGLE_APPLICATION_CREDENTIALS=secrets/google-credentials.json  gunicorn -k gthread -b :8891 main:app --timeout 120 --workers 2 --threads 1                 

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

