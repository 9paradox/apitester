import { CustomFunction, StepType } from '../types';
import Helper from '../utils/helpers';

export interface CustomFnFromOptions {
  stepType: StepType;
  filePath: string;
  functionName: string;
}

export async function customFnFrom(
  options: CustomFnFromOptions
): Promise<CustomFunction> {
  if (options?.filePath && !Helper.fileExists(options.filePath)) {
    throw new Error('Custom function file not found.');
  }

  const module = await Helper.resolve(options.filePath);

  if (!module?.default) {
    throw new Error('Custom function file not found.');
  }

  if (!module.default[options.functionName]) {
    throw new Error('Custom function not found.');
  }

  return module.default[options.functionName];
}
