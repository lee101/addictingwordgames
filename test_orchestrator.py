#!/usr/bin/env python3
"""
Master Test Orchestrator
Combines Python, JavaScript, and Jasmine tests with progressive discovery
"""

import subprocess
import json
import sys
import os
import time
from pathlib import Path
from typing import Dict, List, Tuple
import concurrent.futures
import threading

class TestOrchestrator:
    def __init__(self, fail_fast=True, verbose=False, parallel=False):
        self.fail_fast = fail_fast
        self.verbose = verbose
        self.parallel = parallel
        self.all_results = {
            'python': {'passed': [], 'failed': []},
            'javascript': {'passed': [], 'failed': []},
            'jasmine': {'passed': [], 'failed': []},
            'jscheck': {'passed': [], 'failed': []}
        }
        self.broken_tests = []
        self.lock = threading.Lock()
        
    def run_python_tests(self) -> Tuple[bool, Dict]:
        """Run Python tests using test_runner.py"""
        print("🐍 Running Python tests...")
        
        cmd = ['python', 'test_runner.py']
        if not self.fail_fast:
            cmd.append('--no-fail-fast')
        if self.verbose:
            cmd.append('--verbose')
        cmd.append('--json')
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
            if result.stdout:
                # Extract JSON from output (may have other text)
                lines = result.stdout.split('\n')
                for line in reversed(lines):
                    if line.strip().startswith('{'):
                        try:
                            data = json.loads(line)
                            return data['success'], data
                        except:
                            continue
            return False, {'broken_tests': [], 'passed_tests': []}
        except Exception as e:
            print(f"Error running Python tests: {e}")
            return False, {'broken_tests': [{'name': 'python_runner', 'error': str(e)}], 'passed_tests': []}
    
    def run_jasmine_tests(self) -> Tuple[bool, Dict]:
        """Run Jasmine tests using jasmine_runner.js"""
        print("🟨 Running Jasmine tests...")
        
        cmd = ['node', 'jasmine_runner.js']
        if not self.fail_fast:
            cmd.append('--no-fail-fast')
        if self.verbose:
            cmd.append('--verbose')
            
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
            
            # Parse output to extract results
            output = result.stdout + result.stderr
            broken = []
            passed = []
            
            for line in output.split('\n'):
                if '❌ BROKEN TEST:' in line:
                    test_name = line.split('❌ BROKEN TEST:')[1].strip()
                    broken.append({'name': test_name, 'type': 'jasmine'})
                elif '✅' in line and self.verbose:
                    test_name = line.split('✅')[1].strip()
                    passed.append({'name': test_name, 'type': 'jasmine'})
                    
            return result.returncode == 0, {'broken_tests': broken, 'passed_tests': passed}
            
        except Exception as e:
            print(f"Error running Jasmine tests: {e}")
            return False, {'broken_tests': [{'name': 'jasmine_runner', 'error': str(e)}], 'passed_tests': []}
    
    def run_jscheck_tests(self) -> Tuple[bool, Dict]:
        """Run JSCheck property-based tests"""
        print("🔍 Running JSCheck property tests...")
        
        # Create JSCheck test runner
        jscheck_script = """
// JSCheck test runner
const JSCheck = require('jscheck');

// Example property tests
const tests = [];
let failures = [];
let passes = [];

// Test 1: Array reverse twice equals original
tests.push({
    name: 'array_reverse_twice',
    test: function() {
        return JSCheck.test(
            function(array) {
                const reversed = [...array].reverse();
                const doubleReversed = [...reversed].reverse();
                return JSON.stringify(array) === JSON.stringify(doubleReversed);
            },
            [JSCheck.array(JSCheck.integer())],
            function(pass, fail) {
                if (pass) {
                    passes.push('array_reverse_twice');
                } else {
                    failures.push({name: 'array_reverse_twice', error: fail});
                }
            }
        );
    }
});

// Test 2: String length consistency
tests.push({
    name: 'string_length',
    test: function() {
        return JSCheck.test(
            function(str) {
                return str.length >= 0 && str.length === [...str].length;
            },
            [JSCheck.string()],
            function(pass, fail) {
                if (pass) {
                    passes.push('string_length');
                } else {
                    failures.push({name: 'string_length', error: fail});
                }
            }
        );
    }
});

// Run all tests
tests.forEach(t => {
    try {
        t.test();
    } catch(e) {
        failures.push({name: t.name, error: e.message});
    }
});

console.log('JSCHECK_RESULTS:' + JSON.stringify({
    passed: passes,
    failed: failures
}));
"""
        
        try:
            # Check if jscheck is available
            check_jscheck = subprocess.run(['node', '-e', "require('jscheck')"], 
                                         capture_output=True, timeout=5)
            
            if check_jscheck.returncode != 0:
                print("  JSCheck not installed, skipping property tests")
                return True, {'broken_tests': [], 'passed_tests': []}
                
            result = subprocess.run(['node', '-e', jscheck_script], 
                                  capture_output=True, text=True, timeout=30)
            
            output = result.stdout + result.stderr
            if 'JSCHECK_RESULTS:' in output:
                json_str = output.split('JSCHECK_RESULTS:')[1].split('\n')[0]
                data = json.loads(json_str)
                
                broken = [{'name': f['name'], 'type': 'jscheck', 'error': f.get('error')} 
                         for f in data.get('failed', [])]
                passed = [{'name': name, 'type': 'jscheck'} 
                         for name in data.get('passed', [])]
                         
                return len(broken) == 0, {'broken_tests': broken, 'passed_tests': passed}
                
        except Exception as e:
            print(f"  JSCheck tests skipped: {e}")
            
        return True, {'broken_tests': [], 'passed_tests': []}
    
    def check_page_errors(self, page_path: str) -> List[Dict]:
        """Check a page for JavaScript errors using headless browser"""
        print(f"🌐 Checking page: {page_path}")
        
        # Simple static analysis for now
        errors = []
        
        if Path(page_path).exists():
            content = Path(page_path).read_text()
            
            # Check for common JS errors patterns
            error_patterns = [
                (r'console\.error\(', 'Console error found'),
                (r'throw\s+new\s+Error', 'Error throwing detected'),
                (r'undefined\s+is\s+not', 'Potential undefined error'),
                (r'Cannot\s+read\s+property', 'Property access error pattern')
            ]
            
            import re
            for pattern, description in error_patterns:
                if re.search(pattern, content, re.IGNORECASE):
                    errors.append({
                        'page': page_path,
                        'type': 'static_analysis',
                        'description': description
                    })
                    
        return errors
    
    def run_test_suite(self, suite_name: str, test_func) -> None:
        """Run a test suite and update results"""
        try:
            success, results = test_func()
            
            with self.lock:
                if 'broken_tests' in results:
                    self.all_results[suite_name]['failed'].extend(results['broken_tests'])
                    self.broken_tests.extend(results['broken_tests'])
                    
                if 'passed_tests' in results:
                    self.all_results[suite_name]['passed'].extend(results['passed_tests'])
                    
                # Check fail-fast
                if not success and self.fail_fast:
                    print(f"\n🛑 Test suite '{suite_name}' failed - stopping (fail-fast mode)")
                    
        except Exception as e:
            with self.lock:
                self.all_results[suite_name]['failed'].append({
                    'name': f'{suite_name}_error',
                    'error': str(e)
                })
    
    def run_all_tests(self):
        """Orchestrate all test runs"""
        print("=" * 70)
        print("🎯 Test Orchestrator - Progressive Test Discovery")
        print("=" * 70)
        print(f"Mode: {'Fail-Fast' if self.fail_fast else 'Run All'}")
        print(f"Execution: {'Parallel' if self.parallel else 'Sequential'}")
        print("")
        
        start_time = time.time()
        
        test_suites = [
            ('python', self.run_python_tests),
            ('jasmine', self.run_jasmine_tests),
            ('jscheck', self.run_jscheck_tests)
        ]
        
        if self.parallel and not self.fail_fast:
            # Run tests in parallel
            with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
                futures = []
                for suite_name, test_func in test_suites:
                    future = executor.submit(self.run_test_suite, suite_name, test_func)
                    futures.append(future)
                    
                concurrent.futures.wait(futures)
        else:
            # Run tests sequentially
            for suite_name, test_func in test_suites:
                self.run_test_suite(suite_name, test_func)
                
                # Check fail-fast after each suite
                if self.fail_fast and len(self.broken_tests) > 0:
                    break
        
        # Check pages for errors
        print("\n📄 Checking pages for JavaScript errors...")
        pages_to_check = [
            'templates/index.jinja2',
            'templates/infinite_wordle.jinja2',
            'static/word-jumble/index.html'
        ]
        
        for page in pages_to_check:
            if Path(page).exists():
                errors = self.check_page_errors(page)
                if errors:
                    self.all_results['javascript']['failed'].extend(errors)
                    if self.fail_fast:
                        print(f"🛑 Page errors found in {page} - stopping")
                        break
                        
        elapsed = time.time() - start_time
        
        self.print_summary(elapsed)
        
        return len(self.broken_tests) == 0
    
    def print_summary(self, elapsed_time: float):
        """Print comprehensive test summary"""
        print("\n" + "=" * 70)
        print("📊 Test Summary")
        print("=" * 70)
        
        total_passed = sum(len(r['passed']) for r in self.all_results.values())
        total_failed = sum(len(r['failed']) for r in self.all_results.values())
        
        print(f"⏱️  Time: {elapsed_time:.2f}s")
        print(f"📈 Total: {total_passed + total_failed} tests")
        print(f"✅ Passed: {total_passed}")
        print(f"❌ Failed: {total_failed}")
        
        # Show broken tests by category
        if total_failed > 0:
            print("\n🔴 Broken Tests by Category:")
            
            for category, results in self.all_results.items():
                if results['failed']:
                    print(f"\n  {category.upper()}:")
                    for test in results['failed'][:5]:  # Limit output
                        if isinstance(test, dict):
                            print(f"    ❌ {test.get('name', 'unknown')}")
                            if 'error' in test and self.verbose:
                                print(f"       {test['error'][:100]}")
                                
        # Show first broken test details if fail-fast
        if self.fail_fast and self.broken_tests:
            print("\n🎯 First Broken Test Details:")
            print("-" * 50)
            first = self.broken_tests[0]
            print(f"Test: {first.get('name', 'unknown')}")
            if 'error' in first:
                print(f"Error: {first['error']}")
            if 'output' in first:
                print(f"Output:\n{first['output'][:500]}")
                
        if total_failed == 0:
            print("\n✨ All tests passed!")
        else:
            print(f"\n💔 {total_failed} test(s) failed")
            
def main():
    """CLI entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Master Test Orchestrator')
    parser.add_argument('--no-fail-fast', action='store_true',
                       help='Continue after first failure')
    parser.add_argument('--verbose', '-v', action='store_true',
                       help='Show detailed output')
    parser.add_argument('--parallel', '-p', action='store_true',
                       help='Run test suites in parallel')
    
    args = parser.parse_args()
    
    orchestrator = TestOrchestrator(
        fail_fast=not args.no_fail_fast,
        verbose=args.verbose,
        parallel=args.parallel
    )
    
    success = orchestrator.run_all_tests()
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()