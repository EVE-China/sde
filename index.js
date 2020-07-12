const fs = require('fs');
const axios = require('axios').default;
const cheerio = require('cheerio');
const extract = require('extract-zip');

async function main() {
  const checksum = fs.readFileSync('./checksum').toString();
  const html = (await axios.get('https://developers.eveonline.com/resource/resources')).data;
  const $ = cheerio.load(html);
  const remoteChecksum = await getRemoteChecksum($);
  if (remoteChecksum === checksum) {
    console.log('sde已是最新版, 跳过更新. checksum:' + checksum);
    return;
  }
  await downloadSDE($);
  updateChecksum(remoteChecksum);
}

async function getRemoteChecksum($) {
  const href = $('a[href$="checksum"]').attr('href');
  console.log('checksum url:' + href);
  const rsp = await axios.get(href);
  return rsp.data;
}

function updateChecksum(checksum) {
  fs.writeFileSync('./checksum', checksum);
}

async function downloadSDE($) {
  const href = $('a[href$="sde.zip"]').attr('href');
  console.log('sde url:' + href);
  const rsp = await axios.request({
    url: href,
    method: 'GET',
    responseType: 'blob'
  });
  fs.writeFileSync('tmp.zip', rsp.data);
  await extract('tmp.zip', { dir: __dirname });
  fs.unlinkSync('tmp.zip');
}

main().then(() => {
  console.log('更新完成');
  process.exit(0);
}, reason => {
  console.error('更新失败');
  console.error(reason);
  process.exit(-1);
});