# image_scraper

A tool for scraping images.

This tool is made for downloading img by tag search from ig.
It's forbidden to scrape from ig, so if you want to use this tool,
I will not take any responsibility.

## Requirements

```shell
$ node -v
v18.14.2
```

## Usage

```shell
$ npm run build

$ npm start [keyword of images you want]
```

## 与太話

- このツールは[pythonで書かれたもの](https://github.com/yasuaki640/scraping_images)の後継です。
- 処理の流れとしては以下
  - playwrightでブラウザを起動。
  - タグ検索するurlにアクセスし、ログイン要求されるまで自動スクロール。
  - サイトが非同期で送信するリクエストを`page.on`で監視し、画像urlを得る。
- かなりアレな作りですが、サイトのDOMが変わってもある程度動いてくれるはず。
  - 動かないゴミより動くゴミということで許容しています。
