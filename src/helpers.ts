import path from 'path';
import fs from 'fs';

function fileExists(filePath: string): boolean {
  return fs.existsSync(path.resolve(process.cwd(), filePath));
}

function readFile(filePath: string): string {
  return fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8');
}

const Helper = {
  fileExists,
  readFile,
};

export default Helper;
