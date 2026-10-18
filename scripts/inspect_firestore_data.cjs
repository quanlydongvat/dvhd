const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, getDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDadtc8c1SltdQqa-aPKmm-pLmd1gO2tlA",
  authDomain: "dvhd-52ebb.firebaseapp.com",
  projectId: "dvhd-52ebb",
  storageBucket: "dvhd-52ebb.firebasestorage.app",
  messagingSenderId: "514944557700",
  appId: "1:514944557700:web:4e947d2f0d31f8cfb3d8d1",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function inspect() {
  console.log("=== INSPECTING FIRESTORE DATA ===");
  
  // 1. Check facilities collection
  console.log("\n--- FACILITIES COLLECTION ---");
  const facSnap = await getDocs(collection(db, 'facilities'));
  console.log(`Total facilities in 'facilities' collection: ${facSnap.size}`);
  
  const facilities = [];
  facSnap.forEach(d => {
    const data = d.data();
    let flucCount = 0;
    if (data.speciesList) {
      data.speciesList.forEach(s => {
        flucCount += (s.fluctuations || []).length;
      });
    }
    facilities.push({
      id: d.id,
      name: data.facilityName || data.ownerName,
      commune: data.commune,
      updatedAt: data.updatedAt,
      flucCount,
      speciesCount: (data.speciesList || []).length
    });
  });

  // Sort by updatedAt descending
  facilities.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
  console.log("Top 10 recently updated facilities:");
  console.table(facilities.slice(0, 10));

  // Facilities with fluctuations > 0
  const withFlucs = facilities.filter(f => f.flucCount > 0);
  console.log(`\nFacilities with fluctuations > 0: (${withFlucs.length})`);
  console.table(withFlucs);

  // 2. Check fluctuation_requests collection
  console.log("\n--- FLUCTUATION_REQUESTS COLLECTION ---");
  const reqSnap = await getDocs(collection(db, 'fluctuation_requests'));
  console.log(`Total documents in 'fluctuation_requests': ${reqSnap.size}`);
  reqSnap.forEach(d => {
    const data = d.data();
    console.log(`ID: ${d.id}`, JSON.stringify(data, null, 2));
  });

  // 3. Check legacy wildlife_data collection
  console.log("\n--- WILDLIFE_DATA COLLECTION ---");
  try {
    const legacySnap = await getDoc(doc(db, 'wildlife_data', 'app_state'));
    if (legacySnap.exists()) {
      const legData = legacySnap.data();
      console.log(`Legacy app_state exists, facilitiesList count: ${(legData.facilitiesList || []).length}`);
      console.log(`updatedAt: ${legData.updatedAt}`);
    } else {
      console.log("Legacy app_state does not exist.");
    }
  } catch (e) {
    console.log("Error checking legacy:", e.message);
  }

  process.exit(0);
}

inspect().catch(err => {
  console.error("Inspect error:", err);
  process.exit(1);
});
