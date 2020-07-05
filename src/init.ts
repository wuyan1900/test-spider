import { fetchData } from './fetch-data';
import { parseHtml, diffContentByMd5, getMd5, diffAndwriteContent } from './content-operate';


interface ProcessOptions{
    confPath: string;
    dataPath: string;
    outPutPath: string;
}

export async function init(options?: ProcessOptions) {
    let htmlContent = await fetchData();
    let obj = parseHtml(htmlContent);
    const pageMd5 = getMd5(obj.str);
    const hasDiff = diffContentByMd5(pageMd5, options);
    if (hasDiff) {
        diffAndwriteContent(obj, pageMd5, options);
    }
    else {
        // console.log('没有增量内容.....');
    }
}
