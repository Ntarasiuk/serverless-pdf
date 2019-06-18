const chrome = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

async function getPdf(type, name, req) {
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless
  });

  const page = await browser.newPage();
  let html = req.body.html;

  await page.setContent(html, { waitUntil: "networkidle0" });
  const file = await page.pdf({
    path: `/tmp/${name}.pdf`,
    format: type,
    printBackground: true
  });
  await browser.close();
  return file;
}

module.exports = { getPdf };
