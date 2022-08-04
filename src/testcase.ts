import { IActions } from './apitester';
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
} from './types';

export default class TestCase implements IActions {
  steps: Step[];
  stepIndex: number;

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
  }

  verify(expected: any): TestCase {
    this.recordStep('verify', StepType.Verification, expected);
    return this;
  }

  pickStep(index: number): TestCase {
    this.recordStep('pickStep', StepType.Action, index);
    return this;
  }

  pickAndVerify(options: PickAndVerifyOptions): TestCase {
    this.recordStep('pickAndVerify', StepType.Verification, {
      query: options.query,
      expected: options.expected,
    });
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

  get(options?: GetOptions): TestCase {
    this.recordStep('get', StepType.Action, options);
    return this;
  }

  post(options?: PostOptions): TestCase {
    this.recordStep('post', StepType.Action, options);
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

    for (let index = 1; index < totalSteps; index++) {
      await this.performStep(index, testCaseResults);
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

  private async performStep(index: number, testCaseStatus: TestCaseResult) {
    const currentStep = this.getStep(index);
    const lastStep = this.getStep(index - 1);

    testCaseStatus.executedSteps++;
    testCaseStatus.lastExecutedStep = index;

    if (currentStep.type == StepType.Verification) {
      testCaseStatus.executedVerificationSteps++;
      testCaseStatus.lastVerificationStep = index;
    }

    const { inputData, outputData, verified } = await performAction(
      this,
      currentStep,
      lastStep
    );

    this.setOutputData(index, outputData);

    if (verified !== undefined) this.setStepVerifiedStatus(index, verified);

    if (inputData) this.setInputData(index, inputData);
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
