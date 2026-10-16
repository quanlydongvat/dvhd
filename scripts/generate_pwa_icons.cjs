const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const imgBuffer = fs.readFileSync(path.resolve(__dirname, '../public/images/logo_kiem_lam.png'));
  const base64Img = `data:image/png;base64,${imgBuffer.toString('base64')}`;

  for (const size of [192, 512]) {
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#064e3b;overflow:hidden;display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;">
        <img src="${base64Img}" style="width:${Math.round(size * 0.88)}px;height:${Math.round(size * 0.88)}px;object-fit:contain;" />
      </body>
      </html>
    `);
    const outPath = path.resolve(__dirname, `../public/pwa-${size}x${size}.png`);
    await page.screenshot({ path: outPath });
    console.log(`Generated: ${outPath} (${fs.statSync(outPath).size} bytes)`);
  }

  // 180x180 for Apple touch icon
  await page.setViewport({ width: 180, height: 180, deviceScaleFactor: 1 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#064e3b;overflow:hidden;display:flex;align-items:center;justify-content:center;width:180px;height:180px;">
      <img src="${base64Img}" style="width:160px;height:160px;object-fit:contain;" />
    </body>
    </html>
  `);
  const applePath = path.resolve(__dirname, '../public/apple-touch-icon.png');
  await page.screenshot({ path: applePath });
  console.log(`Generated: ${applePath} (${fs.statSync(applePath).size} bytes)`);

  await browser.close();
  console.log('All PWA icons generated successfully with embedded base64 image!');
})();
