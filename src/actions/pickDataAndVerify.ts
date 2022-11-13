import { pickJsonData } from './pickJsonData';
import { compare, ToBe } from './compare';
import { VerificationResult } from './types';

export interface PickAndVerifyOptions {
  query: string;
  expected: any;
  toBe?: ToBe;
}

export async function pickDataAndVerify(
  inputData: any,
  options: PickAndVerifyOptions
): Promise<VerificationResult> {
  const toBe = options.toBe ?? '==';
  const actualData = await pickJsonData(inputData, options.query);
  const comparison = compare(actualData, toBe, options.expected);
  return {
    verified: comparison.check,
    actualData,
    message: comparison.message,
  };
}
