import axios, { AxiosRequestConfig } from 'axios';

export type AxiosOptions = AxiosRequestConfig;

export async function axiosReq(options: AxiosOptions): Promise<any> {
  const { data, status, statusText } = await axios.request(options);
  return { data, status, statusText };
}
