import apitester from '../src/apitester';

describe('apitester', () => {
  it('should perform overall test actions and verifications', async () => {
    try {
      const test = apitester.setup(
        'should perform overall test actions and verifications'
      );

      const testResult = await test
        .simpleGet('https://jsonplaceholder.typicode.com/todos/')
        .withLastStep_pickAndVerify('status', 200)
        .pickStep(1)
        .withLastStep_pickData('data[0].{id: id}')
        .withLastStep_formatData(
          'https://jsonplaceholder.typicode.com/todos/<%= it.id %>'
        )
        .withLastStep_simpleGet()
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
