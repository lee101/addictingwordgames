import os
import sqlite3
import pytest

from sqlite_models import SQLiteDB


def test_create_and_insert(tmp_path):
    db_path = tmp_path / "test.db"
    db = SQLiteDB(str(db_path))

    db.insert("users", ["id", "name"], ["u1", "Test"])
    row = db.fetchone("users", "id=?", ["u1"])
    assert row[0] == "u1"
    assert row[2] == "Test"

def test_export_json(tmp_path):
    db_path = tmp_path / "test.db"
    db = SQLiteDB(str(db_path))
    db.insert("users", ["id", "name"], ["u2", "Bob"])
    data = db.export_json("users")
    assert data[0]["id"] == "u2"
    assert data[0]["name"] == "Bob"
from subprocess import check_output


def test_cli(tmp_path):
    db_path = tmp_path / "test.db"
    db = SQLiteDB(str(db_path))
    db.insert("users", ["id", "name"], ["u3", "CLI"])
    out = check_output([
        "python",
        "sqlite_cli.py",
        "users",
        "--limit",
        "1",
        "--db",
        str(db_path),
    ])
    assert "u3" in out.decode()
