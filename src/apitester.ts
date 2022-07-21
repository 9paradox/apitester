import TestCase from './testcase';
import { GetOptions, Step, TestCaseResult } from './types';

export interface IActions {
  get(options?: GetOptions): TestCase;
  pickData(query: string): TestCase;
  formatData(templateData: string): TestCase;
  pickAndVerify(query: string, expected: any): TestCase;
  verify(expected: any): TestCase;
  pickStep(index: number): TestCase;
  getStep(index: number): Step;
  test(): Promise<TestCaseResult>;
}

interface ApiTester {
  setup: (title: string) => IActions;
}

export const apitester: ApiTester = {
  setup: (title: string) => {
    return new TestCase(title);
  },
};
