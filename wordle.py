from typing import List
import os

DEFAULT_WORD_LIST = os.path.join(os.path.dirname(__file__), 'static',
                                 'wordle_words.txt')

def evaluate_guess(secret: str, guess: str) -> List[str]:
    """Evaluate a guess against the secret word.

    Returns a list with values 'green', 'yellow' or 'gray' per letter."""
    secret = secret.upper()
    guess = guess.upper()
    result = ['gray'] * len(secret)
    secret_remaining = list(secret)

    # First pass for greens
    for i, (s, g) in enumerate(zip(secret, guess)):
        if g == s:
            result[i] = 'green'
            secret_remaining[i] = None

    # Second pass for yellows
    for i, g in enumerate(guess):
        if result[i] == 'green':
            continue
        if g in secret_remaining:
            result[i] = 'yellow'
            secret_remaining[secret_remaining.index(g)] = None
    return result


def load_words(path: str = DEFAULT_WORD_LIST) -> List[str]:
    """Load a list of words from ``path``.

    Only five-letter words are returned and they are normalized to uppercase."""
    with open(path, 'r', encoding='utf-8') as fh:
        return [w.strip().upper() for w in fh if len(w.strip()) == 5]
