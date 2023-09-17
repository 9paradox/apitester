import { pickJsonData } from './pickJsonData';

interface QueryData {
  step: number;
  query: string;
  name: string;
}

export interface BuildDataOptions {
  queries: QueryData[];
}

export async function buildData(
  data: any[],
  options: BuildDataOptions
): Promise<any> {
  if (!data || data.length == 0) return null;

  if (!options || !options.queries || options.queries.length == 0) return null;

  var outputData: any = {};
  for (var i = 0; i < options.queries.length; i++) {
    const query = options.queries[i];
    const result = await pickJsonData(data[i], query.query);
    outputData[query.name] = result;
  }
  return outputData;
}
