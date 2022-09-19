import TestCase from './testcase';
import {
  ActionName,
  CustomFunction,
  FormatTemplateOptions,
  GetOptions,
  PickAndVerifyOptions,
  PostOptions,
  Step,
  StepOptions,
  StepType,
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
  addStep(options: StepOptions): TestCase;
  getStep(index: number): Step;
  data(key: string): any;
  custom(stepType: StepType, fn: CustomFunction): TestCase;
  log(): TestCase;
  test(): Promise<TestCaseResult>;
}

export function getStepType(actionName: ActionName): StepType {
  const name = actionName.toLocaleLowerCase();
  const logKeys = ['log'];
  const verifyKeys = ['verify'];

  if (verifyKeys.find((k) => name.includes(k))?.length ?? 0 > 0) {
    return StepType.Verification;
  }

  if (logKeys.find((k) => name.includes(k))?.length ?? 0 > 0) {
    return StepType.Logging;
  }

  return StepType.Action;
}

interface ApiTester {
  createTestCase: (options?: TestCaseOptions) => IActions;
}

export const apitester: ApiTester = {
  createTestCase: (options?: TestCaseOptions) => {
    return new TestCase(options);
  },
};
