import { apitester } from '../src/index';

apitester
  .createTestCase({
    title: 'jest-testcase to verify test endpoint',
  })
  .get('https://dummyjson.com/test')
  .pickAndVerify({
    query: 'status',
    expected: 200,
  })
  .testWith();
