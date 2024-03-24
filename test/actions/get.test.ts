import { GetOptions, get } from '../../src/actions/get';

describe('get', () => {
  it('should perform get http call', async () => {
    const result = await get('https://dummyjson.com/products/1');
    expect(result.status).toEqual(200);
  });

  it('should perform get http call with options', async () => {
    const options: GetOptions = {
      url: 'https://dummyjson.com/products/1',
      method: 'GET',
    };
    const result = await get(options);
    expect(result.status).toEqual(200);
  });

  it('should perform get http call with headers', async () => {
    const options: GetOptions = {
      url: 'https://dummyjson.com/products/1',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const result = await get(options);
    expect(result.status).toEqual(200);
  })
});
