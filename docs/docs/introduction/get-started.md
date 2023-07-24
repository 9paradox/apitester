# Getting Started with apitester

Welcome to apitester, the simple and powerful REST API testing package! This guide will walk you through the steps to set up a new Node.js project and get started with apitester. Will start creating and running API test cases in no time.

For this tutorial we will use Jest to run our testcases, you can use other test runner with apitester.

## 1. Set up a new NPM project

Before we begin, make sure you have Node.js and npm (Node Package Manager) installed on your machine. If you don't have them installed, you can download and install them from the official Node.js website (https://nodejs.org).

Now, open your terminal or command prompt and follow these steps:

1. Create a new project directory:

   ```bash
   mkdir my-api-testing-project
   cd my-api-testing-project
   ```

2. Initialize a new npm project:
   ```bash
   npm init -y
   ```

This will generate a `package.json` file in your project directory.

## 2. Install Jest

[Jest](https://jestjs.io/) is a popular testing framework for JavaScript and is widely used for unit testing in Node.js projects. Let's install Jest as a development dependency for our project:

```bash
npm install jest --save-dev
```

This will install Jest and add it as a dev dependency in your `package.json`.

## 3. Install apitester

```bash
npm install @9paradox/apitester
```

This will add @9paradox/apitester as a dependency in your `package.json`. If we want we can also install it as dev dependency.

## 4. Create a test folder with your first test file

Now, let's create a folder to hold our test files. By convention, Jest looks for test files in a directory named `__tests__`, so we'll use that:

1. Create the test folder:

   ```bash
   mkdir __tests__
   ```

2. Create your first test file inside the test folder. Let's call it `hello.test.js`:

   ```javascript
   //__test__/hello.test.js
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
     .testWith('jest');
   ```

## 5. Add a test script to your package.json

To run your tests conveniently, add a test script to your `package.json` file by updating the highlighted line:

```json{6,7,8}
{
  "name": "my-api-testing-project",
  "version": "...",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "jest" // [!code focus] // [!code ++]
  },
  "keywords": [],
  "author": "...",
  "license": "ISC",
  "devDependencies": {
    "@9paradox/apitester": "...",
    "jest": "..."
  }
}
```

## Running the tests

You are now all set to run your tests. To execute the test suite, simply run:

```bash
npm test
```

Jest will automatically discover and execute the test files inside the `__tests__` directory and your test output will be something like:

```bash
> my-api-testing-project@1.0.0 test
> jest

 PASS  __tests__/hello.test.js
  √ verify todos endpoint returns status 200 (248 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.231 s
Ran all test suites.
```

Congratulations! You have successfully set up a new Node.js project with apitester and Jest for API testing. You can now write more test cases and expand your test suite to ensure the reliability and correctness of your api. Happy testing!
