import axios from 'axios';
import * as Eta from 'eta';
import * as JemsPath from 'jmespath';

interface Step {
  index: number;
  action: ActionName;
  inputData: any;
  outputData: any;
}

interface IActions {
  simpleGet(url: string): TestCase;
  withLastStep_simpleGet(): TestCase;
  withLastStep_pickData(query: string): TestCase;
  withLastStep_formatData(templateData: string): TestCase;
  getStep(index: number): Step;
  test(): Promise<void>;
}

type ActionName = keyof IActions | 'TEST_CASE';

enum QueryLang {
  jmespath = 'jmespath',
  jsonata = 'jsonata',
}

async function get(url: string): Promise<any> {
  return await axios.get(url);
}

function getQueryLang(query: string): { lang: QueryLang; query: string } {
  const querySegment = query.split('@$');

  if (querySegment.length <= 1)
    return { lang: QueryLang.jmespath, query: query.trim() };

  const lang = querySegment[0].trim();
  const queryStr = querySegment[1].trim();
  switch (lang) {
    case QueryLang.jmespath:
      return { lang: QueryLang.jmespath, query: queryStr };
    case QueryLang.jsonata:
      return { lang: QueryLang.jsonata, query: queryStr };
    default:
      throw new Error('Invalid query language: ' + lang);
  }
}

async function pickJsonData(data: any, query: string): Promise<any> {
  const queryLang = getQueryLang(query);
  if (queryLang.lang == QueryLang.jmespath) {
    return await JemsPath.search(data, queryLang.query);
  }
  return null;
}

async function formatData(templateData: any, inputData: any): Promise<any> {
  const dataStr =
    typeof templateData != 'string'
      ? JSON.stringify(templateData)
      : templateData;
  return await Eta.render(dataStr, inputData);
}

class TestCase implements IActions {
  steps: Step[];
  stepIndex: number;

  constructor(title: string) {
    this.steps = [
      {
        action: 'TEST_CASE',
        index: 0,
        inputData: title,
        outputData: {},
      },
    ];
    this.stepIndex = 0;
  }

  withLastStep_formatData(templateData: string): TestCase {
    this.recordStep('withLastStep_formatData', templateData);
    return this;
  }

  withLastStep_simpleGet(): TestCase {
    this.recordStep('withLastStep_simpleGet', null);
    return this;
  }

  withLastStep_pickData(query: string): TestCase {
    this.recordStep('withLastStep_pickData', query);
    return this;
  }

  getStep(index: number): Step {
    this.validateIndexOrThrow(index);
    return this.steps[index];
  }

  simpleGet(url: string): TestCase {
    this.recordStep('simpleGet', url);
    return this;
  }

  async test(): Promise<void> {
    return await this._test();
  }

  async _test(): Promise<void> {
    const totalSteps = this.steps.length;
    for (let index = 1; index < totalSteps; index++) {
      const currentStep = this.getStep(index);
      const lastStep = this.getStep(index - 1);

      var outputData: any;

      switch (currentStep.action) {
        case 'TEST_CASE':
          break;

        case 'simpleGet':
          outputData = await get(currentStep.inputData);
          break;

        case 'withLastStep_simpleGet':
          outputData = await get(lastStep.outputData);
          break;

        case 'withLastStep_pickData':
          outputData = await pickJsonData(
            lastStep.outputData,
            currentStep.inputData
          );
          break;

        case 'withLastStep_formatData':
          outputData = await formatData(
            currentStep.inputData,
            lastStep.outputData
          );
          break;

        default:
          throw new Error(`'${currentStep.action}' method is not implemented.`);
      }

      this.setOutputData(currentStep.index, outputData);
    }
  }

  recordStep(action: ActionName, data: any): void {
    this.stepIndex++;
    this.steps.push({
      index: this.stepIndex,
      action: action,
      inputData: data,
      outputData: null,
    });
  }

  validateIndexOrThrow(index: number) {
    if (index > this.steps.length || index < 0)
      throw new Error('Invalid index provided');
  }

  setOutputData(index: number, data: any): void {
    this.validateIndexOrThrow(index);
    this.steps[index].outputData = data;
  }
}

interface ApiTester {
  setup: (title: string) => IActions;
}

export const apitester: ApiTester = {
  setup: (title: string) => {
    return new TestCase(title);
  },
};
