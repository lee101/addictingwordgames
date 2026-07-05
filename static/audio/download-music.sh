#!/bin/bash
# Download music from Pixabay and convert to opus
# Run this script after manually downloading MP3s from Pixabay

# Recommended tracks from Pixabay (visit these URLs to download):
#
# Tower Defense / Strategy:
# - https://pixabay.com/music/video-games-tower-defense-8-bit-chiptune-game-music-357519/
# - https://pixabay.com/music/video-games-356-8-bit-chiptune-game-music-357518/
# - https://pixabay.com/music/search/strategy%20game/
#
# Typing / Arcade:
# - https://pixabay.com/music/video-games-retro-game-arcade-236133/
# - https://pixabay.com/music/video-games-retro-chiptune-adventure-8-bit-video-game-music-318059/
# - https://pixabay.com/music/search/arcade/
#
# Puzzle / Word Games:
# - https://pixabay.com/music/video-games-puzzle-game-loop-bright-casual-video-game-music-116799/
# - https://pixabay.com/music/ambient-peaceful-garden-healing-light-piano-music-251789/
# - https://pixabay.com/music/search/puzzle/
#
# Wordle / Chill:
# - https://pixabay.com/music/ambient-lofi-chill-medium-version-159456/
# - https://pixabay.com/music/ambient-good-night-160166/

AUDIO_DIR="$(dirname "$0")"
cd "$AUDIO_DIR"

# Convert all mp3 files to opus with good compression for web
for f in *.mp3; do
    [ -f "$f" ] || continue
    name="${f%.mp3}"
    echo "Converting $f to ${name}.opus..."
    ffmpeg -y -i "$f" -c:a libopus -b:a 64k -vbr on "${name}.opus"
done

echo ""
echo "Conversion complete! Move the .opus files to appropriate game folders or keep in /static/audio/"
echo ""
echo "Suggested mapping:"
echo "  tower-defense.opus -> Typing Tower Defense"
echo "  arcade.opus -> Typing Game"
echo "  puzzle.opus -> Word Jumble, Word Phzzle"
echo "  chill.opus -> Infinite Wordle"
