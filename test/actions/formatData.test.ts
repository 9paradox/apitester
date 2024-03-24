import { templates } from 'eta';
import { FormatDataOptions, formatData } from '../../src/actions/formatData';

describe('formatData', () => {
  it('should return formatted data for string template as string', async () => {
    const template = 'http://localhost:3000/todos/<%= it.id %>';
    const inputData = {
      id: 1,
    };
    const result = await formatData(template, inputData);
    expect(result).toEqual('http://localhost:3000/todos/1');
  });

  it('should return formatted data for object template as object', async () => {
    const option: FormatDataOptions = {
      templateData: `
        {
            "url": "http://localhost:3000/posts",
            "data": {
                "title":"<%= it.data.title %>",
                "body":"<%= it.data.body %>",
                "userId":<%= it.data.userId %>
            }
        }
    `,
      outputDataFormat: 'object',
    };
    const inputData = {
      data: {
        title: 'delectus aut autem',
        body: 'quis ut nam facilis et officia qui',
        userId: 1,
      },
    };
    const result = await formatData(option, inputData);
    expect(result).toEqual({
      url: 'http://localhost:3000/posts',
      data: {
        title: 'delectus aut autem',
        body: 'quis ut nam facilis et officia qui',
        userId: 1,
      },
    });
  });

  it('should return formatted data for object template as string', async () => {
    const option: FormatDataOptions = {
      templateData: 'http://localhost:3000/todos/<%= it.id %>',
      outputDataFormat: 'string',
    };
    const inputData = {
      id: 1,
    };
    const result = await formatData(option, inputData);
    expect(result).toEqual('http://localhost:3000/todos/1');
  });
});
