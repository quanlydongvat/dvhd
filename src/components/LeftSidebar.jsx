import React from 'react';
import {
  Table,
  LayoutList,
  BarChart3,
  MapPin,
  Plus,
  Download,
  Printer,
  Database,
  Settings,
  ShieldAlert,
  Sparkles,
  Cloud,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { forceClearAllCache } from '../utils/storage';

export default function LeftSidebar({
  currentView = 'SUMMARY',
  onChangeView,
  facilitiesCount = 31,
  onOpenAddFluctuation,
  onExportExcel,
  onOpenPrintView,
  onOpenBackupModal,
  onOpenUISettings,
  activeSpecies,
}) {
  return (
    <aside className="w-72 lg:w-80 flex-shrink-0 bg-white border-r border-slate-200/90 flex flex-col h-full sticky top-0 shadow-sm z-20 select-none">
      {/* Sidebar Header Logo */}
      <div className="p-4 border-b border-slate-100 bg-linear-to-br from-emerald-900 to-slate-900 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-emerald-400 shadow-inner">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-extrabold tracking-wide uppercase text-white">
                Sổ Động Vật Hoang Dã
              </h1>
            </div>
            <p className="text-[11px] text-emerald-300/90 font-medium flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Mẫu II - Nuôi sinh sản (TT85)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Vertical Navigation & Tool Options (Top to Bottom) */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-5 scrollbar-thin">
        {/* GROUP 1: CHẾ ĐỘ QUẢN LÝ (View Modes) */}
        <div>
          <div className="px-2 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Chế độ quản lý & xem
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">
              View Modes
            </span>
          </div>

          <nav className="space-y-1">
            {/* 1. Sổ Mẫu II */}
            <button
              onClick={() => onChangeView('LOGBOOK')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                currentView === 'LOGBOOK'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 translate-x-1'
                  : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Table className={`w-4 h-4 ${currentView === 'LOGBOOK' ? 'text-white' : 'text-emerald-600'}`} />
                <span>Sổ Mẫu II (Chi Tiết)</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  currentView === 'LOGBOOK'
                    ? 'bg-emerald-700 text-emerald-100'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                Alt+1
              </span>
            </button>

            {/* 2. Bảng Tổng Hợp */}
            <button
              onClick={() => onChangeView('SUMMARY')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                currentView === 'SUMMARY'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 translate-x-1'
                  : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutList className={`w-4 h-4 ${currentView === 'SUMMARY' ? 'text-white' : 'text-teal-600'}`} />
                <span>Bảng Tổng Hợp</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded-full">
                  {facilitiesCount} CS
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    currentView === 'SUMMARY'
                      ? 'bg-emerald-700 text-emerald-100'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  Alt+2
                </span>
              </div>
            </button>

            {/* 3. Biểu Đồ Thống Kê */}
            <button
              onClick={() => onChangeView('ANALYTICS')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                currentView === 'ANALYTICS'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 translate-x-1'
                  : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className={`w-4 h-4 ${currentView === 'ANALYTICS' ? 'text-white' : 'text-indigo-600'}`} />
                <span>Biểu Đồ Thống Kê</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  currentView === 'ANALYTICS'
                    ? 'bg-indigo-700 text-indigo-100'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                Alt+3
              </span>
            </button>

            {/* 4. Bản Đồ GIS */}
            <button
              onClick={() => onChangeView('MAP')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                currentView === 'MAP'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 translate-x-1'
                  : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className={`w-4 h-4 ${currentView === 'MAP' ? 'text-white animate-bounce' : 'text-rose-500'}`} />
                <span>Bản Đồ GIS (Google Hybrid)</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  currentView === 'MAP'
                    ? 'bg-rose-700 text-rose-100'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                Alt+4
              </span>
            </button>
          </nav>
        </div>

        {/* GROUP 2: THAO TÁC BIẾN ĐỘNG & BÁO CÁO (Actions) */}
        <div>
          <div className="px-2 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Tác vụ & Báo cáo
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">
              Actions
            </span>
          </div>

          <div className="space-y-1.5">
            {/* Nút Thêm Biến Động Nổi Bật */}
            <button
              onClick={onOpenAddFluctuation}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-extrabold text-white bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5">
                <Plus className="w-4 h-4 text-emerald-100" />
                <span>Thêm Biến Động Mới</span>
              </div>
              <span className="text-[10px] bg-emerald-800/60 text-emerald-100 px-1.5 py-0.5 rounded font-mono">
                Alt+N
              </span>
            </button>

            {/* Xuất Excel */}
            <button
              onClick={onExportExcel}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200/80 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Xuất Sổ Excel (19 Cột)</span>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                Alt+E
              </span>
            </button>

            {/* In Sổ A4 */}
            <button
              onClick={onOpenPrintView}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Printer className="w-4 h-4 text-sky-600" />
                <span>Xem & In Sổ (A4 Ngang)</span>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                Alt+P
              </span>
            </button>
          </div>
        </div>

        {/* GROUP 3: DỮ LIỆU & HỆ THỐNG (System Tools) */}
        <div>
          <div className="px-2 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Dữ liệu & Cài đặt
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">
              System
            </span>
          </div>

          <div className="space-y-1">
            {/* Nhập / Xuất dữ liệu */}
            <button
              onClick={onOpenBackupModal}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-800 border border-slate-200/80 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-indigo-600" />
                <span>Nhập / Xuất dữ liệu</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Cài đặt giao diện */}
            <button
              onClick={onOpenUISettings}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200/80 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-emerald-600" />
                <span>Cài đặt giao diện</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Xóa Cache & Tải Lại Dữ Liệu Gốc */}
            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc chắn muốn xóa bộ nhớ cache và tải lại dữ liệu mới nhất không?')) {
                  forceClearAllCache();
                }
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all shadow-2xs mt-2"
              title="Xóa toàn bộ bộ nhớ tạm (Cache/LocalStorage) và làm mới trình duyệt"
            >
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 text-amber-600 animate-spin-slow" />
                <span>Xóa Cache & Tải Lại Dữ Liệu</span>
              </div>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-mono font-bold">
                Reset
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Footer Status */}
      <div className="p-3 border-t border-slate-200/80 bg-slate-50 text-[11px]">
        <div className="flex items-center justify-between text-slate-600 font-medium">
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <Cloud className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Firebase Cloud Sync</span>
          </div>
          <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
            ONLINE
          </span>
        </div>
      </div>
    </aside>
  );
}
