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

  const dirPath = `${OUT_DIR}/${keyword}`;
  fs.mkdirSync(dirPath, { recursive: true });

  for (const url of urls) {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Fetching failed for image of ${url}`);
      return;
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${keyword}_${Date.now()}.jpg`;
    fs.writeFileSync(`${dirPath}/${fileName}`, buffer);
    console.log(`Saved image of ${fileName}`);
  }
}

main();
