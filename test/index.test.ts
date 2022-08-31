import apitester from '../src/index';

describe('apitester', () => {
  it('should perform overall test actions and verifications', async () => {
    const test = apitester.createTestCase({
      dataFilePath: './test/test-data.json',
    });

    const testResult = await test
      .get('https://jsonplaceholder.typicode.com/todos/')
      .pickAndVerify({ query: 'status', expected: 200, toBe: '==' })
      .pickStep(1)
      .pickData('data[0].{id: id}')
      .formatData('https://jsonplaceholder.typicode.com/todos/<%= it.id %>')
      .get()
      .pickData('data.title')
      .verify('delectus aut autem')
      .addStep({ action: 'pickStep', inputData: 6 })
      .pickData('data.{data:{title:title,body:`lol`,userId:to_number(`1`)}}')
      .formatTemplate({
        filePath: './test/test-template.txt',
        outputDataFormat: 'object',
      })
      .post()
      .pickAndVerify({ query: 'status', expected: [200, 201], toBe: 'in' })
      .pickStep(12)
      .pickData('data.title')
      .verify(test.data('delectus_aut_autem'))
      .test();

    if (!testResult.success) {
      console.log(
        testResult.error?.title + '\nError: ' + testResult.error?.message
      );
    }

    expect(testResult.success).toEqual(true);
  });
});
