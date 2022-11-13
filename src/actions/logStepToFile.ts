import Helper from '../utils/helpers';
import { Step } from '../types';

export interface LogFileResult {
  filePath: string | null;
}

export async function logStepToFile(
  folderPath: string,
  step: Step
): Promise<LogFileResult> {
  try {
    const dateTimeStr = Helper.getDateTimeString();
    var filePath =
      step.action.replace(/[^a-z0-9]/gi, '_').toLowerCase() +
      '_' +
      dateTimeStr +
      '.txt';

    filePath = Helper.joinPaths(folderPath, filePath);
    const text = JSON.stringify(step, undefined, 2);
    Helper.writeToFile(filePath, text);
    return {
      filePath: filePath,
    };
  } catch (e) {
    return {
      filePath: null,
    };
  }
}
