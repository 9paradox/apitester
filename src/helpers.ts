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

const Helper = {
  fileExists,
  readFile,
  folderExists,
};

export default Helper;
