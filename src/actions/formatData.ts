import * as Eta from 'eta';

export async function formatData(
  templateData: any,
  inputData: any
): Promise<any> {
  const dataStr =
    typeof templateData != 'string'
      ? JSON.stringify(templateData)
      : templateData;
  return await Eta.render(dataStr, inputData);
}
