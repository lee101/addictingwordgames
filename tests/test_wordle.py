import wordle

def test_evaluate_guess_all_green():
    assert wordle.evaluate_guess('APPLE', 'APPLE') == ['green'] * 5

def test_evaluate_guess_yellow_and_green():
    # secret: GRAPE, guess: GRAIL -> first three correct (green)
    assert wordle.evaluate_guess('GRAPE', 'GRAIL') == ['green', 'green', 'green', 'gray', 'gray']

def test_evaluate_guess_with_duplicates():
    # secret: BANAL, guess: ALALA
    assert wordle.evaluate_guess('BANAL', 'ALALA') == ['yellow', 'yellow', 'yellow', 'gray', 'gray']


def test_load_words():
    words = wordle.load_words()
    assert len(words) > 1000
    assert all(len(w) == 5 for w in words)
