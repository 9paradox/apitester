# Setting up Testcases

Setting up Testcases builds up on [getting started](/docs/introduction/get-started) tutorial please read it before proceeding.

In this tutorial we will see the different ways in which we can create testcases and run testcases in out testing project.

## Testcases

Testcases are the heart of apitester. They define the steps to be executed in a particular order to perform API testing. Each step in a testcase represents an action, verification, or logging operation.

A typical testcase consists of multiple steps, where each step has an associated action or verification. The testcases are created using the `apitester.createTestCase()` method, and then various steps are added to the testcase using method chaining.

## Creating Testcases

We can create and run testcases in different methods.

1. `apitester.createTestCase` function to write testcase through code.
2. `apitester.createTestCaseFromJsonFile` function to build testcase from json file.
3. `apitester.getJsonTestCasesFromFolder` function to get all json testcases from a folder.
4. `apitester.testJsonTestCasesWith` one function which gets all json testcases from a folder and runs using test runner such as `Jest`.

Testcase file should end with `.test.js / ts / json`, for example `verify-todo.test.js`, or when it is a json-testcases `verify-todo.test.json`.

::: tip
It is suggested to use method 4. `apitester.testJsonTestCasesWith`, when you are starting up a new project with json testcases. Yes you can mix and match these methods as per you need.
:::

### Methods 1: `apitester.createTestCase`

Write testcase through code.

You can create a js or ts file, define testcase and add steps to it using method chaining. Here's an example of a simple testcase:

::: code-group

```javascript:line-numbers {1} [test with Jest]
//__test__/verify-todo.test.js
const { apitester } = require('@9paradox/apitester');

const testcase = apitester.createTestCase({
  title: 'Verify todos endpoint returns status 200',
});

testcase
  .get('https://jsonplaceholder.typicode.com/todos/')
  .pickAndVerify({ query: 'status', expected: 200 })
  .testWith("jest");
```

```javascript:line-numbers {1} [test manual way]
//__test__/verify-todo.test.js
const { apitester } = require('@9paradox/apitester');

const testcase = apitester.createTestCase({
  title: 'Verify todos endpoint returns status 200',
});

testcase
  .get('https://jsonplaceholder.typicode.com/todos/')
  .pickAndVerify({ query: 'status', expected: 200 })
  .test()
  .then((testResult) => {
    console.log('Testcase success:', testResult.success);
    if (!testResult.success) {
      console.log('Testcase failed:', testResult.error);
      console.log('Testcase steps:', testResult.steps);
    }
  })
  .catch((err) => console.error(err));
```

```javascript:line-numbers {1} [test manually with Jest]
//__test__/verify-todo.test.js
const { apitester } = require('@9paradox/apitester');

describe('Todos endpoint', () => {
    it('should return 200 status', async () => {
        const testcase = apitester.createTestCase({
        title: 'Verify todos endpoint returns status 200',
        });

        const testResult = await testcase
        .get('https://jsonplaceholder.typicode.com/todos/')
        .pickAndVerify({ query: 'status', expected: 200 })
        .test();

        if (!testResult.success) {
            console.log(testResult.error?.title + '\nError: ' + testResult.error?.message);
        }

        expect(testResult.success).toEqual(true);
    });
});
```

:::


### Method 2: `apitester.createTestCaseFromJsonFile`

Creating Testcase from JSON File

You can also create a testcase from a JSON file using the `apitester.createTestCaseFromJsonFile()` method.

This is useful when you want to store testcases in separate files for better organization.

First create a JSON file with the testcase steps:

::: code-group

```json:line-numbers [__test__/my_test_case.test.json]
{
  "title": "Verify todos endpoint returns status 200",
  "steps": [
    {
      "action": "get",
      "inputData": "https://jsonplaceholder.typicode.com/todos/"
    },
    {
      "action": "pickAndVerify",
      "inputData": {
        "query": "status",
        "expected": 200
      }
    }
  ]
}
```

:::

Load the testcase from the JSON file:

::: code-group

```javascript:line-numbers {1} [test with Jest]
//__test__/my-test-case.test.js
const { apitester } = require('@9paradox/apitester');

const testcase = apitester.createTestCaseFromJsonFile('./__test__/my_test_case.test.json');

testcase.testWith("jest");
```

