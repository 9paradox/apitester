import { IActions } from './actions';
import { TestCase } from './testcase';
import { TestCaseOptions } from './types';

interface ApiTester {
  createTestCase: (options?: TestCaseOptions) => IActions;
}

export const apitester: ApiTester = {
  createTestCase: (options?: TestCaseOptions) => {
    return new TestCase(options);
  },
};
