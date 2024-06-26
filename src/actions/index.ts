import { TestCase } from '../testcase';
import {
  CustomFnOptions,
  Step,
  StepOptions,
  StepType,
  TestCaseResult,
  TestRunner,
} from '../types';
import { AxiosOptions } from './axiosReq';
import { BuildDataOptions } from './buildData';
import { CustomFnFromOptions } from './customFnFrom';
import { FormatDataOptions } from './formatData';
import { FormatTemplateOptions } from './formatTemplate';
import { GetOptions } from './get';
import { PickAndVerifyOptions } from './pickDataAndVerify';
import { PostOptions } from './post';
import { VerifyOptions } from './verify';
import { VerifyTimeTakenOptions } from './verifyTimeTaken';

export interface IActions {
  title?: string;
  fileName?: string;
  filePath?: string;
  get(options?: GetOptions): TestCase;
  post(options?: PostOptions): TestCase;
  axios(options: AxiosOptions): TestCase;
  inputData(data: any): TestCase;
  pickData(query: string): TestCase;
  buildData(option: BuildDataOptions): TestCase;
  formatData(options: FormatDataOptions): TestCase;
  formatTemplate(options: FormatTemplateOptions): TestCase;
  pickAndVerify(options: PickAndVerifyOptions): TestCase;
  verify(option: VerifyOptions): TestCase;
  verifyTimeTaken(option: VerifyTimeTakenOptions): TestCase;
  pickStep(index: number): TestCase;
  addStep(options: StepOptions): TestCase;
  customFn(options: CustomFnOptions): TestCase;
  customFnFrom(options: CustomFnFromOptions): TestCase;
  log(): TestCase;
  getStep(index: number): Step;
  data(key: string): any;
  test(): Promise<TestCaseResult>;
  testWith(testRunner: TestRunner): void;
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
