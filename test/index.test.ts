import apitester from '../src/index';

describe('apitester', () => {
  it('should perform overall test actions and verifications', async () => {
    try {
      const test = apitester.setup(
        'should perform overall test actions and verifications'
      );

      const testResult = await test
        .get('https://jsonplaceholder.typicode.com/todos/')
        .pickAndVerify('status', 200)
        .pickStep(1)
        .pickData('data[0].{id: id}')
        .formatData('https://jsonplaceholder.typicode.com/todos/<%= it.id %>')
        .get()
        .pickData('data.title')
        .verify('delectus aut autem')
        .pickStep(6)
        .pickData(
          'data.{url:`https://jsonplaceholder.typicode.com/posts`,data:{title:title,body:`lol`,userId:to_number(`1`)}}'
        )
        .post()
        .pickData('data.title')
        .verify('delectus aut autem')
        .test();

      expect(testResult.success).toEqual(true);
      console.log(testResult.steps);
    } catch (error) {
      console.log(error);
      expect(false).toEqual(true);
    }
  });
});
