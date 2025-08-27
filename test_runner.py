#!/usr/bin/env python3
"""
Progressive Test Runner - Finds and reports broken tests efficiently
Supports Python (pytest) and JavaScript tests
"""

import subprocess
import json
import sys
import os
import re
import traceback
from pathlib import Path
from typing import List, Dict, Tuple, Optional
import time

class TestRunner:
    def __init__(self, verbose=False, json_output=False):
        self.verbose = verbose
        self.json_output = json_output
        self.broken_tests = []
        self.passed_tests = []
        self.test_results = {}
        
    def run_python_tests(self, fail_fast=True) -> Tuple[bool, List[Dict]]:
        """Run Python tests using pytest"""
        if not self.json_output:
            print("🔍 Running Python tests...")
        
        cmd = ['python', '-m', 'pytest', 'tests/', '-v', '--tb=short']
        if fail_fast:
            cmd.append('-x')  # Stop on first failure
            
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=60
            )
            
            # Parse pytest output
            lines = result.stdout.split('\n')
            test_results = []
            
            for line in lines:
                # Match test result lines
                if '::test_' in line:
                    if 'PASSED' in line:
                        test_name = line.split('::')[1].split(' ')[0]
                        test_results.append({
                            'name': test_name,
                            'file': line.split('::')[0],
                            'status': 'PASSED',
                            'output': ''
                        })
                    elif 'FAILED' in line:
                        test_name = line.split('::')[1].split(' ')[0]
                        # Extract error details from stderr
                        error_output = self._extract_pytest_error(result.stdout + result.stderr, test_name)
                        test_results.append({
                            'name': test_name,
                            'file': line.split('::')[0],
                            'status': 'FAILED',
                            'output': error_output
                        })
                        if fail_fast:
                            return False, test_results
                            
            return result.returncode == 0, test_results
            
        except subprocess.TimeoutExpired:
            return False, [{'name': 'timeout', 'status': 'FAILED', 'output': 'Tests timed out after 60 seconds'}]
        except Exception as e:
            return False, [{'name': 'error', 'status': 'FAILED', 'output': str(e)}]
    
    def _extract_pytest_error(self, output: str, test_name: str) -> str:
        """Extract error details for a specific test from pytest output"""
        lines = output.split('\n')
        error_lines = []
        capture = False
        
        for i, line in enumerate(lines):
            if test_name in line and 'FAILED' in line:
                capture = True
                continue
            if capture:
                if line.startswith('=') or line.startswith('_'):
                    break
                if line.strip():
                    error_lines.append(line)
                    
        return '\n'.join(error_lines[:20])  # Limit output
    
    def run_javascript_tests(self, test_files: List[str], fail_fast=True) -> Tuple[bool, List[Dict]]:
        """Run JavaScript tests using Node.js"""
        if not self.json_output:
            print("🔍 Running JavaScript tests...")
        
        test_results = []
        all_passed = True
        
        for test_file in test_files:
            if not Path(test_file).exists():
                continue
                
            if not self.json_output:
                print(f"  Testing: {test_file}")
            
            # Create a test wrapper that exports results
            wrapper_script = f"""
const fs = require('fs');
const path = require('path');

// Mock test results collector
global.testResults = [];
global.currentTest = null;

// Mock console.error to capture errors
const originalError = console.error;
console.error = function(...args) {{
    if (global.currentTest) {{
        global.currentTest.errors = global.currentTest.errors || [];
        global.currentTest.errors.push(args.join(' '));
    }}
    originalError.apply(console, args);
}};

try {{
    // Load the test file
    require('{test_file}');
    
    // Output results
    console.log('TEST_RESULTS:' + JSON.stringify(global.testResults));
}} catch (error) {{
    console.log('TEST_RESULTS:' + JSON.stringify([{{
        name: '{test_file}',
        status: 'FAILED',
        error: error.message,
        stack: error.stack
    }}]));
}}
"""
            
            try:
                result = subprocess.run(
                    ['node', '-e', wrapper_script],
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                
                # Parse results
                output = result.stdout + result.stderr
                if 'TEST_RESULTS:' in output:
                    results_json = output.split('TEST_RESULTS:')[1].split('\n')[0]
                    results = json.loads(results_json)
                    test_results.extend(results)
                    
                    for test in results:
                        if test.get('status') == 'FAILED':
                            all_passed = False
                            if fail_fast:
                                return False, test_results
                else:
                    # Check if there were runtime errors
                    if result.returncode != 0:
                        test_results.append({
                            'name': test_file,
                            'status': 'FAILED',
                            'output': output[:500]
                        })
                        all_passed = False
                        if fail_fast:
                            return False, test_results
                            
            except subprocess.TimeoutExpired:
                test_results.append({
                    'name': test_file,
                    'status': 'FAILED',
                    'output': 'Test timed out after 10 seconds'
                })
                all_passed = False
                if fail_fast:
                    return False, test_results
            except Exception as e:
                test_results.append({
                    'name': test_file,
                    'status': 'FAILED',
                    'output': str(e)
                })
                all_passed = False
                if fail_fast:
                    return False, test_results
                    
        return all_passed, test_results
    
    def find_javascript_tests(self) -> List[str]:
        """Find JavaScript test files"""
        test_patterns = ['*test*.js', '*spec*.js']
        test_files = []
        
        # Look in common test directories
        test_dirs = ['tests', 'test', 'spec', 'static']
        
        for test_dir in test_dirs:
            if Path(test_dir).exists():
                for pattern in test_patterns:
                    test_files.extend(Path(test_dir).glob(f'**/{pattern}'))
                    
        # Filter out node_modules
        test_files = [str(f) for f in test_files if 'node_modules' not in str(f)]
        
        return test_files
    
    def run_all_tests(self, fail_fast=True):
        """Run all tests and collect results"""
        if not self.json_output:
            print("=" * 60)
            print("🚀 Progressive Test Runner")
            print("=" * 60)
        
        # Run Python tests
        py_passed, py_results = self.run_python_tests(fail_fast=fail_fast)
        
        # Process Python results
        for result in py_results:
            if result['status'] == 'FAILED':
                self.broken_tests.append(result)
                if not self.json_output:
                    print(f"\n❌ BROKEN TEST FOUND: {result.get('file', '')}::{result['name']}")
                    print("-" * 40)
                    print(result['output'][:500])  # Limit output
                    print("-" * 40)
                
                if fail_fast:
                    if not self.json_output:
                        print("\n🛑 Stopping on first failure (fail-fast mode)")
                    return False
            else:
                self.passed_tests.append(result)
                
        # Find and run JavaScript tests
        js_test_files = self.find_javascript_tests()
        if js_test_files:
            js_passed, js_results = self.run_javascript_tests(js_test_files, fail_fast=fail_fast)
            
            for result in js_results:
                if result['status'] == 'FAILED':
                    self.broken_tests.append(result)
                    if not self.json_output:
                        print(f"\n❌ BROKEN TEST FOUND: {result['name']}")
                        print("-" * 40)
                        print(result.get('output', result.get('error', 'Unknown error'))[:500])
                        print("-" * 40)
                    
                    if fail_fast:
                        if not self.json_output:
                            print("\n🛑 Stopping on first failure (fail-fast mode)")
                        return False
                else:
                    self.passed_tests.append(result)
                    
        return len(self.broken_tests) == 0
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 Test Summary")
        print("=" * 60)
        
        total = len(self.passed_tests) + len(self.broken_tests)
        print(f"Total tests: {total}")
        print(f"✅ Passed: {len(self.passed_tests)}")
        print(f"❌ Failed: {len(self.broken_tests)}")
        
        if self.broken_tests:
            print("\n🔴 Broken Tests:")
            for test in self.broken_tests:
                print(f"  - {test.get('file', test['name'])}::{test.get('name', '')}")
                
        if self.verbose and self.passed_tests:
            print("\n🟢 Passed Tests:")
            for test in self.passed_tests:
                print(f"  - {test.get('file', test['name'])}::{test.get('name', '')}")


def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Progressive Test Runner')
    parser.add_argument('--no-fail-fast', action='store_true', 
                       help='Continue running tests after first failure')
    parser.add_argument('--verbose', '-v', action='store_true',
                       help='Show all test results')
    parser.add_argument('--json', action='store_true',
                       help='Output results as JSON')
    
    args = parser.parse_args()
    
    runner = TestRunner(verbose=args.verbose, json_output=args.json)
    success = runner.run_all_tests(fail_fast=not args.no_fail_fast)
    
    if args.json:
        # Only output JSON, no other text
        result = {
            'success': success,
            'broken_tests': runner.broken_tests,
            'passed_tests': runner.passed_tests if args.verbose else []
        }
        sys.stdout.write(json.dumps(result))
        sys.stdout.flush()
    else:
        runner.print_summary()
    
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()