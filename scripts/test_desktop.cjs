const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const path = require('path');

(async () => {
  const previewProcess = spawn('npx', ['vite', 'preview', '--port', '4173'], {
    shell: true,
    cwd: path.resolve('.')
  });

  await new Promise(r => setTimeout(r, 2000));

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const loginBtn = btns.find(b => b.innerText.includes('Đăng nhập'));
    if (loginBtn) loginBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const inputs = await page.$$('input');
  if (inputs.length >= 2) {
    await inputs[0].type('admin');
    await inputs[1].type('kiemlam123');
    await page.keyboard.press('Enter');
  }
  await new Promise(r => setTimeout(r, 3000));

  const desktopSummary = await page.evaluate(() => {
    const h2 = document.querySelector('header h2');
    return h2 ? h2.innerText : 'not found';
  });
  console.log('Desktop Header Title:', desktopSummary);

  await page.screenshot({ path: 'public/test_results/desktop_view_summary.png' });
  console.log('Saved desktop_view_summary.png');

  await browser.close();
  previewProcess.kill();
  process.exit(0);
})();
