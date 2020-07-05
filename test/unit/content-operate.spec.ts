import { parseHtml, writeContent, getDiffContent } from '../../src/content-operate';
import { dataPath } from '../../src/conf';
import { readFileSync, writeFileSync } from 'fs'
describe('spider content operate', () => {
    
    test('parse li data', ()=> {
        const data = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Document</title>
        </head>
        <body>
            <ul>
                <li class="item-id">111ddd111</li>
                <li class="item-id">2222ww22</li>
            </ul>
        </body>
        </html>`;
        const result = parseHtml(data);
        expect(result.str).toEqual('111ddd111\n2222ww22\n');
    });
    test('write data', async ()=> {
        writeFileSync(dataPath, '');
       
        Promise.resolve()
        .then(() => {
            const data = '111111\n222222\n';
            writeContent(dataPath, '111111\n222222\n');
        })
        .then(() => {
            const content = readFileSync(dataPath).toString();
            expect(content).toEqual('111111\n222222\n');
        })
    });
    test('get diff data', ()=> {
        writeContent(dataPath, '111111\n222222\n');
        let newData = ['222222','3333','111111','555'];
        const intersection = getDiffContent(newData, {dataPath}).join(',');
        expect(intersection).toEqual('3333,555');
    });
    
})