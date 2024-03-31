import { IActions } from './actions';
import runner from './runner';
import { TestCase } from './testcase';
import {
  MultiTestCaseResult,
  TestCaseCallbackData,
  TestCaseOptions,
  TestCaseResult,
  TestRunner,
} from './types';
import Helper from './utils/helpers';

interface ApiTester {
  createTestCase: (options?: TestCaseOptions) => IActions;
  createTestCaseFromJsonFile: (testCasePath: string) => IActions;
  getJsonTestCasesFromFolder: (
    folderPath: string,
    supportedFileExtensions?: string[]
  ) => IActions[];
  runTestCases: (
    testCases: IActions[],
    callback?: (data: TestCaseCallbackData) => Promise<void>
  ) => Promise<MultiTestCaseResult>;
  testJsonTestCasesWith: (
    folderPath: string,
    testRunner: TestRunner,
    supportedFileExtensions?: string[]
  ) => void;
}

export const apitester: ApiTester = {
  createTestCase: (options?: TestCaseOptions) => {
    return new TestCase(options);
  },
  createTestCaseFromJsonFile: (testCasePath: string) => {
    return new TestCase(Helper.buildTestCaseOptionsFromFile(testCasePath));
  },
  getJsonTestCasesFromFolder(
    folderPath: string,
    supportedFileExtensions?: string[]
  ) {
    return buildJsonTestCasesFromFolder(folderPath, supportedFileExtensions);
  },
  runTestCases: function (
    testCases: IActions[],
    callback?: (data: TestCaseCallbackData) => Promise<void>
  ): Promise<MultiTestCaseResult> {
    return new Promise(async (resolve, reject) => {
      var results: TestCaseResult[] = [];
      var success = true;
      var failedTestCaseCount = 0;
      var index = 0;
      for (const testCase of testCases) {
        index++;
        if (callback)
          await callback({
            type: 'before',
            filePath: testCase.filePath ? testCase.filePath : index.toString(),
            testCaseResult: undefined,
          });

        const result = await runTestCase(testCase);

        if (callback)
          await callback({
            type: 'after',
            filePath: testCase.filePath ? testCase.filePath : index.toString(),
            testCaseResult: result,
          });

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
  testJsonTestCasesWith(
    folderPath: string,
    testRunner: TestRunner,
    supportedFileExtensions?: string[]
  ) {
    buildJsonTestCasesFromFolder(folderPath, supportedFileExtensions).forEach(
      (testCase) => {
        runner(testCase, testRunner);
      }
    );
  },
};

function buildJsonTestCasesFromFolder(
  folderPath: string,
  supportedFileExtensions?: string[]
): TestCase[] {
  var testCases: TestCase[] = [];
  const testCaseFiles = Helper.getTestCasesFromFolder(
    folderPath,
    supportedFileExtensions
  );
  for (const testCaseFile of testCaseFiles) {
    try {
      const filePath = Helper.joinPaths(folderPath, testCaseFile);
      const testCaseOptions = Helper.buildTestCaseOptionsFromFile(filePath);
      var testCase = new TestCase(testCaseOptions);
      testCase.title = testCaseOptions.title;
      testCase.fileName = testCaseFile;
      testCase.filePath = filePath;
      testCases.push(testCase);
    } catch (err: any) {
      console.log('Error while loading test case: ' + testCaseFile, err);
      continue;
    }
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
