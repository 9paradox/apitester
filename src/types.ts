import { ActionName } from './actions';
import { VerificationResult } from './actions/types';
import { TestCase } from './testcase';

export enum StepType {
  Action = 'Action',
  Verification = 'Verification',
  Logging = 'Logging',
}

export type Optional<T> = T | undefined;

export interface StepTime {
  ms: number;
  s: number;
}

export interface Step {
  index: number;
  type: StepType;
  action: ActionName;
  inputData: any;
  outputData: any;
  logFile?: string | null;
  verified: Optional<boolean>;
  startedAt?: string;
  endedAt?: string;
  timeTaken?: StepTime;
  description?: string
}

interface Error {
  title: string;
  message?: string;
  exception?: string;
  stepIndex?: number;
  type: 'error' | 'exception';
}

export interface TestCaseResult {
  success: boolean;
  totalSteps: number;
  executedSteps: number;
  lastExecutedStep: number;
  totalVerificationSteps: number;
  executedVerificationSteps: number;
  totalSuccessfulVerificationSteps: number;
  lastVerificationStep: number;
  steps: Step[];
  error?: Error;
}

export interface MultiTestCaseResult {
  success: boolean;
  failedTestCases: number;
  testCaseResults: TestCaseResult[];
  error?: Error;
}

export enum QueryLang {
  jmespath = 'jmespath',
  jsonata = 'jsonata',
}

export interface CallbackData {
  type: 'before' | 'after';
  step: Step;
  stepResult?: StepResult;
}

export interface TestCaseOptions {
  title?: string;
  dataFilePath?: string;
  steps?: StepOptions[];
  logPath?: string;
  logEachStep?: boolean;
  callback?: (data: CallbackData) => Promise<void>;
  abortController?: AbortController;
}

export interface DataSource {
  [key: string]: any;
}

export interface StepResult {
  success: boolean;
  message?: string;
}

export interface StepOptions {
  action: ActionName;
  inputData: any;
}

export interface CustomFromReturn {
  inputData: any;
  outputData: any;
  verification?: VerificationResult;
}

export type CustomFunction = (
  testCase: TestCase,
  currentStep: Step,
  lastStep: Step
) => Promise<CustomFromReturn>;

export interface TestRunner {
  name: 'jest';
  expectFunction: any;
  testFunction: any;
}
