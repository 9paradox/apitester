import * as JemsPath from 'jmespath';
import { QueryLang } from '../types';
import { getQueryLang } from './getQueryLang';

export async function pickJsonData(data: any, query: string): Promise<any> {
  const queryLang = getQueryLang(query);
  if (queryLang.lang == QueryLang.jmespath) {
    return await JemsPath.search(data, queryLang.query);
  }
  return null;
}
