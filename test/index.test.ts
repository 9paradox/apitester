import apitester from '../src/index';

describe('apitester', () => {
  it('should perform overall test actions and verifications', async () => {
    try {
      const test = apitester.setup(
        'should perform overall test actions and verifications'
      );

      const testResult = await test
        .get('https://jsonplaceholder.typicode.com/todos/')
        .withLastStep_pickAndVerify('status', 200)
        .pickStep(1)
        .withLastStep_pickData('data[0].{id: id}')
        .withLastStep_formatData(
          'https://jsonplaceholder.typicode.com/todos/<%= it.id %>'
        )
        .get()
        .withLastStep_pickData('data.title')
        .withLastStep_Verify('delectus aut autem')
        .test();

      expect(testResult.success).toEqual(true);
    } catch (error) {
      console.log(error);
      expect(false).toEqual(true);
    }
  });
});
