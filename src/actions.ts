import axios, { AxiosRequestConfig } from 'axios';
import * as Eta from 'eta';
import * as JemsPath from 'jmespath';
import Helper from './helpers';
import {
  FormatTemplateOptions,
  GetOptions,
  PostOptions,
  QueryLang,
  VerificationResult,
} from './types';

export async function get(options: GetOptions): Promise<any> {
  const url = typeof options === 'string' ? options : options?.url;

  const config =
    typeof options !== 'string' ? (options as AxiosRequestConfig) : undefined;

  if (!url) throw new Error('Invalid url');

  if (config) config.method = 'GET';

  return await axios.get(url, config);
}

export async function post(options: PostOptions): Promise<any> {
  var url = options?.url;
  var data = options?.data;
  const config =
    typeof options !== 'string' ? (options as AxiosRequestConfig) : undefined;

  if (!url) url = config?.url;
  if (!data) data = config?.data;

  if (!url) throw new Error('Invalid url');
  if (!url) throw new Error('Invalid data');

  if (config) config.method = 'POST';

  return await axios.post(url, data, config);
}

export function getQueryLang(query: string): {
  lang: QueryLang;
  query: string;
} {
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
