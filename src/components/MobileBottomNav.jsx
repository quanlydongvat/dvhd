import React from 'react';
import { Table, LayoutList, BarChart3, MapPin, Plus } from 'lucide-react';

export default function MobileBottomNav({
  currentView,
  onChangeView,
  onOpenAddFluctuation,
  facilityCount = 31,
}) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-emerald-900/40 text-white shadow-2xl px-2 py-2 no-print font-sans">
      <div className="flex items-center justify-between max-w-md mx-auto px-1">
        
        {/* 1. Trang Chủ & Thống Kê (Vị trí ưu tiên trên cùng) */}
        <button
          type="button"
          onClick={() => onChangeView('HOME')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-2xl transition-all cursor-pointer ${
            currentView === 'HOME'
              ? 'text-amber-400 bg-emerald-900/60 font-extrabold scale-105 border border-amber-400/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-5 h-5 text-amber-400" />
          <span className="text-[10px] font-bold">Trang Chủ</span>
        </button>

        {/* 2. Bảng Tổng Hợp */}
        <button
          type="button"
          onClick={() => onChangeView('SUMMARY')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-2xl transition-all relative cursor-pointer ${
            currentView === 'SUMMARY'
              ? 'text-emerald-400 bg-emerald-900/60 font-extrabold scale-105 border border-emerald-400/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutList className="w-5 h-5 text-emerald-400" />
          <span className="text-[10px] font-bold">Tổng Hợp</span>
          <span className="absolute -top-1 right-0 bg-emerald-500 text-slate-950 font-mono text-[9px] font-black px-1.5 py-0.2 rounded-full border border-slate-900">
            {facilityCount}
          </span>
        </button>

        {/* Center Nút Thêm Biến Động Nổi Bật */}
        <button
          type="button"
          onClick={onOpenAddFluctuation}
          className="flex flex-col items-center justify-center -mt-6 bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-white p-3.5 rounded-full shadow-xl shadow-emerald-950/80 border-4 border-slate-950 active:scale-95 transition-all cursor-pointer"
          title="Thêm biến động mới"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>

        {/* 3. Sổ Mẫu II */}
        <button
          type="button"
          onClick={() => onChangeView('LOGBOOK')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-2xl transition-all cursor-pointer ${
            currentView === 'LOGBOOK'
              ? 'text-emerald-400 bg-emerald-900/60 font-extrabold scale-105 border border-emerald-400/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Table className="w-5 h-5 text-emerald-400" />
          <span className="text-[10px] font-bold">Sổ Mẫu II</span>
        </button>

        {/* 4. Bản Đồ GIS */}
        <button
          type="button"
          onClick={() => onChangeView('MAP')}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-2xl transition-all cursor-pointer ${
            currentView === 'MAP'
              ? 'text-teal-300 bg-emerald-900/60 font-extrabold scale-105 border border-teal-400/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MapPin className="w-5 h-5 text-rose-400 animate-pulse" />
          <span className="text-[10px] font-bold">Bản Đồ GIS</span>
        </button>

      </div>
    </nav>
  );
}

