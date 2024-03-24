import * as Eta from 'eta';

export type FormatDataOptions =
  | string
  | {
      templateData: string;
      outputDataFormat: 'string' | 'number' | 'boolean' | 'object';
    }
  | undefined;

export async function formatData(
  options: FormatDataOptions,
  inputData: any
): Promise<any> {
  const template = typeof options != 'string' ? options?.templateData : options;

  const outputDataFormat =
    typeof options != 'string' ? options?.outputDataFormat : 'string';

  const dataStr =
    typeof template != 'string' ? JSON.stringify(template) : template;

  var renderedStr = await Eta.render(dataStr, inputData);

  if (renderedStr == undefined) {
    throw new Error('Template data is invalid.');
  }

  switch (outputDataFormat) {
    case 'boolean':
    case 'number':
    case 'object':
      return JSON.parse(renderedStr);
    case 'string':
      return renderedStr;
    default:
      throw new Error('Template data failed to convert to output format.');
  }
}
