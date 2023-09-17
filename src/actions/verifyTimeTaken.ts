import { VerificationResult } from './types';
import { compare, ToBe } from './compare';
import { StepTime } from '../types';

export type VerifyTimeTakenOptions = {
  expected: number;
  format: 'ms' | 's';
  toBe: ToBe;
};

export async function verifyTimeTaken(
  actualData: StepTime | undefined | null,
  options: VerifyTimeTakenOptions
): Promise<VerificationResult> {
  if (!actualData) {
    return {
      verified: false,
      actualData: null,
      message: 'No data to verify',
    };
  }
  const timeTaken = options.format === 'ms' ? actualData.ms : actualData.s;
  const comparison = compare(timeTaken, options.toBe, options.expected);
  return {
    verified: comparison.check,
    actualData,
    message: comparison.message,
  };
}
