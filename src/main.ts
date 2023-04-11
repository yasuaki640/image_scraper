import { chromium } from 'playwright';
import * as fs from 'fs';

const isIncludes = (arr: string[], target: string) =>
  arr.some((el) => target.includes(el));

const OUT_DIR = 'images';

async function main() {
  const browser = await chromium.launch();

  const page = await browser.newPage();
  const keyword = process.argv.pop();
  await page.goto('https://www.instagram.com/explore/tags/' + keyword);

  const urls: string[] = [];
  let lastRequestSend = Date.now();
  page.on('request', (r) => {
    const url = r.url();
    if (isIncludes(['.jpg', '.webp'], url)) {
      urls.push(url);
      lastRequestSend = Date.now();
    }
  });

  do {
    await page.mouse.wheel(0, 1e99);
  } while (Date.now() - lastRequestSend <= 2000);
  console.log(urls.length + ' image urls fetched.');

  await browser.close();

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const json = JSON.stringify({ data: urls });
  const fileName = `${keyword}_${Date.now()}.json`;
  fs.writeFileSync(`${OUT_DIR}/${fileName}`, json);
}

main();
