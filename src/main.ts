import { chromium, type Page } from 'playwright';
import * as fs from 'fs';

const OUT_DIR = 'images';

const isIncludes = (arr: string[], target: string) =>
  arr.some((el) => target.includes(el));

const openPage = async (pageUrl: string) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(pageUrl);
  return { browser, page };
};

const interceptImageUrls = async (page: Page) => {
  const urls: string[] = [];
  let lastRequestSend = Date.now();
  page.on('request', (r) => {
    const url = r.url();
    if (isIncludes(['.jpg', '.jpeg'], url)) {
      urls.push(url);
      lastRequestSend = Date.now();
    }
  });

  do {
    await page.mouse.wheel(0, 200);
  } while (Date.now() - lastRequestSend <= 1000);
  return urls;
};

const downloadImages = async (keyword: string, urls: string[]) => {
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
};

async function main() {
  const keyword = process.argv.at(-2);
  const pageUrl = process.argv.at(-1);
  const { browser, page } = await openPage(pageUrl);

  const urls = await interceptImageUrls(page);
  console.log(urls.length + ' image urls intercepted.');

  await browser.close();

  await downloadImages(keyword, urls);

  console.log('Downloading images finished.');
}

main();
