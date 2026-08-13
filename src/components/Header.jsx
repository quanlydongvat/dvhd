import React from 'react';
import { Settings, Edit3, FolderPlus, Table, LayoutList, BarChart3, MapPin, Building2, Download, Printer, Database, PlusCircle, Bell, LogOut } from 'lucide-react';
import { PURPOSE_CODES } from '../utils/calculations';

export default function Header({
  facilitiesList = [],
  activeFacilityId,
  onSelectFacility,
  facilityInfo = {},
  speciesList = [],
  activeSpecies,
  onSelectSpecies,
  onOpenAddSpecies,
  onOpenEditSpecies,
  onOpenAddFacility,
  onOpenEditFacility,
  onExportExcel,
  onOpenPrintView,
  onOpenBackupModal,
  onOpenUISettings,
  currentView = 'SUMMARY', // 'LOGBOOK' | 'SUMMARY' | 'HOME' | 'MAP'
  onChangeView,
  currentUser,
  pendingRequestsCount = 0,
  onOpenPendingModal,
  onLogout,
}) {
  const COMMUNES = ['xã Hòa Sơn', 'xã Yang Mao', 'xã Cư Pui', 'Xã Krông Bông', 'Xã Dang Kang'];

  // 2-Level Hierarchical Selection State: Selected Commune
  const [selectedCommune, setSelectedCommune] = React.useState('ALL');

  // Sync selectedCommune with active facility's commune if user switched facility externally
  React.useEffect(() => {
    if (facilityInfo && facilityInfo.commune && selectedCommune !== 'ALL') {
      if (facilityInfo.commune !== selectedCommune) {
        setSelectedCommune(facilityInfo.commune);
      }
    }
  }, [facilityInfo]);

  // Filter facilities for 2nd Level Dropdown
  const filteredFacilitiesByCommune = React.useMemo(() => {
    if (selectedCommune === 'ALL') return facilitiesList;
    return facilitiesList.filter((f) => (f.commune || '') === selectedCommune);
  }, [facilitiesList, selectedCommune]);

  // Handle Level 1 Commune selection
  const handleCommuneChange = (newCommune) => {
    setSelectedCommune(newCommune);
    if (newCommune !== 'ALL') {
      const matchInCommune = facilitiesList.filter((f) => (f.commune || '') === newCommune);
      if (matchInCommune.length > 0 && onSelectFacility) {
        onSelectFacility(matchInCommune[0].id);
      }
    }
  };

  const currentPurpose = PURPOSE_CODES.find((p) => p.code === activeSpecies?.purposeCode) || {
    code: 'T',
    name: 'Thương mại',
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'LOGBOOK':
        return { title: 'Sổ Theo Dõi Chi Tiết (Mẫu II)', icon: Table, color: 'text-emerald-700' };
      case 'SUMMARY':
        return { title: `Bảng Tổng Hợp Tất Cả Cơ Sở (${facilitiesList.length} CS)`, icon: LayoutList, color: 'text-teal-700' };
      case 'HOME':
        return { title: 'Trang Chủ & Thống Kê Tổng Quan', icon: BarChart3, color: 'text-amber-600' };
      case 'MAP':
        return { title: 'Bản Đồ Định Vị GIS Cơ Sở Nuôi (Google Hybrid)', icon: MapPin, color: 'text-rose-600' };
      default:
        return { title: 'Sổ Theo Dõi Động Vật Hoang Dã', icon: Table, color: 'text-emerald-700' };
    }
  };

  const activeViewObj = getViewTitle();
  const IconComponent = activeViewObj.icon;

  return (
    <header className="bg-white/95 backdrop-blur-md text-slate-800 shadow-2xs border-b border-slate-300 sticky top-0 z-10 transition-colors">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Top View Header Title & Quick View Badges for Mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-700 shadow-2xs">
                <IconComponent className={`w-5 h-5 ${activeViewObj.color}`} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>{activeViewObj.title}</span>
                  <span className="text-[10px] bg-emerald-100/90 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded-full">
                    TT 85/2025/TT-BNNMT
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Ứng dụng tự động tính toán hiện trạng & biến động tăng giảm đàn theo Thông tư số 85/2025/TT-BNNMT
                </p>
              </div>
            </div>

            {/* Top Right Action Group: Notification Bell & Mobile Logout Button */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {(currentUser?.role === 'ADMIN' || currentUser?.role === 'STAFF') && (
                <button
                  type="button"
                  onClick={onOpenPendingModal}
                  className={`relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-2xl text-xs font-black transition-all cursor-pointer border ${
                    pendingRequestsCount > 0
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-400 shadow-md shadow-amber-500/20 animate-pulse hover:scale-105'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                  }`}
                  title="Xem danh sách biến động đang chờ duyệt"
                >
                  <Bell className={`w-4 h-4 ${pendingRequestsCount > 0 ? 'animate-bounce text-white' : 'text-slate-600'}`} />
                  <span className="hidden sm:inline">Chờ duyệt</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold ${
                    pendingRequestsCount > 0
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {pendingRequestsCount}
                  </span>
                </button>
              )}

              {/* Logout Button on Header (Visible on Mobile & Desktop) */}
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/90 rounded-2xl text-xs font-black transition-all cursor-pointer active:scale-95 shadow-2xs"
                  title="Đăng xuất khỏi hệ thống"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span className="text-[11px] sm:text-xs">Đăng xuất</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Tools & View Bar for Mobile Devices */}
          <div className="flex lg:hidden items-center justify-between gap-1.5 overflow-x-auto pb-1">
            <div className="flex items-center gap-1 bg-emerald-950/5 p-1 rounded-2xl border border-emerald-900/10">
              <button
                type="button"
                onClick={() => onChangeView && onChangeView('HOME')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                  currentView === 'HOME' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                Trang chủ
              </button>
              <button
                type="button"
                onClick={() => onChangeView && onChangeView('SUMMARY')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                  currentView === 'SUMMARY' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                Tổng hợp ({facilitiesList.length})
              </button>
              <button
                type="button"
                onClick={() => onChangeView && onChangeView('LOGBOOK')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                  currentView === 'LOGBOOK' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                Sổ Mẫu II
              </button>
              <button
                type="button"
                onClick={() => onChangeView && onChangeView('MAP')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                  currentView === 'MAP' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                Bản đồ
              </button>
            </div>

            {/* Quick Action Icons for Mobile */}
            <div className="flex items-center gap-1">
              {currentUser?.role === 'ADMIN' && (
                <>
                  <button
                    onClick={onExportExcel}
                    className="p-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold shadow-xs active:scale-95"
                    title="Xuất Báo Cáo Tổng Hợp"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                onClick={onOpenBackupModal}
                className="p-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold shadow-xs active:scale-95"
                title="Sao lưu dữ liệu"
              >
                <Database className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2-Level Hierarchical Facility Info Card & Species Tabs */}
        {currentView === 'LOGBOOK' && (
          <div className="mt-2.5 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            {/* 2-Level Facility Selector (Level 1: Xã -> Level 2: Chủ cơ sở) */}
            <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs">
              <div className="min-w-0 flex-1 w-full space-y-1.5">
                {/* Level 1 (Xã) & Level 2 (Chủ CS) Grid Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 items-center">
                  {/* Level 1: Select Commune */}
                  <div className="sm:col-span-5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                    <span className="text-[11px] font-extrabold text-emerald-900 uppercase tracking-wider whitespace-nowrap">Xã:</span>
                    <select
                      value={selectedCommune}
                      onChange={(e) => handleCommuneChange(e.target.value)}
                      className="bg-white border border-slate-300 rounded-lg px-1.5 py-1 text-xs text-slate-900 font-bold focus:outline-none focus:border-emerald-500 cursor-pointer shadow-2xs w-full truncate"
                    >
                      <option value="ALL">📍 Tất cả 5 Xã ({facilitiesList.length} CS)</option>
                      {COMMUNES.map((c) => {
                        const count = facilitiesList.filter((f) => (f.commune || '') === c).length;
                        if (count === 0) return null;
                        return (
                          <option key={c} value={c}>
                            📍 {c} ({count} CS)
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Level 2: Select Owner / Facility */}
                  <div className="sm:col-span-7 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                    <span className="text-[11px] font-extrabold text-emerald-900 uppercase tracking-wider whitespace-nowrap">Chủ CS:</span>
                    <select
                      value={activeFacilityId || ''}
                      onChange={(e) => onSelectFacility && onSelectFacility(e.target.value)}
                      className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-900 font-bold w-full focus:outline-none focus:border-emerald-500 cursor-pointer shadow-2xs truncate"
                    >
                      {selectedCommune === 'ALL' ? (
                        COMMUNES.map((communeName) => {
                          const communeFacs = facilitiesList.filter((f) => (f.commune || '') === communeName);
                          if (communeFacs.length === 0) return null;
                          return (
                            <optgroup key={communeName} label={`📍 ${communeName} (${communeFacs.length} CS)`}>
                              {communeFacs.map((fac) => (
                                <option key={fac.id} value={fac.id}>
                                  {fac.ownerName} - {fac.speciesList.map((s) => s.vietnameseName).join(', ')} ({fac.registrationCode || 'Chưa mã số'})
                                </option>
                              ))}
                            </optgroup>
                          );
                        })
                      ) : (
                        filteredFacilitiesByCommune.map((fac) => (
                          <option key={fac.id} value={fac.id}>
                            {fac.ownerName} - {fac.speciesList.map((s) => s.vietnameseName).join(', ')} ({fac.registrationCode || 'Chưa mã số'})
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {/* Sub-Details: Code & Address */}
                <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-0.5 truncate pl-1 pt-0.5 border-t border-slate-200/60">
                  <span>Mã số: <strong className="text-slate-800 font-semibold">{facilityInfo.registrationCode || 'Chưa có'}</strong></span>
                  <span>Địa chỉ: <strong className="text-slate-800 font-semibold truncate">{facilityInfo.address || 'Chưa cập nhật'}</strong></span>
                </div>
              </div>

              {/* Action Buttons: Add / Edit Facility */}
              <div className="flex items-center gap-1.5 flex-shrink-0 self-start sm:self-center">
                <button
                  onClick={onOpenAddFacility}
                  className="flex items-center gap-1 text-[11px] font-extrabold bg-emerald-100/90 hover:bg-emerald-200 text-emerald-950 border border-emerald-300/90 px-2.5 py-1.5 rounded-xl transition-all shadow-2xs cursor-pointer whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]"
                  title="Thêm cơ sở nuôi sinh sản mới"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-700" />
                  <span>+ CS mới</span>
                </button>
                <button
                  onClick={onOpenEditFacility}
                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/80 rounded-xl transition-colors"
                  title="Chỉnh sửa thông tin cơ sở đang chọn"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Species Tabs */}
            <div className="lg:col-span-6 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              <div className="flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200/80 w-full overflow-x-auto">
                {speciesList.map((sp) => {
                  const isActive = sp.id === activeSpecies?.id;
                  return (
                    <button
                      key={sp.id}
                      onClick={() => onSelectSpecies(sp.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md font-bold'
                          : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                      }`}
                    >
                      <span>{sp.vietnameseName}</span>
                      {isActive && (
                        <span className="text-[10px] bg-emerald-700 px-1.5 py-0.5 rounded text-emerald-50 font-mono">
                          {sp.scientificName}
                        </span>
                      )}
                    </button>
                  );
                })}

                <button
                  onClick={onOpenAddSpecies}
                  className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-dashed border-emerald-400 whitespace-nowrap transition-colors ml-auto font-medium"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Thêm loài</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Current Active Species Details Bar */}
        {currentView === 'LOGBOOK' && activeSpecies && (
          <div className="mt-2 bg-emerald-50/80 border border-emerald-200/80 rounded-xl px-3.5 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-slate-700 font-medium">
              <div>
                Loài đang chọn: <strong className="text-emerald-800 text-sm font-bold">{activeSpecies.vietnameseName}</strong> (<i>{activeSpecies.scientificName}</i>)
              </div>
              <div>
                Phân loại: <span className="text-slate-900 font-semibold">{activeSpecies.group || 'Chưa phân loại'}</span>
              </div>
              <div>
                Mục đích nuôi: <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 font-semibold">({currentPurpose.code}) {currentPurpose.name}</span>
              </div>
            </div>

            <button
              onClick={onOpenEditSpecies}
              className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold text-xs hover:underline"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Sửa thông tin loài & Dòng A</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
