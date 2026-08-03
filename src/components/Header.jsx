import React from 'react';
import { Plus, Download, Printer, Settings, Database, Edit3, ShieldAlert, FolderPlus, Building2, Table, LayoutList, BarChart3, MapPin, Navigation } from 'lucide-react';
import { PURPOSE_CODES } from '../utils/calculations';

export default function Header({
  facilitiesList = [],
  activeFacilityId,
  onSelectFacility,
  facilityInfo,
  speciesList,
  activeSpecies,
  onSelectSpecies,
  onOpenAddFluctuation,
  onOpenAddSpecies,
  onOpenEditSpecies,
  onOpenEditFacility,
  onExportExcel,
  onOpenPrintView,
  onOpenBackupModal,
  onOpenUISettings,
  currentView = 'LOGBOOK', // 'LOGBOOK' | 'SUMMARY' | 'ANALYTICS' | 'MAP'
  onChangeView,
}) {

  const currentPurpose = PURPOSE_CODES.find((p) => p.code === activeSpecies?.purposeCode) || {
    code: 'T',
    name: 'Thương mại',
  };

  return (
    <header className="bg-white/95 backdrop-blur-md text-slate-800 shadow-sm border-b border-slate-200/80 sticky top-0 z-30 transition-colors">
      {/* Top Banner */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 border border-emerald-200/80 rounded-xl text-emerald-600 shadow-sm">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                  SỔ THEO DÕI ĐỘNG VẬT HOANG DÃ
                  <span className="text-xs bg-emerald-100/80 text-emerald-800 border border-emerald-200 font-semibold px-2.5 py-0.5 rounded-full">
                    Mẫu II - Nuôi Sinh Sản
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Ứng dụng tự động tính toán hiện trạng & biến động tăng giảm đàn theo Thông tư Kiểm lâm
              </p>
            </div>
          </div>

          {/* Navigation View Tabs & Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 mr-2 shadow-inner">
              <button
                onClick={() => onChangeView && onChangeView('LOGBOOK')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentView === 'LOGBOOK'
                    ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Sổ Mẫu II</span>
              </button>

              <button
                onClick={() => onChangeView && onChangeView('SUMMARY')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentView === 'SUMMARY'
                    ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>Bảng Tổng Hợp ({facilitiesList.length} CS)</span>
              </button>

              <button
                onClick={() => onChangeView && onChangeView('ANALYTICS')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentView === 'ANALYTICS'
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Biểu Đồ Thống Kê</span>
              </button>

              <button
                onClick={() => onChangeView && onChangeView('MAP')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentView === 'MAP'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>Bản Đồ GIS (Google Hybrid)</span>
              </button>
            </div>



            {currentView === 'LOGBOOK' && (
              <>
                <button
                  onClick={onOpenAddFluctuation}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg font-semibold text-xs shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Biến Động</span>
                </button>

                <button
                  onClick={onExportExcel}
                  className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-emerald-700 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
                  title="Xuất file Excel chuẩn 19 cột"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Xuất Excel</span>
                </button>

                <button
                  onClick={onOpenPrintView}
                  className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
                  title="Xem bản in khổ A4 ngang"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">In Sổ (A4)</span>
                </button>
              </>
            )}

            <button
              onClick={onOpenBackupModal}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
              title="Quản lý & Nhập/Xuất Dữ Liệu Excel / JSON"
            >
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline">Nhập/Xuất dữ liệu</span>
            </button>

            <button
              onClick={onOpenUISettings}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
              title="Cài đặt giao diện làm việc, màu sắc, cỡ chữ & mật độ bảng"
            >
              <Settings className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">Cài đặt giao diện</span>
            </button>

          </div>
        </div>

        {/* Facility Info Card & Species Tabs */}
        {currentView === 'LOGBOOK' && (
          <div className="mt-3 pt-3 border-t border-slate-200/80 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Facility Selector Dropdown & Details */}
            <div className="lg:col-span-5 bg-slate-50/90 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between shadow-inner">
              <div className="min-w-0 pr-2 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider whitespace-nowrap">Chủ cơ sở:</span>
                  <select
                    value={activeFacilityId || ''}
                    onChange={(e) => onSelectFacility && onSelectFacility(e.target.value)}
                    className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-900 font-bold w-full focus:outline-none focus:border-emerald-500 cursor-pointer shadow-sm"
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
                <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-3 gap-y-0.5 truncate">
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
          <div className="mt-2.5 bg-emerald-50/80 border border-emerald-200/80 rounded-xl px-4 py-1.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-slate-700 font-medium">
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




