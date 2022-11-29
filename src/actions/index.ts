import { TestCase } from '../testcase';
import {
  CustomFunction,
  Step,
  StepOptions,
  StepType,
  TestCaseResult,
} from '../types';
import { AxiosOptions } from './axiosReq';
import { FormatTemplateOptions } from './formatTemplate';
import { GetOptions } from './get';
import { PickAndVerifyOptions } from './pickDataAndVerify';
import { PostOptions } from './post';
import { VerifyOptions } from './verify';

export interface IActions {
  get(options?: GetOptions): TestCase;
  post(options?: PostOptions): TestCase;
  axios(options: AxiosOptions): TestCase;
  pickData(query: string): TestCase;
  formatData(templateData: string): TestCase;
  formatTemplate(options: FormatTemplateOptions): TestCase;
  pickAndVerify(options: PickAndVerifyOptions): TestCase;
  verify(option: VerifyOptions): TestCase;
  pickStep(index: number): TestCase;
  addStep(options: StepOptions): TestCase;
  custom(stepType: StepType, fn: CustomFunction): TestCase;
  log(): TestCase;
  getStep(index: number): Step;
  data(key: string): any;
  test(): Promise<TestCaseResult>;
}

export type ActionName = keyof IActions | 'TEST_CASE';

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
