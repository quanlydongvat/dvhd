// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDadtc8c1SltdQqa-aPKmm-pLmd1gO2tlA",
  authDomain: "dvhd-52ebb.firebaseapp.com",
  projectId: "dvhd-52ebb",
  storageBucket: "dvhd-52ebb.firebasestorage.app",
  messagingSenderId: "514944557700",
  appId: "1:514944557700:web:4e947d2f0d31f8cfb3d8d1",
  measurementId: "G-6MKGD9KZ0C"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

// Helper function to sync app data to Firebase Cloud Firestore
export async function syncAppDataToCloud(appState) {
  try {
    const docRef = doc(db, "wildlife_data", "app_state");
    await setDoc(docRef, {
      ...appState,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error("Error syncing to Firebase Cloud:", error);
    return false;
  }
}

// Helper function to listen for real-time Firebase Cloud changes
export function subscribeToCloudChanges(callback) {
  const docRef = doc(db, "wildlife_data", "app_state");
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      callback(data);
    }
  }, (err) => {
    console.warn("Firestore snapshot listener error:", err);
  });
}
