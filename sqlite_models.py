import sqlite3
from typing import Optional, Iterable


class SQLiteDB:
    """Simple wrapper around sqlite3 for storing word game data."""

    def __init__(self, path: str = None):
        if path is None:
            import os
            path = os.environ.get("WORDGAMES_DB", "wordgames.db")
        self.conn = sqlite3.connect(path)
        self.create_tables()

    def create_tables(self) -> None:
        cur = self.conn.cursor()
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                cookie_user INTEGER,
                name TEXT,
                email TEXT,
                profile_url TEXT,
                access_token TEXT,
                has_purchased INTEGER
            )
            """
        )
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS games (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                urltitle TEXT UNIQUE,
                description TEXT,
                instructions TEXT,
                url TEXT,
                width INTEGER,
                height INTEGER,
                imgwidth INTEGER,
                imgheight INTEGER
            )
            """
        )
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS scores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                score INTEGER,
                difficulty INTEGER,
                timedMode INTEGER,
                time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS highscores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                score INTEGER,
                difficulty INTEGER,
                timedMode INTEGER
            )
            """
        )
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS achievements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                type INTEGER,
                time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS photos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                full_size_image BLOB
            )
            """
        )
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS user_games (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                title TEXT,
                url TEXT,
                frame TEXT,
                width INTEGER,
                height INTEGER
            )
            """
        )
        self.conn.commit()

    def insert(self, table: str, cols: Iterable[str], values: Iterable) -> None:
        placeholders = ",".join("?" for _ in cols)
        sql = f"INSERT INTO {table} ({','.join(cols)}) VALUES ({placeholders})"
        self.conn.execute(sql, list(values))
        self.conn.commit()

    def fetchone(self, table: str, where: str, params: Iterable) -> Optional[tuple]:
        sql = f"SELECT * FROM {table} WHERE {where}"
        cur = self.conn.execute(sql, list(params))
        return cur.fetchone()

    def export_json(self, table: str) -> list:
        cur = self.conn.execute(f"SELECT * FROM {table}")
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, row)) for row in cur.fetchall()]

    # --- User uploaded games helpers ---
    def insert_user_game(self, user_id: str, title: str, url: str,
                         frame: str, width: int, height: int) -> None:
        self.insert(
            "user_games",
            ["user_id", "title", "url", "frame", "width", "height"],
            [user_id, title, url, frame, width, height],
        )

    def fetch_user_game(self, game_id: int) -> Optional[tuple]:
        return self.fetchone("user_games", "id=?", [game_id])

    def list_user_games(self, user_id: str | None = None) -> list:
        cur = (
            self.conn.execute(
                "SELECT * FROM user_games WHERE user_id=?" if user_id else "SELECT * FROM user_games",
                (user_id,) if user_id else (),
            )
        )
        return cur.fetchall()

    def delete_user_game(self, game_id: int) -> None:
        self.conn.execute("DELETE FROM user_games WHERE id=?", (game_id,))
        self.conn.commit()

    def update_user_game(self, game_id: int, frame: str, width: int, height: int) -> None:
        self.conn.execute(
            "UPDATE user_games SET frame=?, width=?, height=? WHERE id=?",
            (frame, width, height, game_id),
        )
        self.conn.commit()
