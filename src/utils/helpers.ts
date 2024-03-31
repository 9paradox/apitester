import path from 'path';
import fs from 'fs';
import { TestCaseOptions } from '../types';

function folderExists(folderPath: string): boolean {
  return fileExists(folderPath);
}

function fileExists(filePath: string): boolean {
  if (path.isAbsolute(filePath)) {
    return fs.existsSync(path.resolve(filePath));
  }
  return fs.existsSync(path.resolve(process.cwd(), filePath));
}

function createFolder(folderPath: string): boolean {
  if (!fileExists(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  return false;
}

function readFile(filePath: string): string {
  if (path.isAbsolute(filePath)) {
    return fs.readFileSync(path.resolve(filePath), 'utf-8');
  }
  return fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8');
}

function pad(number: number, length: number) {
  var str = '' + number;
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
}

function getDateTimeString() {
  const date = new Date();
  var yyyy = date.getFullYear().toString();
  var MM = pad(date.getMonth() + 1, 2);
  var dd = pad(date.getDate(), 2);
  var hh = pad(date.getHours(), 2);
  var mm = pad(date.getMinutes(), 2);
  var ss = pad(date.getSeconds(), 2);
  var ms = pad(date.getMilliseconds(), 2);

  return yyyy + MM + dd + hh + mm + ss + ms;
}

function getTimeSpan(startDateTime: string, endDateTime: string) {
  const start = new Date(startDateTime).getTime();
  const end = new Date(endDateTime).getTime();

  const diff = end - start;
  const seconds = (diff / 1000) % 60;
  return { ms: diff, s: seconds };
}

function joinPaths(path1: string, path2: string): string {
  return path.join(path1, path2);
}

function writeToFile(filePath: string, text: string) {
  fs.writeFileSync(filePath, text);
}

function buildTestCaseOptionsFromFile(testCasePath: string): TestCaseOptions {
  if (testCasePath && !Helper.fileExists(testCasePath)) {
    throw new Error('Test-case file not found.');
  }

  const testCaseOptions = JSON.parse(Helper.readFile(testCasePath));
  return testCaseOptions;
}

function getTestCasesFromFolder(
  folderPath: string,
  supportedFileExtensions?: string[]
) {
  if (!folderExists(folderPath)) {
    throw new Error('Test-cases folder not found.');
  }

  const _supportedFileExtensions = supportedFileExtensions
    ? supportedFileExtensions
    : ['.test.json'];

  const testCases = fs
    .readdirSync(folderPath)
    .filter((file) => isFileExtensionSupported(file, _supportedFileExtensions));
  return testCases;
}

function isFileExtensionSupported(
  filePath: string,
  supportedExtensions: string[]
): boolean {
  return supportedExtensions.some((extension) => filePath.endsWith(extension));
}

async function resolve(filePath: string) {
  const absolutePath = path.resolve(filePath);
  return await import(absolutePath);
}

function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

const Helper = {
  fileExists,
  readFile,
  folderExists,
  getDateTimeString,
  joinPaths,
  writeToFile,
  getTimeSpan,
  createFolder,
  buildTestCaseOptionsFromFile,
  getTestCasesFromFolder,
  resolve,
  isValidURL,
};

export default Helper;
