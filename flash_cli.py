"""CLI utilities for inspecting FlashGame Datastore records."""

from __future__ import annotations

import argparse
import json
from typing import Any, Iterable

from flash_models import FlashGame, get_client


def _serialise(game: FlashGame) -> dict[str, Any]:
    data = game.to_dict()
    data["key"] = game.key.urlsafe() if game.key else None
    for field in ("created", "updated", "crawled_at"):
        value = data.get(field)
        if value is not None:
            data[field] = value.isoformat()  # type: ignore[assignment]
    return data


def _print_games(games: Iterable[FlashGame]) -> None:
    for game in games:
        print(json.dumps(_serialise(game), indent=2))


def list_games(limit: int, tag: str | None) -> None:
    tag_value = tag.strip().lower() if tag else None
    with get_client().context():
        query = FlashGame.query()
        if tag_value:
            query = query.filter(FlashGame.tags == tag_value)
        games = query.order(-FlashGame.crawled_at, -FlashGame.created).fetch(limit)
    _print_games(games)


def get_game(checksum: str) -> None:
    with get_client().context():
        game = FlashGame.query(FlashGame.file_checksum == checksum).get()
    if game:
        _print_games([game])
    else:
        print("No FlashGame found for checksum", checksum)


def main() -> None:
    parser = argparse.ArgumentParser(description="Inspect FlashGame Datastore entries")
    subparsers = parser.add_subparsers(dest="command", required=True)

    list_parser = subparsers.add_parser("list", help="List FlashGame entries")
    list_parser.add_argument("--limit", type=int, default=10)
    list_parser.add_argument("--tag", help="Filter by tag", default=None)

    get_parser = subparsers.add_parser("get", help="Lookup a single FlashGame by checksum")
    get_parser.add_argument("checksum")

    args = parser.parse_args()
    if args.command == "list":
        list_games(args.limit, args.tag)
    elif args.command == "get":
        get_game(args.checksum)


if __name__ == "__main__":
    main()
