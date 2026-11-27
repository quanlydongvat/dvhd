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
      snapshot.forEach(doc => facilitiesList.push({ id: doc.id, ...doc.data() }));
    } else if (user.role === 'ADMIN' || user.role === 'STAFF') {
      // Load all facilities directly from 'facilities' collection
      const snapshot = await getDocs(collection(db, "facilities"));
      snapshot.forEach(doc => facilitiesList.push({ id: doc.id, ...doc.data() }));
    }
    
    if (facilitiesList.length === 0) return null;

    return { facilitiesList };
  } catch (error) {
    console.warn("Error loading from Firebase Cloud:", error);
    return null;
  }
}

// Helper functions to listen for real-time Firebase Cloud changes across all devices
export function subscribeToCloudFacilities(onData, onError) {
  if (!db) return () => {};
  return onSnapshot(collection(db, "facilities"), (snapshot) => {
    if (snapshot.empty) return;
    const facilitiesList = [];
    snapshot.forEach((docSnap) => {
      facilitiesList.push({ id: docSnap.id, ...docSnap.data() });
    });
    if (onData) onData(facilitiesList);
  }, (err) => {
    if (onError) onError(err);
    else console.warn("Real-time facilities listener error:", err);
  });
}

export function subscribeToCloudRequests(onData, onError) {
  if (!db) return () => {};
  return onSnapshot(collection(db, "fluctuation_requests"), (snapshot) => {
    const list = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    if (onData) onData(list);
  }, (err) => {
    if (onError) onError(err);
    else console.warn("Real-time requests listener error:", err);
  });
}

export function subscribeToCloudPackingList(onData, onError) {
  if (!db) return () => {};
  return onSnapshot(collection(db, "packing_lists"), (snapshot) => {
    const list = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    if (onData) onData(list);
  }, (err) => {
    if (onError) onError(err);
    else console.warn("Real-time packing list listener error:", err);
  });
}

export function subscribeToCloudChanges(callback) {
  return subscribeToCloudFacilities(callback);
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

// ==========================================
// USER REVIEWS & RATINGS (Đánh giá người dùng)
// ==========================================

export const DEFAULT_USER_REVIEWS = [
  {
    id: 'rev_fac_10',
    facilityId: 'fac_10',
    facilityName: 'Cơ sở nuôi Trịnh Lục',
    ownerName: 'Trịnh Lục',
    commune: 'xã Cư Pui',
    username: 'trinhluc',
    userRole: 'FACILITY',
    rating: 5,
    comment: 'Ứng dụng khai báo biến động tăng giảm đàn rất tiện lợi, thao tác trực tiếp trên điện thoại nhanh chóng, sổ sách rõ ràng minh bạch.',
    createdAt: '2026-11-20T08:30:00.000Z',
    updatedAt: '2026-11-20T08:30:00.000Z',
  },
  {
    id: 'rev_fac_12',
    facilityId: 'fac_12',
    facilityName: 'Cơ sở nuôi Lê Thanh Đức',
    ownerName: 'Lê Thanh Đức',
    commune: 'Xã Krông Bông',
    username: 'lethanhduc',
    userRole: 'FACILITY',
    rating: 5,
    comment: 'Theo dõi số lượng đàn cầy vòi hương và xuất bảng kê lâm sản rất chuẩn xác. Cán bộ Kiểm lâm tiếp nhận và duyệt biến động nhanh.',
    createdAt: '2026-11-22T09:15:00.000Z',
    updatedAt: '2026-11-22T09:15:00.000Z',
  },
  {
    id: 'rev_fac_18',
    facilityId: 'fac_18',
    facilityName: 'Cơ sở nuôi Lê Quang Mạnh',
    ownerName: 'Lê Quang Mạnh',
    commune: 'Xã Krông Bông',
    username: 'lequangmanh',
    userRole: 'FACILITY',
    rating: 5,
    comment: 'Hệ thống tự động tính toán tổng đàn dúi theo Thông tư 85 rất tiện ích, giúp cơ sở không phải cộng sổ tay thủ công nữa.',
    createdAt: '2026-11-23T14:45:00.000Z',
    updatedAt: '2026-11-23T14:45:00.000Z',
  },
  {
    id: 'rev_fac_11',
    facilityId: 'fac_11',
    facilityName: 'Cơ sở nuôi Nguyễn Hữu Đô',
    ownerName: 'Nguyễn Hữu Đô',
    commune: 'xã Cư Pui',
    username: 'nguyenhuudo',
    userRole: 'FACILITY',
    rating: 5,
    comment: 'Giao diện tiếng Việt rõ ràng, dễ sử dụng cho các hộ chăn nuôi. Đánh giá 5 sao cho phần mềm!',
    createdAt: '2026-11-24T10:20:00.000Z',
    updatedAt: '2026-11-24T10:20:00.000Z',
  },
  {
    id: 'rev_fac_1791188880545',
    facilityId: 'fac_1791188880545',
    facilityName: 'Nguyễn Văn Vinh',
    ownerName: 'Nguyễn Văn Vinh',
    commune: 'xã Hòa Sơn',
    username: 'nguyenvanvinh',
    userRole: 'FACILITY',
    rating: 5,
    comment: 'Biểu đồ và bảng xếp hạng rất trực quan, nắm bắt ngay được hiện trạng và biến động tăng đàn trong tháng.',
    createdAt: '2026-11-25T16:00:00.000Z',
    updatedAt: '2026-11-25T16:00:00.000Z',
  },
];

export function subscribeToUserReviews(onData, onError) {
  if (!db) return () => {};
  return onSnapshot(collection(db, 'user_reviews'), (snapshot) => {
    const list = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    // Sort by createdAt descending
    list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    if (onData) onData(list);
  }, (err) => {
    if (onError) onError(err);
    else console.warn('Real-time user_reviews listener error:', err);
  });
}

export async function saveUserReviewToCloud(reviewObj) {
  try {
    if (!db || !reviewObj || !reviewObj.id) return false;
    const docRef = doc(db, 'user_reviews', reviewObj.id);
    const cleaned = removeUndefinedKeys({
      ...reviewObj,
      updatedAt: new Date().toISOString()
    });
    await setDoc(docRef, cleaned);
    console.log(`[Firestore] Saved user review "${reviewObj.id}" successfully.`);
    return true;
  } catch (error) {
    console.warn('Error saving user review to Cloud Firestore:', error);
    return false;
  }
}

export async function deleteUserReviewFromCloud(reviewId) {
  try {
    if (!db || !reviewId) return false;
    await deleteDoc(doc(db, 'user_reviews', reviewId));
    console.log(`[Firestore] Deleted user review "${reviewId}" successfully.`);
    return true;
  } catch (error) {
    console.warn('Error deleting user review from Cloud Firestore:', error);
    return false;
  }
}

export async function loadUserReviewsFromCloud() {
  try {
    if (!db) return null;
    const snapshot = await getDocs(collection(db, 'user_reviews'));
    if (snapshot.empty) return null;
    const list = [];
    snapshot.forEach((d) => list.push({ id: d.id, ...d.data() }));
    list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return list;
  } catch (error) {
    console.warn('Error loading user reviews from Cloud:', error);
    return null;
  }
}
