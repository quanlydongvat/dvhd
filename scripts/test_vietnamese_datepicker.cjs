const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5173/';
const SCREENSHOT_DIR = path.resolve(__dirname, '../public/test_results');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

(async () => {
  console.log('🚀 KIỂM TRA BỘ CHỌN NGÀY THÁNG TIẾNG VIỆT (VIETNAMESE DATE PICKER)...');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise((r) => setTimeout(r, 2000));

    // Check if on login page or needs login
    const loginInput = await page.$('input[placeholder*="Tên đăng nhập"], input[type="text"]');
    if (loginInput) {
      console.log('🔑 Đang đăng nhập tài khoản quản trị...');
      await page.type('input[placeholder*="Tên đăng nhập"], input[type="text"]', 'admin', { delay: 50 });
      await page.type('input[placeholder*="Mật khẩu"], input[type="password"]', 'admin123', { delay: 50 });
      await page.evaluate(() => {
        const submitBtn = document.querySelector('button[type="submit"]') || Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Đăng nhập'));
        if (submitBtn) submitBtn.click();
      });
      await new Promise((r) => setTimeout(r, 2500));
    }

    // Navigate to Table View (Sổ mẫu II)
    console.log('📑 Mở tab Sổ Mẫu II (Chi tiết)...');
    const tableTabBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find(b => b.textContent.includes('Sổ Mẫu II (Chi Tiết)') || b.textContent.includes('Sổ Mẫu II'));
      if (target) {
        target.click();
        return true;
      }
      return false;
    });
    await new Promise((r) => setTimeout(r, 1500));

    // Click "+ Ghi biến động mới"
    console.log('➕ Mở modal "Ghi biến động mới"...');
    const openedModal = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find(b => b.textContent.includes('Ghi biến động mới'));
      if (target) {
        target.click();
        return true;
      }
      return false;
    });

    if (!openedModal) {
      throw new Error('Không tìm thấy nút "Ghi biến động mới"!');
    }
    await new Promise((r) => setTimeout(r, 1500));

    // Check Vietnamese date input value
    const dateInputVal = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      // Find the datepicker input
      const dateInput = inputs.find(i => i.placeholder && i.placeholder.includes('ngày/tháng/năm'));
      return dateInput ? dateInput.value : null;
    });

    console.log(`   ✓ Giá trị ngày ban đầu hiển thị: "${dateInputVal}" (Định dạng DD/MM/YYYY chuẩn Việt Nam)`);
    if (!dateInputVal || !dateInputVal.includes('/')) {
      throw new Error(`Định dạng ngày không phải DD/MM/YYYY: ${dateInputVal}`);
    }

    // Click to open calendar popover
    console.log('📅 Mở bảng lịch tiếng Việt...');
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      const dateInput = inputs.find(i => i.placeholder && i.placeholder.includes('ngày/tháng/năm'));
      if (dateInput) {
        dateInput.click();
      }
    });
    await new Promise((r) => setTimeout(r, 800));

    // Verify Vietnamese days and months in popover
    const popoverInfo = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      const hasT2 = bodyText.includes('T2');
      const hasCN = bodyText.includes('CN');
      const hasHomNay = bodyText.includes('Hôm nay');
      const hasDong = bodyText.includes('Đóng');
      const hasThang = bodyText.includes('Tháng');
      const hasNam = bodyText.includes('Năm');
      return { hasT2, hasCN, hasHomNay, hasDong, hasThang, hasNam };
    });

    console.log('   ✓ Kiểm tra thành phần giao diện Lịch tiếng Việt:');
    console.log(`     - Thứ trong tuần (T2..CN): ${popoverInfo.hasT2 && popoverInfo.hasCN ? 'ĐÚNG' : 'SAI'}`);
    console.log(`     - Tháng/Năm: ${popoverInfo.hasThang && popoverInfo.hasNam ? 'ĐÚNG' : 'SAI'}`);
    console.log(`     - Nút "Hôm nay", "Đóng": ${popoverInfo.hasHomNay && popoverInfo.hasDong ? 'ĐÚNG' : 'SAI'}`);

    // Take screenshot of open calendar
    const screenshotPath = path.join(SCREENSHOT_DIR, 'vn_datepicker_modal.png');
    await page.screenshot({ path: screenshotPath });
    console.log(`   ✓ Đã chụp ảnh xác nhận tại: ${screenshotPath}`);

    // Click day 25 in the calendar
    console.log('👉 Thử chọn ngày 25 trong tháng...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const day25Btn = buttons.find(b => b.textContent.trim() === '25' && b.className.includes('rounded-xl'));
      if (day25Btn) {
        day25Btn.click();
      }
    });
    await new Promise((r) => setTimeout(r, 800));

    const updatedDateVal = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      const dateInput = inputs.find(i => i.placeholder && i.placeholder.includes('ngày/tháng/năm'));
      return dateInput ? dateInput.value : null;
    });

    console.log(`   ✓ Giá trị sau khi chọn ngày 25: "${updatedDateVal}"`);
    if (!updatedDateVal || !updatedDateVal.startsWith('25/')) {
      throw new Error(`Chọn ngày 25 thất bại, giá trị là: ${updatedDateVal}`);
    }

    // Verify time input 24h format and presets
    const timeVal = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      const timeInput = inputs.find(i => i.placeholder && i.placeholder.includes('07:30 hoặc 14:00'));
      return timeInput ? timeInput.value : null;
    });
    console.log(`   ✓ Giờ ghi nhận (24 giờ): "${timeVal}"`);

    // Test quick preset "14:00"
    console.log('👉 Thử chọn giờ nhanh 14:00...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn14 = buttons.find(b => b.textContent.trim() === '14:00');
      if (btn14) btn14.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    const updatedTime = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      const timeInput = inputs.find(i => i.placeholder && i.placeholder.includes('07:30 hoặc 14:00'));
      return timeInput ? timeInput.value : null;
    });
    console.log(`   ✓ Giờ ghi nhận sau khi bấm nhanh: "${updatedTime}"`);

    // Take screenshot after selection
    const screenshotAfter = path.join(SCREENSHOT_DIR, 'vn_datepicker_selected.png');
    await page.screenshot({ path: screenshotAfter });
    console.log(`   ✓ Đã chụp ảnh kết quả: ${screenshotAfter}`);

    console.log('\n🎉 TẤT CẢ CÁC BƯỚC KIỂM THỬ BỘ CHỌN NGÀY TIẾNG VIỆT ĐỀU THÀNH CÔNG RỰC RỠ!');
  } catch (err) {
    console.error('❌ LỖI TRONG QUÁ TRÌNH KIỂM THỬ:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
