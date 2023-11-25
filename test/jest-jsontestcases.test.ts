import { apitester } from '../src/index';
import { expect, test as jestTest } from '@jest/globals';

apitester.testJsonTestCasesWith('./test/jest-json-testcases', {
  name: 'jest',
  testFunction: jestTest,
  expectFunction: expect,
});
