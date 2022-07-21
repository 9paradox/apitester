const { default: apitester } = require("@9paradox/apitester");

apitester.setup('should perform overall test actions and verifications')
    .simpleGet('https://jsonplaceholder.typicode.com/todos/')
    .withLastStep_pickAndVerify('status', 200)
    .pickStep(1)
    .withLastStep_pickData('data[0].{id: id}')
    .withLastStep_formatData('https://jsonplaceholder.typicode.com/todos/<%= it.id %>')
    .withLastStep_simpleGet()
    .withLastStep_pickData('data.title')
    .withLastStep_Verify('delectus aut autem')
    .test()
    .then(testResult => {
        console.log('Testcase success:-')
        console.log(testResult.success);
        console.log('Testcase steps:-')
        console.log(testResult.steps);
    })
    .catch(err => {
        console.log(err);
    });