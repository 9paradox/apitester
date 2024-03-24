import { apitester } from '../src/index';
import { expect, test as jestTest } from '@jest/globals';

const abortFn = jest.fn();

// @ts-ignore
global.AbortController = jest.fn(() => ({
  abort: abortFn,
}));

apitester.testJsonTestCasesWith('./test/jest-json-testcases', {
  name: 'jest',
  testFunction: jestTest,
  expectFunction: expect,
});
