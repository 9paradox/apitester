export function inputAsOutput(data: any): any {
  var outputData: any = typeof data == 'string' ? data : { ...data };
  return outputData;
}
