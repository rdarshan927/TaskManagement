module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(msw|@mswjs)/)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/__tests__/utils/',
    '/src/__tests__/mocks/' // Add this line to exclude mock files
  ],
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
};