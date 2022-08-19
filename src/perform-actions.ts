import {
  get,
  post,
  pickJsonData,
  formatData,
  pickDataAndVerify,
  verify,
  formatTemplate,
} from './actions';
import TestCase from './testcase';
import { Step, Optional } from './types';

export default async function performAction(
  testCase: TestCase,
  currentStep: Step,
  lastStep: Step
) {
  var inputData: any = null;
  var outputData: any;
  var verified: Optional<boolean> = undefined;

  //TODO: refactor into key based function calls
  switch (currentStep.action) {
    case 'TEST_CASE':
      break;

    case 'get':
      inputData = currentStep.inputData
        ? currentStep.inputData
        : lastStep.outputData;
      outputData = await get(inputData);
      break;

    case 'post':
      inputData = currentStep.inputData
        ? currentStep.inputData
        : lastStep.outputData;
      outputData = await post(inputData);
      break;

    case 'pickData':
      outputData = await pickJsonData(
        lastStep.outputData,
        currentStep.inputData
      );
      break;

    case 'formatData':
      outputData = await formatData(currentStep.inputData, lastStep.outputData);
      break;

    case 'pickAndVerify':
      outputData = await pickDataAndVerify(
        lastStep.outputData,
        currentStep.inputData
      );
      verified = outputData.verified;
      break;

    case 'pickStep':
      outputData = testCase.getStep(currentStep.inputData).outputData;
      break;

    case 'verify':
      outputData = await verify(lastStep.outputData, currentStep.inputData);
      verified = outputData.verified;
      break;

    case 'formatTemplate':
      outputData = await formatTemplate(
        currentStep.inputData,
        lastStep.outputData
      );
      break;

    default:
      throw new Error(`'${currentStep.action}' method is not implemented.`);
  }
  return { inputData, outputData, verified };
}
