import { fetchData } from './fetch-data';
import { writeFileSync, readFileSync, writeFile } from 'fs';
import { resolve } from 'path';
import {createHash} from 'crypto'
import {logger} from './log4j'
const cheerio = require('cheerio');


const rootPath = process.cwd();
const confPath = resolve(rootPath, "data/conf.data");
const dataPath = resolve(rootPath, "data/existence.data");
const outPutPath = resolve(rootPath, "data/output.data");
interface ProcessOptions{}

export async function init(options?: ProcessOptions) {
    let htmlContent = await fetchData();
    // start your code here
    let obj = parseHtml(htmlContent);
    if (obj.content.length > 0) {
        
        const contentMd5 = getSaveContentMd5();
        const pageMd5 = encrypt('md5', obj.str);

        if(!contentMd5) {
            // 首次输出数据
            console.log('首次录入....');
            initFileContent(obj.str, pageMd5);
        }
        else {
            if (pageMd5 !== contentMd5) {
                console.log('输出增量内容....');
                writeDiffContent(obj, pageMd5);
            }
            else {
                console.log('没有增量内容....');
            }
        }
    }
    else {
        console.log('未能找到内容');
    } 
}

function writeDiffContent(obj, pageMd5) {
    writeOutPutData(obj.content);
    writePageContentAndMd5(obj.str, pageMd5);
}

function initFileContent(content, pageMd5) {
    writeContent(outPutPath, content);
    writePageContentAndMd5(content, pageMd5);
}
function writeContent(path, content) {
    writeFile(path, content, (error) => {
        if (error) {
            logger.error(error);
        }
    });
}
function writePageContentAndMd5(content, pageMd5) {
    writeContent(dataPath, content);
    writeContent(confPath, pageMd5);
}
function writeOutPutData(pageContent) {
    
    let array = getFilterContent(pageContent);
    let content = array.join('\n');
    writeContent(outPutPath, content);
}

function getFilterContent(pageContent) {
    let file = readFileSync(dataPath);
    let fileContent = file.toString();
    if (fileContent.length > 0) {
        let existArray = fileContent.replace(/\n/g, ',').split(',');
        let intersection = pageContent.filter(item => existArray.indexOf(item) === -1);
        return intersection;
    }
}

function getSaveContentMd5() {
    let contentMd5 = readFileSync(confPath).toString();
    return contentMd5;
}

function encrypt(algorithm, content)  {
    let hash = createHash(algorithm)
    hash.update(content)
    return hash.digest('hex')
}

function parseHtml(result) {
    const $ = cheerio.load(result);
    
    let captionList = $('.item-id');
    let obj = {
        content: [],
        str: ''
    };
    captionList.each(function() {
        let cap = $(this);
        obj.str = obj.str + cap.html() + '\n';
        obj.content.push(cap.html());
    });
    return obj;
}

// 以下是读写文件示例，__dirname指的是当前文件的工作目录
// writeFileSync('../log/test.log', '测试文本');
// const txt = readFileSync('.../log/test.log');
// const filePath = resolve(__dirname, '../log/test.log');
// console.log(filePath, txt);
