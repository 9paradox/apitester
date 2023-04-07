//npm i @9paradox/apitester
const { apitester } = require("@9paradox/apitester");

//testcase to verify TODOs endpoint is status is success
//then pick the first todo from response and verify if the tile.

apitester.createTestCase('Verify TODOS endpoint')

    //step 1. get results form /todos
    .get('https://jsonplaceholder.typicode.com/todos/')

    //step 2. verify the status is success
    .pickAndVerify({ query: 'status', expected: 200 })

    //step 3. select data of step 1
    .pickStep(1)

    //step 4. select id of first todo
    .pickData('data[0].{id: id}')
    .pickAndVerify({ query: 'id', toBe: "notIn", expected: ["", null] })
    .pickStep(4)
    //step 5. build url for selected id
    .formatData('https://jsonplaceholder.typicode.com/todos/<%= it.id %>')

    //step 6. perform get on the url build in previous step
    .get()

    //step 7. verify title from data received in previous step
    .pickAndVerify({ query: 'data.title', expected: 'delectus aut autem' })

    //perform the test
    .test()
    .then(testResult => {
        console.log('Testcase success:- ', testResult.success);
        if (!testResult.success) {
            console.log('Testcase failed:- ', testResult.error);
            console.log('Testcase steps:- ', testResult.steps);
        }
    })
    .catch(err => console.log(err));