const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const bannerImgBase64 = fs.readFileSync(path.resolve(__dirname, '../public/images/banner.jpg')).toString('base64');
  
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; background: #0f172a; padding: 20px;">
        <h2 style="color: white; font-family: sans-serif;">Kiểm tra Banner 100% chiều dài, height: 264px</h2>
        <!-- 100% width, object-cover -->
        <div style="width: 1200px; height: 264px; overflow: hidden; border-radius: 16px; border: 1px solid #10b981; position: relative;">
          <img src="data:image/jpeg;base64,${bannerImgBase64}" style="width: 100%; height: 100%; object-fit: cover; object-position: center;" />
        </div>

        <h2 style="color: white; font-family: sans-serif; margin-top: 30px;">Kiểm tra Banner với object-position: right</h2>
        <div style="width: 1200px; height: 264px; overflow: hidden; border-radius: 16px; border: 1px solid #10b981; position: relative;">
          <img src="data:image/jpeg;base64,${bannerImgBase64}" style="width: 100%; height: 100%; object-fit: cover; object-position: right center;" />
        </div>
      </body>
    </html>
  `);

  await page.screenshot({ path: path.resolve(__dirname, 'banner_render_preview.png'), fullPage: true });
  await browser.close();
  console.log('Saved banner_render_preview.png successfully');
})();
