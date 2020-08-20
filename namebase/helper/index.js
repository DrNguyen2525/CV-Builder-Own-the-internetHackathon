const fetch = require('node-fetch');
const puppeteer = require('puppeteer');
require('dotenv').config();

module.exports = {
  api: (method, endpoint, body) => {
    const credentials = Buffer.from(`${process.env.ACCESS_KEY}:${process.env.SECRET_KEY}`);
    const encodedCredentials = credentials.toString('base64');
    const authorization = `Basic ${encodedCredentials}`;

    const options = {
      method,
      body,
      headers: {
        Authorization: authorization,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    const url = `https://namebase.io${endpoint}`;
    return fetch(url, options)
      .then(res => res.json())
      .catch(err => err);
  },
  getPdfFromPage: async (url, type, path = null) => {
    const browser = await puppeteer.launch({
      headless: true
    });

    const page = await browser.newPage();

    await page.goto(url);

    // Wait for resume preview page to be loaded completely
    await new Promise(resolve => setTimeout(resolve, 6000));

    await page.emulateMediaType('print');

    let pdf;

    if (type === 'single') {
      const height = await page.evaluate(() => {
        const { body } = document;
        const html = document.documentElement;

        const maxHeight = Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight,
          html.scrollHeight,
          html.offsetHeight
        );

        return maxHeight;
      });

      pdf = await page.pdf({
        path,
        printBackground: true,
        width: `21cm`,
        height: `${height}px`,
        pageRanges: '1'
      });
    } else {
      pdf = await page.pdf({
        path,
        format: 'A4',
        printBackground: true
      });
    }

    await browser.close();

    return pdf;
  }
};
