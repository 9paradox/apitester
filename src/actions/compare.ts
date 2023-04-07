export type ToBe =
  | 'equal'
  | '=='
  | 'notEqual'
  | '!='
  | 'greaterThan'
  | '>'
  | 'greaterThanOrEqual'
  | '>='
  | 'lessThan'
  | '<'
  | 'lessThanOrEqual'
  | '<='
  | 'in'
  | 'notIn'
  | 'contains';

export function compare(
  actual: any,
  toBe: ToBe,
  expected: any
): { check: boolean; message?: string } {
  var check = false;
  var message: string | undefined;
  switch (toBe) {
    case '==':
    case 'equal':
      check = JSON.stringify(actual) === JSON.stringify(expected);
      if (!check) {
        message = 'actual is not equal to expected.';
      }
      break;

    case '!=':
    case 'notEqual':
      check = JSON.stringify(actual) !== JSON.stringify(expected);
      if (!check) {
        message = 'actual and expected should be not equal.';
      }
      break;

    case '>':
    case 'greaterThan':
      if (Number.isNaN(actual) || Number.isNaN(expected)) {
        throw new Error('The actual or expected data is not number.');
      }
      check = JSON.stringify(actual) > JSON.stringify(expected);
      if (!check) {
        message = 'actual is not greater than expected.';
      }
      break;

    case '>=':
    case 'greaterThanOrEqual':
      if (Number.isNaN(actual) || Number.isNaN(expected)) {
        throw new Error('The actual or expected data is not number.');
      }
      check = JSON.stringify(actual) >= JSON.stringify(expected);
      if (!check) {
        message = 'actual is not greater than or equal to expected.';
      }
      break;

    case '<':
    case 'lessThan':
      if (Number.isNaN(actual) || Number.isNaN(expected)) {
        throw new Error('The actual or expected data is not number.');
      }
      check = JSON.stringify(actual) < JSON.stringify(expected);
      if (!check) {
        message = 'actual is not less than expected.';
      }
      break;

    case '<=':
    case 'lessThanOrEqual':
      if (Number.isNaN(actual) || Number.isNaN(expected)) {
        throw new Error('The actual or expected data is not number.');
      }
      check = JSON.stringify(actual) <= JSON.stringify(expected);
      if (!check) {
        message = 'actual is not less than or equal to expected.';
      }
      break;

    case 'in':
      if (!Array.isArray(expected)) {
        throw new Error('The expected data is not of array type.');
      }
      check = [...expected].includes(actual);
      if (!check) {
        message = 'actual is not found expected.';
      }
      break;

    case 'notIn':
      if (!Array.isArray(expected)) {
        throw new Error('The expected data is not of array type.');
      }
      check = ![...expected].includes(actual);
      if (!check) {
        message = 'actual should not be found expected.';
      }
      break;

    case 'contains':
      if (Array.isArray(actual)) {
        check = [...actual].includes(expected);
      } else {
        check = JSON.stringify(actual).includes(expected);
      }
      if (!check) {
        message = 'actual does not contain expected.';
      }
      break;

    default:
      throw new Error(`'${toBe}' comparison is not implemented.`);
  }

  if (message && message.length > 0) {
    message += ' Actual:- ' + JSON.stringify(actual);
    message += ' Expected:- ' + JSON.stringify(expected);
  }

  return { check, message };
}
