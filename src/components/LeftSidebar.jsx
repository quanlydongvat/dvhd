import React from 'react';
import {
  Table,
  LayoutList,
  BarChart3,
  MapPin,
  Plus,
  Building2,
  Download,
  Database,
  Settings,
  ShieldAlert,
  Sparkles,
  Cloud,
  ChevronRight,
  Home,
  LogOut,
  SlidersHorizontal,
} from 'lucide-react';

export default function LeftSidebar({
  currentView = 'SUMMARY',
  onChangeView,
  facilitiesCount = 31,
  onOpenAddFluctuation,
  onOpenAddFacility,
  onExportExcel,
  onOpenPrintView,
  onOpenBackupModal,
  onOpenUISettings,
  activeSpecies,
  currentUser,
  onLogout,
}) {
  const isNavActive = (viewName) => currentView === viewName;

  return (
    <aside className="w-72 lg:w-80 flex-shrink-0 bg-white border-r border-slate-300 flex flex-col h-full sticky top-0 shadow-xs z-20 select-none font-sans">
      
      {/* Sidebar Header Logo Banner */}
      <div className="p-4 border-b border-slate-300 bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 bg-white p-1 rounded-2xl border border-emerald-400/40 shadow-inner flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img
              src="./images/logo.jpg"
              alt="Logo Kiểm Lâm"
              className="w-full h-full object-contain rounded-xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div>
            <h1 className="text-[11px] font-black tracking-wide uppercase text-white leading-tight">
              HẠT KIỂM LÂM KHU VỰC KRÔNG BÔNG
            </h1>
            <p className="text-[10px] text-emerald-200/90 font-bold flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Sổ Động Vật Hoang Dã (TT85)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links & Options */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-6 scrollbar-thin">
        
        {/* GROUP 1: CHẾ ĐỘ QUẢN LÝ & XEM */}
        <div>
          <div className="px-2 mb-2.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Chế độ quản lý & xem
            </span>
          </div>

          <nav className="space-y-1.5">
            {/* If FACILITY account, show ONLY Sổ Mẫu II (Chi Tiết của cơ sở) */}
            {currentUser?.role === 'FACILITY' ? (
              <button
                type="button"
                onClick={() => onChangeView('LOGBOOK')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/20 translate-x-1 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Table className="w-4 h-4 text-white" />
                  <span>Sổ Ghi Chép Mẫu II</span>
                </div>
              </button>
            ) : (
              <>
                {/* 1. Trang Chủ & Thống Kê (Uu tien tren cung) */}
                <button
                  type="button"
                  onClick={() => onChangeView('HOME')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                    isNavActive('HOME')
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/20 translate-x-1'
                      : 'text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-950 border border-transparent hover:border-emerald-200/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 className={`w-4 h-4 ${isNavActive('HOME') ? 'text-white' : 'text-emerald-600'}`} />
                    <span>Trang Chủ & Thống Kê</span>
                  </div>
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isNavActive('HOME')
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-amber-100 text-amber-900 border border-amber-200'
                    }`}
                  >
                    HOT
                  </span>
                </button>

                {/* 2. Bảng Tổng Hợp */}
                <button
                  type="button"
                  onClick={() => onChangeView('SUMMARY')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                    isNavActive('SUMMARY')
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/20 translate-x-1'
                      : 'text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-950 border border-transparent hover:border-emerald-200/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutList className={`w-4 h-4 ${isNavActive('SUMMARY') ? 'text-white' : 'text-emerald-600'}`} />
                    <span>Bảng Tổng Hợp</span>
                  </div>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full transition-colors ${
                      isNavActive('SUMMARY')
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-200/80'
                    }`}
                  >
                    {facilitiesCount} CS
                  </span>
                </button>

                {/* 3. Sổ Mẫu II (Chi Tiết) */}
                <button
                  type="button"
                  onClick={() => onChangeView('LOGBOOK')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                    isNavActive('LOGBOOK')
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/20 translate-x-1'
                      : 'text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-950 border border-transparent hover:border-emerald-200/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Table className={`w-4 h-4 ${isNavActive('LOGBOOK') ? 'text-white' : 'text-emerald-600'}`} />
                    <span>Sổ Mẫu II (Chi Tiết)</span>
                  </div>
                </button>

                {/* 4. Bản Đồ GIS */}
                <button
                  type="button"
                  onClick={() => onChangeView('MAP')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                    isNavActive('MAP')
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/20 translate-x-1'
                      : 'text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-950 border border-transparent hover:border-emerald-200/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className={`w-4 h-4 ${isNavActive('MAP') ? 'text-white' : 'text-emerald-600'}`} />
                    <span>Bản Đồ GIS (Google Hybrid)</span>
                  </div>
                </button>
              </>
            )}
          </nav>
        </div>

        {/* GROUP 2: TÁC VỤ & BÁO CÁO */}
        <div>
          <div className="px-2 mb-2.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Tác vụ & Báo cáo
            </span>
          </div>

          <div className="space-y-2">
            {/* Primary Action: Thêm Biến Động Mới */}
            <button
              type="button"
              onClick={onOpenAddFluctuation}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Plus className="w-4 h-4 text-white" />
                <span>Thêm Biến Động Mới</span>
              </div>
            </button>

            {/* Secondary Action: Thêm Cơ Sở Nuôi Mới (Chỉ dành cho Admin/Staff) */}
            {currentUser?.role !== 'FACILITY' && (
              <button
                type="button"
                onClick={onOpenAddFacility}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold text-emerald-950 bg-emerald-50/90 hover:bg-emerald-100 border border-emerald-200/90 hover:border-emerald-300 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <span>Thêm Cơ Sở Nuôi Mới</span>
                </div>
                <Plus className="w-3.5 h-3.5 text-emerald-700" />
              </button>
            )}

            {/* Action: Xuất Báo Cáo Excel / Xuất Sổ Ghi Chép */}
            <button
              type="button"
              onClick={onExportExcel}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold text-slate-800 hover:text-emerald-950 bg-slate-50/90 hover:bg-emerald-50/90 border border-slate-200/90 hover:border-emerald-200/90 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Download className="w-4 h-4 text-emerald-600" />
                <span>
                  {currentUser?.role === 'ADMIN' || currentUser?.role === 'STAFF'
                    ? 'Xuất Báo Cáo (Toàn huyện)'
                    : 'Xuất Sổ Ghi Chép (Cơ sở)'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* GROUP 3: DỮ LIỆU & CÀI ĐẶT (Chỉ dành riêng cho Admin tối cao) */}
        {currentUser?.role === 'ADMIN' && (
          <div>
            <div className="px-2 mb-2.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Dữ liệu & Cài đặt
              </span>
            </div>

            <div className="space-y-1.5">
              {/* Quản Trị Tài Khoản (Chỉ Admin) */}
              <button
                type="button"
                onClick={() => onChangeView('ADMIN_USERS')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                  isNavActive('ADMIN_USERS')
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/20 translate-x-1'
                    : 'text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-950 border border-transparent hover:border-emerald-200/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className={`w-4 h-4 ${isNavActive('ADMIN_USERS') ? 'text-white' : 'text-emerald-600'}`} />
                  <span>Quản Trị Tài Khoản</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${isNavActive('ADMIN_USERS') ? 'text-white' : 'text-slate-400'}`} />
              </button>

              {/* Nhập / Xuất dữ liệu */}
              <button
                type="button"
                onClick={onOpenBackupModal}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold text-slate-700 hover:text-emerald-950 bg-slate-50/80 hover:bg-emerald-50/80 border border-slate-200/80 hover:border-emerald-200/80 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>Nhập / Xuất dữ liệu</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Cài đặt giao diện */}
              <button
                type="button"
                onClick={onOpenUISettings}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold text-slate-700 hover:text-emerald-950 bg-slate-50/80 hover:bg-emerald-50/80 border border-slate-200/80 hover:border-emerald-200/80 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 text-emerald-600" />
                  <span>Cài đặt giao diện</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Footer Status & Logged-in User */}
      <div className="p-3.5 border-t border-slate-200/80 bg-slate-50/90 text-[11px] space-y-2">
        {currentUser && (
          <div className="bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className={`w-8 h-8 rounded-xl font-black flex items-center justify-center text-xs flex-shrink-0 ${
                currentUser.role === 'ADMIN'
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-800 text-white'
                  : currentUser.role === 'STAFF'
                  ? 'bg-gradient-to-br from-teal-600 to-emerald-700 text-white'
                  : 'bg-emerald-600 text-white'
              }`}>
                {currentUser.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden leading-tight">
                <div className="font-extrabold text-slate-900 truncate text-xs">{currentUser.username}</div>
                <div className="text-[10px] font-extrabold text-emerald-700 mt-0.5">
                  {currentUser.role === 'ADMIN'
                    ? '🛡️ Hạt Kiểm Lâm (Admin)'
                    : currentUser.role === 'STAFF'
                    ? '🌲 Cán Bộ Lâm Nghiệp (dlc-krb)'
                    : '🏠 Cơ sở nuôi'}
                </div>
              </div>
            </div>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer flex-shrink-0"
                title="Đăng xuất khỏi hệ thống"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-slate-600 font-medium px-1">
          <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[10px]">
            <Cloud className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Firebase Cloud Sync</span>
          </div>
          <span className="bg-emerald-100/90 text-emerald-900 border border-emerald-200/80 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase">
            ONLINE
          </span>
        </div>
      </div>
    </aside>
  );
}
