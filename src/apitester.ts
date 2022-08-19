import TestCase from './testcase';
import {
  FormatTemplateOptions,
  GetOptions,
  PickAndVerifyOptions,
  PostOptions,
  Step,
  TestCaseOptions,
  TestCaseResult,
  VerifyOptions,
} from './types';

export interface IActions {
  get(options?: GetOptions): TestCase;
  post(options?: PostOptions): TestCase;
  pickData(query: string): TestCase;
  formatData(templateData: string): TestCase;
  formatTemplate(options: FormatTemplateOptions): TestCase;
  pickAndVerify(options: PickAndVerifyOptions): TestCase;
  verify(option: VerifyOptions): TestCase;
  pickStep(index: number): TestCase;
  getStep(index: number): Step;
  data(key: string): any;
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
