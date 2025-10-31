from typing import List

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
