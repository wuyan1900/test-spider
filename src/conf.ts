import { resolve } from 'path';
const rootPath = process.cwd();
export const confPath = resolve(rootPath, "data/conf.data");
export const dataPath = resolve(rootPath, "data/existence.data");
export const outPutPath = resolve(rootPath, "data/output.data");
