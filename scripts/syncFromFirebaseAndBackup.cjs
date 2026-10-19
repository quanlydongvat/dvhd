const fs = require('fs');
const path = require('path');
const https = require('https');

function decodeFirestoreValue(val) {
  if (!val) return null;
  if ('stringValue' in val) return val.stringValue;
  if ('integerValue' in val) return Number(val.integerValue);
  if ('doubleValue' in val) return Number(val.doubleValue);
  if ('booleanValue' in val) return val.booleanValue;
  if ('nullValue' in val) return null;
  if ('mapValue' in val) {
    const res = {};
    const fields = val.mapValue.fields || {};
    for (const k in fields) {
      res[k] = decodeFirestoreValue(fields[k]);
    }
    return res;
  }
  if ('arrayValue' in val) {
    const values = val.arrayValue.values || [];
    return values.map(decodeFirestoreValue);
  }
  return null;
}

function decodeFirestoreDoc(doc) {
  const fields = doc.fields || {};
  const res = {};
  for (const k in fields) {
    res[k] = decodeFirestoreValue(fields[k]);
  }
  if (!res.id && doc.name) {
    res.id = doc.name.split('/').pop();
  }
  if (!res.facilityName && res.name) res.facilityName = res.name;
  if (!res.name && res.facilityName) res.name = res.facilityName;
  if (!res.ownerName && res.owner) res.ownerName = res.owner;
  if (!res.owner && res.ownerName) res.owner = res.ownerName;
  return res;
}

const BLACKLISTED_DELETED_FACILITY_IDS = ['fac_1786163777938', 'fac_1788916180780'];

function fetchCollection(collName) {
  return new Promise((resolve, reject) => {
    const url = `https://firestore.googleapis.com/v1/projects/dvhd-52ebb/databases/(default)/documents/${collName}?pageSize=300`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const docs = (parsed.documents || []).map(decodeFirestoreDoc);
          resolve(docs);
        } catch (e) {
          console.error(`Error parsing ${collName}:`, e);
          resolve([]);
        }
      });
    }).on('error', (err) => {
      console.error(`Fetch error ${collName}:`, err);
      resolve([]);
    });
  });
}

