import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(svg|png|jpg|jpeg|gif|webp)$': '<rootDir>/__mocks__/fileMock.ts',
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'ESNext',
          moduleResolution: 'bundler',
          jsx: 'react-jsx',
          verbatimModuleSyntax: false,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          strict: true,
        },
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  modulePathIgnorePatterns: ['<rootDir>/local/', '<rootDir>/dist/'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;
