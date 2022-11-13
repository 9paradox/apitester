import * as Eta from 'eta';
import Helper from '../utils/helpers';

export type FormatTemplateOptions =
  | string
  | {
      filePath: string;
      outputDataFormat: 'string' | 'number' | 'boolean' | 'object';
    }
  | undefined;

export async function formatTemplate(
  options: FormatTemplateOptions,
  inputData: any
): Promise<any> {
  const template = typeof options != 'string' ? options?.filePath : options;

  const outputDataFormat =
    typeof options != 'string' ? options?.outputDataFormat : 'object';

  if (!template || !Helper.fileExists(template)) {
    throw new Error('Template file not found.');
  }

  const renderedStr = await Eta.render(Helper.readFile(template), inputData);

  if (renderedStr == undefined) {
    throw new Error('Template file content is invalid.');
  }

  switch (outputDataFormat) {
    case 'boolean':
    case 'number':
    case 'object':
      return JSON.parse(renderedStr);
    case 'string':
      return renderedStr;
    default:
      throw new Error('Template file failed to convert to output format.');
  }
}
