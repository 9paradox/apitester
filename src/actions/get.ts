import axios, { AxiosRequestConfig } from 'axios';
import Helper from '../utils/helpers';

export type GetOptions = string | AxiosRequestConfig | undefined;

export async function get(
  options: GetOptions,
  signal?: AbortSignal
): Promise<any> {
  const url = typeof options === 'string' ? options : options?.url;

  var config =
    typeof options !== 'string' ? (options as AxiosRequestConfig) : undefined;

  if (!url || !Helper.isValidURL(url)) throw new Error('Invalid url');

  if (config) {
    config.method = 'GET';
    config.validateStatus = (statusNumber) => {
      return true;
    }; //don't throw error
    config.signal = signal;
  } else {
    config = {
      method: 'GET',
      validateStatus: (statusNumber: number) => {
        return true;
      },
      signal: signal,
    } as AxiosRequestConfig;
  }

  const { data, status, statusText } = await axios.get(url, config);
  return { data, status, statusText };
}
