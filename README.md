

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
