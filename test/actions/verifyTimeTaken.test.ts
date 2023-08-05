import { verifyTimeTaken } from '../../src/actions/verifyTimeTaken';
import { StepTime } from '../../src/types';

describe('verifyTimeTaken', () => {
  it('should return false when actual data is null', async () => {
    const actual = null;
    const result = await verifyTimeTaken(actual, {
      expected: 10,
      toBe: '>=',
      format: 'ms',
    });
    expect(result.verified).toBe(false);
  });

  it('should return false when actual data is undefined', async () => {
    const actual = undefined;
    const result = await verifyTimeTaken(actual, {
      expected: 10,
      toBe: '>=',
      format: 'ms',
    });
    expect(result.verified).toBe(false);
  });

  it('should return true for actual 10ms <= expected 20ms', async () => {
    const actual: StepTime = {
      ms: 10,
      s: 0.01,
    };
    const result = await verifyTimeTaken(actual, {
      expected: 20,
      toBe: '<=',
      format: 'ms',
    });
    expect(result.verified).toBe(true);
  });

  it('should return false for actual 30ms <= expected 20ms', async () => {
    const actual: StepTime = {
      ms: 30,
      s: 0.03,
    };
    const result = await verifyTimeTaken(actual, {
      expected: 20,
      toBe: '<=',
      format: 'ms',
    });
    expect(result.verified).toBe(false);
  });
});
