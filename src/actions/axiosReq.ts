import axios, { AxiosRequestConfig } from 'axios';
import Helper from '../utils/helpers';

export type AxiosOptions = AxiosRequestConfig;

export async function axiosReq(
  options: AxiosOptions,
  signal?: AbortSignal
): Promise<any> {
  if (!options.url || !Helper.isValidURL(options.url))
    throw new Error('Invalid url');

  options.signal = signal;
  const { data, status, statusText } = await axios.request(options);
  return { data, status, statusText };
}
