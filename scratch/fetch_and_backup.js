import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import fs from 'fs';
import path from 'path';

const firebaseConfig = {
  apiKey: "AIzaSyDadtc8c1SltdQqa-aPKmm-pLmd1gO2tlA",
  authDomain: "dvhd-52ebb.firebaseapp.com",
  projectId: "dvhd-52ebb",
  storageBucket: "dvhd-52ebb.firebasestorage.app",
  messagingSenderId: "514944557700",
  appId: "1:514944557700:web:4e947d2f0d31f8cfb3d8d1",
  measurementId: "G-6MKGD9KZ0C"
};

async function exportBackup() {
  console.log("Connecting to Firebase Cloud Firestore...");
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  let facilitiesList = [];

  // 1. Get from facilities collection
  try {
    const snapshot = await getDocs(collection(db, "facilities"));
    snapshot.forEach(docSnap => {
      facilitiesList.push(docSnap.data());
    });
    console.log(`Loaded ${facilitiesList.length} facilities from 'facilities' collection.`);
  } catch (err) {
    console.error("Error fetching facilities collection:", err);
  }

  // 2. Check old app_state if any extra
  try {
    const docRef = doc(db, "wildlife_data", "app_state");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const oldData = docSnap.data();
      const oldFacilities = oldData.facilitiesList || [];
      console.log(`Found ${oldFacilities.length} facilities in legacy 'app_state'.`);
      if (oldFacilities.length > facilitiesList.length) {
        facilitiesList = oldFacilities;
      }
    }
  } catch (err) {
    console.warn("Legacy app_state check:", err.message);
  }

  if (facilitiesList.length === 0) {
    console.log("No data found in Firebase Cloud.");
    process.exit(0);
  }

  // Create backup directory
  const backupDir = path.join(process.cwd(), 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const jsonFilename = `SAO_LUU_DU_LIEU_DONG_VAT_${timestamp}.json`;
  const jsonPath = path.join(backupDir, jsonFilename);

  const backupData = {
    exportedAt: new Date().toISOString(),
    totalFacilities: facilitiesList.length,
    facilitiesList: facilitiesList
  };

  fs.writeFileSync(jsonPath, JSON.stringify(backupData, null, 2), 'utf8');
  console.log(`\n======================================================`);
  console.log(`✅ DA SAO LUU THANH CONG DU LIEU TU FIREBASE!`);
  console.log(`📁 DUONG DAN FILE LUU TREN MAY TINH: ${jsonPath}`);
  console.log(`📊 TONG SO CO SO NUOI DA LUU: ${facilitiesList.length}`);
  console.log(`======================================================\n`);
  
  process.exit(0);
}

exportBackup();
