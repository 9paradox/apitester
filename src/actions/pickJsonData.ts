import * as JemsPath from 'jmespath';
import jsonata from 'jsonata';
import { QueryLang } from '../types';
import { getQueryLang } from './getQueryLang';

export async function pickJsonData(data: any, query: string): Promise<any> {
  if (!data || !query) return null;

  const queryLang = getQueryLang(query);
  if (queryLang.lang == QueryLang.jmespath) {
    return await JemsPath.search(data, queryLang.query);
  }
  if (queryLang.lang == QueryLang.jsonata) {
    const expression = jsonata(queryLang.query);
    const result = await expression.evaluate(data);
    return result;
  }
  return null;
}
