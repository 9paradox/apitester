# apitester

A simple rest api testing package. Crafted with easy to use method call and method chaining, so you can write clean api testing automation scripts in javascript and typescript.

🛠️ _This project is still in alpha stage and there might be breaking changes in stable release._ 🛠️

## Features

- Easily test entire api workflows.
- Define testing steps directly in json file.
- Log request and response.
- Capture time and performance.
- Load testcase data.
- Load request and data templates.
- Query data easily with [jmespath](https://jmespath.org/) or [jsonata](https://jsonata.org/).
- Extend functionality using custom functions.

## Table of Contents

- [Installation](https://github.com/9paradox/apitester#Installation)
- [Usage](https://github.com/9paradox/apitester#Usage)
- [Type reference](https://github.com/9paradox/apitester#type-reference)

## Installation

Install into an new or existing javascript/typescript project.

```bash
npm i @9paradox/apitester
```

## Usage

1.  Initial step is to create a testcase using one of the following way:
    - `apitester.createTestCase` function to write testcase through code.
    - `apitester.createTestCaseFromJsonFile` function to build testcase from json file.
    - `apitester.getJsonTestCasesFromFolder` function to get all json testcases from a folder.
2.  The testcase can perform multiple steps/actions.
3.  Each step/action requires input data. Some of the steps can use output data from previous step as input.
4.  Finally we call `test()` function to start executing the testcase, which returns a `Promise`.
    - In case of `apitester.getJsonTestCasesFromFolder`, we use `apitester.runTestCases(testcases)` to execute multiple testcases.

Simple example to get started with `apitester.createTestCase`.

```javascript
//simple_test.js
const { apitester } = require('@9paradox/apitester');

const testcase = apitester.createTestCase({
  title: 'verify todos endpoint returns status 200',
});

testcase
  //step 1. get results form /todos
  .get('https://jsonplaceholder.typicode.com/todos/')

  //step 2. verify the status is success
  .pickAndVerify({ query: 'status', expected: 200 })

  //perform the test
  .test()
  .then((testResult) => {
    console.log('Testcase success:- ', testResult.success);
    if (!testResult.success) {
      console.log('Testcase failed:- ', testResult.error);
      console.log('Testcase steps:- ', testResult.steps);
    }
  })
  .catch((err) => console.log(err));
```

to run the file

```bash
node simple_test.js
```

We can use apitester in any nodejs test project such as [jest](https://jestjs.io/docs/getting-started) or [xv](https://github.com/typicode/xv).
There are some more examples in the [examples](https://github.com/9paradox/apitester/tree/main/examples) folder.
PRs adding more examples are very welcome!

## Try online

Check out these [demo](https://stackblitz.com/edit/apitester-examples-nodejs-d4tcen?file=README.md) testcase to get started with apitester.

## Method Reference

#### `apitester.createTestCase(..)`

Create new testcase.

```javascript
const testcase = apitester.createTestCase({...}: TestCaseOptions);
```

#### TestCaseOptions

| Parameter      | Type                                    | Required | Description                                                                                                      |
| :------------- | :-------------------------------------- | :------- | :--------------------------------------------------------------------------------------------------------------- |
| `title`        | `string`                                | `no`     | Title for the test case.                                                                                         |
| `dataFilePath` | `string`                                | `no`     | File path for JSON data key-value file.                                                                          |
| `steps`        | `StepOptions[]`                         | `no`     | Add steps while creating testcase. Check [type reference](https://github.com/9paradox/apitester#type-reference). |
| `logPath`      | `string`                                | `no`     | Logging folder path.                                                                                             |
| `logEachStep`  | `boolean`                               | `no`     | Used to enable logging each step.                                                                                |
| `callback`     | `(data: CallbackData) => Promise<void>` | `no`     | Callback function called before and after each step.                                                             |

#### `apitester.createTestCaseFromJsonFile(..)`

Create new testcase from json test-case file.

```javascript
const testcase = apitester.createTestCaseFromJsonFile(
  'path-to-file/test-case.json'
);
```

Make sure the json test case file follows `TestCaseOptions` schema.

```json
{
  "title": "running apitester from example-test-case.json file",
  "steps": [
    {
      "action": "get",
      "inputData": "https://jsonplaceholder.typicode.com/todos/"
    },
    {
      "action": "pickAndVerify",
      "inputData": {
        "query": "status",
        "expected": 200,
        "toBe": "=="
      }
    }
  ]
}
```

#### `apitester.getJsonTestCasesFromFolder(..)` and `apitester.runTestCases(..)`

- We can test multiple json testcase from a given folder.
- Testcase file name must end with `.test.json`, for example `simple-testcase.test.json`, or else custom file extension list can be provided to `apitester.getJsonTestCasesFromFolder(..)`
- `apitester.runTestCases(..)` returns `MultiTestCaseResult`.

```javascript
//example folder with testcase
//  path-to/
//    -- json-testcases/
//        -- my-testcase.test.json
//        -- other_scenario.test.json

const testCases = apitester.getJsonTestCasesFromFolder(
  'path-to/json-testcases'
  //,['.test.json', '.apitester'] //custom file extensions (optional)
);

const multiTestCaseResult = await apitester.runTestCases(testCases);

if (!multiTestCaseResult.success) {
  console.log('Testcases failed: ' + multiTestCaseResult.failedTestCases);
}
```

- `apitester.runTestCases(testCases, callback)` also supports callback `(data: TestCaseCallbackData) => Promise<void>`.

## Quester - vscode extension

Create and run apitester testcases directly in vscode now. Install [Quester for vscode](https://marketplace.visualstudio.com/items?itemName=9paradox.quester-vscode) from Visual Studio Code marketplace.

![Quester - vscode extension](https://raw.githubusercontent.com/9paradox/quester-vscode/main/assets/quester-vscode-screenshot.png 'Quester for vscode extension screenshot')

## apitester-creator

Now easily create testcases with the online drag-and-drop tool - [apitester-creator](https://9paradox.com/apitester-creator/).

![apitester-creator](https://raw.githubusercontent.com/9paradox/apitester-creator/main/screenshot.png 'apitester-creator screenshot')

Export json testcases and run them using `apitester.getJsonTestCasesFromFolder(..)` and `apitester.runTestCases(..)`.

## Action/Step methods

Once a new testcase is created, we can perform multiple steps/actions and finally call `test()` method to execute the test.

| Action (ActionName) | Input Type               | Return Type | Description                                                                                    |
| :------------------ | :----------------------- | :---------- | :--------------------------------------------------------------------------------------------- |
| `get`               | `GetOptions`             | `TestCase`  | Perform `GET` http request.                                                                    |
| `post`              | `PostOptions`            | `TestCase`  | Perform `POST` http request.                                                                   |
| `axios`             | `AxiosOptions`           | `TestCase`  | Perform http request based on [AxiosRequestConfig](https://github.com/axios/axios#axios-api).  |
| `pickData`          | `string`                 | `TestCase`  | Perform json query to pick data from last step.                                                |
| `buildData`         | `BuildDataOptions`       | `TestCase`  | Build and merge your data from different steps using json query.                               |
| `formatData`        | `string`                 | `TestCase`  | Render string template based on input data from last step using [Eta.js](https://eta.js.org/). |
| `formatTemplate`    | `FormatTemplateOptions`  | `TestCase`  | Render template file based on input data from last step using [Eta.js](https://eta.js.org/).   |
| `pickAndVerify`     | `PickAndVerifyOptions`   | `TestCase`  | Perform json query to pick data from last step and do a test assert.                           |
| `verify`            | `VerifyOptions`          | `TestCase`  | To assert data from last step.                                                                 |
| `verifyTimeTaken`   | `VerifyTimeTakenOptions` | `TestCase`  | To assert time taken for last step.                                                            |
| `pickStep`          | `number`                 | `TestCase`  | To pick output data from specific step. Also supports negative index from current step.        |
| `addStep`           | `StepOptions`            | `TestCase`  | Add a steps from JSON object.                                                                  |
| `customFn`          | `CustomFnOptions`        | `TestCase`  | Run custom function as a step.                                                                 |
| `customFnFrom`      | `CustomFnFromOptions`    | `TestCase`  | Run custom function from a javascript file as a step.                                          |
| `log`               | -                        | `TestCase`  | Last steps will be logged to a file.                                                           |
| `getStep`           | `number`                 | `Step`      | Returns the specific step with its input and output data.                                      |

## Type Reference

#### StepOptions

Create steps from JSON object.

| Parameter   | Type         | Required | Description                                                                                                  |
| :---------- | :----------- | :------- | :----------------------------------------------------------------------------------------------------------- |
| `action`    | `ActionName` | `yes`    | Action name such as `get`,`pickAndVerify` etc.                                                               |
| `inputData` | `any`        | `yes`    | Input data for the action. Check [method reference](https://github.com/9paradox/apitester#method-reference). |

#### CallbackData

User provided callback function which is called before and after each step.

| Parameter    | Type                | Required | Description                                                 |
| :----------- | :------------------ | :------- | :---------------------------------------------------------- |
| `type`       | `before` or `after` | `yes`    | Used to identify if the callback is called before or after. |
| `step`       | `Step`              | `yes`    | Current step.                                               |
| `stepResult` | `StepResult`        | `no`     | Step success result updated in type 'after'.                |

#### TestCaseCallbackData

User provided callback function which is called before and after each testcase running with `apitester.runTestCases(...)`.

| Parameter        | Type                | Required | Description                                                 |
| :--------------- | :------------------ | :------- | :---------------------------------------------------------- |
| `type`           | `before` or `after` | `yes`    | Used to identify if the callback is called before or after. |
| `filePath`       | `string`            | `yes`    | Current testcase file path.                                 |
| `testCaseResult` | `TestCaseResult`    | `no`     | Testcase success result updated in type 'after'.            |

#### GetOptions

Create GetOptions using one of the following type.

| Type                 | Description                                                              |
| :------------------- | :----------------------------------------------------------------------- |
| `string`             | String URL.                                                              |
| `AxiosRequestConfig` | [Axios Request config object](https://github.com/axios/axios#axios-api). |
| `undefined`          | To pick string URL from last step.                                       |

#### PostOptions

Create PostOptions using one of the following type.

| Type                 | Description                                                              |
| :------------------- | :----------------------------------------------------------------------- |
| `SimplePostConfig`   | Object with string `url` and any `data`.                                 |
| `AxiosRequestConfig` | [Axios Request config object](https://github.com/axios/axios#axios-api). |
| `undefined`          | To pick `SimplePostConfig` from last step.                               |

#### BuildDataOptions

Query data form different steps and merge into one object.

| Parameter | Type          | Required | Description                                         |
| :-------- | :------------ | :------- | :-------------------------------------------------- |
| `queries` | `QueryData[]` | `yes`    | Array of queries to merge data from multiple steps. |

#### QueryData

| Parameter | Type     | Required | Description                           |
| :-------- | :------- | :------- | :------------------------------------ |
| `step`    | `number` | `yes`    | Step number to perform json query on. |
| `query`   | `string` | `yes`    | Json query.                           |
| `name`    | `string` | `yes`    | Field name to store value into.       |

#### FormatTemplateOptions

Create FormatTemplateOptions using one of the following type.

| Type                                                                                             | Description                              |
| :----------------------------------------------------------------------------------------------- | :--------------------------------------- |
| `string`                                                                                         | Template filepath.                       |
| {`'filePath'` : `string`, `'outputDataFormat'` : `string` or `number` or `'boolean` or `object`} | Template filepath and render output type |
| `undefined`                                                                                      | To take type from last step.             |

#### PickAndVerifyOptions

Perform json query to pick data from last step and verify the data against expected data.

| Parameter  | Type     | Required | Description                |
| :--------- | :------- | :------- | :------------------------- |
| `query`    | `string` | `yes`    | Query string to pick data. |
| `expected` | `any`    | `yes`    | Expected data.             |
| `toBe`     | `ToBe`   | `no`     | Comparison type.           |

#### ToBe

Assertion to perform against expected data. `==` is default.

`equal` , ` ==` , `notEqual` , `!=` , `greaterThan` , `>` , `greaterThanOrEqual` , `>=` , `lessThan` , `<` , `lessThanOrEqual` , `<=` , `in` , `notIn` , `contains`

#### VerifyOptions

Create VerifyOptions using one of the following type.

| Type                                                     | Description                  |
| :------------------------------------------------------- | :--------------------------- |
| `string`                                                 | string data.                 |
| {`'expected'` : `any`, `'toBe'` : `ToBe` or `undefined`} | Expected data to be verified |

#### VerifyTimeTakenOptions

Verify time taken by last step.

| Parameter  | Type        | Required | Description                                                                   |
| :--------- | :---------- | :------- | :---------------------------------------------------------------------------- |
| `expected` | `number`    | `yes`    | Expected time.                                                                |
| `format`   | `ms` or `s` | `yes`    | Compare expected time against ms (milliseconds) or s (seconds) of actual time |
| `toBe`     | `ToBe`      | `yes`    | Comparison type.                                                              |

#### CustomFnOptions

User provided function to run as a step.

| Parameter  | Type             | Required | Description                      |
| :--------- | :--------------- | :------- | :------------------------------- |
| `stepType` | `StepType`       | `yes`    | Type of step.                    |
| `fn`       | `CustomFunction` | `yes`    | Filepath of the javascript file. |

#### CustomFunction structure

```javascript
//custom function input parameter and return type structure
myFunction = async (testCase: TestCase, currentStep: Step, lastStep: Step) => {
	return {
		inputData: any;
		outputData: any;
		verification?: VerificationResult; //required when the step is Verification type
	}
}
```

#### CustomFnFromOptions

User provided function from a external file to run as a step. The user function should follow CustomFunction definition.

| Parameter      | Type       | Required | Description                                           |
| :------------- | :--------- | :------- | :---------------------------------------------------- |
| `stepType`     | `StepType` | `yes`    | Type of step.                                         |
| `filePath`     | `string`   | `yes`    | Filepath of the javascript file.                      |
| `functionName` | `string`   | `yes`    | Name of the function which is exported from the file. |

An example of a custom function from a external javascript file.

```javascript
//function should follow CustomFunction structure.
async function myCustomFunction(testCase, currentStep, lastStep) {
  var output = testCase.data('delectus_aut_autem');
  output = output.toUpperCase();
  var result = {
    inputData: lastStep.outputData,
    outputData: output,
  };
  return result;
}

//should follow exporting the functionName
module.exports.myCustomFunction = myCustomFunction;
```

#### StepType

Used to indicate step operation type.

| Values         | Description                                                            |
| :------------- | :--------------------------------------------------------------------- |
| `Action`       | To denote the step will perform some testcase related action.          |
| `Verification` | To denote the step will perform verification or assertion on action/s. |
| `Logging`      | To denote the step will perform logging action/s.                      |

#### VerificationResult

Return type for verification step.

| Parameter    | Type      | Required | Description                                     |
| :----------- | :-------- | :------- | :---------------------------------------------- |
| `verified`   | `boolean` | `yes`    | To denote if the step has passed the assertion. |
| `actualData` | `any`     | `yes`    | Actual data from the step used for assertion.   |
| `message`    | `string`  | `no`     | Any message or verification error message.      |

#### QueryLang

Enum to identify which json query library to use.

| Query string starts with | Values     | Description                                                                                                                               |
| :----------------------- | :--------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `@jmespath`              | `jmespath` | To denote the query will be performed using [jmespath](https://jmespath.org/).                                                            |
| `@jsonata`               | `jsonata`  | To denote the query will be performed using [jsonata](https://jsonata.org/). Note: jsonata query are work in progress in current release. |

#### Step

Structure of a step.

| Parameter    | Type                        | Description                                                    |
| :----------- | :-------------------------- | :------------------------------------------------------------- |
| `index`      | `number`                    | Step number starting from 1.                                   |
| `type`       | `StepType`                  | Type of step.                                                  |
| `action`     | `ActionName`                | Step/Action method name.                                       |
| `inputData`  | `any`                       | Input data/parameters provided to the action method.           |
| `outputData` | `any`                       | Output/return data from the action method.                     |
| `verified`   | `Optional<boolean>`         | Indicator if the step has been verified against the assertion. |
| `startedAt`  | `string`                    | Date time stamp of starting the step.                          |
| `endedAt`    | `string`                    | Date time stamp of ending the step.                            |
| `timeTaken`  | `{ ms: number; s: number }` | Time taken to execute the step.                                |

#### TestCaseResult

Return type for testcase `test()` method.

| Parameter                          | Type      | Required | Description                                                                                    |
| :--------------------------------- | :-------- | :------- | :--------------------------------------------------------------------------------------------- |
| `success`                          | `boolean` | `yes`    | Denotes if the testcase is successful.                                                         |
| `totalSteps`                       | `number`  | `yes`    | Total number of steps.                                                                         |
| `executedSteps`                    | `number`  | `yes`    | Total number of steps are executed.                                                            |
| `lastExecutedStep`                 | `number`  | `yes`    | Step number of last step that was executed.                                                    |
| `totalVerificationSteps`           | `number`  | `yes`    | Total number of [verification type](https://github.com/9paradox/apitester#steptype) of steps . |
| `executedVerificationSteps`        | `number`  | `yes`    | Total number of verification type of steps that were executed.                                 |
| `totalSuccessfulVerificationSteps` | `number`  | `yes`    | Total number of verification type of steps that were executed and were successful.             |
| `lastVerificationStep`             | `number`  | `yes`    | Step number of last verification type of step that was executed.                               |
| `steps`                            | `Step[]`  | `yes`    | List of all steps in the testcase.                                                             |
| `error`                            | `Error`   | `no`     | Error object containing error details.                                                         |

#### MultiTestCaseResult

Structure of multi testcase execution.

| Parameter         | Type               | Required | Description                                 |
| :---------------- | :----------------- | :------- | :------------------------------------------ |
| `success`         | `boolean`          | `yes`    | Denotes if all the testcase are successful. |
| `failedTestCases` | `number`           | `yes`    | Total number of failed testcases.           |
| `testCaseResults` | `TestCaseResult[]` | `yes`    | List of all testcase result.                |
| `error`           | `Error`            | `no`     | Error object containing error details.      |

#### Error

Structure of testcase error.

| Parameter   | Type                   | Required | Description                                            |
| :---------- | :--------------------- | :------- | :----------------------------------------------------- |
| `title`     | `string`               | `yes`    | Error title with step number where the error occurred. |
| `message`   | `string`               | `no`     | More detail description of the error.                  |
| `exception` | `string`               | `no`     | Exception in Json stringified form.                    |
| `type`      | `error` or `exception` | `no`     | Denotes the type of error.                             |

## Roadmap

- Refactor code to support plugin architecture
- Add more actions
- Update docs
- Code refactor
- Add more examples
- Add support for XML.

## License

[MIT](https://raw.githubusercontent.com/9paradox/apitester/main/LICENSE)
