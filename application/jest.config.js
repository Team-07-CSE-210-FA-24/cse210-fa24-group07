module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.js', '**/?(*.)+(spec|test).[jt]s?(x)'],
  transformIgnorePatterns: [
    '/node_modules/(?!(electron-store)/)', // Explicitly allow electron-store
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'renderer/**/*.js',
    'src/**/*.js',
    '!src/**/index.js',
    '!**/node_modules/**',
    '!**/main.js', // Exclude main.js if unnecessary for coverage
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};