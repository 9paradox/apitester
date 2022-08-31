import { AxiosRequestConfig } from 'axios';
import { IActions } from './apitester';

export type ActionName = keyof IActions | 'TEST_CASE';

export enum StepType {
  Action = 'Action',
  Verification = 'Verification',
}

export type Optional<T> = T | undefined;

export interface Step {
  index: number;
  type: StepType;
  action: ActionName;
  inputData: any;
  outputData: any;
  verified: Optional<boolean>;
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
  error?: { title: string; message?: string; type: 'error' | 'exception' };
}

export enum QueryLang {
  jmespath = 'jmespath',
  jsonata = 'jsonata',
}

export interface VerificationResult {
  verified: boolean;
  actualData: any;
  message?: string;
}

export type GetOptions = string | AxiosRequestConfig | undefined;

export interface SimplePostConfig {
  url: string;
  data: any;
}

export type PostOptions = SimplePostConfig | AxiosRequestConfig | undefined;

export interface TestCaseOptions {
  title?: string;
  dataFilePath?: string;
  steps?: StepOptions[];
}

export type ToBe =
  | 'equal'
  | '=='
  | 'notEqual'
  | '!='
  | 'greaterThan'
  | '>'
  | 'greaterThanOrEqual'
  | '>='
  | 'lessThan'
  | '<'
  | 'lessThanOrEqual'
  | '<='
  | 'in'
  | 'notIn'
  | 'contains';

export interface PickAndVerifyOptions {
  query: string;
  expected: any;
  toBe?: ToBe;
}

export type VerifyOptions =
  | string
  | {
      expected: any;
      toBe?: ToBe;
    };

export interface DataSource {
  [key: string]: any;
}

export type FormatTemplateOptions =
  | string
  | {
      filePath: string;
      outputDataFormat: 'string' | 'number' | 'boolean' | 'object';
    }
  | undefined;

export interface StepResult {
  success: boolean;
  message?: string;
}

export interface StepOptions {
  action: ActionName;
  inputData: any;
}
