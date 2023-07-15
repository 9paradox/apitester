import { TestRunner } from './types';
import { TestCase } from './testcase';
import JestHelper from './utils/jestHelper';

const runner = (testCase: TestCase, testRunner: TestRunner) => {
  switch (testRunner) {
    case 'jest':
      JestHelper.test(testCase);
  }
};

export default runner;
