import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TableView from './components/TableView';
import SummaryView from './components/SummaryView';
import AnalyticsView from './components/AnalyticsView';
import MapView from './components/MapView';
import DesktopAppHeader from './components/DesktopAppHeader';
import DesktopShortcutsModal from './components/DesktopShortcutsModal';
import MobileBottomNav from './components/MobileBottomNav';
import UISettingsModal, { DEFAULT_UI_SETTINGS } from './components/UISettingsModal';
import FluctuationModal from './components/FluctuationModal';

import SpeciesModal from './components/SpeciesModal';
import FacilityModal from './components/FacilityModal';
import ExportImportModal from './components/ExportImportModal';
import PrintView from './components/PrintView';
import { computeLogbookTable } from './utils/calculations';
import { loadAppData, saveAppData, clearAppData, resetToDemoData, REAL_FACILITIES_DATA } from './utils/storage';
import { exportToExcel } from './utils/exportExcel';

export default function App() {
  const [appState, setAppState] = useState(() => loadAppData());
  const [currentView, setCurrentView] = useState('SUMMARY'); // Default to SUMMARY so user immediately sees all facilities!
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


  const { facilitiesList = REAL_FACILITIES_DATA, activeFacilityId, facilityInfo, speciesList = [], activeSpeciesId } = appState;

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
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isPrintViewOpen, setIsPrintViewOpen] = useState(false);

  // Sync state to LocalStorage on change
  useEffect(() => {
    saveAppData(appState);
  }, [appState]);

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
        setCurrentView('ANALYTICS');
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

  // Handler: Save Fluctuation (Add or Edit)
  const handleSaveFluctuation = (formData) => {
    if (!activeSpecies) return;

    let updatedFluctuations = [...(activeSpecies.fluctuations || [])];

    if (editingFluctuation) {
      // Edit existing
      updatedFluctuations = updatedFluctuations.map((item) =>
        item.id === editingFluctuation.id ? { ...item, ...formData } : item
      );
    } else {
      // Add new
      const newItem = {
        id: 'fluc_' + Date.now(),
        ...formData,
        createdAt: Date.now(),
      };
      updatedFluctuations.push(newItem);
    }

    const updatedSpeciesList = speciesList.map((sp) =>
      sp.id === activeSpecies.id ? { ...sp, fluctuations: updatedFluctuations } : sp
    );

    // Also update facilitiesList entry
    const updatedFacilitiesList = facilitiesList.map((fac) =>
      fac.id === activeFacilityId ? { ...fac, speciesList: updatedSpeciesList } : fac
    );

    setAppState((prev) => ({
      ...prev,
      facilitiesList: updatedFacilitiesList,
      speciesList: updatedSpeciesList,
    }));
    setEditingFluctuation(null);
  };

  // Handler: Delete Fluctuation
  const handleDeleteFluctuation = (rowId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nhật ký biến động này không? Tất cả số liệu phía sau sẽ tự động được tính toán lại!')) {
      return;
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

  // Handler: Save Facility Info
  const handleSaveFacility = (formData) => {
    const updatedFacilitiesList = facilitiesList.map((fac) =>
      fac.id === activeFacilityId ? { ...fac, ...formData } : fac
    );

    setAppState((prev) => ({
      ...prev,
      facilitiesList: updatedFacilitiesList,
      facilityInfo: formData,
    }));
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

  // Export Excel
  const handleExportExcel = () => {
    if (!activeSpecies) {
      alert('Vui lòng chọn ít nhất 01 loài nuôi để xuất Excel.');
      return;
    }
    exportToExcel(activeSpecies, rows, facilityInfo);
  };

  return (

    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white pb-16 lg:pb-0">
      {/* Desktop App Header Bar */}
      <DesktopAppHeader
        onToggleFullscreen={handleToggleFullscreen}
        isFullscreen={isFullscreen}
        density={density}
        onChangeDensity={setDensity}
        onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
        onOpenUISettings={() => setIsUISettingsModalOpen(true)}
      />


      {/* Top Header */}
      <Header
        facilitiesList={facilitiesList}
        activeFacilityId={activeFacilityId}
        onSelectFacility={handleSelectFacility}
        facilityInfo={facilityInfo}
        speciesList={speciesList}
        activeSpecies={activeSpecies}
        onSelectSpecies={handleSelectSpecies}
        onOpenAddFluctuation={() => {
          setEditingFluctuation(null);
          setIsFluctuationModalOpen(true);
        }}
        onOpenAddSpecies={() => {
          setEditingSpecies(null);
          setIsSpeciesModalOpen(true);
        }}
        onOpenEditSpecies={() => {
          setEditingSpecies(activeSpecies);
          setIsSpeciesModalOpen(true);
        }}
        onOpenEditFacility={() => setIsFacilityModalOpen(true)}
        onExportExcel={handleExportExcel}
        onOpenPrintView={() => setIsPrintViewOpen(true)}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onOpenUISettings={() => setIsUISettingsModalOpen(true)}
        currentView={currentView}
        onChangeView={setCurrentView}
      />


      {/* Main Content Area */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {currentView === 'SUMMARY' ? (
          <SummaryView
            facilitiesList={facilitiesList}
            activeFacilityId={activeFacilityId}
            onSelectFacility={(facId) => {
              handleSelectFacility(facId);
              setCurrentView('LOGBOOK');
            }}
            onOpenMapFacility={(facId) => {
              setTargetFacilityId(facId);
              setCurrentView('MAP');
            }}
          />

        ) : currentView === 'ANALYTICS' ? (
          <AnalyticsView facilitiesList={facilitiesList} />
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
            onOpenEditFacility={() => setIsFacilityModalOpen(true)}
            onOpenBackupModal={() => setIsBackupModalOpen(true)}
          />
        )}
      </main>

      {/* App Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-4 text-center text-xs text-slate-500 no-print shadow-xs mb-12 lg:mb-0">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-medium">
            Phần mềm Quản lý Sổ theo dõi Động vật Hoang dã (Mẫu II - Nuôi sinh sản) © 2026. Tuân thủ Quy định Kiểm lâm & Thủy sản.
          </p>
        </div>
      </footer>

      {/* Smart Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentView={currentView}
        onChangeView={setCurrentView}
        onOpenAddFluctuation={() => {
          setEditingFluctuation(null);
          setIsFluctuationModalOpen(true);
        }}
        facilityCount={facilitiesList.length}
      />

      {/* Modals */}
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
        facilityInfo={facilityInfo}
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
    </div>
  );
}



