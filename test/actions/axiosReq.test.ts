import { AxiosOptions, axiosReq } from '../../src/actions/axiosReq';

describe('axiosReq', () => {
  it('should perform axios http call', async () => {
    const option = {
      url: 'https://dummyjson.com/products/1',
    };
    const result = await axiosReq(option);
    expect(result.status).toEqual(200);
  });

  it('should perform axios http call with options', async () => {
    const options: AxiosOptions = {
      url: 'https://dummyjson.com/products/1',
      method: 'GET',
    };
    const result = await axiosReq(options);
    expect(result.status).toEqual(200);
  });

  it('should perform axios http call with headers', async () => {
    const options: AxiosOptions = {
      url: 'https://dummyjson.com/products/add',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        title: 'test',
      },
    };
    const result = await axiosReq(options);
    expect(result.status).toEqual(200);
  });
});
