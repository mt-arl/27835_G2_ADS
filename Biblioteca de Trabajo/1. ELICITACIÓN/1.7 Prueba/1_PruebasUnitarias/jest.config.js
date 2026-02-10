/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  transform: {},
  moduleFileExtensions: ['js', 'mjs', 'ts'],
  testMatch: ['**/*.test.js', '**/*.test.mjs'],
  verbose: true,
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**'
  ],
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'lcov', 'html']
};
