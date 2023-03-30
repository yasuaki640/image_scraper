import { chromium } from "playwright";

const isIncludes = (arr: any[], target: string) => arr.some(el => target.includes(el));

async function main() {
  const browser = await chromium.launch({ headless: false });

  const page = await browser.newPage();
  await page.goto("https://www.instagram.com/explore/tags/"); // TODO 引数かなんかでなんとかする

  const urls: string[] = [];
  page.on("request", (r) => {
    const url = r.url();
    if (isIncludes([".jpg", ".webp"], url)) {
      urls.push(url);
    }
  });

  for (let i = 0; i < 4; i++) {
    await page.waitForTimeout(4 * 1000);
    await page.mouse.wheel(0, 10000);
  }

  await browser.close();

  console.log(urls);
};

main();
