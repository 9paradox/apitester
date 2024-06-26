import { apitester } from '../src/index';
import { StepType } from '../src/types';
import jsonServer from 'json-server';

const server = jsonServer.create();
const router = jsonServer.router('./test/db.json');
server.use(router);

var httpServer: any;

describe('apitester', () => {
  const abortFn = jest.fn();

  // @ts-ignore
  global.AbortController = jest.fn(() => ({
    abort: abortFn,
  }));

  beforeAll(() => {
    httpServer = server.listen(3000);
  });

  afterAll(() => {
    httpServer?.close();
  });

  it('should perform overall test actions and verifications', async () => {
    const test = apitester.createTestCase({
      dataFilePath: './test/test-data.json',
      logPath: './logs',
      logEachStep: true,
      callback: async (data) => {
        if (data.step.index == 1 && data.type == 'after') console.log(data);
      },
    });

    const testResult = await test
      .axios({
        url: 'http://localhost:3000/todos/',
        method: 'GET',
      })
      .pickAndVerify({ query: 'status', expected: 200, toBe: '==' })
      .pickStep(1)
      .pickData('@jsonata data[0].{"id": id}')
      .formatData('http://localhost:3000/todos/<%= it.id %>')
      .get()
      .log()
      .pickStep(-2)
      .pickData('data.title')
      .verify('delectus aut autem')
      .addStep({ action: 'pickStep', inputData: 6 })
      .pickData('data.{data:{title:title,body:`lol`,userId:to_number(`1`)}}')
      .formatTemplate({
        filePath: './test/test-template.txt',
        outputDataFormat: 'object',
      })
      .post()
      .verifyTimeTaken({ expected: 1000, toBe: '>=', format: 'ms' })
      .pickStep(-2)
      .pickAndVerify({ query: 'status', expected: [200, 201], toBe: 'in' })
      .pickStep(-5)
      .pickData('data.title')
      .customFn({
        stepType: StepType.Action,
        fn: async (testCase, currentStep, lastStep) => {
          var output = test.data('delectus_aut_autem');
          if (lastStep.outputData == output) {
            output = (output as string).toUpperCase();
          }
          return {
            inputData: lastStep.outputData,
            outputData: output,
          };
        },
      })
      .verify('DELECTUS AUT AUTEM')
      .buildData({
        queries: [
          {
            step: 1,
            query: 'data[0].id',
            name: 'step1Id',
          },
          {
            step: 6,
            query: 'data.title',
            name: 'step6Title',
          },
        ],
      })
      .verify({
        expected: {
          step1Id: 1,
          step6Title: 'delectus aut autem',
        },
      })
      .customFnFrom({
        stepType: StepType.Action,
        filePath: './test/customFunctions/my_test_function.js',
        functionName: 'customFunction',
      })
      .verify('DELECTUS AUT AUTEM')
      .inputData({
        title: 'some input data',
      })
      .pickAndVerify({
        query: 'title',
        expected: 'some input data',
        toBe: '==',
      })
      .inputData('lol')
      .verify('lol')
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
    const testCases = apitester.getJsonTestCasesFromFolder(
      './test/json-testcases',
      ['.test.json', '.apitester']
    );

    const multiTestCaseResult = await apitester.runTestCases(
      testCases,
      async (data) => {
        if (data.type == 'after') console.log('running ' + data.filePath);
      }
    );

    if (!multiTestCaseResult.success) {
      console.log('Testcases failed: ' + multiTestCaseResult.failedTestCases);
    }

    expect(multiTestCaseResult.success).toEqual(true);
  });
});
