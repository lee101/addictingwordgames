"""Migrate data from Google Cloud NDB to local SQLite database."""

from typing import Iterable

from google.cloud import ndb

from models import User, Game, Score, HighScore, Achievement, Photo
from sqlite_models import SQLiteDB


def _copy_query(query: Iterable, table: str, cols: Iterable[str], db: SQLiteDB):
    for entity in query:
        values = [getattr(entity, c) for c in cols]
        db.insert(table, cols, values)


def migrate(project: str, sqlite_path: str = "wordgames.db") -> None:
    client = ndb.Client(project=project)
    db = SQLiteDB(sqlite_path)
    with client.context():
        _copy_query(User.query(), "users",
                    ["id", "cookie_user", "name", "email", "profile_url",
                     "access_token", "has_purchased"], db)
        _copy_query(Game.query(), "games",
                    ["title", "urltitle", "description", "instructions",
                     "url", "width", "height", "imgwidth", "imgheight"], db)
        _copy_query(Score.query(), "scores",
                    ["user", "score", "difficulty", "timedMode"], db)
        _copy_query(HighScore.query(), "highscores",
                    ["user", "score", "difficulty", "timedMode"], db)
        _copy_query(Achievement.query(), "achievements",
                    ["user", "type"], db)
        _copy_query(Photo.query(), "photos", ["title", "full_size_image"], db)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="migrate datastore to sqlite")
    parser.add_argument("project", help="Google Cloud project id")
    parser.add_argument("--db", default="wordgames.db", help="SQLite DB path")
    args = parser.parse_args()
    migrate(args.project, args.db)
