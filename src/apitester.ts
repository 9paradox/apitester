import TestCase from './testcase';
import {
  GetOptions,
  PickAndVerifyOptions,
  PostOptions,
  Step,
  TestCaseOptions,
  TestCaseResult,
} from './types';

export interface IActions {
  get(options?: GetOptions): TestCase;
  post(options?: PostOptions): TestCase;
  pickData(query: string): TestCase;
  formatData(templateData: string): TestCase;
  pickAndVerify(options: PickAndVerifyOptions): TestCase;
  verify(expected: any): TestCase;
  pickStep(index: number): TestCase;
  getStep(index: number): Step;
  test(): Promise<TestCaseResult>;
}

interface ApiTester {
  createTestCase: (options?: TestCaseOptions) => IActions;
}

export const apitester: ApiTester = {
  createTestCase: (options?: TestCaseOptions) => {
    return new TestCase(options);
  },
};
