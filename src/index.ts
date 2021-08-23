import fs = require('fs');
import axios from "axios";
import * as cheerio from "cheerio";
import * as extract from "extract-zip";

/**
 * 获取最新的checksum
 * @param $ cheerio
 * @returns checksum
 */
 async function getRemoteChecksum($: cheerio.Root) {
  const href = $('a[href$="checksum"]').attr('href');
  const rsp = await axios.get(href);
  return rsp.data;
}

/**
 * 下载最新的sde包
 * @param $ cheerio
 */
async function downloadSDE($: cheerio.Root) {
  const href = $('a[href$="sde.zip"]').attr('href');
  console.log('sde url:' + href);
  const rsp = await axios.request({
    url: href,
    method: 'GET',
    responseType: 'arraybuffer'
  });
  fs.writeFileSync('tmp.zip', rsp.data);
  console.log('下载成功, 解压sde中');
  await extract('tmp.zip', { dir: __dirname });
  console.log('解压完成, 删除临时文件tmp.zip');
  fs.unlinkSync('tmp.zip');
}

/**
 * 更新本地的checksum
 * @param checksum checksum
 */
 function updateChecksum(checksum: string) {
  fs.writeFileSync('./checksum', checksum);
}

async function main() {
  if (fs.existsSync(__dirname + '/sde')) {
    console.log('清理sde目录');
    fs.rmdirSync(__dirname + '/sde', { recursive: true });
  }
  const checksum = fs.readFileSync('./checksum').toString();
  const html = (await axios.get('https://developers.eveonline.com/resource/resources')).data;
  const $ = cheerio.load(html);
  const remoteChecksum = await getRemoteChecksum($);
  console.log(`checksum local:${checksum} -> remote:${remoteChecksum}`);
  if (remoteChecksum === checksum) {
    console.log('sde已是最新版, 跳过更新. checksum:' + checksum);
    return;
  }
  console.log('更新中');
  await downloadSDE($);
  updateChecksum(remoteChecksum);
}

main().then(() => {
  console.log('更新完成');
  process.exit(0);
}, reason => {
  console.error('更新失败');
  console.error(reason);
  process.exit(-1);
});