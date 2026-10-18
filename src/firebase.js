// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDadtc8c1SltdQqa-aPKmm-pLmd1gO2tlA",
  authDomain: "dvhd-52ebb.firebaseapp.com",
  projectId: "dvhd-52ebb",
  storageBucket: "dvhd-52ebb.firebasestorage.app",
  messagingSenderId: "514944557700",
  appId: "1:514944557700:web:4e947d2f0d31f8cfb3d8d1",
  measurementId: "G-6MKGD9KZ0C"
};

let app = null;
let db = null;
let analytics = null;
let auth = null;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported && app) {
        analytics = getAnalytics(app);
      }
    }).catch(() => {});
  }
} catch (e) {
  console.warn("Firebase initialization warning:", e);
}

export { app, db, analytics, auth };

import { writeBatch, collection, getDocs, query, where } from "firebase/firestore";

// Helper to recursively remove all undefined keys to prevent Firestore write crashes
export function removeUndefinedKeys(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(removeUndefinedKeys);
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = removeUndefinedKeys(value);
    }
  }
  return cleaned;
}

// Helper function to save a single facility document to Cloud Firestore
export async function saveFacilityToCloud(facilityObj) {
  try {
    if (!db || !facilityObj || !facilityObj.id) return false;
    const docRef = doc(db, "facilities", facilityObj.id);
    const cleaned = removeUndefinedKeys({ ...facilityObj, updatedAt: new Date().toISOString() });
    await setDoc(docRef, cleaned);
    console.log(`[Firestore] Successfully saved facility "${facilityObj.id}" to Cloud.`);
    return true;
  } catch (error) {
    console.warn("Error saving facility to Cloud Firestore:", error);
    return false;
  }
}

// Helper function to sync app data to Firebase Cloud Firestore
export async function syncAppDataToCloud(appState) {
  try {
    if (!db || !appState || !appState.facilitiesList) return false;
    
    // Instead of one big document, write each facility to the 'facilities' collection
    const batch = writeBatch(db);
    
    appState.facilitiesList.forEach(fac => {
      const docRef = doc(db, "facilities", fac.id);
      const cleaned = removeUndefinedKeys({ ...fac, updatedAt: fac.updatedAt || new Date().toISOString() });
      batch.set(docRef, cleaned);
    });
    
    await batch.commit();
    console.log(`[Firestore] Successfully synced ${appState.facilitiesList.length} facilities to Cloud.`);
    return true;
  } catch (error) {
    console.warn("Error syncing to Firebase Cloud:", error);
    return false;
  }
}

export async function deleteFacilityFromCloud(facilityId) {
  try {
    if (!db || !facilityId) return false;
    await deleteDoc(doc(db, "facilities", facilityId));

    // Also update legacy app_state if it exists so deleted facilities are never resurrected
    try {
      const docRef = doc(db, "wildlife_data", "app_state");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const oldData = docSnap.data();
        if (oldData.facilitiesList) {
          const filtered = oldData.facilitiesList.filter(f => f.id !== facilityId);
          await setDoc(docRef, { ...oldData, facilitiesList: filtered });
        }
      }
    } catch (e) {
      console.warn("Could not sync deletion to legacy app_state:", e);
    }

    return true;
  } catch (error) {
    console.warn("Error deleting facility from Firebase Cloud:", error);
    return false;
  }
}

// Helper function to load data from Firebase Cloud
export async function loadAppDataFromCloud(user) {
  try {
    if (!db || !user) return null;
    let facilitiesList = [];
    
    if (user.role === 'FACILITY' && user.facilityId) {
      // Load only specific facility
      const q = query(collection(db, "facilities"), where("id", "==", user.facilityId));
      const snapshot = await getDocs(q);
      snapshot.forEach(doc => facilitiesList.push(doc.data()));
    } else if (user.role === 'ADMIN' || user.role === 'STAFF') {
      // Load all facilities directly from 'facilities' collection
      const snapshot = await getDocs(collection(db, "facilities"));
      snapshot.forEach(doc => facilitiesList.push(doc.data()));
    }
    
    if (facilitiesList.length === 0) return null;

    return { facilitiesList };
  } catch (error) {
    console.warn("Error loading from Firebase Cloud:", error);
    return null;
  }
}

// Helper function to listen for real-time Firebase Cloud changes
export function subscribeToCloudChanges(callback) {
  // Not used actively in new architecture to avoid over-fetching
  // Just returning dummy unsubscribe
  return () => {};
}

// Cloud Firestore helpers for Packing List (Sổ theo dõi bảng kê lâm sản)
export async function syncPackingListToCloud(packingList) {
  try {
    if (!db || !Array.isArray(packingList)) return false;
    const batch = writeBatch(db);
    packingList.forEach((item) => {
      const docRef = doc(db, 'packing_lists', item.id);
      const cleaned = removeUndefinedKeys({ ...item, updatedAt: item.updatedAt || new Date().toISOString() });
      batch.set(docRef, cleaned);
    });
    await batch.commit();
    return true;
  } catch (error) {
    console.warn('Error syncing packing list to Cloud Firestore:', error);
    return false;
  }
}

export async function savePackingListItemToCloud(item) {
  try {
    if (!db || !item || !item.id) return false;
    const docRef = doc(db, 'packing_lists', item.id);
    const cleaned = removeUndefinedKeys({ ...item, updatedAt: new Date().toISOString() });
    await setDoc(docRef, cleaned);
    return true;
  } catch (error) {
    console.warn('Error saving packing list item to Cloud:', error);
    return false;
  }
}

export async function deletePackingListItemFromCloud(id) {
  try {
    if (!db || !id) return false;
    await deleteDoc(doc(db, 'packing_lists', id));
    return true;
  } catch (error) {
    console.warn('Error deleting packing list item from Cloud:', error);
    return false;
  }
}

export async function loadPackingListFromCloud() {
  try {
    if (!db) return null;
    const snapshot = await getDocs(collection(db, 'packing_lists'));
    if (snapshot.empty) return null;
    const list = [];
    snapshot.forEach((d) => list.push(d.data()));
    list.sort((a, b) => (Number(a.stt) || 0) - (Number(b.stt) || 0));
    return list;
  } catch (error) {
    console.warn('Error loading packing list from Cloud:', error);
    return null;
  }
}
