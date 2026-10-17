import React from 'react';
import { Table, LayoutList, BarChart3, MapPin, Download, Database, Bell, LogOut, FileCheck2, Search, Sliders } from 'lucide-react';

export default function Header({
  facilitiesList = [],
  onExportExcel,
  onOpenBackupModal,
  onOpenUISettings,
  currentView = 'SUMMARY', // 'LOGBOOK' | 'SUMMARY' | 'HOME' | 'MAP'
  onChangeView,
  currentUser,
  pendingRequestsCount = 0,
  onOpenPendingModal,
  onLogout,
  onOpenLogin,
  onOpenQuickSearch,
}) {
  const getViewTitle = () => {
    switch (currentView) {
      case 'LOGBOOK':
        return {
          title: 'Sổ Theo Dõi Chi Tiết (Mẫu II)',
          mobileTitle: 'Sổ Mẫu II',
          icon: Table,
          color: 'text-emerald-700'
        };
      case 'SUMMARY':
        return {
          title: `Bảng Tổng Hợp Tất Cả Cơ Sở (${facilitiesList.length} CS)`,
          mobileTitle: `Tổng Hợp (${facilitiesList.length} CS)`,
          icon: LayoutList,
          color: 'text-teal-700'
        };
      case 'HOME':
        return {
          title: 'Trang Chủ & Thống Kê Tổng Quan',
          mobileTitle: 'Trang Chủ',
          icon: BarChart3,
          color: 'text-amber-600'
        };
      case 'MAP':
        return {
          title: 'Bản Đồ Định Vị GIS Cơ Sở Nuôi (Google Hybrid)',
          mobileTitle: 'Bản Đồ GIS',
          icon: MapPin,
          color: 'text-rose-600'
        };
      case 'PACKING_LIST':
        return {
          title: 'Sổ Theo Dõi Xuất Bảng Kê Lâm Sản',
          mobileTitle: 'Sổ Bảng Kê',
          icon: FileCheck2,
          color: 'text-amber-700'
        };
      default:
        return {
          title: 'Sổ Theo Dõi Động Vật Hoang Dã',
          mobileTitle: 'Sổ Động Vật',
          icon: Table,
          color: 'text-emerald-700'
        };
    }
  };

  const activeViewObj = getViewTitle();
  const IconComponent = activeViewObj.icon;

  return (
    <header 
      style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 8px)' }}
      className="bg-white/95 backdrop-blur-md text-slate-800 shadow-2xs border-b border-slate-300 sticky top-0 z-30 transition-all sm:!pt-0"
    >
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
        {/* Top View Header Title & Quick View Badges for Mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 sm:pb-1.5 border-b border-slate-100">
          <div className="flex items-center justify-between w-full sm:w-auto gap-2 sm:gap-3 min-w-0">
            {/* View Title & Icon Block */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="p-1.5 sm:p-2 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-700 shadow-2xs flex-shrink-0">
                <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${activeViewObj.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <h2 className="text-sm sm:text-base lg:text-lg font-black text-slate-900 tracking-tight whitespace-nowrap truncate min-w-0">
                    <span className="sm:hidden">{activeViewObj.mobileTitle}</span>
                    <span className="hidden sm:inline">{activeViewObj.title}</span>
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 font-medium hidden sm:block truncate">
                  Ứng dụng tự động tính toán hiện trạng & biến động tăng giảm đàn theo Thông tư số 85/2025/TT-BNNMT
                </p>
              </div>
            </div>

            {/* Top Right Action Group: Notifications, Quick Search, Login/Logout, Toggle Minimal */}
            <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
              {/* Quick Search Button (Ctrl + K) */}
              <button
                type="button"
                onClick={onOpenQuickSearch}
                className="flex items-center justify-center p-1.5 sm:px-3 sm:py-1.5 bg-slate-100 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl text-xs text-slate-700 hover:text-emerald-900 transition-all cursor-pointer shadow-2xs group"
                title="Tìm kiếm nhanh cơ sở, loài, bảng kê (Phím tắt: Ctrl + K)"
              >
                <Search className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-500 group-hover:text-emerald-600 stroke-[2.2]" />
                <span className="font-extrabold text-[11px] hidden md:inline ml-1.5">Tìm nhanh</span>
                <kbd className="hidden lg:inline-flex items-center text-[9px] font-black font-mono bg-white text-slate-500 px-1.5 py-0.5 rounded border border-slate-300 shadow-2xs ml-1 group-hover:border-emerald-300 group-hover:text-emerald-700">
                  Ctrl K
                </kbd>
              </button>

              {(currentUser?.role === 'ADMIN' || currentUser?.role === 'STAFF') && (
                <button
                  type="button"
                  onClick={onOpenPendingModal}
                  className={`relative flex items-center justify-center p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl sm:rounded-2xl text-xs font-black transition-all cursor-pointer border ${
                    pendingRequestsCount > 0
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-400 shadow-md shadow-amber-500/20 animate-pulse hover:scale-105'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                  }`}
                  title="Xem danh sách biến động đang chờ duyệt"
                >
                  <Bell className={`w-4 h-4 ${pendingRequestsCount > 0 ? 'animate-bounce text-white' : 'text-slate-600'}`} />
                  <span className="hidden sm:inline ml-1">Chờ duyệt</span>
                  {pendingRequestsCount > 0 && (
                    <span className="sm:hidden absolute -top-1 -right-1 bg-red-600 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                      {pendingRequestsCount}
                    </span>
                  )}
                  <span className={`hidden sm:inline-block ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    pendingRequestsCount > 0
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {pendingRequestsCount}
                  </span>
                </button>
              )}

              {/* UI Settings & PWA Button */}
              {onOpenUISettings && (
                <button
                  type="button"
                  onClick={onOpenUISettings}
                  className="flex items-center justify-center p-1.5 sm:p-2 bg-slate-100 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-slate-700 hover:text-emerald-800 rounded-xl transition-all cursor-pointer shadow-2xs"
                  title="Cài đặt giao diện & Cài đặt App (PWA)"
                >
                  <Sliders className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-600" />
                </button>
              )}

              {/* Backup & Restore Button (Desktop) */}
              {onOpenBackupModal && (
                <button
                  type="button"
                  onClick={onOpenBackupModal}
                  className="hidden sm:flex items-center gap-1 p-2 bg-slate-100 hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 text-slate-700 hover:text-indigo-800 rounded-xl transition-all cursor-pointer shadow-2xs"
                  title="Sao lưu & Phục hồi dữ liệu"
                >
                  <Database className="w-3.5 h-3.5 text-slate-600" />
                </button>
              )}

              {/* Login / Logout Button */}
              {currentUser ? (
                onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="flex items-center justify-center p-1.5 sm:px-2.5 sm:py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/90 rounded-xl text-xs font-black transition-all cursor-pointer active:scale-95 shadow-2xs"
                    title="Đăng xuất khỏi hệ thống"
                  >
                    <LogOut className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-rose-600" />
                    <span className="hidden sm:inline text-xs ml-1">Đăng xuất</span>
                  </button>
                )
              ) : (
                onOpenLogin && (
                  <button
                    type="button"
                    onClick={onOpenLogin}
                    className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-xs"
                    title="Đăng nhập tài khoản quản trị/cơ sở"
                  >
                    <span className="text-xs">🔑 <span className="hidden sm:inline">Đăng nhập</span></span>
                  </button>
                )
              )}

            </div>
          </div>

          {/* Quick Tools & View Bar for Tablets only (Hidden on phones because MobileBottomNav is pinned at bottom) */}
          <div className="hidden sm:flex lg:hidden items-center justify-between gap-1.5 overflow-x-auto pb-1 mt-1">
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
              <button
                type="button"
                onClick={() => onChangeView && onChangeView('PACKING_LIST')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                  currentView === 'PACKING_LIST' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                Sổ Bảng Kê
              </button>
            </div>

            {/* Quick Action Icons for Mobile */}
            <div className="flex items-center gap-1">
              {currentUser?.role === 'ADMIN' && (
                <button
                  onClick={onExportExcel}
                  className="p-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold shadow-xs active:scale-95"
                  title="Xuất Báo Cáo Tổng Hợp"
                >
                  <Download className="w-4 h-4" />
                </button>
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
      </div>
    </header>
  );
}
