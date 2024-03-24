import axios, { AxiosRequestConfig } from 'axios';
import Helper from '../utils/helpers';

export type AxiosOptions = AxiosRequestConfig;

export async function axiosReq(options: AxiosOptions): Promise<any> {
  if (!options.url || !Helper.isValidURL(options.url))
    throw new Error('Invalid url');
  const { data, status, statusText } = await axios.request(options);
  return { data, status, statusText };
}
