import { apitester } from '../src/index';
import { expect, test as jestTest } from '@jest/globals';

const abortFn = jest.fn();

// @ts-ignore
global.AbortController = jest.fn(() => ({
  abort: abortFn,
}));

apitester
  .createTestCase({
    title: 'jest-testcase to verify test endpoint',
  })
  .get('https://dummyjson.com/test')
  .pickAndVerify({
    query: 'status',
    expected: 200,
  })
  .testWith({
    name: 'jest',
    testFunction: jestTest,
    expectFunction: expect,
  });
