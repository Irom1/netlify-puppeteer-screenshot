//const serverless = require('serverless-http');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

exports.handler = async (event, context) => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();

  //
  const pageToScreenshot = JSON.parse(event.body).pageToScreenshot || "https://www.apple.com/";
  //

  await page.goto(pageToScreenshot, { waitUntil: 'networkidle2' });

  const screenshot = await page.screenshot({ encoding: 'binary' });

  await browser.close();

  return {
      statusCode: 200,
      body: JSON.stringify({
          message: `Complete screenshot of ${pageToScreenshot}`,
          buffer: screenshot
      })
  }

  //
  const title = await page.title();
  await browser.close();
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `works of ${title}`,
    })
  }

};