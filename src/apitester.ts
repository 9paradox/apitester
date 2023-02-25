import { IActions } from './actions';
import { TestCase } from './testcase';
import { TestCaseOptions } from './types';
import Helper from './utils/helpers';

interface ApiTester {
  createTestCase: (options?: TestCaseOptions) => IActions;
  createTestCaseFromJsonFile: (testCasePath: string) => IActions;
}

export const apitester: ApiTester = {
  createTestCase: (options?: TestCaseOptions) => {
    return new TestCase(options);
  },
  createTestCaseFromJsonFile: (testCasePath: string) => {
    return new TestCase(Helper.buildTestCaseOptionsFromFile(testCasePath));
  },
};
