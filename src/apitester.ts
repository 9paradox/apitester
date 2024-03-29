import { IActions } from './actions';
import runner from './runner';
import { TestCase } from './testcase';
import {
  MultiTestCaseResult,
  TestCaseOptions,
  TestCaseResult,
  TestRunner,
} from './types';
import Helper from './utils/helpers';

interface ApiTester {
  createTestCase: (options?: TestCaseOptions) => IActions;
  createTestCaseFromJsonFile: (testCasePath: string) => IActions;
  getJsonTestCasesFromFolder: (folderPath: string) => IActions[];
  runTestCases: (testCases: IActions[]) => Promise<MultiTestCaseResult>;
  testJsonTestCasesWith: (folderPath: string, testRunner: TestRunner) => void;
}

export const apitester: ApiTester = {
  createTestCase: (options?: TestCaseOptions) => {
    return new TestCase(options);
  },
  createTestCaseFromJsonFile: (testCasePath: string) => {
    return new TestCase(Helper.buildTestCaseOptionsFromFile(testCasePath));
  },
  getJsonTestCasesFromFolder(folderPath: string) {
    return buildJsonTestCasesFromFolder(folderPath);
  },
  runTestCases: function (testCases: IActions[]): Promise<MultiTestCaseResult> {
    return new Promise(async (resolve, reject) => {
      var results: TestCaseResult[] = [];
      var success = true;
      var failedTestCaseCount = 0;
      for (const testCase of testCases) {
        const result = await runTestCase(testCase);
        success = success && result.success;
        failedTestCaseCount = failedTestCaseCount + (result.success ? 0 : 1);
        results.push(result);
      }

      var multiTestCaseResult: MultiTestCaseResult = {
        success: success,
        failedTestCases: failedTestCaseCount,
        testCaseResults: results,
      };

      resolve(multiTestCaseResult);
    });
  },
  testJsonTestCasesWith(folderPath: string, testRunner: TestRunner) {
    buildJsonTestCasesFromFolder(folderPath).forEach((testCase) => {
      runner(testCase, testRunner);
    });
  },
};

function buildJsonTestCasesFromFolder(folderPath: string): TestCase[] {
  var testCases: TestCase[] = [];
  const testCaseFiles = Helper.getTestCasesFromFolder(folderPath);
  for (const testCaseFile of testCaseFiles) {
    const testCaseOptions = Helper.buildTestCaseOptionsFromFile(
      Helper.joinPaths(folderPath, testCaseFile)
    );
    testCases.push(new TestCase(testCaseOptions));
  }
  return testCases;
}

async function runTestCase(testCase: IActions): Promise<TestCaseResult> {
  try {
    const result = await testCase.test();
    return result;
  } catch (err: any) {
    return buildExceptionTestCase(err, testCase.getStep(0).inputData);
  }
}

function buildExceptionTestCase(
  err: any,
  testCaseTitle: string
): TestCaseResult {
  const exception = JSON.stringify(err);
  return {
    success: false,
    error: {
      title: testCaseTitle,
      type: 'exception',
      exception: exception,
      message: err.message,
    },
    executedSteps: 0,
    executedVerificationSteps: 0,
    lastExecutedStep: 0,
    lastVerificationStep: 0,
    totalSteps: 0,
    totalSuccessfulVerificationSteps: 0,
    totalVerificationSteps: 0,
    steps: [],
  };
}
