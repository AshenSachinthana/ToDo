export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  testMatch: ['**/__tests__/**/*.{ts,tsx}', '**/*.{spec,test}.{ts,tsx}'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        types: ['jest', '@testing-library/jest-dom'],
      },
    }],
  },

  // Jest to check ALL source files
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',                    // Check all .ts and .tsx files in src
    '!src/**/*.{test,spec}.{ts,tsx}',       // Exclude test files
    '!src/**/__tests__/**',                 
    '!src/main.tsx',                        
    '!src/vite-env.d.ts',                  
    '!src/setupTests.ts',                   
    '!src/**/*.d.ts',                       
  ],
  
  // Set minimum coverage thresholds
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};