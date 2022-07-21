import {
  get,
  pickJsonData,
  formatData,
  pickDataAndVerify,
  verify,
} from './actions';
import { IActions } from './apitester';
import {
  Step,
  StepType,
  TestCaseResult,
  Optional,
  ActionName,
  GetOptions,
} from './types';

export default class TestCase implements IActions {
  steps: Step[];
  stepIndex: number;

  constructor(title: string) {
    this.steps = [
      {
        action: 'TEST_CASE',
        type: StepType.Action,
        index: 0,
        inputData: title,
        outputData: {},
        verified: undefined,
      },
    ];
    this.stepIndex = 0;
  }

  withLastStep_Verify(expected: any): TestCase {
    this.recordStep('withLastStep_Verify', StepType.Verification, expected);
    return this;
  }

  pickStep(index: number): TestCase {
    this.recordStep('pickStep', StepType.Action, index);
    return this;
  }

  withLastStep_pickAndVerify(query: string, expected: any): TestCase {
    this.recordStep('withLastStep_pickAndVerify', StepType.Verification, {
      query: query,
      expected: expected,
    });
    return this;
  }

  withLastStep_formatData(templateData: string): TestCase {
    this.recordStep('withLastStep_formatData', StepType.Action, templateData);
    return this;
  }

  withLastStep_pickData(query: string): TestCase {
    this.recordStep('withLastStep_pickData', StepType.Action, query);
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

  async test(): Promise<TestCaseResult> {
    return await this._test();
  }

  async _test(): Promise<TestCaseResult> {
    const totalSteps = this.steps.length;

    const totalVerificationSteps = this.steps.filter(
      (s) => s.type == StepType.Verification
    ).length;

    var testCaseStatus: TestCaseResult = {
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
      const currentStep = this.getStep(index);
      const lastStep = this.getStep(index - 1);

      var inputData: any = null;
      var outputData: any;
      var verified: Optional<boolean> = undefined;

      testCaseStatus.executedSteps++;
      testCaseStatus.lastExecutedStep = index;

      if (currentStep.type == StepType.Verification) {
        testCaseStatus.executedVerificationSteps++;
        testCaseStatus.lastVerificationStep = index;
      }

      switch (currentStep.action) {
        case 'TEST_CASE':
          break;

        case 'get':
          inputData = currentStep.inputData
            ? currentStep.inputData
            : lastStep.outputData;
          outputData = await get(inputData);
          break;

        case 'withLastStep_pickData':
          outputData = await pickJsonData(
            lastStep.outputData,
            currentStep.inputData
          );
          break;

        case 'withLastStep_formatData':
          outputData = await formatData(
            currentStep.inputData,
            lastStep.outputData
          );
          break;

        case 'withLastStep_pickAndVerify':
          outputData = await pickDataAndVerify(
            lastStep.outputData,
            currentStep.inputData.query,
            currentStep.inputData.expected
          );
          verified = outputData.verified;
          break;

        case 'pickStep':
          outputData = this.getStep(currentStep.inputData).outputData;
          break;

        case 'withLastStep_Verify':
          outputData = await verify(lastStep.outputData, currentStep.inputData);
          verified = outputData.verified;
          break;

        default:
          throw new Error(`'${currentStep.action}' method is not implemented.`);
      }

      this.setOutputData(currentStep.index, outputData);

      if (verified !== undefined)
        this.setStepVerifiedStatus(currentStep.index, verified);

      if (inputData) this.setInputData(currentStep.index, inputData);
    }

    testCaseStatus.steps = [...this.steps];

    testCaseStatus.totalSuccessfulVerificationSteps = this.steps.filter(
      (s) => s.type == StepType.Verification && s.verified == true
    ).length;

    testCaseStatus.success =
      testCaseStatus.totalSuccessfulVerificationSteps ==
      testCaseStatus.totalVerificationSteps;

    return testCaseStatus;
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
