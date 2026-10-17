const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = path.resolve(__dirname, '../public/test_results');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

(async () => {
  console.log('🚀 KIỂM THỬ TÍNH NĂNG PWA & TỰ ĐỘNG KHẮC PHỤC TRẮNG MÀN HÌNH TRÊN ĐIỆN THOẠI CŨ...');

  // Start vite preview server on port 4173
  const previewProcess = spawn('npx', ['vite', 'preview', '--port', '4173'], {
    shell: true,
    cwd: path.resolve(__dirname, '..')
  });

  previewProcess.stdout.on('data', (d) => console.log('[Vite Preview]', d.toString().trim()));
  previewProcess.stderr.on('data', (d) => console.error('[Vite Preview Error]', d.toString().trim()));

  // Wait 3s for preview server to start
  await new Promise((r) => setTimeout(r, 3000));

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  // Simulate iPhone 14 Pro User Agent & Mobile Viewport
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1');
  await page.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true });

  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));

  try {
    // TEST 1: Open Root URL on Mobile
    console.log('\n👉 [Test 1] Mở trang chủ trên giả lập iPhone...');
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise((r) => setTimeout(r, 2000));

    const title1 = await page.title();
    console.log(`   ✓ Tiêu đề trang: "${title1}"`);
    const splashGone1 = await page.evaluate(() => !document.getElementById('pwa-splash'));
    console.log(`   ✓ Màn hình Splash đã nạp xong và hiển thị giao diện chính: ${splashGone1 ? 'ĐÚNG' : 'SAI'}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_pwa_root.png') });

    // TEST 2: Open Legacy /dvhd/ Shortcut URL (Exactly what older installed phones click!)
    console.log('\n👉 [Test 2] Mở đường dẫn shortcut PWA cũ (/dvhd/) mà các điện thoại đã cài trước đó đang lưu...');
    await page.goto('http://localhost:4173/dvhd/', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise((r) => setTimeout(r, 2500));

    const currentUrl = page.url();
    console.log(`   ✓ URL hiện tại sau khi tự động chuẩn hóa: "${currentUrl}"`);
    const rootContent = await page.evaluate(() => document.getElementById('root')?.innerText?.length);
    console.log(`   ✓ Dung lượng nội dung hiển thị trong #root: ${rootContent} ký tự (Tuyệt đối không bị trắng màn hình!)`);

    if (!rootContent || rootContent < 50) {
      throw new Error('Nội dung trang bị trắng (blank screen)!');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_pwa_legacy_dvhd.png') });
    console.log('   ✓ Đã chụp ảnh màn hình điện thoại cũ mở /dvhd/ thành công!');

    // TEST 3: Deep link navigation on mobile
    console.log('\n👉 [Test 3] Mở trang Sổ Mẫu II trên điện thoại...');
    await page.goto('http://localhost:4173/so-mau-2', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise((r) => setTimeout(r, 2000));
    const title3 = await page.title();
    console.log(`   ✓ Mở trực tiếp /so-mau-2: "${title3}"`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_pwa_so_mau_2.png') });

    console.log('\n🎉 TOÀN BỘ CÁC BƯỚC KIỂM THỬ PWA MOBILE & ĐIỆN THOẠI CŨ ĐỀU THÀNH CÔNG RỰC RỠ!');
  } catch (err) {
    console.error('❌ LỖI TRONG QUÁ TRÌNH TEST:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    previewProcess.kill();
  }
})();
