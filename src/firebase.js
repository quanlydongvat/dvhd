// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
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

// Helper function to sync app data to Firebase Cloud Firestore
export async function syncAppDataToCloud(appState) {
  try {
    if (!db || !appState || !appState.facilitiesList) return false;
    
    // Instead of one big document, write each facility to the 'facilities' collection
    const batch = writeBatch(db);
    
    appState.facilitiesList.forEach(fac => {
      const docRef = doc(db, "facilities", fac.id);
      batch.set(docRef, { ...fac, updatedAt: new Date().toISOString() });
    });
    
    await batch.commit();
    return true;
  } catch (error) {
    console.warn("Error syncing to Firebase Cloud:", error);
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
    } else if (user.role === 'ADMIN') {
      // Load all facilities
      const snapshot = await getDocs(collection(db, "facilities"));
      
      // TEMP FORCED MIGRATION: Check if old app_state has more facilities
      const docRef = doc(db, "wildlife_data", "app_state");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const oldData = docSnap.data();
        const oldFacilities = oldData.facilitiesList || [];
        
        if (oldFacilities.length > snapshot.size) {
          console.log("Found more facilities in old app_state. Migrating...");
          const batch = writeBatch(db);
          oldFacilities.forEach(fac => {
            const facRef = doc(db, "facilities", fac.id);
            batch.set(facRef, fac);
          });
          await batch.commit();
          facilitiesList = oldFacilities;
        } else {
          snapshot.forEach(doc => facilitiesList.push(doc.data()));
        }
      } else {
        snapshot.forEach(doc => facilitiesList.push(doc.data()));
      }
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
