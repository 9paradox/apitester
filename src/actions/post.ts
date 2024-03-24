import axios, { AxiosRequestConfig } from 'axios';
import Helper from '../utils/helpers';

export interface SimplePostConfig {
  url: string;
  data: any;
}
export type PostOptions = SimplePostConfig | AxiosRequestConfig | undefined;

export async function post(
  options: PostOptions,
  signal?: AbortSignal
): Promise<any> {
  var url = options?.url;
  var reqData = options?.data;
  var config =
    typeof options !== 'string' ? (options as AxiosRequestConfig) : undefined;

  if (!url) url = config?.url;
  if (!reqData) reqData = config?.data;

  if (!url || !Helper.isValidURL(url)) throw new Error('Invalid url');

  if (config) {
    config.method = 'POST';
    config.validateStatus = (statusNumber) => {
      return true;
    }; //don't throw error
    config.signal = signal;
  } else {
    config = {
      method: 'POST',
      validateStatus: (statusNumber: number) => {
        return true;
      },
      signal: signal,
    } as AxiosRequestConfig;
  }

  const { data, status, statusText } = await axios.post(url, reqData, config);
  return { data, status, statusText };
}
