import { confPath, dataPath, outPutPath } from '../../src/conf'
import { fetchData } from '../../src/fetch-data';
import { init } from '../../src/init';
import { parseHtml, writeContent, getMd5 } from '../../src/content-operate';
import { readFileSync } from 'fs';
import { logger } from '../../src/log4j'
describe('spider init', () => {
    const options = {
        confPath: confPath,
        dataPath: dataPath,
        outPutPath: outPutPath
    };
    test('diff content', ()=> {
        writeContent(dataPath, '');
        writeContent(confPath, '');
        writeContent(outPutPath, '');
        Promise.resolve()
        .then(() => {
            init(options);
        })
        .then(async () => {
            const htmlContent = await fetchData();
            const obj = parseHtml(htmlContent);
            const pageMd5 = getMd5(obj.str);
            return [obj, pageMd5];
        })
        .then((arr: string[]) => {
            const contentMd5 = readFileSync(options.confPath).toString();
            return expect(arr[1]).toEqual(contentMd5);
        })
        .catch((error) => {
            logger.error(error);
        });
        
    })
})