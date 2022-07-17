import axios from 'axios';
import * as Eta from 'eta';
import * as JemsPath from 'jmespath';
import { QueryLang, VerificationResult } from './types';

export async function get(url: string): Promise<any> {
  return await axios.get(url);
}

export function getQueryLang(query: string): { lang: QueryLang; query: string } {
  const querySegment = query.split('@$');

  if (querySegment.length <= 1)
    return { lang: QueryLang.jmespath, query: query.trim() };

  const lang = querySegment[0].trim();
  const queryStr = querySegment[1].trim();
  switch (lang) {
    case QueryLang.jmespath:
      return { lang: QueryLang.jmespath, query: queryStr };
    case QueryLang.jsonata:
      return { lang: QueryLang.jsonata, query: queryStr };
    default:
      throw new Error('Invalid query language: ' + lang);
  }
}

export async function pickJsonData(data: any, query: string): Promise<any> {
  const queryLang = getQueryLang(query);
  if (queryLang.lang == QueryLang.jmespath) {
    return await JemsPath.search(data, queryLang.query);
  }
  return null;
}

export async function formatData(templateData: any, inputData: any): Promise<any> {
  const dataStr =
    typeof templateData != 'string'
      ? JSON.stringify(templateData)
      : templateData;
  return await Eta.render(dataStr, inputData);
}

export async function pickDataAndVerify(
  inputData: any,
  query: string,
  expectedData: any
): Promise<VerificationResult> {
  const actualData = await pickJsonData(inputData, query);
  const areEqual = JSON.stringify(actualData) === JSON.stringify(expectedData);
  return { verified: areEqual, actualData };
}

export async function verify(
  actualData: any,
  expectedData: any
): Promise<VerificationResult> {
  const areEqual = JSON.stringify(actualData) === JSON.stringify(expectedData);
  return { verified: areEqual, actualData };
}
