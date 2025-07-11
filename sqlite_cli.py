"""Simple CLI for interacting with the SQLite database."""

import argparse
import json
from sqlite_models import SQLiteDB


def show(table: str, limit: int, db: SQLiteDB) -> None:
    cur = db.conn.execute(f"SELECT * FROM {table} LIMIT ?", (limit,))
    rows = cur.fetchall()
    print(json.dumps(rows, indent=2))


def main() -> None:
    parser = argparse.ArgumentParser(description="query sqlite db")
    parser.add_argument("table", help="table name")
    parser.add_argument("--limit", type=int, default=10)
    parser.add_argument("--db", default="wordgames.db")
    args = parser.parse_args()
    db = SQLiteDB(args.db)
    show(args.table, args.limit, db)


if __name__ == "__main__":
    main()
