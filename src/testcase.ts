import Helper from './utils/helpers';
import performAction, { PerformActionResult } from './mapActions';
import {
  Step,
  StepType,
  TestCaseResult,
  Optional,
  TestCaseOptions,
  DataSource,
  StepResult,
  StepOptions,
  CallbackData,
  TestRunner,
  CustomFnOptions,
} from './types';
import { FormatTemplateOptions } from './actions/formatTemplate';
import { VerifyOptions } from './actions/verify';
import { PickAndVerifyOptions } from './actions/pickDataAndVerify';
import { ActionName, getStepType } from './actions';
import { GetOptions } from './actions/get';
import { logStepToFile } from './actions/logStepToFile';
import { AxiosOptions } from './actions/axiosReq';
import { PostOptions } from './actions/post';
import runner from './runner';
import { VerifyTimeTakenOptions } from './actions/verifyTimeTaken';
import { BuildDataOptions } from './actions/buildData';
import { CustomFnFromOptions } from './actions/customFnFrom';
import { FormatDataOptions } from './actions/formatData';

export class TestCase {
  steps: Step[];
  stepIndex: number;
  dataSource: DataSource;
  options?: TestCaseOptions;
  title?: string;
  fileName?: string;
  filePath?: string;

  constructor(options?: TestCaseOptions) {
    this.steps = [
      {
        action: 'TEST_CASE',
        type: StepType.Action,
        index: 0,
        inputData: options?.title,
        outputData: {},
        verified: undefined,
      },
    ];

    this.title = options?.title;

    this.stepIndex = 0;
    this.dataSource = {};
    this.options = options;

    if (!this.options?.abortController) {
      this.options!.abortController = new AbortController();
    }

    if (options?.dataFilePath && !Helper.fileExists(options.dataFilePath)) {
      throw new Error('Data file not found.');
    }

    if (options?.dataFilePath && Helper.fileExists(options.dataFilePath)) {
      this.dataSource = JSON.parse(Helper.readFile(options.dataFilePath));
    }

    if (options?.steps && options.steps.length > 0) {
      this.addSteps(options?.steps);
    }

    if (options?.logPath || options?.logEachStep) {
      if (options?.logPath && !Helper.folderExists(options.logPath)) {
        throw new Error('Log folder not found.');
      }
      if (options?.logPath && options?.logEachStep) {
        options.logPath = Helper.joinPaths(
          options.logPath,
          Helper.getDateTimeString()
        );

        if (Helper.createFolder(options.logPath)) {
          throw new Error('Log folder not found.');
        }
      }
    }
  }

  private addSteps(steps: StepOptions[]): TestCase {
    steps.forEach((step) => {
      this.addStep(step);
    });
    return this;
  }

  formatTemplate(options: FormatTemplateOptions): TestCase {
    this.recordStep('formatTemplate', StepType.Action, options);
    return this;
  }

  data(key: string): any {
    if (!this.dataSource.hasOwnProperty(key))
      throw new Error('Key not found in the data source.');

    return this.dataSource[key];
  }

  verify(option: VerifyOptions): TestCase {
    this.recordStep('verify', StepType.Verification, option);
    return this;
  }

  verifyTimeTaken(option: VerifyTimeTakenOptions): TestCase {
    this.recordStep('verifyTimeTaken', StepType.Verification, option);
    return this;
  }

  pickStep(index: number): TestCase {
    this.recordStep('pickStep', StepType.Action, index);
    return this;
  }

  pickAndVerify(options: PickAndVerifyOptions): TestCase {
    this.recordStep('pickAndVerify', StepType.Verification, options);
    return this;
  }

  formatData(option: FormatDataOptions): TestCase {
    this.recordStep('formatData', StepType.Action, option);
    return this;
  }

  inputData(data: any): TestCase {
    this.recordStep('inputData', StepType.Action, data);
    return this;
  }

  pickData(query: string): TestCase {
    this.recordStep('pickData', StepType.Action, query);
    return this;
  }

  buildData(option: BuildDataOptions): TestCase {
    this.recordStep('buildData', StepType.Action, option);
    return this;
  }

  getStep(index: number, currentStepIndex: number = 0): Step {
    var stepIndex = index;
    if (index < 0 && currentStepIndex > 1) {
      stepIndex = currentStepIndex + index;
    }
    this.validateIndexOrThrow(stepIndex);
    return this.steps[stepIndex];
  }

  getStepsData(stepNumbers: number[]): any[] {
    const stepsData: any[] = [];
    for (const stepNumber of stepNumbers) {
      stepsData.push(this.getStep(stepNumber).outputData ?? {});
    }
    return stepsData;
  }

  addStep(options: StepOptions): TestCase {
    var stepType = null;
    try {
      stepType = getStepType(options.action);
    } catch (ex) {
      throw new Error(
        'Unable to create step, please check step for type/typo error.'
      );
    }
    const methodName = options.action.toString();
    (this as any)[methodName](options.inputData);
    return this;
  }

  get(options?: GetOptions): TestCase {
    this.recordStep('get', StepType.Action, options);
    return this;
  }

  post(options?: PostOptions): TestCase {
    this.recordStep('post', StepType.Action, options);
    return this;
  }

  axios(options: AxiosOptions): TestCase {
    this.recordStep('axios', StepType.Action, options);
    return this;
  }

  log(): TestCase {
    this.recordStep('log', StepType.Logging, this.options?.logPath);
    return this;
  }

