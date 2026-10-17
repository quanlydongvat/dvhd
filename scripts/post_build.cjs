const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');
const dvhdDir = path.join(distDir, 'dvhd');

console.log('[Post-Build] Creating legacy fallback directory for older installed apps (/dvhd/)...');

if (!fs.existsSync(dvhdDir)) {
  fs.mkdirSync(dvhdDir, { recursive: true });
}

// Copy index.html and manifest.json to dist/dvhd
const filesToCopy = ['index.html', 'manifest.json', 'app.json', '404.html'];
filesToCopy.forEach((file) => {
  const src = path.join(distDir, file);
  const dest = path.join(dvhdDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`  ✓ Copied ${file} -> dist/dvhd/${file}`);
  }
});

// Ensure CNAME is copied to dist
const cnameSrc = path.resolve(__dirname, '../public/CNAME');
const cnameDest = path.join(distDir, 'CNAME');
if (fs.existsSync(cnameSrc)) {
  fs.copyFileSync(cnameSrc, cnameDest);
  console.log('  ✓ Verified CNAME (quanlydongvat.xyz) in dist');
}

// Ensure .nojekyll is copied to dist
const nojekyllSrc = path.resolve(__dirname, '../public/.nojekyll');
const nojekyllDest = path.join(distDir, '.nojekyll');
if (fs.existsSync(nojekyllSrc)) {
  fs.copyFileSync(nojekyllSrc, nojekyllDest);
  console.log('  ✓ Verified .nojekyll in dist');
}

console.log('[Post-Build] Completed legacy fallback support successfully!');
