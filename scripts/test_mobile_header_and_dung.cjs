const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

(async () => {
  const previewProcess = spawn('npx', ['vite', 'preview', '--port', '4173'], {
    shell: true,
    cwd: path.resolve('.')
  });

  await new Promise(r => setTimeout(r, 2500));

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();

  // Set iPhone 14/15 Viewport (393 x 852)
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1');
  await page.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true });

  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // Find login button on Landing Page and open login modal if needed
  console.log('Attempting login...');
  const clickedLogin = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const loginBtn = btns.find(b => b.innerText.includes('Đăng nhập'));
    if (loginBtn) {
      loginBtn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked login button:', clickedLogin);

  await new Promise(r => setTimeout(r, 1000));

  // Fill login inputs
  const inputs = await page.$$('input');
  console.log('Input fields count:', inputs.length);
  if (inputs.length >= 2) {
    await inputs[0].type('admin');
    await inputs[1].type('kiemlam123');
    await page.keyboard.press('Enter');
  }

  await new Promise(r => setTimeout(r, 3500));

  if (!fs.existsSync('public/test_results')) {
    fs.mkdirSync('public/test_results', { recursive: true });
  }

  // 1. Check HOME View
  console.log('\n--- 1. HOME VIEW ---');
  let homeTitle = await page.evaluate(() => {
    const h2 = document.querySelector('header h2');
    return h2 ? { text: h2.innerText, height: h2.getBoundingClientRect().height, scrollHeight: h2.scrollHeight } : null;
  });
  console.log('HOME Title:', homeTitle);
  await page.screenshot({ path: 'public/test_results/mobile_view_home.png' });

  // 2. Switch to SUMMARY View
  console.log('\n--- 2. SUMMARY VIEW ---');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('nav button, button'));
    const summaryBtn = buttons.find(b => b.innerText.includes('Tổng Hợp') || b.innerText.includes('Tổng hợp'));
    if (summaryBtn) summaryBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  let summaryTitle = await page.evaluate(() => {
    const h2 = document.querySelector('header h2');
    return h2 ? { text: h2.innerText, height: h2.getBoundingClientRect().height, scrollHeight: h2.scrollHeight } : null;
  });
  console.log('SUMMARY Title:', summaryTitle);
  await page.screenshot({ path: 'public/test_results/mobile_view_summary.png' });

  // Check Nguyen Hoang Dung in Hoa Son vs Dang Kang
  const dungData = await page.evaluate(() => {
    // In summary view, check the commune accordion counts and facility cards
    const accordions = Array.from(document.querySelectorAll('.border, div, tr')).map(el => el.innerText);
    const bodyText = document.body.innerText;

    // Check if Hoa Son lists Dung
    const hoaSonMatch = bodyText.match(/XÃ HÒA SƠN[\s\S]*?(?=XÃ|xã|$)/i);
    const hoaSonText = hoaSonMatch ? hoaSonMatch[0] : '';
    const dungInHoaSon = hoaSonText.includes('Nguyễn Hoàng Dũng');

    // Check if Dang Kang lists Dung
    const dangKangMatch = bodyText.match(/XÃ DANG KANG[\s\S]*?(?=XÃ|xã|$)/i);
    const dangKangText = dangKangMatch ? dangKangMatch[0] : '';
    const dungInDangKang = dangKangText.includes('Nguyễn Hoàng Dũng');

    return {
      dungInHoaSon,
      dungInDangKang,
      hoaSonSummary: hoaSonText.slice(0, 200)
    };
  });
  console.log('Nguyen Hoang Dung placement check:', dungData);

  // 3. Switch to LOGBOOK View
  console.log('\n--- 3. LOGBOOK VIEW ---');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('nav button, button'));
    const logbookBtn = buttons.find(b => b.innerText.includes('Sổ Mẫu II'));
    if (logbookBtn) logbookBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  let logbookTitle = await page.evaluate(() => {
    const h2 = document.querySelector('header h2');
    return h2 ? { text: h2.innerText, height: h2.getBoundingClientRect().height, scrollHeight: h2.scrollHeight } : null;
  });
  console.log('LOGBOOK Title:', logbookTitle);
  await page.screenshot({ path: 'public/test_results/mobile_view_logbook.png' });

  await browser.close();
  previewProcess.kill();
  console.log('\nALL VERIFICATION TESTS COMPLETE.');
  process.exit(0);
})();
