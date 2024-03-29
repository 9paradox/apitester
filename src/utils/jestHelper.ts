import { TestRunner } from '../types';
import { TestCase } from './../testcase';

function test(testRunner: TestRunner, testCase: TestCase) {
  testRunner.testFunction(
    testCase.options?.title ?? 'Test case without a title',
    async () => {
      try {
        const testCaseResult = await testCase.test();
        if (testCaseResult.success) {
          testRunner.expectFunction(testCaseResult.success).toBe(true);
        } else {
          const error =
            'Error message: ' +
              testCaseResult.error?.message +
              '. Details: ' +
              testCaseResult.error?.title +
              '. Exception: ' +
              testCaseResult.error?.exception ?? 'null';

          testRunner.expectFunction(error).toBe('success');
        }
      } catch (ex: any) {
        testRunner.expectFunction(ex).toBe('success');
      }
    }
  );
}

const JestHelper = {
  test,
};

export default JestHelper;
