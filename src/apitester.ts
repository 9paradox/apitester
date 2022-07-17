import TestCase from './testcase';
import { Step, TestCaseResult } from './types';

export interface IActions {
  simpleGet(url: string): TestCase;
  withLastStep_simpleGet(): TestCase;
  withLastStep_pickData(query: string): TestCase;
  withLastStep_formatData(templateData: string): TestCase;
  withLastStep_pickAndVerify(query: string, expected: any): TestCase;
  withLastStep_Verify(expected: any): TestCase;
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
