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
}

export enum QueryLang {
  jmespath = 'jmespath',
  jsonata = 'jsonata',
}

export interface VerificationResult {
  verified: boolean;
  actualData: any;
}
