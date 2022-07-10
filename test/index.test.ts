import { apitester } from '../src/index';

describe('apitester', () => {
  it('should ', async () => {
    try {
      const test = apitester.setup('');
      await test
        .simpleGet('https://jsonplaceholder.typicode.com/todos/')
        .withLastStep_pickData('data[0].{id: id}')
        .withLastStep_formatData(
          'https://jsonplaceholder.typicode.com/todos/<%= it.id %>'
        )
        .withLastStep_simpleGet()
        .withLastStep_pickData('data.title')
        .test();

      const cc = test.getStep(5)?.outputData;
      expect(cc).toEqual('delectus aut autem');
    } catch (error) {
      console.log(error);
    }
  });
});