async function syncAndBackup() {
  console.log('Downloading live data from Firebase Cloud Firestore (dvhd-52ebb)...');
  
  const rawFacilities = await fetchCollection('facilities');
  const fluctuationRequests = await fetchCollection('fluctuation_requests');
  const users = await fetchCollection('users');

  const facilities = rawFacilities.filter(f => !BLACKLISTED_DELETED_FACILITY_IDS.includes(f.id));

  console.log(`Downloaded ${facilities.length} active Facilities (filtered from ${rawFacilities.length}), ${fluctuationRequests.length} Requests, ${users.length} Users.`);

  const timestamp = new Date().toISOString();
  const backupObject = {
    appName: "Sổ Theo Dõi Động Vật Hoang Dã (Thông tư 85/2025/TT-BNNMT)",
    unit: "Hạt Kiểm Lâm Khu Vực Krông Bông",
    syncedAt: timestamp,
    facilitiesCount: facilities.length,
    usersCount: users.length,
    requestsCount: fluctuationRequests.length,
    facilitiesList: facilities,
    fluctuationRequests,
    usersList: users,
  };

  // 1. Write JSON to public/ and docs/ for web downloads
  const publicBackupPath = path.join(__dirname, '../public/backup_cloud_firebase.json');
  const docsBackupPath = path.join(__dirname, '../docs/backup_cloud_firebase.json');
  const timestampedBackupPath = path.join(__dirname, '../docs/backup_42_coso_20261019_latest.json');

  fs.writeFileSync(publicBackupPath, JSON.stringify(backupObject, null, 2), 'utf8');
  fs.writeFileSync(docsBackupPath, JSON.stringify(backupObject, null, 2), 'utf8');
  fs.writeFileSync(timestampedBackupPath, JSON.stringify(backupObject, null, 2), 'utf8');
  console.log('Saved JSON backups to public/backup_cloud_firebase.json, docs/backup_cloud_firebase.json & docs/backup_42_coso_20261019_latest.json');

  // 1.1 Update REAL_FACILITIES_DATA in src/utils/storage.js
  const storageJsPath = path.join(__dirname, '../src/utils/storage.js');
  let storageContent = fs.readFileSync(storageJsPath, 'utf8');
  const startMarker = 'export const REAL_FACILITIES_DATA = [';
  const endMarker = '];';
  const startIdx = storageContent.indexOf(startMarker);
  if (startIdx !== -1) {
    const endIdx = storageContent.indexOf(endMarker, startIdx);
    if (endIdx !== -1) {
      const newDeclaration = `export const REAL_FACILITIES_DATA = ${JSON.stringify(facilities, null, 2)};`;
      storageContent = storageContent.substring(0, startIdx) + newDeclaration + storageContent.substring(endIdx + endMarker.length);
      fs.writeFileSync(storageJsPath, storageContent, 'utf8');
      console.log('Successfully updated REAL_FACILITIES_DATA in src/utils/storage.js with latest 42 facilities & fluctuations!');
    }
  }

  // 2. Generate Google Drive / Google Sheets compatible CSV summary file
  const csvRows = [];
  csvRows.push(['STT', 'Tên Cơ Sở Nuôi', 'Chủ Cơ Sở', 'Địa Chỉ', 'Xã', 'Mã Số Đăng Ký', 'Loài Nuôi', 'Tổng Cá Thể'].join(','));

  facilities.forEach((fac, idx) => {
    let speciesNames = [];
    let totalAnimals = 0;

    (fac.speciesList || []).forEach(sp => {
      speciesNames.push(sp.vietnameseName);
      const b = sp.baseline || {};
      const baseTotal = (Number(b.father) || 0) + (Number(b.mother) || 0) + (Number(b.otherMale) || 0) + (Number(b.otherFemale) || 0) + (Number(b.otherUnknown) || 0);
      
      let netFluctuation = 0;
      (sp.fluctuations || []).forEach(fluc => {
        const inc = (Number(fluc.incFather) || 0) + (Number(fluc.incMother) || 0) + (Number(fluc.incOtherMale) || 0) + (Number(fluc.incOtherFemale) || 0) + (Number(fluc.incOtherUnknown) || 0);
        const dec = (Number(fluc.decFather) || 0) + (Number(fluc.decMother) || 0) + (Number(fluc.decOtherMale) || 0) + (Number(fluc.decOtherFemale) || 0) + (Number(fluc.decOtherUnknown) || 0);
        netFluctuation += (inc - dec);
      });
      totalAnimals += (baseTotal + netFluctuation);
    });

    const cleanName = `"${(fac.facilityName || '').replace(/"/g, '""')}"`;
    const cleanOwner = `"${(fac.ownerName || '').replace(/"/g, '""')}"`;
    const cleanAddress = `"${(fac.address || '').replace(/"/g, '""')}"`;
    const cleanCommune = `"${(fac.commune || '').replace(/"/g, '""')}"`;
    const cleanRegCode = `"${(fac.registrationCode || '').replace(/"/g, '""')}"`;
    const cleanSpecies = `"${speciesNames.join('; ')}"`;

    csvRows.push([idx + 1, cleanName, cleanOwner, cleanAddress, cleanCommune, cleanRegCode, cleanSpecies, totalAnimals].join(','));
  });

  const csvPath = path.join(__dirname, '../docs/Bao_Cao_Tong_Hop_Firebase_GoogleDrive.csv');
  // BOM \uFEFF for Excel & Google Sheets UTF-8 compatibility
  fs.writeFileSync(csvPath, '\uFEFF' + csvRows.join('\n'), 'utf8');
  console.log('Saved Google Drive compatible CSV to docs/Bao_Cao_Tong_Hop_Firebase_GoogleDrive.csv');

  console.log('Sync from Firebase completed successfully!');
}

syncAndBackup();
