import path from 'path';
import fs from 'fs';

function folderExists(folderPath: string): boolean {
  return fileExists(folderPath);
}

function fileExists(filePath: string): boolean {
  if (path.isAbsolute(filePath)) {
    return fs.existsSync(path.resolve(filePath));
  }
  return fs.existsSync(path.resolve(process.cwd(), filePath));
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

  return yyyy + MM + dd + hh + mm + ss;
}

function getTimeSpan(startDateTime: string, endDateTime: string) {
  const start = new Date(startDateTime).getTime();
  const end = new Date(endDateTime).getTime();

  const diff = end - start;
  const seconds = Math.floor((diff / 1000) % 60);
  return { ms: diff, s: seconds };
}

function joinPaths(path1: string, path2: string): string {
  return path.join(path1, path2);
}

function writeToFile(filePath: string, text: string) {
  fs.writeFileSync(filePath, text);
}

const Helper = {
  fileExists,
  readFile,
  folderExists,
  getDateTimeString,
  joinPaths,
  writeToFile,
  getTimeSpan,
};

export default Helper;
