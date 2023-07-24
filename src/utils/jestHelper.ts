import { TestCase } from './../testcase';
import { expect, test as jestTest } from '@jest/globals';

function test(testCase: TestCase) {
  jestTest(testCase.options?.title ?? 'Test case without a title', async () => {
    try {
      const testCaseResult = await testCase.test();
      if (testCaseResult.success) {
        expect(testCaseResult.success).toBe(true);
      } else {
        const error =
          'Error message: ' +
            testCaseResult.error?.message +
            '. Details: ' +
            testCaseResult.error?.title +
            '. Exception: ' +
            testCaseResult.error?.exception ?? 'null';

        expect(error).toBe('success');
      }
    } catch (ex: any) {
      expect(ex).toBe('success');
    }
  });
}

const JestHelper = {
  test,
};

export default JestHelper;
