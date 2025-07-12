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


def test_user_games_table(tmp_path):
    db_path = tmp_path / "test.db"
    db = SQLiteDB(str(db_path))
    db.insert_user_game("u1", "My Game", "http://example.com", "#111", 640, 480)
    row = db.fetchone("user_games", "user_id=?", ["u1"])
    assert row[2] == "My Game"
    assert row[3] == "http://example.com"
    assert row[4] == "#111"
    assert row[7] is not None
    db.update_user_game(row[0], "#222", 800, 600, "New Title", "http://new")
    updated = db.fetch_user_game(row[0])
    assert updated[2] == "New Title"
    assert updated[3] == "http://new"
    assert updated[4] == "#222"
    db.delete_user_game(row[0])
    assert db.fetch_user_game(row[0]) is None

def test_user_games_listing_order(tmp_path):
    db_path = tmp_path / "test.db"
    db = SQLiteDB(str(db_path))
    db.insert_user_game("u1", "Game1", "url1", "#111", 640, 480)
    db.insert_user_game("u1", "Game2", "url2", "#222", 640, 480)
    rows = db.list_user_games("u1")
    assert rows[0][2] == "Game2"
    assert rows[1][2] == "Game1"
    all_rows = db.list_user_games()
    assert len(all_rows) == 2
