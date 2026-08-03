// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
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

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
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

export { app, db, analytics };

// Helper function to sync app data to Firebase Cloud Firestore
export async function syncAppDataToCloud(appState) {
  try {
    if (!db || !appState) return false;
    const docRef = doc(db, "wildlife_data", "app_state");
    await setDoc(docRef, {
      ...appState,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.warn("Error syncing to Firebase Cloud:", error);
    return false;
  }
}

// Helper function to listen for real-time Firebase Cloud changes
export function subscribeToCloudChanges(callback) {
  try {
    if (!db) return () => {};
    const docRef = doc(db, "wildlife_data", "app_state");
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback(data);
      }
    }, (err) => {
      console.warn("Firestore snapshot listener error:", err);
    });
  } catch (e) {
    return () => {};
  }
}
