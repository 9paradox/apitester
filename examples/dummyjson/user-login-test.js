const { apitester } = require("@9paradox/apitester");

const testcase = apitester.createTestCase({
    title: 'verify user can login and has token on dummyjson/user endpoint',
});

testcase
    .axios({
        url: 'https://dummyjson.com/auth/login',
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        data: {
            username: 'kminchelle',
            password: '0lelplR',
        },
    })
    .pickAndVerify({ query: 'status', expected: 200, toBe: '==' })
    .pickStep(1)
    .pickAndVerify({
        query: 'data.token',
        expected: [null, undefined],
        toBe: 'notIn',
    })
    .test()
    .then((testResult) => {
        console.log('Testcase success:- ', testResult.success);
        if (!testResult.success) {
            console.log('Testcase failed:- ', testResult.error);
            console.log('Testcase steps:- ', testResult.steps);
        }
    })
    .catch((err) => console.log(err));
