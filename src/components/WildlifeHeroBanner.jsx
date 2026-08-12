import React from 'react';
import { ShieldCheck, MapPin, Building2, Feather, Sparkles, PlusCircle, Table, BarChart3, Download, Layers } from 'lucide-react';

export default function WildlifeHeroBanner({
  facilitiesCount = 31,
  totalAnimals = 964,
  currentView = 'SUMMARY',
  onChangeView,
  onOpenAddFluctuation,
  onExportExcel,
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white p-5 sm:p-6 lg:p-8 shadow-2xl border border-emerald-500/30 mb-6 group">
      {/* Ambient Decorative Background Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/30 transition-all duration-700" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/25 transition-all duration-700" />
      
      {/* Decorative Subtle Overlay Grid Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Side: App Branding & Wildlife Icons Showcase */}
        <div className="space-y-3 max-w-3xl">
          {/* Top Pill Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-extrabold shadow-xs backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>TT 85/2025/TT-BNNMT</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-extrabold shadow-xs backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Nuôi Sinh Sản & Sinh Trưởng</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 font-extrabold shadow-xs backdrop-blur-md">
              <MapPin className="w-3.5 h-3.5 text-indigo-300" />
              <span>Hạt Kiểm lâm khu vực Krông Bông</span>
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white uppercase leading-tight drop-shadow-md">
            ỨNG DỤNG SỔ THEO DÕI QUẢN LÝ ĐỘNG VẬT HOANG DÃ ĐIỆN TỬ
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-emerald-100/90 font-medium leading-relaxed max-w-2xl">
            Hệ thống quản lý hiện trạng & tự động tính toán biến động tăng giảm đàn động vật hoang dã theo Thông tư 85/2025/TT-BNNMT của Bộ Nông nghiệp & PTNT
          </p>

          {/* Wildlife Species Icon Banner Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md text-emerald-200 font-bold hover:bg-white/15 transition-all">
              <span className="text-base">🐆</span>
              <span>Cầy Vòi Hương, Mèo Rừng</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md text-teal-200 font-bold hover:bg-white/15 transition-all">
              <span className="text-base">🦔</span>
              <span>Dúi, Nhím, Chồn, Nai</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md text-amber-200 font-bold hover:bg-white/15 transition-all">
              <span className="text-base">🦜</span>
              <span>Trĩ, Khướu, Yến, Vẹt</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md text-rose-200 font-bold hover:bg-white/15 transition-all">
              <span className="text-base">🐢</span>
              <span>Rùa, Trăn, Kỳ Đà</span>
            </div>
          </div>
        </div>

        {/* Right Side: KPI Cards & Fast Action Controls */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[280px]">
          {/* Quick Counter Box */}
          <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 grid grid-cols-2 gap-3 text-center shadow-lg">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30">
              <span className="text-emerald-200 block text-[11px] font-bold uppercase tracking-wider">Tổng cơ sở</span>
              <span className="text-2xl font-black font-mono text-white">{facilitiesCount} CS</span>
              <span className="text-[10px] text-emerald-300 block font-medium">Thuộc 5 Xã</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/30">
              <span className="text-amber-200 block text-[11px] font-bold uppercase tracking-wider">Tổng cá thể</span>
              <span className="text-2xl font-black font-mono text-amber-300">{totalAnimals}</span>
              <span className="text-[10px] text-amber-200 block font-medium">Toàn địa bàn</span>
            </div>
          </div>

          {/* Quick Trigger Buttons */}
          <div className="flex flex-col gap-2">
            {onOpenAddFluctuation && (
              <button
                onClick={onOpenAddFluctuation}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all active:scale-95 text-xs uppercase tracking-wide border border-emerald-400/50"
              >
                <PlusCircle className="w-4 h-4 text-emerald-100" />
                <span>+ Khai Báo Biến Động Đàn</span>
              </button>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onChangeView && onChangeView('SUMMARY')}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all border ${
                  currentView === 'SUMMARY'
                    ? 'bg-white text-emerald-950 border-white shadow-md'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>5 Xã CS</span>
              </button>

              <button
                onClick={() => onChangeView && onChangeView('MAP')}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all border ${
                  currentView === 'MAP'
                    ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Bản Đồ GIS</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
