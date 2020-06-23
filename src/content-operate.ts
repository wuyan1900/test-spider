
import {createHash} from 'crypto'
import { readFileSync, writeFile } from 'fs'
import {logger} from './log4j'
const cheerio = require('cheerio')

/**
 * 解析抓取网页的html
 * @param result 抓取的html网页内容
 * @returns parse html content
 */
export function parseHtml(result) {
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

export function diffContentByMd5(md5, options) {
  const contentMd5 = getSaveContentMd5(options);
  return contentMd5 !== md5;
}

/**
 * 
 * @param content 网页内容
 */
export function getMd5(content) {
  return encrypt('md5', content);
}

/**
 * 写入抓取网页内容，diff内容和md5
 * @param obj 抓取网页后解析的内容
 * @param md5 网页内容生成的md5
 */
export function diffAndwriteContent (obj, md5, options) {
  const diff = getDiffContent(obj.content, options);
  writeContent(options.dataPath, obj.str);
  writeContent(options.outPutPath, diff.join('\n'));
  writeContent(options.confPath, md5);
}


function writeContent(path, content) {
  writeFile(path, content, (error) => {
      if (error) {
          logger.error(error);
      }
  });
}

/**
 * 比较抓取内容和文件已有内容的diff
 * @param pageContent 网页内容
 */
function getDiffContent(pageContent, options) {
  let file = readFileSync(options.dataPath);
  let fileContent = file.toString();
  let intersection;
  let existArray = fileContent.replace(/\n/g, ',').split(',');
  intersection = pageContent.filter(item => existArray.indexOf(item) === -1);
  return intersection;
}

function encrypt(algorithm, content)  {
  let hash = createHash(algorithm);
  hash.update(content);
  return hash.digest('hex');
}

function getSaveContentMd5(options) {
  return readFileSync(options.confPath).toString();
}