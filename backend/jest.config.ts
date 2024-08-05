import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testTimeout: 30000,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.ts'],
};

export default config;
