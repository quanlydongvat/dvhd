const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const videoPath = 'file:///' + path.resolve(__dirname, '../public/banner.mp4').replace(/\\/g, '/');
  const posterPath = 'file:///' + path.resolve(__dirname, '../public/images/banner.jpg').replace(/\\/g, '/');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; background: #0b1512; padding: 24px; font-family: sans-serif;">
        <h3 style="color: #6ee7b7; margin-bottom: 12px;">Phương án 1: Video 100% full width, height 264px (Desktop)</h3>
        <div style="width: 100%; max-width: 1280px; height: 264px; border-radius: 16px; overflow: hidden; border: 1px solid rgba(16, 185, 129, 0.4); position: relative; background: #000; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);">
          <video autoplay loop muted playsinline poster="${posterPath}" style="width: 100%; height: 100%; object-fit: cover; object-position: center; display: block;">
            <source src="${videoPath}" type="video/mp4" />
          </video>
        </div>

        <h3 style="color: #6ee7b7; margin-top: 32px; margin-bottom: 12px;">Phương án 2: Mobile View (width: 420px, height: 192px)</h3>
        <div style="width: 420px; height: 192px; border-radius: 14px; overflow: hidden; border: 1px solid rgba(16, 185, 129, 0.4); position: relative; background: #000;">
          <video autoplay loop muted playsinline poster="${posterPath}" style="width: 100%; height: 100%; object-fit: cover; object-position: center; display: block;">
            <source src="${videoPath}" type="video/mp4" />
          </video>
        </div>
      </body>
    </html>
  `);

  // Wait a bit for video frame
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({ path: path.resolve(__dirname, 'video_preview.png'), fullPage: true });
  await browser.close();
  console.log('Video preview saved');
})();