```javascript:line-numbers {1} [test manual way]
//__test__/my-test-case.test.js
const { apitester } = require('@9paradox/apitester');

const testcase = apitester.createTestCaseFromJsonFile('./__test__/my_test_case.test.json');

testcase
  .test()
  .then((testResult) => {
    console.log('Testcase success:', testResult.success);
    if (!testResult.success) {
      console.log('Testcase failed:', testResult.error);
      console.log('Testcase steps:', testResult.steps);
    }
  })
  .catch((err) => console.error(err));
```

```javascript:line-numbers {1} [test manually with Jest]
//__test__/my-test-case.test.js
const { apitester } = require('@9paradox/apitester');

describe('Todos endpoint', () => {
   it('should return 200 status', async () => {
       const testcase = apitester.createTestCaseFromJsonFile('./__test__/my_test_case.test.json');
       const testResult = await testcase.test();
       if (!testResult.success) {
           console.log(testResult.error?.title + '\nError: ' + testResult.error?.message);
       }
       expect(testResult.success).toEqual(true);
    });
});
```
:::

### Method 3: `apitester.getJsonTestCasesFromFolder`

Gets all json testcases from a folder.

This is a manual method which is useful when you wan to loop through each json testcase from a specified folder and run them manually.

::: code-group

```javascript:line-numbers {1,6} [test manual way]
//__test__/test-my-json-testcases.test.js

// folder structure with json testcase
//  __test__/
//    -- test-my-json-testcases.test.js
//    -- my-json-testcases/
//        -- my-testcase.test.json
//        -- other_scenario.test.json

const { apitester } = require('@9paradox/apitester');

const testCases = apitester.getJsonTestCasesFromFolder(
    './__test__/my-json-testcases'
);

const multiTestCaseResult = await apitester.runTestCases(testCases);

if (!multiTestCaseResult.success) {
    console.log('Testcases failed: ' + multiTestCaseResult.failedTestCases);
}
else {
   console.log('Testcases were successful');
}
```


```javascript:line-numbers {1,6} [test manually with Jest]
//__test__/test-my-json-testcases.test.js

// folder structure with json testcase
//  __test__/
//    -- test-my-json-testcases.test.js
//    -- my-json-testcases/
//        -- my-testcase.test.json
//        -- other_scenario.test.json

const { apitester } = require('@9paradox/apitester');

describe('Todos endpoint', () => {
  it('should run json test-case files from folder', async () => {
    const testCases = apitester.getJsonTestCasesFromFolder(
      './__test__/my-json-testcases'
    );

    const multiTestCaseResult = await apitester.runTestCases(testCases);

    if (!multiTestCaseResult.success) {
      console.log('Testcases failed: ' + multiTestCaseResult.failedTestCases);
    }

    expect(multiTestCaseResult.success).toEqual(true);
  });
});
```

:::

### Method 4: `apitester.testJsonTestCasesWith`

Easiest method to get all json testcases and run them using test runner such such as `Jest`.

First thing is to add the start file for json folder you want to run test for.

::: code-group

```javascript:line-numbers {1} [test with Jest]
//__test__/run-json-testcases.test.js

// folder structure with json testcase
//  __test__/
//    -- test-my-json-testcases.test.js
//    -- all-json-testcases/
//        -- scenario-1.test.json
//        -- scenario-2.test.json
//        -- scenario-3.test.json
//        -- ...
//        -- other_scenario.test.json

const { apitester } = require('@9paradox/apitester');

apitester.testJsonTestCasesWith('./__test__/all-json-testcases', 'jest');
```

:::

Just this one code line will find all the testcases which ends with `.test.json` files and run them using `Jest`.

apitester has inbuilt support for `Jest`.


## Running Testcases

To run the testcase it is suggested to use some test runners such as [jest](https://jestjs.io/docs/getting-started) or [xv](https://github.com/typicode/xv).

::: code-group

```bash [with Jest configured]
npm test
```

```bash [manual test]
node __test__/folder-path-to/your-testcase.test.js
```

:::
