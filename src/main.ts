import { chromium } from 'playwright';

const isIncludes = (arr: string[], target: string) =>
  arr.some((el) => target.includes(el));

async function main() {
  const browser = await chromium.launch({ headless: false });

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
    await page.mouse.wheel(0, 10000);
    await page.waitForTimeout(3000);
  } while (Date.now() - lastRequestSend <= 3000);

  await browser.close();
  console.log(urls);
}

main();
