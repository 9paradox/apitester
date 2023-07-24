import { TestRunner } from './types';
import JestHelper from './utils/jestHelper';
import { TestCase } from './testcase';

const runner = (testCase: TestCase, testRunner: TestRunner) => {
  switch (testRunner) {
    case 'jest':
      JestHelper.test(testCase);
  }
};

export default runner;
