import { TestRunner } from './types';
import JestHelper from './utils/jestHelper';
import { TestCase } from './testcase';

const runner = (testCase: TestCase, testRunner: TestRunner) => {
  switch (testRunner.name) {
    case 'jest':
      JestHelper.test(testRunner, testCase);
  }
};

export default runner;
