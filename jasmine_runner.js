#!/usr/bin/env node

/**
 * Jasmine Test Runner with Progressive Discovery
 * Runs Jasmine tests and reports only broken tests
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class JasmineTestRunner {
    constructor(options = {}) {
        this.failFast = options.failFast !== false;
        this.verbose = options.verbose || false;
        this.brokenTests = [];
        this.passedTests = [];
        this.currentSuite = null;
        this.testFiles = [];
    }

    /**
     * Find all spec files in the project
     */
    findSpecFiles(dir = '.', exclude = ['node_modules', '.git', 'venv', '.venv']) {
        const specs = [];
        
        const walk = (currentDir) => {
            try {
                const files = fs.readdirSync(currentDir);
                
                for (const file of files) {
                    const fullPath = path.join(currentDir, file);
                    const stat = fs.statSync(fullPath);
                    
                    if (stat.isDirectory()) {
                        // Skip excluded directories
                        if (!exclude.includes(file)) {
                            walk(fullPath);
                        }
                    } else if (file.endsWith('.spec.js') || file.endsWith('Spec.js')) {
                        specs.push(fullPath);
                    }
                }
            } catch (err) {
                // Ignore permission errors
            }
        };
        
        walk(dir);
        return specs;
    }

    /**
     * Create a custom Jasmine reporter
     */
    createReporter() {
        return `
const CustomReporter = {
    jasmineStarted: function(suiteInfo) {
        console.log('JASMINE_START:' + JSON.stringify({
            totalSpecsDefined: suiteInfo.totalSpecsDefined
        }));
    },
    
    suiteStarted: function(result) {
        console.log('SUITE_START:' + result.fullName);
    },
    
    specStarted: function(result) {
        console.log('SPEC_START:' + result.fullName);
    },
    
    specDone: function(result) {
        const output = {
            name: result.fullName,
            status: result.status,
            file: result.file || 'unknown',
            duration: result.duration || 0
        };
        
        if (result.status === 'failed') {
            output.failures = result.failedExpectations.map(exp => ({
                message: exp.message,
                stack: exp.stack
            }));
        }
        
        console.log('SPEC_RESULT:' + JSON.stringify(output));
        
        // Exit on first failure if fail-fast is enabled
        if (result.status === 'failed' && process.env.FAIL_FAST === 'true') {
            console.log('FAIL_FAST_EXIT');
            process.exit(1);
        }
    },
    
    suiteDone: function(result) {
        console.log('SUITE_DONE:' + result.fullName);
    },
    
    jasmineDone: function(runDetails) {
        console.log('JASMINE_DONE:' + JSON.stringify({
            overallStatus: runDetails.overallStatus,
            totalTime: runDetails.totalTime
        }));
    }
};

jasmine.getEnv().addReporter(CustomReporter);
`;
    }

    /**
     * Run a single spec file
     */
    async runSpecFile(specFile) {
        return new Promise((resolve) => {
            const wrapperScript = `
${this.createReporter()}

// Load Jasmine
const Jasmine = require('jasmine');
const jasmine = new Jasmine();

// Configure Jasmine
jasmine.loadConfig({
    spec_files: ['${specFile}'],
    stopSpecOnExpectationFailure: ${this.failFast}
});

// Run tests
jasmine.execute();
`;

            const child = spawn('node', ['-e', wrapperScript], {
                env: { ...process.env, FAIL_FAST: String(this.failFast) },
                timeout: 30000
            });

            let output = '';
            let errorOutput = '';

            child.stdout.on('data', (data) => {
                output += data.toString();
            });

            child.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            child.on('close', (code) => {
                const results = this.parseOutput(output + errorOutput);
                resolve({
                    file: specFile,
                    success: code === 0,
                    results: results
                });
            });

            child.on('error', (err) => {
                resolve({
                    file: specFile,
                    success: false,
                    results: [{
                        name: specFile,
                        status: 'failed',
                        failures: [{ message: err.message }]
                    }]
                });
            });
        });
    }

    /**
     * Parse Jasmine output
     */
    parseOutput(output) {
        const results = [];
        const lines = output.split('\\n');

        for (const line of lines) {
            if (line.startsWith('SPEC_RESULT:')) {
                try {
                    const result = JSON.parse(line.substring('SPEC_RESULT:'.length));
                    results.push(result);
                } catch (e) {
                    // Ignore parse errors
                }
            }
        }

        return results;
    }

    /**
     * Run all tests
     */
    async runAll() {
        console.log('🔍 Searching for Jasmine spec files...');
        
        const specFiles = this.findSpecFiles();
        
        if (specFiles.length === 0) {
            console.log('No Jasmine spec files found.');
            return true;
        }

        console.log(\`Found \${specFiles.length} spec file(s)\`);
        console.log('');

        let allPassed = true;

        for (const specFile of specFiles) {
            console.log(\`Running: \${specFile}\`);
            
            const result = await this.runSpecFile(specFile);
            
            for (const test of result.results) {
                if (test.status === 'failed') {
                    this.brokenTests.push(test);
                    allPassed = false;
                    
                    console.log(\`\\n❌ BROKEN TEST: \${test.name}\`);
                    console.log('-'.repeat(40));
                    
                    if (test.failures) {
                        for (const failure of test.failures) {
                            console.log(failure.message);
                            if (this.verbose && failure.stack) {
                                console.log(failure.stack);
                            }
                        }
                    }
                    
                    console.log('-'.repeat(40));
                    
                    if (this.failFast) {
                        console.log('\\n🛑 Stopping on first failure (fail-fast mode)');
                        break;
                    }
                } else if (test.status === 'passed') {
                    this.passedTests.push(test);
                    if (this.verbose) {
                        console.log(\`✅ \${test.name}\`);
                    }
                }
            }
            
            if (!allPassed && this.failFast) {
                break;
            }
        }

        return allPassed;
    }

    /**
     * Print summary
     */
    printSummary() {
        console.log('');
        console.log('='.repeat(60));
        console.log('📊 Jasmine Test Summary');
        console.log('='.repeat(60));
        
        const total = this.passedTests.length + this.brokenTests.length;
        console.log(\`Total specs: \${total}\`);
        console.log(\`✅ Passed: \${this.passedTests.length}\`);
        console.log(\`❌ Failed: \${this.brokenTests.length}\`);
        
        if (this.brokenTests.length > 0) {
            console.log('\\n🔴 Failed Specs:');
            for (const test of this.brokenTests) {
                console.log(\`  - \${test.name}\`);
            }
        }
    }
}

// CLI interface
if (require.main === module) {
    const args = process.argv.slice(2);
    
    const options = {
        failFast: !args.includes('--no-fail-fast'),
        verbose: args.includes('--verbose') || args.includes('-v')
    };
    
    const runner = new JasmineTestRunner(options);
    
    runner.runAll().then((success) => {
        runner.printSummary();
        process.exit(success ? 0 : 1);
    }).catch((err) => {
        console.error('Error running tests:', err);
        process.exit(1);
    });
}

module.exports = JasmineTestRunner;