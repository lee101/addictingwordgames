# Progressive Test Runner Documentation

A comprehensive test running system that progressively discovers and reports broken tests across Python, JavaScript, and Jasmine test suites.

## Features

- **Fail-Fast Mode**: Stops on first failure for quick feedback
- **Progressive Discovery**: Iteratively finds broken tests
- **Multi-Framework Support**: Python (pytest), JavaScript (Node.js), Jasmine, JSCheck
- **Detailed Error Reporting**: Shows only broken test logs and exceptions
- **Parallel Execution**: Optional parallel test suite execution
- **Page Error Detection**: Static analysis for JavaScript errors in HTML pages

## Components

### 1. `test_runner.py`
Main Python test runner that handles pytest and JavaScript tests.

```bash
# Run with fail-fast (default)
python test_runner.py

# Run all tests without stopping
python test_runner.py --no-fail-fast

# Verbose output
python test_runner.py --verbose

# JSON output for integration
python test_runner.py --json
```

### 2. `jasmine_runner.js`
Dedicated Jasmine test runner for spec files.

```bash
# Run Jasmine tests
node jasmine_runner.js

# Run without fail-fast
node jasmine_runner.js --no-fail-fast

# Verbose mode
node jasmine_runner.js --verbose
```

### 3. `test_orchestrator.py`
Master orchestrator that combines all test frameworks.

```bash
# Run all test suites
python test_orchestrator.py

# Run in parallel (when not using fail-fast)
python test_orchestrator.py --parallel --no-fail-fast

# Verbose output
python test_orchestrator.py --verbose
```

## Test Discovery

The system automatically discovers tests using these patterns:

**Python Tests:**
- `tests/test_*.py` (configured in pytest.ini)
- Uses pytest for execution

**JavaScript Tests:**
- `*test*.js`
- `*spec*.js`
- Excludes `node_modules`

**Jasmine Tests:**
- `*.spec.js`
- `*Spec.js`

## Fail-Fast Behavior

When enabled (default), the test runner will:
1. Stop immediately on first test failure
2. Report the broken test details
3. Exit with non-zero status

This provides rapid feedback during development.

## Error Reporting

The system reports:
- Test name and file location
- Error messages and stack traces (limited to 500 chars)
- Failure counts by category
- First failure details in fail-fast mode

## Example Output

### Successful Run
```
======================================================================
🎯 Test Orchestrator - Progressive Test Discovery
======================================================================
Mode: Fail-Fast
Execution: Sequential

🐍 Running Python tests...
✅ All Python tests passed

📊 Test Summary
======================================================================
⏱️  Time: 2.04s
📈 Total: 20 tests
✅ Passed: 20
❌ Failed: 0

✨ All tests passed!
```

### Failed Test
```
❌ BROKEN TEST FOUND: tests/test_example.py::test_failing
----------------------------------------
AssertionError: Expected 20 but got 10
----------------------------------------

🛑 Stopping on first failure (fail-fast mode)
```

## Integration with CI/CD

The test runners exit with appropriate status codes:
- `0`: All tests passed
- `1`: One or more tests failed

This makes them suitable for CI/CD pipelines:

```yaml
# GitHub Actions example
- name: Run Tests
  run: python test_orchestrator.py
```

## Adding New Tests

1. **Python**: Add `test_*.py` files to `tests/` directory
2. **JavaScript**: Add `*.test.js` or `*.spec.js` files
3. **Jasmine**: Add `*.spec.js` files

The runners will automatically discover and execute new tests.

## Performance Tips

1. Use fail-fast during development for quick feedback
2. Use parallel execution for full test runs
3. Focus on specific test files when debugging:
   ```bash
   python -m pytest tests/test_specific.py -v
   ```

## Troubleshooting

### Tests Not Found
- Check file naming patterns
- Ensure tests are not in excluded directories
- Verify pytest.ini configuration

### Timeout Issues
- Default timeout is 60s for Python, 10s for JavaScript
- Adjust in the respective runner files if needed

### JSON Parsing Errors
- Use `--json` flag for machine-readable output
- Ensure no print statements in test code when using JSON mode