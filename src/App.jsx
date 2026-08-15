import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LeftSidebar from './components/LeftSidebar';
import TableView from './components/TableView';
import SummaryView from './components/SummaryView';
import AnalyticsView from './components/AnalyticsView';
import MapView from './components/MapView';
import AdminDashboard from './components/AdminDashboard';
import DesktopAppHeader from './components/DesktopAppHeader';
import DesktopShortcutsModal from './components/DesktopShortcutsModal';
import MobileBottomNav from './components/MobileBottomNav';
import UISettingsModal, { DEFAULT_UI_SETTINGS } from './components/UISettingsModal';
import FluctuationModal from './components/FluctuationModal';

import SpeciesModal from './components/SpeciesModal';
import FacilityModal from './components/FacilityModal';
import ExportImportModal from './components/ExportImportModal';
import PrintView from './components/PrintView';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { computeLogbookTable } from './utils/calculations';
import { loadAppData, saveAppData, clearAppData, resetToDemoData, REAL_FACILITIES_DATA, EMPTY_FACILITY_INFO } from './utils/storage';
import { exportDistrictReport, exportFacilityLogbook } from './utils/exportExcel';
import { syncAppDataToCloud, loadAppDataFromCloud, deleteFacilityFromCloud } from './firebase';
import ExportModal from './components/ExportModal';
import PendingApprovalsModal from './components/PendingApprovalsModal';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, addDoc, updateDoc, deleteDoc, getDoc, collection, getDocs, query, where, writeBatch } from 'firebase/firestore';
import Login from './components/Login';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  
  const [appState, setAppState] = useState(() => loadAppData());
  const [currentView, setCurrentView] = useState('HOME'); // Default to HOME dashboard
  const [targetFacilityId, setTargetFacilityId] = useState(null);

  // Desktop App UI & Workspace Settings States
  const [density, setDensity] = useState('COMPACT'); // 'COMPACT' | 'SPACIOUS'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  const [uiSettings, setUiSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('wildlife_ui_settings');
      return saved ? JSON.parse(saved) : DEFAULT_UI_SETTINGS;
    } catch (e) {
      return DEFAULT_UI_SETTINGS;
    }
  });

  const [isUISettingsModalOpen, setIsUISettingsModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('wildlife_ui_settings', JSON.stringify(uiSettings));
    } catch (e) {}
  }, [uiSettings]);

  // Auth Listener
  useEffect(() => {
    import('./firebase').then(({ db }) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            let role = 'FACILITY';
            let facilityId = null;
            const cleanUsername = user.email ? user.email.split('@')[0] : 'user';

            if (userDoc.exists()) {
              const data = userDoc.data();
              role = data.role || 'FACILITY';
              facilityId = data.facilityId || null;
            } else {
              if (cleanUsername === 'admin') role = 'ADMIN';
              if (cleanUsername === 'dlc-krb') role = 'STAFF';
            }

            setCurrentUser({
              uid: user.uid,
              email: user.email,
              username: cleanUsername,
              role,
              facilityId,
            });
          } catch (err) {
            console.error("Error fetching user role", err);
          }
        } else {
          setCurrentUser(null);
        }
        setIsAuthChecking(false);
      });
      return () => unsubscribe();
    });
  }, []);

  // Public Cloud Sync on Mount (For Guest / Demo users across different computers)
  useEffect(() => {
    import('./firebase').then(async ({ db }) => {
      if (!db) return;
      try {
        const snapshot = await getDocs(collection(db, "facilities"));
        if (!snapshot.empty) {
          const cloudFacilities = [];
          snapshot.forEach(doc => {
            cloudFacilities.push(doc.data());
          });

          if (cloudFacilities.length > 0) {
            console.log(`[Firebase Guest Restore] Loaded ${cloudFacilities.length} facilities publicly.`);
            setSkipNextSync(true);
            setAppState(prev => {
              const activeFacId = prev.activeFacilityId || cloudFacilities[0]?.id;
              const activeFac = cloudFacilities.find((f) => f.id === activeFacId) || cloudFacilities[0];
              return {
                ...prev,
                facilitiesList: cloudFacilities,
                activeFacilityId: activeFacId,
                facilityInfo: activeFac ? {
                  id: activeFac.id,
                  facilityName: activeFac.facilityName,
                  ownerName: activeFac.ownerName,
                  registrationCode: activeFac.registrationCode,
                  registrationDate: activeFac.registrationDate,
                  commune: activeFac.commune || 'xã Hòa Sơn',
                  address: activeFac.address,
                  phone: activeFac.phone,
                  purposeCode: activeFac.purposeCode,
                  note: activeFac.note,
                  lat: activeFac.lat || '',
                  lng: activeFac.lng || '',
                } : prev.facilityInfo,
                speciesList: activeFac?.speciesList || [],
                activeSpeciesId: activeFac?.speciesList?.[0]?.id || null,
              };
            });
          }
        }
      } catch (err) {
        console.warn("Public load from Firebase Cloud failed:", err);
      }
    });
  }, []);

  useEffect(() => {
    if (currentUser?.role === 'FACILITY') {
      setCurrentView('LOGBOOK');
    }
  }, [currentUser]);

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  const { facilitiesList = REAL_FACILITIES_DATA, activeFacilityId, facilityInfo, speciesList = [], activeSpeciesId } = appState;

  // Compute total animals across all 31 facilities
  let grandTotalAnimals = 0;
  facilitiesList.forEach((fac) => {
    fac.speciesList?.forEach((sp) => {
      const b = sp.baseline || {};
      grandTotalAnimals += (Number(b.father) || 0) + (Number(b.mother) || 0) + (Number(b.otherMale) || 0) + (Number(b.otherFemale) || 0) + (Number(b.otherUnknown) || 0);
    });
  });

  // Active species object
  const activeSpecies = speciesList.find((s) => s.id === activeSpeciesId) || speciesList[0] || null;

  // Compute 19-column table rows automatically
  const rows = computeLogbookTable(activeSpecies?.baseline || {}, activeSpecies?.fluctuations || []);

  // Modal visibility states
  const [isFluctuationModalOpen, setIsFluctuationModalOpen] = useState(false);
  const [editingFluctuation, setEditingFluctuation] = useState(null);

  const [isSpeciesModalOpen, setIsSpeciesModalOpen] = useState(false);
  const [editingSpecies, setEditingSpecies] = useState(null);

  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isPrintViewOpen, setIsPrintViewOpen] = useState(false);
  const [skipNextSync, setSkipNextSync] = useState(false);
  const isInitialMount = React.useRef(true);

  // Sync state to LocalStorage and Firebase Cloud Firestore on change
  useEffect(() => {
    saveAppData(appState);
    if (skipNextSync) {
      setSkipNextSync(false);
      return;
    }
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    syncAppDataToCloud(appState);
  }, [appState]);

  // Load data from Firebase Cloud after authentication
  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;
    
    loadAppDataFromCloud(currentUser).then((cloudData) => {
      if (cancelled || !cloudData) return;

      const cloudFacilities = cloudData.facilitiesList;
      if (!cloudFacilities || !Array.isArray(cloudFacilities) || cloudFacilities.length === 0) return;

      const localFacilities = appState.facilitiesList || [];

      // If user is Facility, we force the loaded facility
      // If user is Admin, we merge/take from cloud if it's larger
      if (currentUser.role === 'FACILITY' || cloudFacilities.length > localFacilities.length) {
        console.log(`[Firebase Restore] Loaded ${cloudFacilities.length} facilities for role ${currentUser.role}`);

        let activeFacId = currentUser.facilityId || cloudData.activeFacilityId || cloudFacilities[0]?.id;
        // If the facility list doesn't have the activeFacId, pick the first one
        if (!cloudFacilities.find(f => f.id === activeFacId)) {
           activeFacId = cloudFacilities[0]?.id;
        }
        
        const activeFac = cloudFacilities.find((f) => f.id === activeFacId) || cloudFacilities[0];

        setSkipNextSync(true);
        setAppState({
          facilitiesList: cloudFacilities,
          activeFacilityId: activeFacId,
          facilityInfo: activeFac ? {
            id: activeFac.id,
            facilityName: activeFac.facilityName,
            ownerName: activeFac.ownerName,
            registrationCode: activeFac.registrationCode,
            registrationDate: activeFac.registrationDate,
            commune: activeFac.commune || 'xã Hòa Sơn',
            address: activeFac.address,
            phone: activeFac.phone,
            purposeCode: activeFac.purposeCode,
            note: activeFac.note,
            lat: activeFac.lat || '',
            lng: activeFac.lng || '',
          } : appState.facilityInfo,
          speciesList: activeFac?.speciesList || [],
          activeSpeciesId: cloudData.activeSpeciesId || activeFac?.speciesList?.[0]?.id || null,
        });
      }
    });

    return () => { cancelled = true; };
  }, [currentUser]); 


  // Global Desktop Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.altKey && (e.key === '1' || e.key === '!')) {
        e.preventDefault();
        setCurrentView('LOGBOOK');
      } else if (e.altKey && (e.key === '2' || e.key === '@')) {
        e.preventDefault();
        setCurrentView('SUMMARY');
      } else if (e.altKey && (e.key === '3' || e.key === '#')) {
        e.preventDefault();
        setCurrentView('HOME');
      } else if (e.altKey && (e.key === '4' || e.key === '$')) {
        e.preventDefault();
        setCurrentView('MAP');
      } else if (e.altKey && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        setEditingFluctuation(null);
        setIsFluctuationModalOpen(true);
      } else if (e.altKey && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        if (activeSpecies) exportToExcel(activeSpecies, rows, facilityInfo);
      } else if (e.altKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        setIsPrintViewOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSpecies, rows, facilityInfo]);

  // Toggle Browser Fullscreen Mode (F11 style)
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };


  // Handler: Select Facility from dropdown or summary table
  const handleSelectFacility = (facId) => {
    const fac = facilitiesList.find((f) => f.id === facId);
    if (!fac) return;

    setAppState((prev) => ({
      ...prev,
      activeFacilityId: fac.id,
      facilityInfo: {
        id: fac.id,
        facilityName: fac.facilityName,
        ownerName: fac.ownerName,
        registrationCode: fac.registrationCode,
        registrationDate: fac.registrationDate,
        address: fac.address,
        phone: fac.phone,
        purposeCode: fac.purposeCode,
        note: fac.note,
        lat: fac.lat,
        lng: fac.lng,
      },
      speciesList: fac.speciesList || [],
      activeSpeciesId: fac.speciesList?.[0]?.id || null,
    }));
  };

  // Handler: Select Active Species Tab
  const handleSelectSpecies = (id) => {
    setAppState((prev) => ({ ...prev, activeSpeciesId: id }));
  };

  // Handler: Clear all data (Xóa trắng)
  const handleClearAllData = () => {
    const cleared = clearAppData();
    setAppState(cleared);
  };

  // Handler: Reset to real/demo data
  const handleResetDemo = () => {
    const demo = resetToDemoData();
    setAppState(demo);
  };
  // Pending Fluctuation Requests State & Handlers
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);

  const fetchPendingRequests = async () => {
    try {
      const reqsMap = new Map();

      // 1. Fetch from Firestore fluctuation_requests collection
      if (db) {
        try {
          const querySnapshot = await getDocs(collection(db, 'fluctuation_requests'));
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.status === 'PENDING') {
              const key = data.fluctuationId || docSnap.id;
              reqsMap.set(key, { id: docSnap.id, ...data });
            }
          });
        } catch (err) {
          console.warn("Error fetching fluctuation_requests:", err);
        }
      }

      // 2. Scan all facilities in facilitiesList for any fluctuation with approvalStatus === 'PENDING'
      (facilitiesList || []).forEach((fac) => {
        (fac.speciesList || []).forEach((sp) => {
          (sp.fluctuations || []).forEach((fluc) => {
            if (fluc.approvalStatus === 'PENDING') {
              const key = fluc.id;
              if (!reqsMap.has(key)) {
                reqsMap.set(key, {
                  id: 'req_' + fluc.id,
                  fluctuationId: fluc.id,
                  facilityId: fac.id,
                  speciesId: sp.id,
                  facilityName: fac.facilityName || fac.name,
                  speciesName: sp.vietnameseName,
                  submittedBy: fac.ownerName || 'Cơ sở',
                  status: 'PENDING',
                  createdAt: fluc.createdAt || Date.now(),
                  incFather: fluc.incFather || 0,
                  incMother: fluc.incMother || 0,
                  incOtherMale: fluc.incOtherMale || 0,
                  incOtherFemale: fluc.incOtherFemale || 0,
                  incOtherUnknown: fluc.incOtherUnknown || 0,
                  decFather: fluc.decFather || 0,
                  decMother: fluc.decMother || 0,
                  decOtherMale: fluc.decOtherMale || 0,
                  decOtherFemale: fluc.decOtherFemale || 0,
                  decOtherUnknown: fluc.decOtherUnknown || 0,
                  date: fluc.date,
                  reason: fluc.reason || fluc.description,
                  note: fluc.note,
                  verifier: fluc.verifier,
                  ...fluc,
                });
              }
            }
          });
        });
      });

      const reqs = Array.from(reqsMap.values());
      reqs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setPendingRequests(reqs);
    } catch (err) {
      console.error("Error fetching pending requests:", err);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'ADMIN' || currentUser?.role === 'STAFF') {
      fetchPendingRequests();
      const interval = setInterval(fetchPendingRequests, 10000);
      return () => clearInterval(interval);
    }
  }, [currentUser, facilitiesList]);

  // --- APPROVAL WORKFLOW FOR ADMIN ---
  const handleApproveRequest = async (req) => {
    // Merge pending fluctuation into the facility
    const targetFac = facilitiesList.find(f => f.id === req.facilityId);
    if (!targetFac) {
      alert("Không tìm thấy cơ sở này trong dữ liệu.");
      return;
    }
    const targetSpList = targetFac.speciesList || [];
    const targetSp = targetSpList.find(s => s.id === req.speciesId);
    if (!targetSp) {
      alert("Không tìm thấy loài này trong cơ sở.");
      return;
    }

    let found = false;
    const updatedFluctuations = (targetSp.fluctuations || []).map((fluc) => {
      const isMatch = req.fluctuationId ? (fluc.id === req.fluctuationId) : (fluc.id === req.id || (fluc.date === req.date && fluc.reason === req.reason));
      if (isMatch) {
        found = true;
        return { ...fluc, approvalStatus: 'APPROVED' };
      }
      return fluc;
    });

    if (!found) {
      const { id, status, facilityId, speciesId, facilityName, speciesName, submittedBy, ...cleanFormData } = req;
      updatedFluctuations.push({
        id: req.fluctuationId || 'fluc_' + Date.now(),
        ...cleanFormData,
        createdAt: req.createdAt || Date.now(),
        approvalStatus: 'APPROVED',
      });
    }

    const updatedSpeciesList = targetSpList.map((sp) =>
      sp.id === req.speciesId ? { ...sp, fluctuations: updatedFluctuations } : sp
    );

    const updatedFacilitiesList = facilitiesList.map((fac) =>
      fac.id === req.facilityId ? { ...fac, speciesList: updatedSpeciesList } : fac
    );

    setAppState((prev) => ({
      ...prev,
      facilitiesList: updatedFacilitiesList
    }));

    if (db) {
      try {
        if (req.id && !req.id.startsWith('req_')) {
          await setDoc(doc(db, 'fluctuation_requests', req.id), { status: 'APPROVED' }, { merge: true });
        }
        if (req.fluctuationId) {
          const q = query(collection(db, 'fluctuation_requests'), where('fluctuationId', '==', req.fluctuationId));
          const snapshot = await getDocs(q);
          snapshot.forEach(async (docSnap) => {
            await setDoc(doc(db, 'fluctuation_requests', docSnap.id), { status: 'APPROVED' }, { merge: true });
          });
        }
      } catch (e) {
        console.warn("Cloud update approval status:", e);
      }
    }
  };

  const handleApprovePending = async (req) => {
    try {
      await handleApproveRequest(req);
      alert(`Đã duyệt thành công biến động của cơ sở ${req.facilityName || ''}!`);
      fetchPendingRequests();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi duyệt yêu cầu: " + err.message);
    }
  };

  const handleRejectRequest = async (req) => {
    const targetFac = facilitiesList.find(f => f.id === req.facilityId);
    if (!targetFac) return;

    const targetSpList = targetFac.speciesList || [];
    const targetSp = targetSpList.find(s => s.id === req.speciesId);
    if (!targetSp) return;

    const updatedFluctuations = (targetSp.fluctuations || []).filter((fluc) => {
      return !(req.fluctuationId ? (fluc.id === req.fluctuationId) : (fluc.id === req.id || (fluc.date === req.date && fluc.reason === req.reason)));
    });

    const updatedSpeciesList = targetSpList.map((sp) =>
      sp.id === req.speciesId ? { ...sp, fluctuations: updatedFluctuations } : sp
    );

    const updatedFacilitiesList = facilitiesList.map((fac) =>
      fac.id === req.facilityId ? { ...fac, speciesList: updatedSpeciesList } : fac
    );

    setAppState((prev) => ({
      ...prev,
      facilitiesList: updatedFacilitiesList
    }));

    if (db) {
      try {
        if (req.id && !req.id.startsWith('req_')) {
          await setDoc(doc(db, 'fluctuation_requests', req.id), { status: 'REJECTED' }, { merge: true });
        }
        if (req.fluctuationId) {
          const q = query(collection(db, 'fluctuation_requests'), where('fluctuationId', '==', req.fluctuationId));
          const snapshot = await getDocs(q);
          snapshot.forEach(async (docSnap) => {
            await setDoc(doc(db, 'fluctuation_requests', docSnap.id), { status: 'REJECTED' }, { merge: true });
          });
        }
      } catch (e) {
        console.warn("Cloud update reject status:", e);
      }
    }
  };

  const handleRejectPending = async (req) => {
    if (!window.confirm(`Bạn có chắc chắn muốn TỪ CHỐI yêu cầu biến động của ${req.facilityName || 'cơ sở'}? Biến động này sẽ bị XÓA khỏi sổ ghi chép.`)) return;
    try {
      await handleRejectRequest(req);
      alert("Đã từ chối yêu cầu và xóa biến động khỏi cơ sở.");
      fetchPendingRequests();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi từ chối yêu cầu: " + err.message);
    }
  };

  // Handler: Save Fluctuation (Add or Edit)
  const handleSaveFluctuation = async (formData) => {
    const { targetFacilityId, targetSpeciesId, ...cleanFormData } = formData;

    const targetFacId = targetFacilityId || activeFacilityId;

    const targetFac = facilitiesList.find((f) => f.id === targetFacId) || facilitiesList[0];
    if (!targetFac) return;

    const targetSpList = targetFac.speciesList || [];
    const targetSpId = targetSpeciesId || activeSpeciesId;
    const targetSp = targetSpList.find((s) => s.id === targetSpId) || targetSpList[0];
    if (!targetSp) return;

    let updatedFluctuations = [...(targetSp.fluctuations || [])];
    const isFacilityUser = currentUser && currentUser.role === 'FACILITY';

    if (editingFluctuation) {
      // Edit existing
      updatedFluctuations = updatedFluctuations.map((item) =>
        item.id === editingFluctuation.id 
          ? { 
              ...item, 
              ...cleanFormData,
              approvalStatus: isFacilityUser ? 'PENDING' : (item.approvalStatus || 'APPROVED')
            } 
          : item
      );

      // Sync edited fluctuation request to cloud if facility edited it
      if (isFacilityUser) {
        const requestItem = {
          ...cleanFormData,
          createdAt: Date.now(),
          status: 'PENDING',
          facilityId: targetFacId,
          speciesId: targetSpId,
          facilityName: targetFac.facilityName || targetFac.name,
          speciesName: targetSp.vietnameseName,
          submittedBy: currentUser.username || 'Cơ sở',
          fluctuationId: editingFluctuation.id,
        };
        try {
          const q = query(collection(db, 'fluctuation_requests'), where('fluctuationId', '==', editingFluctuation.id));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            snapshot.forEach(async (docSnap) => {
              await setDoc(doc(db, 'fluctuation_requests', docSnap.id), requestItem, { merge: true });
            });
          } else {
            await addDoc(collection(db, 'fluctuation_requests'), requestItem);
          }
        } catch (err) {
          console.warn("Error syncing edited request to cloud:", err);
        }
      }
    } else {
      // Add new
      const flucId = 'fluc_' + Date.now();
      const newItem = {
        id: flucId,
        ...cleanFormData,
        createdAt: Date.now(),
        approvalStatus: isFacilityUser ? 'PENDING' : 'APPROVED',
      };
      updatedFluctuations.push(newItem);

      if (isFacilityUser) {
        const requestItem = {
          ...cleanFormData,
          createdAt: Date.now(),
          status: 'PENDING',
          facilityId: targetFacId,
          speciesId: targetSpId,
          facilityName: targetFac.facilityName || targetFac.name,
          speciesName: targetSp.vietnameseName,
          submittedBy: currentUser.username || 'Cơ sở',
          fluctuationId: flucId,
        };
        try {
          await addDoc(collection(db, 'fluctuation_requests'), requestItem);
        } catch (err) {
          console.error("Error creating pending request record:", err);
        }
      }
    }

    const updatedSpeciesList = targetSpList.map((sp) =>
      sp.id === targetSp.id ? { ...sp, fluctuations: updatedFluctuations } : sp
    );

    const updatedFacilitiesList = facilitiesList.map((fac) =>
      fac.id === targetFacId ? { ...fac, speciesList: updatedSpeciesList } : fac
    );

    setAppState((prev) => ({
      ...prev,
      facilitiesList: updatedFacilitiesList,
      activeFacilityId: targetFacId,
      facilityInfo: {
        id: targetFac.id,
        facilityName: targetFac.facilityName,
        ownerName: targetFac.ownerName,
        registrationCode: targetFac.registrationCode,
        registrationDate: targetFac.registrationDate,
        commune: targetFac.commune,
        address: targetFac.address,
        phone: targetFac.phone,
        purposeCode: targetFac.purposeCode,
        note: targetFac.note,
        lat: targetFac.lat,
        lng: targetFac.lng,
      },
      speciesList: updatedSpeciesList,
      activeSpeciesId: targetSpId,
    }));

    if (isFacilityUser) {
      alert('Đã lưu biến động và hiển thị tức thì trên sổ! Dữ liệu đang chờ Hạt Kiểm Lâm duyệt.');
    } else {
      alert('Đã lưu biến động thành công!');
    }

    setIsFluctuationModalOpen(false);
    setEditingFluctuation(null);
  };

  // Handler: Delete Fluctuation
  const handleDeleteFluctuation = async (rowId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nhật ký biến động này không? Tất cả số liệu phía sau sẽ tự động được tính toán lại!')) {
      return;
    }

    const targetFluc = (activeSpecies.fluctuations || []).find((item) => item.id === rowId);

    // If it is pending, delete it from firestore collection 'fluctuation_requests'
    if (targetFluc && targetFluc.approvalStatus === 'PENDING') {
      try {
        const q = query(collection(db, 'fluctuation_requests'), where('fluctuationId', '==', rowId));
        const snapshot = await getDocs(q);
        snapshot.forEach(async (docSnap) => {
          await deleteDoc(doc(db, 'fluctuation_requests', docSnap.id));
        });
      } catch (err) {
        console.warn("Error deleting pending request from cloud:", err);
      }
    }

    const updatedFluctuations = (activeSpecies.fluctuations || []).filter((item) => item.id !== rowId);

    const updatedSpeciesList = speciesList.map((sp) =>
      sp.id === activeSpecies.id ? { ...sp, fluctuations: updatedFluctuations } : sp
    );

    const updatedFacilitiesList = facilitiesList.map((fac) =>
      fac.id === activeFacilityId ? { ...fac, speciesList: updatedSpeciesList } : fac
    );

    setAppState((prev) => ({
      ...prev,
      facilitiesList: updatedFacilitiesList,
      speciesList: updatedSpeciesList,
    }));
  };

  // Handler: Save Species (Add new or edit existing & baseline A)
  const handleSaveSpecies = (formData) => {
    const {
      vietnameseName,
      scientificName,
      group,
      citesAppendix,
      purposeCode,
      baselineDate,
      father,
      mother,
      otherMale,
      otherFemale,
      otherUnknown,
      baselineNote,
      verifier,
    } = formData;

    const newBaseline = {
      date: baselineDate,
      father,
      mother,
      otherMale,
      otherFemale,
      otherUnknown,
      note: baselineNote,
      verifier,
    };

    let updatedSpeciesList = [];

    if (editingSpecies) {
      // Edit existing species & baseline
      updatedSpeciesList = speciesList.map((sp) =>
        sp.id === editingSpecies.id
          ? {
              ...sp,
              vietnameseName,
              scientificName,
              group,
              citesAppendix,
              purposeCode,
              baseline: newBaseline,
            }
          : sp
      );

      const updatedFacilitiesList = facilitiesList.map((fac) =>
        fac.id === activeFacilityId ? { ...fac, speciesList: updatedSpeciesList } : fac
      );

      setAppState((prev) => ({
        ...prev,
        facilitiesList: updatedFacilitiesList,
        speciesList: updatedSpeciesList,
      }));
    } else {
      // Add new species logbook
      const newSpeciesObj = {
        id: 'species_' + Date.now(),
        vietnameseName,
        scientificName,
        group,
        citesAppendix,
        purposeCode,
        baseline: newBaseline,
        fluctuations: [],
      };

      updatedSpeciesList = [...speciesList, newSpeciesObj];

      const updatedFacilitiesList = facilitiesList.map((fac) =>
        fac.id === activeFacilityId ? { ...fac, speciesList: updatedSpeciesList } : fac
      );

      setAppState((prev) => ({
        ...prev,
        facilitiesList: updatedFacilitiesList,
        speciesList: updatedSpeciesList,
        activeSpeciesId: newSpeciesObj.id,
      }));
    }

    setEditingSpecies(null);
  };

  // Handler: Open Add Facility Modal
  const handleOpenAddFacility = () => {
    setEditingFacility(null);
    setIsFacilityModalOpen(true);
  };

  // Handler: Open Edit Facility Modal
  const handleOpenEditFacility = () => {
    setEditingFacility(facilityInfo);
    setIsFacilityModalOpen(true);
  };

  // Handler: Save Facility Info (Add new or Edit existing)
  const handleSaveFacility = (formData) => {
    if (editingFacility && editingFacility.id) {
      // Edit existing facility
      const updatedFacilitiesList = facilitiesList.map((fac) =>
        fac.id === editingFacility.id ? { ...fac, ...formData } : fac
      );

      const isCurrentActive = activeFacilityId === editingFacility.id;
      const updatedFacilityInfo = isCurrentActive ? { ...facilityInfo, ...formData } : facilityInfo;

      setAppState((prev) => ({
        ...prev,
        facilitiesList: updatedFacilitiesList,
        facilityInfo: updatedFacilityInfo,
      }));
    } else {
      // Create new facility
      const newFacilityId = 'fac_' + Date.now();
      const defaultSpeciesList = [
        {
          id: 'sp_' + Date.now() + '_1',
          vietnameseName: formData.initialSpeciesName || 'Cầy vòi Hương',
          scientificName: formData.initialScientificName || 'Paradoxurus hermaphroditus',
          group: formData.initialGroup || 'Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)',
          citesAppendix: formData.initialCites || 'Phụ lục II CITES',
          purposeCode: formData.purposeCode || 'T',
          baseline: {
            date: formData.registrationDate || new Date().toISOString().split('T')[0],
            father: Number(formData.father) || 0,
            mother: Number(formData.mother) || 0,
            otherMale: Number(formData.otherMale) || 0,
            otherFemale: Number(formData.otherFemale) || 0,
            otherUnknown: Number(formData.otherUnknown) || 0,
            note: 'Hiện trạng đăng ký ban đầu',
            verifier: 'Hạt Kiểm lâm Huyện Krông Bông',
          },
          fluctuations: [],
        },
      ];

      const newFacilityObj = {
        id: newFacilityId,
        facilityName: formData.facilityName || 'Cơ sở nuôi mới',
        ownerName: formData.ownerName || 'Chủ cơ sở',
        registrationCode: formData.registrationCode || 'Chưa có mã số',
        registrationDate: formData.registrationDate || new Date().toISOString().split('T')[0],
        commune: formData.commune || 'xã Hòa Sơn',
        address: formData.address || '',
        phone: formData.phone || '',
        purposeCode: formData.purposeCode || 'T',
        note: formData.note || '',
        lat: formData.lat || '',
        lng: formData.lng || '',
        speciesList: defaultSpeciesList,
      };

      const updatedFacilitiesList = [newFacilityObj, ...facilitiesList];

      setAppState((prev) => ({
        ...prev,
        facilitiesList: updatedFacilitiesList,
        activeFacilityId: newFacilityId,
        facilityInfo: newFacilityObj,
        speciesList: defaultSpeciesList,
        activeSpeciesId: defaultSpeciesList[0].id,
      }));
    }
    setEditingFacility(null);
  };

  const handleDeleteFacility = async (facilityId) => {
    try {
      // 1. Delete the facility document from Firestore
      await deleteFacilityFromCloud(facilityId);

      // 2. Delete any users associated with this facility from Firestore 'users' collection
      const userSnapshot = await getDocs(query(collection(db, "users"), where("facilityId", "==", facilityId)));
      const batch = writeBatch(db);
      userSnapshot.forEach((userDoc) => {
        batch.delete(userDoc.ref);
      });
      await batch.commit();

      // 3. Update local state
      const updatedFacilitiesList = facilitiesList.filter(f => f.id !== facilityId);
      let nextActiveId = activeFacilityId;
      let nextFacilityInfo = facilityInfo;
      let nextSpeciesList = speciesList;
      let nextActiveSpeciesId = activeSpeciesId;

      if (activeFacilityId === facilityId) {
        const fallbackFac = updatedFacilitiesList[0];
        nextActiveId = fallbackFac ? fallbackFac.id : '';
        nextFacilityInfo = fallbackFac ? {
          id: fallbackFac.id,
          facilityName: fallbackFac.facilityName,
          ownerName: fallbackFac.ownerName,
          registrationCode: fallbackFac.registrationCode,
          registrationDate: fallbackFac.registrationDate,
          commune: fallbackFac.commune || 'xã Hòa Sơn',
          address: fallbackFac.address,
          phone: fallbackFac.phone,
          purposeCode: fallbackFac.purposeCode,
          note: fallbackFac.note,
          lat: fallbackFac.lat || '',
          lng: fallbackFac.lng || '',
        } : null;
        nextSpeciesList = fallbackFac?.speciesList || [];
        nextActiveSpeciesId = fallbackFac?.speciesList?.[0]?.id || null;
      }

      setAppState((prev) => ({
        ...prev,
        facilitiesList: updatedFacilitiesList,
        activeFacilityId: nextActiveId,
        facilityInfo: nextFacilityInfo,
        speciesList: nextSpeciesList,
        activeSpeciesId: nextActiveSpeciesId
      }));

      alert("✅ Đã xóa cơ sở nuôi và các tài khoản liên kết thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa cơ sở:", err);
      alert("Lỗi khi xóa cơ sở: " + err.message);
    }
  };

  // Handler: Import Data (JSON or Excel)
  const handleImportData = (parsedData) => {
    const facilities = parsedData.facilitiesList || (parsedData.speciesList ? [
      {
        id: 'fac_custom_' + Date.now(),
        facilityName: parsedData.facilityInfo?.facilityName || 'Cơ sở nuôi mới',
        ownerName: parsedData.facilityInfo?.ownerName || 'Chủ cơ sở',
        registrationCode: parsedData.facilityInfo?.registrationCode || '',
        address: parsedData.facilityInfo?.address || '',
        phone: parsedData.facilityInfo?.phone || '',
        purposeCode: parsedData.facilityInfo?.purposeCode || 'T',
        speciesList: parsedData.speciesList || [],
      }
    ] : []);

    const activeFac = facilities[0];

    setAppState({
      facilitiesList: facilities,
      activeFacilityId: activeFac?.id || null,
      facilityInfo: activeFac ? {
        id: activeFac.id,
        facilityName: activeFac.facilityName,
        ownerName: activeFac.ownerName,
        registrationCode: activeFac.registrationCode,
        address: activeFac.address,
        phone: activeFac.phone,
        purposeCode: activeFac.purposeCode,
      } : { ...EMPTY_FACILITY_INFO },
      speciesList: activeFac?.speciesList || [],
      activeSpeciesId: activeFac?.speciesList?.[0]?.id || null,
    });
  };

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Export Excel
  const handleExportExcelClick = () => {
    if (currentUser?.role === 'ADMIN' || currentUser?.role === 'STAFF') {
      // Admin và Cán bộ (dlc-krb) có quyền mở modal xuất báo cáo tổng hợp mẫu (Toàn huyện / 5 Xã)
      setIsExportModalOpen(true);
    } else {
      // Cơ sở nuôi chỉ xuất sổ ghi chép Mẫu II của chính cơ sở đó
      const userFac =
        facilitiesList.find(
          (f) => (currentUser?.assignedFacilityIds || []).includes(f.id) || f.ownerName === currentUser?.username
        ) ||
        facilitiesList.find((f) => f.id === activeFacilityId) ||
        facilitiesList[0];

      if (userFac) {
        exportFacilityLogbook(userFac);
      } else {
        alert('Không tìm thấy dữ liệu cơ sở nuôi của bạn.');
      }
    }
  };

  const handleExportExecute = async (selectedCommune) => {
    await exportDistrictReport(facilitiesList, selectedCommune);
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium animate-pulse">Đang kiểm tra hệ thống...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLoginSuccess={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white pb-16 lg:pb-0">
      {/* <DesktopAppHeader
        onToggleFullscreen={handleToggleFullscreen}
        isFullscreen={isFullscreen}
        density={density}
        onChangeDensity={setDensity}
        onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
        onOpenUISettings={() => setIsUISettingsModalOpen(true)}
      /> */}

      {/* Main Flex Wrapper with Fixed Left Sidebar + Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Left Sidebar Column (Desktop Vertical Tools Menu) */}
        <div className="hidden lg:block">
          <LeftSidebar
            currentView={currentView}
            onChangeView={setCurrentView}
            facilitiesCount={facilitiesList.length}
            onOpenAddFluctuation={() => {
              setEditingFluctuation(null);
              setIsFluctuationModalOpen(true);
            }}
            onOpenAddFacility={handleOpenAddFacility}
            onExportExcel={handleExportExcelClick}
            onOpenPrintView={() => setIsPrintViewOpen(true)}
            onOpenBackupModal={() => setIsBackupModalOpen(true)}
            onOpenUISettings={() => setIsUISettingsModalOpen(true)}
            activeSpecies={activeSpecies}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        </div>

        {/* Right Main Workspace Column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header Bar */}
          <Header
            facilitiesList={facilitiesList}
            activeFacilityId={activeFacilityId}
            onSelectFacility={handleSelectFacility}
            facilityInfo={facilityInfo}
            speciesList={speciesList}
            activeSpecies={activeSpecies}
            onSelectSpecies={handleSelectSpecies}
            onOpenAddSpecies={() => {
              setEditingSpecies(null);
              setIsSpeciesModalOpen(true);
            }}
            onOpenEditSpecies={() => {
              setEditingSpecies(activeSpecies);
              setIsSpeciesModalOpen(true);
            }}
            onOpenAddFacility={handleOpenAddFacility}
            onOpenEditFacility={handleOpenEditFacility}
            onExportExcel={handleExportExcelClick}
            onOpenPrintView={() => setIsPrintViewOpen(true)}
            onOpenBackupModal={() => setIsBackupModalOpen(true)}
            onOpenUISettings={() => setIsUISettingsModalOpen(true)}
            currentView={currentView}
            onChangeView={setCurrentView}
            currentUser={currentUser}
            pendingRequestsCount={pendingRequests.length}
            onOpenPendingModal={() => setIsPendingModalOpen(true)}
            onLogout={handleLogout}
          />

            {/* Main Content Area */}
            <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
              {/* Show Video Banner ONLY on Home view */}
              {currentView === 'HOME' && (
                <div className="mb-5 animate-in fade-in slide-in-from-top-4 duration-500 rounded-2xl overflow-hidden border border-emerald-500/30 shadow-lg bg-slate-900 h-[260px] sm:h-[340px] md:h-[390px] lg:h-[430px] relative flex items-center justify-center">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="./images/banner.jpg"
                    className="w-full h-full object-cover object-center block rounded-2xl"
                  >
                    <source src="./banner.mp4" type="video/mp4" />
                    <source src="./images/banner.mp4" type="video/mp4" />
                    <img
                      src="./images/banner.jpg"
                      alt="Hạt Kiểm lâm khu vực Krông Bông - Banner Quản lý cơ sở nuôi động vật hoang dã"
                      className="w-full h-full object-cover object-center block rounded-2xl"
                    />
                  </video>
                </div>
              )}

              {currentView === 'ADMIN_USERS' && currentUser?.role === 'ADMIN' ? (
                <AdminDashboard facilitiesList={facilitiesList} onApproveRequest={handleApproveRequest} onDeleteFacility={handleDeleteFacility} />
              ) : currentView === 'HOME' ? (
                <AnalyticsView facilitiesList={facilitiesList} />
            ) : currentView === 'SUMMARY' ? (
              <SummaryView
                currentUser={currentUser}
                facilitiesList={facilitiesList}
                activeFacilityId={activeFacilityId}
                onSelectFacility={(facId) => {
                  handleSelectFacility(facId);
                  setCurrentView('LOGBOOK');
                }}
                onOpenAddFacility={handleOpenAddFacility}
                onOpenMapFacility={(facId) => {
                  setTargetFacilityId(facId);
                  setCurrentView('MAP');
                }}
                onDeleteFacility={handleDeleteFacility}
              />
            ) : currentView === 'MAP' ? (
              <MapView
                facilitiesList={facilitiesList}
                activeFacilityId={activeFacilityId}
                targetFacilityId={targetFacilityId}
                onSelectFacility={(facId) => {
                  handleSelectFacility(facId);
                  setCurrentView('LOGBOOK');
                }}
                onUpdateFacilityCoords={(facId, newLat, newLng) => {
                  const updatedFacilitiesList = facilitiesList.map((fac) =>
                    fac.id === facId ? { ...fac, lat: newLat, lng: newLng } : fac
                  );
                  setAppState((prev) => ({
                    ...prev,
                    facilitiesList: updatedFacilitiesList,
                    facilityInfo:
                      prev.facilityInfo?.id === facId
                        ? { ...prev.facilityInfo, lat: newLat, lng: newLng }
                        : prev.facilityInfo,
                  }));
                }}
              />
            ) : (
              <TableView
                rows={rows}
                species={activeSpecies}
                facilityInfo={facilityInfo}
                onEditRow={(row) => {
                  const rawFluctuation = activeSpecies?.fluctuations?.find((item) => item.id === row.rowId);
                  if (rawFluctuation) {
                    setEditingFluctuation(rawFluctuation);
                    setIsFluctuationModalOpen(true);
                  }
                }}
                onDeleteRow={handleDeleteFluctuation}
                onEditBaseline={() => {
                  setEditingSpecies(activeSpecies);
                  setIsSpeciesModalOpen(true);
                }}
                onOpenAddSpecies={() => {
                  setEditingSpecies(null);
                  setIsSpeciesModalOpen(true);
                }}
                onOpenAddFacility={handleOpenAddFacility}
                onOpenEditFacility={handleOpenEditFacility}
                onOpenBackupModal={() => setIsBackupModalOpen(true)}
                onApprovePending={handleApprovePending}
                onRejectPending={handleRejectPending}
                currentUser={currentUser}
              />
            )}
          </main>

          {/* App Footer */}
          <footer className="bg-white border-t border-slate-200/80 py-3 text-center text-xs text-slate-600 no-print shadow-2xs mb-12 lg:mb-0 mt-auto">
            <div className="max-w-7xl mx-auto px-4 space-y-1">
              <p className="text-xs text-emerald-800 font-extrabold">
                © Hạt Kiểm lâm khu vực Krông Bông
              </p>
              <p className="font-semibold text-slate-800 text-xs">
                Ứng dụng sổ theo dõi quản lý động vật hoang dã điện tử - Nuôi sinh sản
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Sử dụng và lưu hành trong phạm vi quản lý của đơn vị.
              </p>
            </div>
          </footer>
        </div>
      </div>


      {/* Smart Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentView={currentView}
        onChangeView={setCurrentView}
        onOpenAddFluctuation={() => {
          setEditingFluctuation(null);
          setIsFluctuationModalOpen(true);
        }}
        facilityCount={facilitiesList.length}
        currentUser={currentUser}
        onExportExcel={handleExportExcelClick}
      />

      {isExportModalOpen && (
        <ExportModal
          onClose={() => setIsExportModalOpen(false)}
          onExport={handleExportExecute}
        />
      )}

      <PendingApprovalsModal
        isOpen={isPendingModalOpen}
        onClose={() => setIsPendingModalOpen(false)}
        pendingRequests={pendingRequests}
        onApprove={handleApprovePending}
        onReject={handleRejectPending}
      />

      {/* Settings Modals */}
      <UISettingsModal
        isOpen={isUISettingsModalOpen}
        onClose={() => setIsUISettingsModalOpen(false)}
        uiSettings={uiSettings}
        onUpdateSettings={setUiSettings}
        onResetSettings={() => setUiSettings(DEFAULT_UI_SETTINGS)}
      />

      <DesktopShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />


      <FluctuationModal
        isOpen={isFluctuationModalOpen}
        onClose={() => setIsFluctuationModalOpen(false)}
        onSave={handleSaveFluctuation}
        editData={editingFluctuation}
        facilitiesList={facilitiesList}
        activeFacilityId={activeFacilityId}
        species={activeSpecies}
        lastRowState={rows[rows.length - 1]}
      />

      <SpeciesModal
        isOpen={isSpeciesModalOpen}
        onClose={() => setIsSpeciesModalOpen(false)}
        onSave={handleSaveSpecies}
        editSpecies={editingSpecies}
      />

      <FacilityModal
        isOpen={isFacilityModalOpen}
        onClose={() => setIsFacilityModalOpen(false)}
        onSave={handleSaveFacility}
        editFacility={editingFacility}
      />

      <ExportImportModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        appData={appState}
        onImportData={handleImportData}
        onClearData={handleClearAllData}
        onResetDemoData={handleResetDemo}
      />

      <PrintView
        isOpen={isPrintViewOpen}
        onClose={() => setIsPrintViewOpen(false)}
        species={activeSpecies}
        rows={rows}
        facilityInfo={facilityInfo}
      />

      {/* PWA Installation Floating Banner */}
      <PWAInstallPrompt />
    </div>
  );
}



