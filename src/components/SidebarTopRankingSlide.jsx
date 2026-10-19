import React, { useState, useEffect, useMemo } from 'react';
import {
  Trophy,
  Flame,
  Leaf,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { computeLogbookTable, isCitesSpecies, getCanonicalSpecies } from '../utils/calculations';

export default function SidebarTopRankingSlide({
  facilitiesList = [],
  onSelectFacility,
  onChangeView,
}) {
  const [activeSlide, setActiveSlide] = useState(0); // 0: Nguy cấp quý hiếm, 1: Thông thường
  const [isPaused, setIsPaused] = useState(false);

  // Compute Top 5 Endangered and Top 5 Common facilities with real-time recalculation
  const { topEndangered, topCommon } = useMemo(() => {
    const endangeredFacs = [];
    const commonFacs = [];

    (facilitiesList || []).forEach((fac) => {
      let eCount = 0;
      let cCount = 0;
      const eDetails = [];
      const cDetails = [];

      (fac.speciesList || []).forEach((sp) => {
        const rows = computeLogbookTable(sp.baseline || {}, sp.fluctuations || []);
        const lastRow = rows[rows.length - 1];
        const spTotal = lastRow ? (Number(lastRow.total) || 0) : 0;
        if (spTotal <= 0) return;

        const canonical = getCanonicalSpecies(sp.vietnameseName, sp.scientificName);
        const isCites = canonical.isCites !== undefined ? canonical.isCites : isCitesSpecies(sp);
        const name = canonical.vietnameseName || sp.vietnameseName;

        if (isCites) {
          eCount += spTotal;
          eDetails.push(`${name} (${spTotal})`);
        } else {
          cCount += spTotal;
          cDetails.push(`${name} (${spTotal})`);
        }
      });

      if (eCount > 0) {
        endangeredFacs.push({
          id: fac.id,
          name: fac.ownerName || fac.facilityName || 'Chưa đặt tên',
          commune: fac.commune || 'Krông Bông',
          code: fac.registrationCode || '',
          count: eCount,
          details: eDetails.join(', '),
        });
      }

      if (cCount > 0) {
        commonFacs.push({
          id: fac.id,
          name: fac.ownerName || fac.facilityName || 'Chưa đặt tên',
          commune: fac.commune || 'Krông Bông',
          code: fac.registrationCode || '',
          count: cCount,
          details: cDetails.join(', '),
        });
      }
    });

    endangeredFacs.sort((a, b) => b.count - a.count);
    commonFacs.sort((a, b) => b.count - a.count);

    return {
      topEndangered: endangeredFacs.slice(0, 5),
      topCommon: commonFacs.slice(0, 5),
    };
  }, [facilitiesList]);

  // Auto-slide every 5 seconds (pauses when user hovers to read or click)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleFacilityClick = (facId) => {
    if (onSelectFacility) onSelectFacility(facId);
    if (onChangeView) onChangeView('LOGBOOK');
  };

  const currentList = activeSlide === 0 ? topEndangered : topCommon;
  const isEndangered = activeSlide === 0;

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="space-y-2 select-none"
    >
      {/* Widget Header with Navigation Arrows */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center shadow-2xs">
            <Trophy className="w-3.5 h-3.5 stroke-[2.3]" />
          </div>
          <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Bảng Xếp Hạng Nuôi
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[9px] font-black uppercase tracking-wider text-amber-800 bg-amber-100/90 border border-amber-200 px-1.5 py-0.5 rounded-md">
            Top 5
          </span>
          {/* Prev/Next Slide buttons */}
          <button
            type="button"
            onClick={() => setActiveSlide((prev) => (prev === 0 ? 1 : 0))}
            className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-200/70 rounded-md transition-colors cursor-pointer"
            title="Xem bảng xếp hạng trước"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setActiveSlide((prev) => (prev === 0 ? 1 : 0))}
            className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-200/70 rounded-md transition-colors cursor-pointer"
            title="Xem bảng xếp hạng tiếp theo"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Ranking Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-2.5 space-y-2.5 overflow-hidden transition-all duration-300">
        
        {/* Slide Switcher Segmented Pills */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/60 text-[10px]">
          <button
            type="button"
            onClick={() => setActiveSlide(0)}
            className={`flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg font-black transition-all cursor-pointer ${
              activeSlide === 0
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Flame className="w-3 h-3 text-amber-300" />
            <span className="truncate">Nguy cấp, quý hiếm</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSlide(1)}
            className={`flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg font-black transition-all cursor-pointer ${
              activeSlide === 1
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Leaf className="w-3 h-3 text-emerald-200" />
            <span className="truncate">Thông thường</span>
          </button>
        </div>

        {/* Slide Category Description Subtitle */}
        <div className="flex items-center justify-between px-1 text-[10px]">
          <span className="font-extrabold text-slate-500">
            {isEndangered ? 'Nhóm IB, IIB & CITES' : 'Động vật rừng thông thường'}
          </span>
          <span className="text-[9px] font-semibold text-slate-400">
            {isPaused ? '⏸️ Tạm dừng' : '🔄 Tự động chuyển'}
          </span>
        </div>

        {/* Top 5 Facilities List */}
        <div className="space-y-1 animate-in fade-in duration-300 min-h-[175px]">
          {currentList.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400 font-medium">
              Chưa có dữ liệu cơ sở nuôi
            </div>
          ) : (
            currentList.map((fac, idx) => {
              const rank = idx + 1;
              return (
                <button
                  key={fac.id}
                  type="button"
                  onClick={() => handleFacilityClick(fac.id)}
                  title={`Nhấn để mở Sổ Mẫu II của ${fac.name} (${fac.details})`}
                  className="w-full flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all text-left cursor-pointer group active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1 pr-1.5">
                    {/* Rank Badge */}
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] flex-shrink-0 shadow-2xs ${
                        rank === 1
                          ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 font-black ring-1 ring-amber-300'
                          : rank === 2
                          ? 'bg-slate-200 text-slate-800 font-black border border-slate-300'
                          : rank === 3
                          ? 'bg-amber-100 text-amber-900 font-black border border-amber-200'
                          : 'bg-slate-100 text-slate-600 font-bold border border-slate-200/70'
                      }`}
                    >
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                    </div>

                    {/* Facility Info */}
                    <div className="min-w-0 flex-1 leading-tight">
                      <div className="flex items-center gap-1">
                        <span className="font-extrabold text-xs text-slate-900 truncate group-hover:text-emerald-800 transition-colors">
                          {fac.name}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium truncate">
                        {fac.commune}
                        {fac.details && <span className="text-slate-500"> • {fac.details}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Count Badge */}
                  <div className="flex-shrink-0 text-right">
                    <span
                      className={`text-xs font-black font-mono px-2 py-0.5 rounded-lg border shadow-2xs whitespace-nowrap ${
                        isEndangered
                          ? 'text-rose-800 bg-rose-50 border-rose-200/80 group-hover:bg-rose-100'
                          : 'text-emerald-800 bg-emerald-50 border-emerald-200/80 group-hover:bg-emerald-100'
                      }`}
                    >
                      {fac.count.toLocaleString('vi-VN')} <span className="text-[10px] font-sans font-bold">con</span>
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Carousel Slide Indicators & Hint */}
        <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
          <span className="truncate">Nhấp vào cơ sở để xem Sổ Mẫu II</span>
          
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => setActiveSlide(0)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                activeSlide === 0 ? 'w-5 bg-rose-600' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
              }`}
              title="Xem nhóm Nguy cấp, quý hiếm"
            />
            <button
              type="button"
              onClick={() => setActiveSlide(1)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                activeSlide === 1 ? 'w-5 bg-emerald-600' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
              }`}
              title="Xem nhóm Thông thường"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
