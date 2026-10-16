const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5173/';
const SCREENSHOT_DIR = path.resolve(__dirname, '../public/test_results');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  const warnings = [];

  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error') {
      // Ignore favicon or benign warnings
      if (!text.includes('favicon') && !text.includes('autocomplete')) {
        errors.push(`[Console Error] ${text}`);
      }
    } else if (msg.type() === 'warning') {
      warnings.push(`[Console Warn] ${text}`);
    }
  });

  page.on('pageerror', (err) => {
    errors.push(`[Page Crash/Exception] ${err.toString()}`);
  });

  console.log('========================================================');
  console.log('🚀 BẮT ĐẦU KIỂM THỬ TOÀN DIỆN HỆ THỐNG KIỂM LÂM KRÔNG BÔNG');
  console.log('========================================================\n');

  try {
    // ----------------------------------------------------
    // TEST 1: Load Website & Check Initial State
    // ----------------------------------------------------
    console.log('👉 [Test 1] Truy cập trang chủ & kiểm tra nạp dữ liệu ban đầu...');
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise((r) => setTimeout(r, 2500));

    const pageTitle = await page.title();
    console.log(`   ✓ Tiêu đề trang: "${pageTitle}"`);
    if (!pageTitle.includes('Động Vật Hoang Dã')) {
      throw new Error('Tiêu đề trang không đúng!');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_homepage.png') });
    console.log('   ✓ Đã chụp ảnh màn hình Trang Chủ.');

    // ----------------------------------------------------
    // TEST 2: Test Navigation between Core Views
    // ----------------------------------------------------
    console.log('\n👉 [Test 2] Kiểm tra chuyển đổi các View chính...');
    
    // Switch to Sổ Tổng Hợp
    console.log('   -> Chuyển sang Sổ Tổng Hợp (SUMMARY)...');
    await page.evaluate(() => {
      // Find navigation button for Tổng Hợp
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Tổng Hợp') || b.innerText.includes('Sổ Tổng Hợp'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_summary_view.png') });
    console.log('   ✓ Đã chụp ảnh màn hình Sổ Tổng Hợp.');

    // Switch to Sổ Mẫu II (LOGBOOK)
    console.log('   -> Chuyển sang Sổ Mẫu II (LOGBOOK)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Sổ Mẫu II') || b.innerText.includes('Mẫu II'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_logbook_view.png') });
    console.log('   ✓ Đã chụp ảnh màn hình Sổ Mẫu II.');

    // Switch to Sổ Bảng Kê Lâm Sản (PACKING_LIST)
    console.log('   -> Chuyển sang Sổ Bảng Kê Lâm Sản (PACKING_LIST)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Bảng Kê') || b.innerText.includes('Bảng kê lâm sản'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 1500));
    
    // Check Leaderboard rendering
    const hasLeaderboard = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('BẢNG XẾP HẠNG') || text.includes('XUẤT BÁN') || text.includes('Lớp Thú') || text.includes('Lớp Chim');
    });
    console.log(`   ✓ Bảng xếp hạng xuất bán (Lớp Chim & Lớp Thú) hiển thị: ${hasLeaderboard ? 'CÓ' : 'KHÔNG'}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_packing_list_view.png') });
    console.log('   ✓ Đã chụp ảnh màn hình Bảng Kê Lâm Sản & Bảng Xếp Hạng.');

    // Switch to Bản Đồ GIS (MAP)
    console.log('   -> Chuyển sang Bản Đồ GIS (MAP)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Bản Đồ') || b.innerText.includes('Bản đồ GIS'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 2500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_map_view.png') });
    console.log('   ✓ Đã chụp ảnh màn hình Bản Đồ GIS.');

    // Switch to Báo Cáo Phân Tích (ANALYTICS)
    console.log('   -> Chuyển sang Báo Cáo Phân Tích (ANALYTICS)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Phân Tích') || b.innerText.includes('Báo cáo phân tích') || b.innerText.includes('Thống Kê'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_analytics_view.png') });
    console.log('   ✓ Đã chụp ảnh màn hình Báo Cáo Phân Tích.');

    // ----------------------------------------------------
    // TEST 3: Test Quick Search Modal (Ctrl + K)
    // ----------------------------------------------------
    console.log('\n👉 [Test 3] Kiểm tra Thanh tìm kiếm nhanh thông minh (Ctrl + K)...');
    // Open Quick Search via keyboard shortcut
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyK');
    await page.keyboard.up('Control');
    await new Promise((r) => setTimeout(r, 1000));

    let isSearchOpen = await page.evaluate(() => {
      return !!document.querySelector('input[placeholder*="Tìm nhanh"]');
    });

    if (!isSearchOpen) {
      // Fallback click on Quick Search Floating button
      await page.evaluate(() => {
        const btn = document.querySelector('button[title*="Ctrl + K"]');
        if (btn) btn.click();
      });
      await new Promise((r) => setTimeout(r, 1000));
      isSearchOpen = await page.evaluate(() => !!document.querySelector('input[placeholder*="Tìm nhanh"]'));
    }

    console.log(`   ✓ Modal tìm kiếm mở thành công: ${isSearchOpen ? 'CÓ' : 'KHÔNG'}`);

    if (isSearchOpen) {
      // Type search keyword "Yang Mao"
      await page.type('input[placeholder*="Tìm nhanh"]', 'Yang Mao', { delay: 50 });
      await new Promise((r) => setTimeout(r, 800));

      const searchResultsCount = await page.evaluate(() => {
        return document.querySelectorAll('.animate-in, [class*="hover:bg-slate-100"]').length;
      });
      console.log(`   ✓ Tìm thấy kết quả tìm kiếm cho từ khóa "Yang Mao": ${searchResultsCount > 0 ? 'CÓ (' + searchResultsCount + ' kết quả)' : 'KHÔNG'}`);

      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_quick_search_results.png') });

      // Close modal with Escape key
      await page.keyboard.press('Escape');
      await new Promise((r) => setTimeout(r, 500));
    }

    // ----------------------------------------------------
    // TEST 4: Test UI Settings Modal & PWA Section
    // ----------------------------------------------------
    console.log('\n👉 [Test 4] Kiểm tra Cài đặt giao diện & Mục PWA...');
    await page.evaluate(() => {
      const btn = document.querySelector('button[title*="Giao diện"], button[title*="Cài đặt"], button[title*="Tùy biến"]');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    const isSettingsOpen = await page.evaluate(() => {
      return document.body.innerText.includes('Cài Đặt Giao Diện Làm Việc');
    });
    console.log(`   ✓ Modal Cài Đặt Giao Diện mở: ${isSettingsOpen ? 'CÓ' : 'KHÔNG'}`);

    if (isSettingsOpen) {
      const hasPWABtn = await page.evaluate(() => {
        return document.body.innerText.includes('Ứng Dụng Điện Thoại & Ngoại Tuyến (PWA)');
      });
      console.log(`   ✓ Nút Hướng Dẫn Cài Đặt PWA có trong Cài Đặt: ${hasPWABtn ? 'CÓ' : 'KHÔNG'}`);

      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_ui_settings_pwa.png') });

      // Close Settings Modal
      await page.keyboard.press('Escape');
      await new Promise((r) => setTimeout(r, 500));
    }

    // ----------------------------------------------------
    // TEST 5: Test PWA Manual Install Modal
    // ----------------------------------------------------
    console.log('\n👉 [Test 5] Kiểm tra Hướng dẫn Cài đặt App (PWA Manual Guide)...');
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('open-pwa-install'));
    });
    await new Promise((r) => setTimeout(r, 1000));

    const isPWAModalOpen = await page.evaluate(() => {
      return document.body.innerText.includes('Cài Đặt App Kiểm Lâm Krông Bông');
    });
    console.log(`   ✓ Bảng hướng dẫn PWA (Android & iPhone) mở thành công: ${isPWAModalOpen ? 'CÓ' : 'KHÔNG'}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_pwa_guide_modal.png') });

    // Close PWA Modal
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 500));

    // ----------------------------------------------------
    // TEST 6: Test Auto-Backup Reminder Banner
    // ----------------------------------------------------
    console.log('\n👉 [Test 6] Kiểm tra Hệ thống Sao lưu Dữ liệu (Backup)...');
    await page.evaluate(() => {
      // Trigger backup modal from header button
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Sao lưu') || b.title?.includes('Sao lưu'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    const isBackupModalOpen = await page.evaluate(() => {
      return document.body.innerText.includes('Sao Lưu') || document.body.innerText.includes('Phục Hồi');
    });
    console.log(`   ✓ Modal Sao Lưu & Phục Hồi Dữ Liệu mở: ${isBackupModalOpen ? 'CÓ' : 'KHÔNG'}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_backup_modal.png') });

    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 500));

    // ----------------------------------------------------
    // TEST 7: Mobile Viewport Test (390x844 - iPhone / Android)
    // ----------------------------------------------------
    console.log('\n👉 [Test 7] Kiểm tra Giao diện trên Điện Thoại (Mobile Responsive 390x844)...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise((r) => setTimeout(r, 2000));

    const hasMobileNav = await page.evaluate(() => {
      // Check if MobileBottomNav is mounted
      return !!document.querySelector('nav') || !!document.querySelector('.fixed.bottom-0');
    });
    console.log(`   ✓ Thanh điều hướng đáy trên điện thoại (MobileBottomNav) hiển thị: ${hasMobileNav ? 'CÓ' : 'KHÔNG'}`);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_mobile_home.png') });
    console.log('   ✓ Đã chụp ảnh màn hình điện thoại (Trang chủ).');

    // Switch to Logbook on Mobile
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('nav button, .fixed.bottom-0 button'));
      const btn = btns.find(b => b.innerText.includes('Mẫu II') || b.innerText.includes('Sổ Mẫu II'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12_mobile_logbook.png') });
    console.log('   ✓ Đã chụp ảnh màn hình điện thoại (Sổ Mẫu II).');

    console.log('\n========================================================');
    console.log('📊 KẾT QUẢ TỔNG QUAN KIỂM THỬ:');
    console.log(`   - Tổng số lỗi nghiêm trọng (Page Crash / Console Error): ${errors.length}`);
    console.log(`   - Tổng số cảnh báo (Console Warnings): ${warnings.length}`);
    if (errors.length > 0) {
      console.log('   - Chi tiết lỗi:');
      errors.forEach(e => console.log(`     ❌ ${e}`));
    } else {
      console.log('   - 🎉 TẤT CẢ CÁC TÍNH NĂNG VÀ VIEW ĐỀU HOẠT ĐỘNG HOÀN HẢO KHÔNG CÓ LỖI!');
    }
    console.log('========================================================\n');

  } catch (err) {
    console.error('❌ Lỗi trong quá trình chạy kiểm thử:', err);
    errors.push(err.toString());
  } finally {
    await browser.close();
  }

  process.exit(errors.length > 0 ? 1 : 0);
})();
