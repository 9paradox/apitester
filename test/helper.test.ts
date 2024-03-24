import Helper from '../src/utils/helpers';
import fsExtra from 'fs-extra';

const tempFolderPath = './temp-test';

function setup(): void {
  if (fsExtra.existsSync(tempFolderPath)) {
    fsExtra.removeSync(tempFolderPath);
  }
}

describe('Helper', () => {
  let isSetupDone = false;
  beforeEach(() => {
    if (!isSetupDone) {
      setup();
      isSetupDone = true;
    }
  });

  it('should return true if the folder exists', () => {
    expect(Helper.folderExists('./test')).toBe(true);
  });

  it('should return false if the folder does not exist', () => {
    expect(Helper.folderExists('./does-not-exist')).toBe(false);
  });

  it('should create a folder if it does not exist', () => {
    Helper.createFolder(tempFolderPath);
    expect(Helper.folderExists(tempFolderPath)).toBe(true);
  });

  it('should return the timespan between two dates', () => {
    const start = new Date();
    const end = new Date(start.getTime() + 1000);
    expect(Helper.getTimeSpan(start.toISOString(), end.toISOString())).toEqual({
      ms: 1000,
      s: 1,
    });
  });

  it('should join two paths together', () => {
    const joinedPath = Helper.joinPaths('./test', 'test.txt');
    expect(
      joinedPath == 'test/test.txt' || joinedPath == 'test\\test.txt'
    ).toBe(true);
  });

  it('should create folder, write text to a file and read file', () => {
    Helper.writeToFile(
      tempFolderPath + '/new-file.txt',
      'This is the contents of new-file.txt'
    );

    expect(Helper.readFile(tempFolderPath + '/new-file.txt')).toBe(
      'This is the contents of new-file.txt'
    );
  });

  it('should return an array of test cases ending with ".test.json"', () => {
    Helper.writeToFile(
      tempFolderPath + '/test1.test.json',
      'This is the contents of test1.test.json'
    );

    Helper.writeToFile(
      tempFolderPath + '/test-some-other-test.json',
      'test-some-other-test.json'
    );

    Helper.writeToFile(
      tempFolderPath + '/test2.test.json',
      'This is the contents of test1.test.json'
    );

    const result = Helper.getTestCasesFromFolder(tempFolderPath);

    expect(result).toEqual(['test1.test.json', 'test2.test.json']);
  });

  it('should validate url', () => {
    expect(Helper.isValidURL('https://example.com')).toBe(true);
    expect(Helper.isValidURL('example.com')).toBe(false);
    expect(Helper.isValidURL('')).toBe(false);
  });
});
