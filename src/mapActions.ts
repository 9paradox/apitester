import { logStepToFile } from './actions/logStepToFile';
import { verify } from './actions/verify';
import { pickDataAndVerify } from './actions/pickDataAndVerify';
import { formatTemplate } from './actions/formatTemplate';
import { formatData } from './actions/formatData';
import { pickJsonData } from './actions/pickJsonData';
import { Step, Optional, CustomFunction } from './types';
import { get } from './actions/get';
import { post } from './actions/post';
import { VerificationResult } from './actions/types';
import { TestCase } from './testcase';
import { axiosReq } from './actions/axiosReq';
import { verifyTimeTaken } from './actions/verifyTimeTaken';
import { BuildDataOptions, buildData } from './actions/buildData';
import { customFrom } from './actions/customFrom';

export interface PerformActionResult {
  inputData: any;
  outputData: any;
  verification: Optional<VerificationResult>;
}

export default async function performAction(
  testCase: TestCase,
  currentStep: Step,
  lastStep: Step
): Promise<PerformActionResult> {
  var inputData: any = null;
  var outputData: any;
  var verification: Optional<VerificationResult> = undefined;

  //TODO: refactor into key based function calls
  switch (currentStep.action) {
    case 'TEST_CASE':
      break;

    case 'get':
      inputData = currentStep.inputData
        ? currentStep.inputData
        : lastStep.outputData;
      outputData = await get(
        inputData,
        testCase.options?.abortController?.signal
      );
      break;

    case 'post':
      inputData = currentStep.inputData
        ? currentStep.inputData
        : lastStep.outputData;
      outputData = await post(inputData);
      break;

    case 'axios':
      inputData = currentStep.inputData
        ? currentStep.inputData
        : lastStep.outputData;
      outputData = await axiosReq(inputData);
      break;

    case 'pickData':
      outputData = await pickJsonData(
        lastStep.outputData,
        currentStep.inputData
      );
      break;

    case 'buildData':
      const buildDataOptions = currentStep.inputData as BuildDataOptions;
      const stepNumbers = buildDataOptions.queries.map((q) => q.step);
      const data = testCase.getStepsData(stepNumbers);
      outputData = await buildData(data, currentStep.inputData);
      break;

    case 'formatData':
      outputData = await formatData(currentStep.inputData, lastStep.outputData);
      break;

    case 'pickAndVerify':
      outputData = await pickDataAndVerify(
        lastStep.outputData,
        currentStep.inputData
      );
      verification = outputData;
      break;

    case 'pickStep':
      outputData = testCase.getStep(
        currentStep.inputData,
        currentStep.index
      ).outputData;
      break;

    case 'verify':
      outputData = await verify(lastStep.outputData, currentStep.inputData);
      verification = outputData;
      break;

    case 'verifyTimeTaken':
      outputData = await verifyTimeTaken(
        lastStep.timeTaken,
        currentStep.inputData
      );
      verification = outputData;
      break;

    case 'formatTemplate':
      outputData = await formatTemplate(
        currentStep.inputData,
        lastStep.outputData
      );
      break;

    case 'log':
      outputData = await logStepToFile(currentStep.inputData, lastStep);
      break;

    case 'custom':
      const customFnResult = await (currentStep.inputData as CustomFunction)(
        testCase,
        currentStep,
        lastStep
      );
      inputData = customFnResult.inputData;
      outputData = customFnResult.outputData;
      verification = customFnResult.verification;
      break;

    case 'customFrom':
      const customFromFn: CustomFunction = await customFrom(
        currentStep.inputData
      );
      const customFnFromResult = await customFromFn(
        testCase,
        currentStep,
        lastStep
      );
      inputData = customFnFromResult.inputData;
      outputData = customFnFromResult.outputData;
      verification = customFnFromResult.verification;
      break;

    default:
      throw new Error(`'${currentStep.action}' method is not implemented.`);
  }
  return { inputData, outputData, verification };
}
