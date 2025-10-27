module.exports = {
  moduleFileExtensions: [
    'js',
    'json',
    'ts'
  ],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  // Whitelist for coverage: Includes testable files, excludes boilerplate
  collectCoverageFrom: [
    '**/*.(t|j)s',                           // All TS/JS in src
    '!**/*.spec.ts',                         // Exclude tests
    '!**/*.test.ts',                         // Exclude any .test.ts
    '!**/*.d.ts',                            // Exclude declarations
    '!main.ts',                              // Exclude entry point
    '!**/*.module.ts',                       // Exclude modules (app.module.ts, etc.)
    '!**/*.config.ts',                       // Exclude configs
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  // Enforce min coverage
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
};