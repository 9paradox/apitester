import { getStepType, IActions } from './apitester';
import Helper from './helpers';
import performAction from './perform-actions';
import {
  Step,
  StepType,
  TestCaseResult,
  Optional,
  ActionName,
  GetOptions,
  PostOptions,
  TestCaseOptions,
  PickAndVerifyOptions,
  DataSource,
  FormatTemplateOptions,
  VerifyOptions,
  StepResult,
  StepOptions,
  CallbackData,
  CustomFunction,
} from './types';

export default class TestCase implements IActions {
  steps: Step[];
  stepIndex: number;
  dataSource: DataSource;
  options?: TestCaseOptions;

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
    this.stepIndex = 0;
    this.dataSource = {};
    this.options = options;

    if (options?.dataFilePath && !Helper.fileExists(options.dataFilePath)) {
      throw new Error('Data file not found.');
    }

    if (options?.dataFilePath && Helper.fileExists(options.dataFilePath)) {
      this.dataSource = JSON.parse(Helper.readFile(options.dataFilePath));
    }

    if (options?.steps && options.steps.length > 0) {
      this.addSteps(options?.steps);
    }

    if (options?.logPath && !Helper.folderExists(options.logPath)) {
      throw new Error('Log folder not found.');
    }
  }

  addSteps(steps: StepOptions[]): TestCase {
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

  pickStep(index: number): TestCase {
    this.recordStep('pickStep', StepType.Action, index);
    return this;
  }

  pickAndVerify(options: PickAndVerifyOptions): TestCase {
    this.recordStep('pickAndVerify', StepType.Verification, options);
    return this;
  }

  formatData(templateData: string): TestCase {
    this.recordStep('formatData', StepType.Action, templateData);
    return this;
  }

  pickData(query: string): TestCase {
    this.recordStep('pickData', StepType.Action, query);
    return this;
  }

  getStep(index: number): Step {
    this.validateIndexOrThrow(index);
    return this.steps[index];
  }

  addStep(options: StepOptions): TestCase {
    const stepType = getStepType(options.action);
    this.recordStep(options.action, stepType, options.inputData);
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

  log(): TestCase {
    this.recordStep('log', StepType.Logging, this.options?.logPath);
    return this;
  }

  custom(stepType: StepType, fn: CustomFunction): TestCase {
    this.recordStep('custom', stepType, fn);
    return this;
  }

  async test(): Promise<TestCaseResult> {
    return await this.testCaseRunner();
  }

  async testCaseRunner(): Promise<TestCaseResult> {
    const totalSteps = this.steps.length;

    const totalVerificationSteps = this.steps.filter(
      (s) => s.type == StepType.Verification
    ).length;

    var testCaseResults: TestCaseResult = {
      success: false,
      totalSteps: totalSteps,
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
            title: 'Error occurred on step: ' + index,
            message: stepResult.message,
          };
        }
      } catch (ex) {
        shouldContinue = false;
        testCaseResults.error = {
          type: 'exception',
          title: 'Exception occurred on step: ' + index,
          message: JSON.stringify(ex),
        };
      }
      if (shouldContinue == false) break;
    }

    testCaseResults.steps = [...this.steps];

    testCaseResults.totalSuccessfulVerificationSteps = this.steps.filter(
      (s) => s.type == StepType.Verification && s.verified == true
    ).length;

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

    this.stepCallback({
      type: 'before',
      action: currentStep.action,
      stepType: currentStep.type,
      stepNumber: currentStep.index,
      startedAt: currentStep.startedAt,
    });

    const { inputData, outputData, verification } = await performAction(
      this,
      currentStep,
      lastStep
    );

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
      success: true,
    };

    if (currentStep.type == StepType.Verification) {
      stepResult.success = verification?.verified ?? false;
      if (verification?.message) {
        stepResult.message = verification.message;
      }
    }

    this.stepCallback({
      type: 'after',
      action: currentStep.action,
      stepType: currentStep.type,
      stepNumber: currentStep.index,
      stepResult: stepResult,
      endedAt: currentStep.endedAt,
      timeTakenMs: currentStep.timeTaken?.ms,
    });

    return stepResult;
  }

  stepCallback(data: CallbackData) {
    if (this.options?.callback) this.options?.callback(data);
  }

  recordStep(
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

  validateIndexOrThrow(index: number) {
    if (index > this.steps.length || index < 0)
      throw new Error('Invalid index provided');
  }

  setOutputData(index: number, data: any): void {
    this.validateIndexOrThrow(index);
    this.steps[index].outputData = data;
  }

  setInputData(index: number, data: any): void {
    this.validateIndexOrThrow(index);
    this.steps[index].inputData = data;
  }

  setStepVerifiedStatus(index: number, verified: Optional<boolean>): void {
    this.validateIndexOrThrow(index);
    this.steps[index].verified = verified;
  }
}
