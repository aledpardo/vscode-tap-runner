import { validateCodeLensOptions } from '../util';

describe('validateCodeLensOptions', () =>
  it.each([
    [
      ['a', 'run', 'RUN', 'watch', 'debug', 'other', 'debug', 'debug', 'watch', 'run'],
      ['run', 'watch', 'debug'],
    ],
    [[], []],
  ])('should turn "taprunner.codeLens" options  into something valid', (input, expected) => {
    expect(validateCodeLensOptions(input)).toEqual(expected);
  }));
