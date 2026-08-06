import React from 'react';
import { Settings, Edit3, FolderPlus, Table, LayoutList, BarChart3, MapPin, Building2, Download, Printer, Database } from 'lucide-react';
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
  onOpenEditFacility,
  onExportExcel,
  onOpenPrintView,
  onOpenBackupModal,
  onOpenUISettings,
  currentView = 'SUMMARY', // 'LOGBOOK' | 'SUMMARY' | 'ANALYTICS' | 'MAP'
  onChangeView,
}) {
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
      case 'ANALYTICS':
        return { title: 'Biểu Đồ Thống Kê Tổng Quan', icon: BarChart3, color: 'text-indigo-700' };
      case 'MAP':
        return { title: 'Bản Đồ Định Vị GIS Cơ Sở Nuôi (Google Hybrid)', icon: MapPin, color: 'text-rose-600' };
      default:
        return { title: 'Sổ Theo Dõi Động Vật Hoang Dã', icon: Table, color: 'text-emerald-700' };
    }
  };

  const activeViewObj = getViewTitle();
  const IconComponent = activeViewObj.icon;

  return (
    <header className="bg-white/95 backdrop-blur-md text-slate-800 shadow-2xs border-b border-slate-200/80 sticky top-0 z-10 transition-colors">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Top View Header Title & Quick View Badges for Mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 border border-emerald-200/80 rounded-lg text-emerald-700 shadow-2xs">
              <IconComponent className={`w-5 h-5 ${activeViewObj.color}`} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>{activeViewObj.title}</span>
                <span className="text-[10px] bg-emerald-100/90 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded-full">
                  TT 85/2025/TT-BNNMT
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Ứng dụng tự động tính toán hiện trạng & biến động tăng giảm đàn theo Thông tư số 85/2025/TT-BNNMT
              </p>
            </div>
          </div>

          {/* Quick Tools & View Bar for Mobile Devices */}
          <div className="flex lg:hidden items-center justify-between gap-1.5 overflow-x-auto pb-1">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                onClick={() => onChangeView && onChangeView('LOGBOOK')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                  currentView === 'LOGBOOK' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Sổ Mẫu II
              </button>
              <button
                onClick={() => onChangeView && onChangeView('SUMMARY')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                  currentView === 'SUMMARY' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Tổng hợp ({facilitiesList.length})
              </button>
              <button
                onClick={() => onChangeView && onChangeView('ANALYTICS')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                  currentView === 'ANALYTICS' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Thống kê
              </button>
              <button
                onClick={() => onChangeView && onChangeView('MAP')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                  currentView === 'MAP' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Bản đồ
              </button>
            </div>

            {/* Quick Action Icons for Mobile */}
            <div className="flex items-center gap-1">
              <button
                onClick={onExportExcel}
                className="p-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold shadow-xs active:scale-95"
                title="Xuất Excel"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenPrintView}
                className="p-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold shadow-xs active:scale-95"
                title="In Sổ A4"
              >
                <Printer className="w-4 h-4" />
              </button>
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

        {/* Facility Info Card & Species Tabs */}
        {currentView === 'LOGBOOK' && (
          <div className="mt-2.5 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            {/* Facility Selector Dropdown & Details */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center justify-between shadow-2xs">
              <div className="min-w-0 pr-2 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider whitespace-nowrap">Chủ cơ sở:</span>
                  <select
                    value={activeFacilityId || ''}
                    onChange={(e) => onSelectFacility && onSelectFacility(e.target.value)}
                    className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-900 font-bold w-full focus:outline-none focus:border-emerald-500 cursor-pointer shadow-2xs"
                  >
                    {['xã Hòa Sơn', 'xã Yang Mao', 'xã Cư Pui', 'Xã Krông Bông', 'Xã Dang Kang'].map((communeName) => {
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
                    })}
                  </select>
                </div>
                <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-3 gap-y-0.5 truncate pl-6">
                  <span>Mã số: <strong className="text-slate-800 font-semibold">{facilityInfo.registrationCode}</strong></span>
                  <span>Địa chỉ: <strong className="text-slate-800 font-semibold truncate">{facilityInfo.address}</strong></span>
                </div>
              </div>
              <button
                onClick={onOpenEditFacility}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors flex-shrink-0 ml-1"
                title="Chỉnh sửa thông tin cơ sở"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* Species Tabs */}
            <div className="lg:col-span-7 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
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
