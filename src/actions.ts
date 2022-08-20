import axios, { AxiosRequestConfig } from 'axios';
import * as Eta from 'eta';
import * as JemsPath from 'jmespath';
import Helper from './helpers';
import {
  FormatTemplateOptions,
  GetOptions,
  PickAndVerifyOptions,
  PostOptions,
  QueryLang,
  ToBe,
  VerificationResult,
  VerifyOptions,
} from './types';

export async function get(options: GetOptions): Promise<any> {
  const url = typeof options === 'string' ? options : options?.url;

  var config =
    typeof options !== 'string' ? (options as AxiosRequestConfig) : undefined;

  if (!url) throw new Error('Invalid url');

  if (config) {
    config.method = 'GET';
    config.validateStatus = (statusNumber) => {
      return true;
    }; //don't throw error
  } else {
    config = {
      method: 'GET',
      validateStatus: (statusNumber: number) => {
        return true;
      },
    } as AxiosRequestConfig;
  }

  return await axios.get(url, config);
}

export async function post(options: PostOptions): Promise<any> {
  var url = options?.url;
  var data = options?.data;
  var config =
    typeof options !== 'string' ? (options as AxiosRequestConfig) : undefined;

  if (!url) url = config?.url;
  if (!data) data = config?.data;

  if (!url) throw new Error('Invalid url');
  if (!url) throw new Error('Invalid data');

  if (config) {
    config.method = 'POST';
    config.validateStatus = (statusNumber) => {
      return true;
    }; //don't throw error
  } else {
    config = {
      method: 'POST',
      validateStatus: (statusNumber: number) => {
        return true;
      },
    } as AxiosRequestConfig;
  }

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

export function compare(
  actual: any,
  toBe: ToBe,
  expected: any
): { check: boolean; message?: string } {
  var check = false;
  var message: string | undefined;
  switch (toBe) {
    case '==':
    case 'equal':
      check = JSON.stringify(actual) === JSON.stringify(expected);
      if (!check) {
        message = 'actual is not equal to expected.';
      }
      break;

    case '!=':
    case 'notEqual':
      check = JSON.stringify(actual) !== JSON.stringify(expected);
      if (!check) {
        message = 'actual and expected should be not equal.';
      }
      break;

    case '>':
    case 'greaterThan':
      if (Number.isNaN(actual) || Number.isNaN(expected)) {
        throw new Error('The actual or expected data is not number.');
      }
      check = JSON.stringify(actual) > JSON.stringify(expected);
      if (!check) {
        message = 'actual is not greater than expected.';
      }
      break;

    case '>=':
    case 'greaterThanOrEqual':
      if (Number.isNaN(actual) || Number.isNaN(expected)) {
        throw new Error('The actual or expected data is not number.');
      }
      check = JSON.stringify(actual) >= JSON.stringify(expected);
      if (!check) {
        message = 'actual is not greater than or equal to expected.';
      }
      break;

    case '<':
    case 'lessThan':
      if (Number.isNaN(actual) || Number.isNaN(expected)) {
        throw new Error('The actual or expected data is not number.');
      }
      check = JSON.stringify(actual) < JSON.stringify(expected);
      if (!check) {
        message = 'actual is not less than expected.';
      }
      break;

    case '<=':
    case 'lessThanOrEqual':
      if (Number.isNaN(actual) || Number.isNaN(expected)) {
        throw new Error('The actual or expected data is not number.');
      }
      check = JSON.stringify(actual) <= JSON.stringify(expected);
      if (!check) {
        message = 'actual is not less than or equal to expected.';
      }
      break;

    case 'in':
      if (!Array.isArray(expected)) {
        throw new Error('The expected data is not of array type.');
      }
      check = [...expected].includes(actual);
      if (!check) {
        message = 'actual is not found expected.';
      }
      break;

    case 'notIn':
      if (!Array.isArray(expected)) {
        throw new Error('The expected data is not of array type.');
      }
      check = ![...expected].includes(actual);
      if (!check) {
        message = 'actual should not be found expected.';
      }
      break;

    case 'contains':
      if (Array.isArray(actual)) {
        check = [...actual].includes(expected);
      } else {
        check = JSON.stringify(actual).includes(expected);
      }
      if (!check) {
        message = 'actual does not contain expected.';
      }
      break;

    default:
      throw new Error(`'${toBe}' comparison is not implemented.`);
  }
  return { check, message };
}

export async function pickDataAndVerify(
  inputData: any,
  options: PickAndVerifyOptions
): Promise<VerificationResult> {
  const toBe = options.toBe ?? '==';
  const actualData = await pickJsonData(inputData, options.query);
  const comparison = compare(actualData, toBe, options.expected);
  return {
    verified: comparison.check,
    actualData,
    message: comparison.message,
  };
}

export async function verify(
  actualData: any,
  options: VerifyOptions
): Promise<VerificationResult> {
  const toBe = typeof options != 'string' ? options.toBe ?? '==' : '==';
  const expectedData = typeof options != 'string' ? options.expected : options;

  const comparison = compare(actualData, toBe, expectedData);
  return {
    verified: comparison.check,
    actualData,
    message: comparison.message,
  };
}
