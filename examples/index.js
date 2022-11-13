const { default: apitester } = require("@9paradox/apitester");

apitester.createTestCase('should perform overall test actions and verifications')
    .get('https://jsonplaceholder.typicode.com/todos/')
    .pickAndVerify({query: 'status', expected: 200})
    .pickStep(1)
    .pickData('data[0].{id: id}')
    .formatData('https://jsonplaceholder.typicode.com/todos/<%= it.id %>')
    .get()
    .pickData('data.title')
    .verify('delectus aut autem')
    .test()
    .then(testResult => {
        console.log('Testcase success:-')
        console.log(testResult.success);
        if(!testResult.success){
            console.log('Testcase steps:-')
            console.log(testResult.steps);
        }
    })
    .catch(err => {
        console.log(err);
    });