  customFn(options: CustomFnOptions): TestCase {
    this.recordStep('customFn', options.stepType, options.fn);
    return this;
  }

  customFnFrom(options: CustomFnFromOptions): TestCase {
    this.recordStep('customFnFrom', options.stepType, options);
    return this;
  }

  async test(): Promise<TestCaseResult> {
    return await this.testCaseRunner();
  }

  testWith(testRunner: TestRunner) {
    //todo: move to global config
    runner(this, testRunner);
  }

  //todo: all actions to implement signal.abort
  abort() {
    if (!this.options?.abortController?.signal?.aborted) {
      this.options?.abortController?.abort();
    }
  }

  private async testCaseRunner(): Promise<TestCaseResult> {
    const totalSteps = this.steps.length;

    const totalVerificationSteps = this.steps.filter(
      (s) => s.type == StepType.Verification
    ).length;

    var testCaseResults: TestCaseResult = {
      success: false,
      totalSteps: totalSteps - 1,
      executedSteps: 0,
      lastExecutedStep: 0,
      totalVerificationSteps: totalVerificationSteps,
      executedVerificationSteps: 0,
      totalSuccessfulVerificationSteps: 0,
      lastVerificationStep: 0,
      steps: [...this.steps],
    };

    var shouldContinue = false;
    for (let index = 1; index < totalSteps; index++) {
      try {
        const stepResult = await this.performStep(index, testCaseResults);
        shouldContinue = stepResult.success;
        if (!shouldContinue) {
          testCaseResults.error = {
            type: 'error',
            title:
              'Error occurred on step: ' +
              index +
              ' - ' +
              this.getStep(index).action,
            message: stepResult.message,
            stepIndex: index,
          };
        }

        if (this.options?.abortController?.signal?.aborted) {
          throw new Error('Aborted by user.');
        }
      } catch (ex: any) {
        shouldContinue = false;
        testCaseResults.error = {
          stepIndex: index,
          type: 'exception',
          title: 'Exception occurred on step: ' + index,
          message: ex?.message,
          exception: JSON.stringify(ex),
        };
      }
      if (shouldContinue == false) break;
    }

    testCaseResults.steps = [...this.steps];

    testCaseResults.totalSuccessfulVerificationSteps = this.steps.filter(
      (s) => s.type == StepType.Verification && s.verified == true
    ).length;

    if (!testCaseResults.error)
      testCaseResults.success =
        testCaseResults.totalSuccessfulVerificationSteps ==
        testCaseResults.totalVerificationSteps;

    return testCaseResults;
  }

  private async performStep(
    index: number,
    testCaseStatus: TestCaseResult
  ): Promise<StepResult> {
    const currentStep = this.getStep(index);
    const lastStep = this.getStep(index - 1);

    testCaseStatus.executedSteps++;
    testCaseStatus.lastExecutedStep = index;

    if (currentStep.type == StepType.Verification) {
      testCaseStatus.executedVerificationSteps++;
      testCaseStatus.lastVerificationStep = index;
    }

    currentStep.startedAt = new Date().toISOString();

    await this.stepCallback({
      type: 'before',
      step: currentStep,
    });

    let performActionResult: PerformActionResult;
    var exception = null;
    try {
      performActionResult = await performAction(this, currentStep, lastStep);
    } catch (ex: any) {
      exception = ex;
      performActionResult = {
        inputData: null,
        outputData: null,
        verification: {
          actualData: null,
          verified: false,
          message: ex?.message,
        },
      };
    }

    const { inputData, outputData, verification } = performActionResult;

    currentStep.endedAt = new Date().toISOString();

    currentStep.timeTaken = Helper.getTimeSpan(
      currentStep.startedAt,
      currentStep.endedAt
    );

    this.setOutputData(index, outputData);

    if (verification !== undefined)
      this.setStepVerifiedStatus(index, verification.verified);

    if (inputData) this.setInputData(index, inputData);

    var stepResult: StepResult = {
      success: exception == null,
    };

    if (currentStep.type == StepType.Verification) {
      stepResult.success = verification?.verified ?? false;
      if (verification?.message) {
        stepResult.message = verification.message;
      }
    }

    await this.stepCallback({
      type: 'after',
      step: currentStep,
      stepResult: stepResult,
    });

    if (this.options?.logEachStep) {
      if (index == 1) await logStepToFile(this.options.logPath!, lastStep);
      await logStepToFile(this.options.logPath!, currentStep);
    }

    if (exception) {
      throw exception;
    }

    return stepResult;
  }

  private async stepCallback(data: CallbackData) {
    if (this.options?.callback) await this.options?.callback(data);
  }

  private recordStep(
    action: ActionName,
    type: StepType,
    data: any,
    verified: Optional<boolean> = undefined
  ): void {
    this.stepIndex++;
    this.steps.push({
      index: this.stepIndex,
      type,
      action,
      inputData: data,
      outputData: null,
      verified,
    });
  }

  private validateIndexOrThrow(index: number) {
    if (index > this.steps.length || index < 0)
      throw new Error('Invalid index provided');
  }

  private setOutputData(index: number, data: any): void {
    this.validateIndexOrThrow(index);
    this.steps[index].outputData = data;
  }

  private setInputData(index: number, data: any): void {
    this.validateIndexOrThrow(index);
    this.steps[index].inputData = data;
  }

  private setStepVerifiedStatus(
    index: number,
    verified: Optional<boolean>
  ): void {
    this.validateIndexOrThrow(index);
    this.steps[index].verified = verified;
  }
}
