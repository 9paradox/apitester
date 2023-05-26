import { apitester } from '../src/index';
import { StepType } from '../src/types';

describe('apitester', () => {
  it('should perform overall test actions and verifications', async () => {
    const test = apitester.createTestCase({
      dataFilePath: './test/test-data.json',
      logPath: './logs',
      logEachStep: true,
      callback: (data) => {
        if (data.step.index == 1 && data.type == 'after') console.log(data);
      },
    });

    const testResult = await test
      .axios({
        url: 'https://jsonplaceholder.typicode.com/todos/',
        method: 'GET',
      })
      .pickAndVerify({ query: 'status', expected: 200, toBe: '==' })
      .pickStep(1)
      .pickData('@jsonata data[0].{"id": id}')
      .formatData('https://jsonplaceholder.typicode.com/todos/<%= it.id %>')
      .get()
      .log()
      .pickStep(6)
      .pickData('data.title')
      .verify('delectus aut autem')
      .addStep({ action: 'pickStep', inputData: 6 })
      .pickData('data.{data:{title:title,body:`lol`,userId:to_number(`1`)}}')
      .formatTemplate({
        filePath: './test/test-template.txt',
        outputDataFormat: 'object',
      })
      .post()
      .pickAndVerify({ query: 'status', expected: [200, 201], toBe: 'in' })
      .pickStep(13)
      .pickData('data.title')
      .custom(StepType.Action, (testCase, currentStep, lastStep) => {
        var output = test.data('delectus_aut_autem');
        if (lastStep.outputData == output) {
          output = (output as string).toUpperCase();
        }
        return {
          inputData: lastStep.outputData,
          outputData: output,
        };
      })
      .verify('DELECTUS AUT AUTEM')
      .test();

    if (!testResult.success) {
      console.log(
        testResult.error?.title + '\nError: ' + testResult.error?.message
      );
    }

    expect(testResult.success).toEqual(true);
  });

  it('should run json test-case file', async () => {
    const test = apitester.createTestCaseFromJsonFile(
      './test/test-case-example.json'
    );

    const testResult = await test.test();

    if (!testResult.success) {
      console.log(
        testResult.error?.title + '\nError: ' + testResult.error?.message
      );
    }

    expect(testResult.success).toEqual(true);
  });

  it('should run json test-case files from folder', async () => {
    const testCases = apitester.createTestCasesFromJsonFiles(
      './test/json-testcases'
    );

    const multiTestCaseResult = await apitester.runTestCases(testCases);

    if (!multiTestCaseResult.success) {
      console.log('Testcases failed: ' + multiTestCaseResult.failedTestCases);
    }

    expect(multiTestCaseResult.success).toEqual(true);
  });
});
