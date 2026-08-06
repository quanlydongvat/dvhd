import React from 'react';
import { Table, LayoutList, BarChart3, PieChart, MapPin, Plus, Menu } from 'lucide-react';

export default function MobileBottomNav({
  currentView,
  onChangeView,
  onOpenAddFluctuation,
  facilityCount = 31,
}) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 text-white shadow-2xl px-2 py-1.5 no-print">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Sổ Mẫu II */}
        <button
          onClick={() => onChangeView('LOGBOOK')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
            currentView === 'LOGBOOK'
              ? 'text-emerald-400 bg-slate-800 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Table className="w-5 h-5" />
          <span className="text-[10px] font-sans">Sổ Mẫu II</span>
        </button>

        {/* Bảng Tổng Hợp */}
        <button
          onClick={() => onChangeView('SUMMARY')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all relative ${
            currentView === 'SUMMARY'
              ? 'text-emerald-400 bg-slate-800 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutList className="w-5 h-5" />
          <span className="text-[10px] font-sans">Tổng Hợp</span>
          <span className="absolute -top-1 right-1 bg-emerald-500 text-slate-950 font-mono text-[9px] font-black px-1 rounded-full">
            {facilityCount}
          </span>
        </button>

        {/* Center Quick FAB: Thêm Biến Động */}
        <button
          onClick={onOpenAddFluctuation}
          className="flex flex-col items-center justify-center -mt-5 bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white p-3 rounded-full shadow-lg border-2 border-slate-900 active:scale-95 transition-all"
          title="Thêm biến động mới"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>

        {/* 3. Trang Chủ / Thống Kê */}
        <button
          onClick={() => onChangeView('HOME')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
            currentView === 'HOME'
              ? 'text-amber-400 bg-slate-800 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <PieChart className="w-5 h-5" />
          <span className="text-[10px] font-sans">Trang Chủ</span>
        </button>

        {/* Bản Đồ GIS */}
        <button
          onClick={() => onChangeView('MAP')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
            currentView === 'MAP'
              ? 'text-rose-400 bg-slate-800 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MapPin className="w-5 h-5 text-rose-500 animate-pulse" />
          <span className="text-[10px] font-sans">Bản Đồ GIS</span>
        </button>
      </div>
    </nav>
  );
}
