import axios, { AxiosRequestConfig } from 'axios';

export interface SimplePostConfig {
  url: string;
  data: any;
}
export type PostOptions = SimplePostConfig | AxiosRequestConfig | undefined;

export async function post(options: PostOptions): Promise<any> {
  var url = options?.url;
  var reqData = options?.data;
  var config =
    typeof options !== 'string' ? (options as AxiosRequestConfig) : undefined;

  if (!url) url = config?.url;
  if (!reqData) reqData = config?.data;

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

  const { data, status, statusText } = await axios.post(url, reqData, config);
  return { data, status, statusText };
}
