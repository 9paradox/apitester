const { apitester } = require("@9paradox/apitester");

apitester.createTestCase('should perform overall test actions and verifications')
    .get('https://jsonplaceholder.typicode.com/todos/')
    .pickAndVerify({ query: 'status', expected: 200 })
    .pickStep(1)
    .pickData('data[0].{id: id}')
    .formatData('https://jsonplaceholder.typicode.com/todos/<%= it.id %>')
    .get()
    .pickData('data.title')
    .verify('delectus aut autem')
    .test()
    .then(testResult => {
        console.log('Testcase success:- ', testResult.success);
        if (!testResult.success) {
            console.log('Testcase failed:- ', testResult.error);
            console.log('Testcase steps:- ', testResult.steps);
        }
    })
    .catch(err => console.log(err));