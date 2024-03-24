import { PostOptions, post } from '../../src/actions/post';

describe('post', () => {
  it('should perform post http call', async () => {
    const option = {
      url: 'https://dummyjson.com/products/add',
      data: {
        title: 'test',
      }
    }
    const result = await post(option);
    expect(result.status).toEqual(200);
  });

  it('should perform post http call with options', async () => {
    const options: PostOptions = {
      url: 'https://dummyjson.com/products/add',
      method: 'POST',
      data: {
        title: 'test',
      }
    };
    const result = await post(options);
    expect(result.status).toEqual(200);
  })

  it('should perform post http call with headers', async () => {
    const options: PostOptions = {
      url: 'https://dummyjson.com/products/add',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        title: 'test',
      }
    };
    const result = await post(options);
    expect(result.status).toEqual(200);
  })
});
