import { ActionName } from './actions';
import { VerificationResult } from './actions/types';
import { TestCase } from './testcase';

export enum StepType {
  Action = 'Action',
  Verification = 'Verification',
  Logging = 'Logging',
}

export type Optional<T> = T | undefined;

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
  timeTaken?: { ms: number; s: number };
}

interface Error {
  title: string;
  message?: string;
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

export enum QueryLang {
  jmespath = 'jmespath',
  jsonata = 'jsonata',
}

export interface CallbackData {
  type: 'before' | 'after';
  stepNumber: number;
  stepType: StepType;
  action: ActionName;
  stepResult?: StepResult;
  startedAt?: string;
  endedAt?: string;
  timeTakenMs?: number;
}

export interface TestCaseOptions {
  title?: string;
  dataFilePath?: string;
  steps?: StepOptions[];
  logPath?: string;
  callback?: (data: CallbackData) => void;
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

export type CustomFunction = (
  testCase: TestCase,
  currentStep: Step,
  lastStep: Step
) => {
  inputData: any;
  outputData: any;
  verification?: VerificationResult;
};
