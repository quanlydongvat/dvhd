const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request =>
    console.log('REQUEST FAILED:', request.url(), request.failure().errorText)
  );

  console.log('Navigating to Github Pages URL...');
  await page.goto('https://quanlydongvat.github.io/dvhd/', { waitUntil: 'networkidle0' });
  
  console.log('Taking screenshot...');
  await page.screenshot({ path: 'screenshot.png' });
  
  await browser.close();
})();
