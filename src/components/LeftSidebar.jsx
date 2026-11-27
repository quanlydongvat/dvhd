import React from 'react';
import {
  Table,
  LayoutList,
  BarChart3,
  MapPin,
  Plus,
  Building2,
  Database,
  Settings,
  ShieldAlert,
  Sparkles,
  Cloud,
  ChevronRight,
  LogOut,
  SlidersHorizontal,
  Compass,
  FileSpreadsheet,
  FileCheck2,
} from 'lucide-react';
import SidebarTopRankingSlide from './SidebarTopRankingSlide';
import SidebarUserReviews from './SidebarUserReviews';

export default function LeftSidebar({
  currentView = 'SUMMARY',
  onChangeView,
  facilitiesCount = 31,
  packingListCount = 33,
  facilitiesList = [],
  onSelectFacility,
  reviews = [],
  onOpenReviewModal,
  onOpenLogin,
  onOpenAddFluctuation,
  onOpenAddFacility,
  onOpenAddPackingList,
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
    <aside className="w-80 lg:w-96 flex-shrink-0 bg-slate-50/90 backdrop-blur-md border-r border-slate-200/90 flex flex-col h-full sticky top-0 shadow-xs z-20 select-none font-sans">
      
      {/* 1. Sidebar Header Logo Banner */}
      <div className="p-4 border-b border-emerald-900/50 bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white relative overflow-hidden shadow-sm">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/15 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 bg-white/95 p-1 rounded-2xl ring-2 ring-emerald-400/40 shadow-md flex items-center justify-center flex-shrink-0 overflow-hidden">
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
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black tracking-widest text-emerald-300 uppercase truncate">
                Chi cục Kiểm lâm Đắk Lắk
              </span>
            </div>
            <h1 className="text-xs sm:text-sm font-black tracking-wide uppercase text-white leading-tight truncate">
              HẠT KIỂM LÂM KHU VỰC KRÔNG BÔNG
            </h1>
            <p className="text-[11px] text-emerald-200/90 font-bold flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="truncate">Sổ Động Vật Hoang Dã</span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Links & Sections */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-5 scrollbar-thin">
        
        {/* SECTION 1: CHẾ ĐỘ QUẢN LÝ & XEM */}
        <section>
          <div className="flex items-center justify-between px-1.5 mb-2">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Quản lý & Thống kê
            </h2>
          </div>

          <nav className="bg-white rounded-2xl p-1.5 border border-slate-200/80 shadow-2xs space-y-1">
            {/* If FACILITY account, show ONLY Sổ Mẫu II (Chi Tiết của cơ sở) */}
            {currentUser?.role === 'FACILITY' ? (
              <button
                type="button"
                onClick={() => onChangeView('LOGBOOK')}
                className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white">
                    <Table className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-black">Sổ Ghi Chép Mẫu II</div>
                    <div className="text-[10px] text-emerald-100">Chi tiết theo dõi của cơ sở</div>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-white/20 text-white px-2 py-0.5 rounded-full">
                  Đang xem
                </span>
              </button>
            ) : (
              <>
                {/* 1. Trang Chủ & Thống Kê */}
                <button
                  type="button"
                  onClick={() => onChangeView('HOME')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isNavActive('HOME')
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-700 hover:text-emerald-900 hover:bg-emerald-50/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isNavActive('HOME')
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                    }`}>
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div className="text-left leading-tight">
                      <div className="font-bold">Trang Chủ & Thống Kê</div>
                      <div className={`text-[10px] font-medium ${isNavActive('HOME') ? 'text-emerald-100' : 'text-slate-400'}`}>
                        Tổng quan toàn huyện
                      </div>
                    </div>
                  </div>
                </button>

                {/* 2. Bảng Tổng Hợp */}
                <button
                  type="button"
                  onClick={() => onChangeView('SUMMARY')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isNavActive('SUMMARY')
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-700 hover:text-emerald-900 hover:bg-emerald-50/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isNavActive('SUMMARY')
                        ? 'bg-white/20 text-white'
                        : 'bg-teal-50 text-teal-600 border border-teal-200/60'
                    }`}>
                      <LayoutList className="w-4 h-4" />
                    </div>
                    <div className="text-left leading-tight">
                      <div className="font-bold">Bảng Tổng Hợp</div>
                      <div className={`text-[10px] font-medium ${isNavActive('SUMMARY') ? 'text-emerald-100' : 'text-slate-400'}`}>
                        Danh sách các cơ sở
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                      isNavActive('SUMMARY')
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600 border border-slate-200/80'
                    }`}
                  >
                    {facilitiesCount} CS
                  </span>
                </button>

                {/* 3. Sổ Mẫu II (Chi Tiết) */}
                <button
                  type="button"
                  onClick={() => onChangeView('LOGBOOK')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isNavActive('LOGBOOK')
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-700 hover:text-emerald-900 hover:bg-emerald-50/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isNavActive('LOGBOOK')
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-50 text-indigo-600 border border-indigo-200/60'
                    }`}>
                      <Table className="w-4 h-4" />
                    </div>
                    <div className="text-left leading-tight">
                      <div className="font-bold">Sổ Mẫu II (Chi Tiết)</div>
                      <div className={`text-[10px] font-medium ${isNavActive('LOGBOOK') ? 'text-emerald-100' : 'text-slate-400'}`}>
                        Nhật ký biến động loài
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isNavActive('LOGBOOK') ? 'text-white' : 'text-slate-400'}`} />
                </button>

                {/* 4. Sổ Theo Dõi Bảng Kê Lâm Sản (Mới) */}
                <button
                  type="button"
                  onClick={() => onChangeView('PACKING_LIST')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isNavActive('PACKING_LIST')
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-700 hover:text-emerald-900 hover:bg-emerald-50/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isNavActive('PACKING_LIST')
                        ? 'bg-white/20 text-white'
                        : 'bg-amber-50 text-amber-600 border border-amber-200/60'
                    }`}>
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div className="text-left leading-tight">
                      <div className="font-bold">Sổ Theo Dõi Bảng Kê</div>
                      <div className={`text-[10px] font-medium ${isNavActive('PACKING_LIST') ? 'text-emerald-100' : 'text-slate-400'}`}>
                        Lâm sản xuất bán
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                      isNavActive('PACKING_LIST')
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600 border border-slate-200/80'
                    }`}
                  >
                    {packingListCount} BK
                  </span>
                </button>

                {/* 5. Bản Đồ GIS */}
                <button
                  type="button"
                  onClick={() => onChangeView('MAP')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isNavActive('MAP')
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-700 hover:text-emerald-900 hover:bg-emerald-50/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isNavActive('MAP')
                        ? 'bg-white/20 text-white'
                        : 'bg-rose-50 text-rose-600 border border-rose-200/60'
                    }`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="text-left leading-tight">
                      <div className="font-bold">Bản Đồ GIS Vệ Tinh</div>
                      <div className={`text-[10px] font-medium ${isNavActive('MAP') ? 'text-emerald-100' : 'text-slate-400'}`}>
                        Google Hybrid tọa độ cơ sở
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                      isNavActive('MAP')
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600 border border-slate-200/80'
                    }`}
                  >
                    GIS
                  </span>
                </button>
              </>
            )}
          </nav>
        </section>

        {/* SECTION 2: TÁC VỤ & BÁO CÁO (Nghiệp vụ ghi nhận) */}
        <section>
          <div className="flex items-center justify-between px-1.5 mb-2">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Tác vụ & Báo cáo
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-2xs space-y-2">
            {/* Primary Action Button: Thêm Biến Động Mới */}
            <button
              type="button"
              onClick={onOpenAddFluctuation}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all active:scale-[0.99] cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white shadow-inner group-hover:rotate-90 transition-transform">
                  <Plus className="w-4 h-4 stroke-[3]" />
                </div>
                <div className="text-left">
                  <div className="leading-tight font-black">Thêm Biến Động Mới</div>
                  <div className="text-[10px] text-emerald-200/90 font-medium">Tăng, giảm, xuất nhập đàn</div>
                </div>
              </div>
              <span className="text-[10px] bg-white/20 text-white font-extrabold px-2 py-0.5 rounded-md border border-white/20">
                + Ghi
              </span>
            </button>

            {/* Action 2: Thêm Cơ Sở Nuôi Mới (Admin/Staff only) */}
            {currentUser?.role !== 'FACILITY' && (
              <button
                type="button"
                onClick={onOpenAddFacility}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-extrabold text-emerald-950 bg-white hover:bg-emerald-50/80 border border-emerald-300 hover:border-emerald-400 transition-all shadow-2xs cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="leading-tight text-slate-800 group-hover:text-emerald-950">Thêm Cơ Sở Nuôi Mới</div>
                    <div className="text-[10px] text-slate-500 font-medium">Đăng ký mã cơ sở & đàn nuôi</div>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 font-extrabold px-2 py-0.5 rounded-md border border-emerald-200">
                  + Thêm
                </span>
              </button>
            )}

            {/* Action 3: Ghi Bảng Kê Xuất Bán Mới */}
            {currentUser?.role !== 'FACILITY' && onOpenAddPackingList && (
              <button
                type="button"
                onClick={onOpenAddPackingList}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-extrabold text-amber-950 bg-white hover:bg-amber-50/80 border border-amber-300 hover:border-amber-400 transition-all shadow-2xs cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="leading-tight text-slate-800 group-hover:text-amber-950">Ghi Bảng Kê Xuất Bán</div>
                    <div className="text-[10px] text-slate-500 font-medium">Cấp số vào sổ & xác nhận</div>
                  </div>
                </div>
                <span className="text-[10px] text-amber-800 bg-amber-100 font-extrabold px-2 py-0.5 rounded-md border border-amber-200">
                  + Sổ BK
                </span>
              </button>
            )}

            {/* Action 3: Xuất Báo Cáo Excel */}
            <button
              type="button"
              onClick={onExportExcel}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-extrabold text-slate-800 hover:text-emerald-950 bg-white hover:bg-emerald-50/60 border border-slate-200/90 hover:border-emerald-300 transition-all shadow-2xs cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="text-left">
                  <div className="leading-tight text-slate-800 group-hover:text-emerald-950">
                    {currentUser?.role === 'ADMIN' || currentUser?.role === 'STAFF'
                      ? 'Xuất Báo Cáo (Toàn huyện)'
                      : 'Xuất Sổ Ghi Chép (Cơ sở)'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">Xuất biểu mẫu Excel (.xlsx)</div>
                </div>
              </div>
              <span className="text-[10px] text-emerald-800 bg-emerald-100/80 font-extrabold px-2 py-0.5 rounded-md border border-emerald-200">
                Excel
              </span>
            </button>
          </div>
        </section>

        {/* SECTION 3: DỮ LIỆU & CÀI ĐẶT (Chỉ dành cho Admin) */}
        {currentUser?.role === 'ADMIN' && (
          <section>
            <div className="flex items-center justify-between px-1.5 mb-2">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Dữ liệu & Cài đặt
              </h2>
            </div>

            <div className="bg-white rounded-2xl p-1.5 border border-slate-200/80 shadow-2xs space-y-1">
              {/* Quản Trị Tài Khoản */}
              <button
                type="button"
                onClick={() => onChangeView('ADMIN_USERS')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isNavActive('ADMIN_USERS')
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isNavActive('ADMIN_USERS')
                      ? 'bg-white/20 text-white'
                      : 'bg-rose-50 text-rose-600 border border-rose-200/60'
                  }`}>
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div className="text-left leading-tight">
                    <div>Quản Trị Tài Khoản</div>
                    <div className={`text-[10px] font-medium ${isNavActive('ADMIN_USERS') ? 'text-emerald-100' : 'text-slate-400'}`}>
                      Phân quyền Hạt & Cơ sở
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ${isNavActive('ADMIN_USERS') ? 'text-white' : 'text-slate-400'}`} />
              </button>

              {/* Nhập / Xuất dữ liệu */}
              <button
                type="button"
                onClick={onOpenBackupModal}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-extrabold text-slate-800 hover:text-emerald-950 hover:bg-slate-50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 border border-sky-200/60 flex items-center justify-center">
                    <Database className="w-4 h-4" />
                  </div>
                  <div className="text-left leading-tight">
                    <div>Nhập / Xuất Dữ Liệu</div>
                    <div className="text-[10px] text-slate-400 font-medium">Sao lưu & phục hồi dữ liệu</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
              </button>

              {/* Cài đặt giao diện */}
              <button
                type="button"
                onClick={onOpenUISettings}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-extrabold text-slate-800 hover:text-emerald-950 hover:bg-slate-50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 border border-purple-200/60 flex items-center justify-center">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <div className="text-left leading-tight">
                    <div>Cài Đặt Giao Diện</div>
                    <div className="text-[10px] text-slate-400 font-medium">Màu sắc & cỡ chữ</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
              </button>
            </div>
          </section>
        )}

        {/* SECTION 4: BẢNG XẾP HẠNG TOP 5 CƠ SỞ NUÔI (NGUY CẤP QUÝ HIẾM & THÔNG THƯỜNG) */}
        <SidebarTopRankingSlide
          facilitiesList={facilitiesList}
          onSelectFacility={onSelectFacility}
          onChangeView={onChangeView}
        />

        {/* SECTION 5: ĐÁNH GIÁ & GÓP Ý TỪ CÁC CƠ SỞ NUÔI (1 ĐẾN 5 SAO & BÌNH LUẬN) */}
        <SidebarUserReviews
          reviews={reviews}
          currentUser={currentUser}
          onOpenReviewModal={onOpenReviewModal}
          onOpenLogin={onOpenLogin}
        />

      </div>

      {/* 3. Sidebar Footer: User profile & Cloud Sync */}
      <div className="p-3.5 border-t border-slate-200/90 bg-white/80 backdrop-blur-xs text-[11px] space-y-2.5 shadow-2xs">
        {currentUser && (
          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className={`w-8 h-8 rounded-xl font-black flex items-center justify-center text-xs flex-shrink-0 shadow-2xs ${
                currentUser.role === 'ADMIN'
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-800 text-white'
                  : currentUser.role === 'STAFF'
                  ? 'bg-gradient-to-br from-teal-600 to-emerald-700 text-white'
                  : 'bg-emerald-600 text-white'
              }`}>
                {currentUser.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden leading-tight">
                <div className="font-black text-slate-900 truncate text-xs">{currentUser.username}</div>
                <div className="text-[10px] font-extrabold text-emerald-700 mt-0.5 truncate">
                  {currentUser.role === 'ADMIN'
                    ? '🛡️ Hạt Kiểm lâm khu vực (Admin)'
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
          <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-[10px]">
            <Cloud className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Firebase Cloud Sync</span>
          </div>
          <span className="bg-emerald-100/90 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping inline-block" />
            ONLINE
          </span>
        </div>
      </div>
    </aside>
  );
}
