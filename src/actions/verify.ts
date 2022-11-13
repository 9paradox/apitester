import { VerificationResult } from './types';
import { compare, ToBe } from './compare';

export type VerifyOptions =
  | string
  | {
      expected: any;
      toBe?: ToBe;
    };

export async function verify(
  actualData: any,
  options: VerifyOptions
): Promise<VerificationResult> {
  const toBe = typeof options != 'string' ? options.toBe ?? '==' : '==';
  const expectedData = typeof options != 'string' ? options.expected : options;

  const comparison = compare(actualData, toBe, expectedData);
  return {
    verified: comparison.check,
    actualData,
    message: comparison.message,
  };
}
