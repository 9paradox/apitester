# apitester

A simple rest api testing package for javascript and typescript. 
Crafted with easy to use method call and method chaining, so you can write clean api testing automation scripts.

🛠️ *This project is still in alpha stage and there might be breaking changes in stable release.* 🛠️

## Installation

Install into an existing javascript or typescript project

```bash
npm i @9paradox/apitester
```

## Usage

Simple nodejs example to get started.

```javascript
//simple_test.js
const  {  default: apitester }  =  require("@9paradox/apitester");

const testcase = apitester.createTestCase('verify todos endpoint returns status 200');
testcase.get('https://jsonplaceholder.typicode.com/todos/')
		.pickAndVerify({query:  'status',  expected:  200})
		.test()
		.then(testResult  =>  {
			console.log('Testcase success:-')
			console.log(testResult.success);
			if(!testResult.success){
				console.log('Testcase steps:-')
				console.log(testResult.steps);
			}
		})
		.catch(err  =>  {
			console.log(err);
		});
```

to run the file

```bash
node simple_test.js
```

We can use apitester in any nodejs test project such as [jest](https://jestjs.io/docs/getting-started) or [xv](https://github.com/typicode/xv). 
There are some more examples in the [examples](https://github.com/9paradox/apitester/tree/main/examples) folder. 
PRs adding more examples are very welcome!

## Table of Contents

-	[Installation](https://github.com/9paradox/apitester#Installation)
-	[Usage](https://github.com/9paradox/apitester#Usage)

## Roadmap

- Add plugin architecture 
- Add more actions
- Add docs
- Code refactor
- Add more examples

## License
[MIT](https://raw.githubusercontent.com/9paradox/apitester/main/LICENSE)

