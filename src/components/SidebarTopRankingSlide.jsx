import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Trophy,
  Flame,
  Leaf,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
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
  const [tickerKey, setTickerKey] = useState(0);

  // Compute Top 5 Endangered and Top 5 Common facilities with real-time recalculation
  const { topEndangered, topCommon, maxEndangered, maxCommon } = useMemo(() => {
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
          details: eDetails.join(' • '),
        });
      }

      if (cCount > 0) {
        commonFacs.push({
          id: fac.id,
          name: fac.ownerName || fac.facilityName || 'Chưa đặt tên',
          commune: fac.commune || 'Krông Bông',
          code: fac.registrationCode || '',
          count: cCount,
          details: cDetails.join(' • '),
        });
      }
    });

    endangeredFacs.sort((a, b) => b.count - a.count);
    commonFacs.sort((a, b) => b.count - a.count);

    const slicedEndangered = endangeredFacs.slice(0, 5);
    const slicedCommon = commonFacs.slice(0, 5);

    const maxE = Math.max(...slicedEndangered.map((f) => f.count), 1);
    const maxC = Math.max(...slicedCommon.map((f) => f.count), 1);

    return {
      topEndangered: slicedEndangered,
      topCommon: slicedCommon,
      maxEndangered: maxE,
      maxCommon: maxC,
    };
  }, [facilitiesList]);

  // Auto-slide every 5 seconds (smooth loop, pauses when user hovers)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
      setTickerKey((k) => k + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, activeSlide]);

  const handleFacilityClick = (facId) => {
    if (onSelectFacility) onSelectFacility(facId);
    if (onChangeView) onChangeView('LOGBOOK');
  };

  const handleSlideChange = (slideIndex) => {
    setActiveSlide(slideIndex);
    setTickerKey((k) => k + 1);
  };

  const isEndangered = activeSlide === 0;

  // Render a list of ranked facilities with visual progress bars
  const renderRankingList = (list, maxCount, isEndangeredGroup) => {
    if (!list || list.length === 0) {
      return (
        <div className="py-8 text-center text-xs text-slate-400 font-medium bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          Chưa có dữ liệu cơ sở nuôi
        </div>
      );
    }

    return (
      <div className="space-y-1.5">
        {list.map((fac, idx) => {
          const rank = idx + 1;
          const percentage = Math.round((fac.count / maxCount) * 100);

          return (
            <button
              key={fac.id}
              type="button"
              onClick={() => handleFacilityClick(fac.id)}
              title={`Nhấn để mở Sổ Mẫu II của ${fac.name} (${fac.details})`}
              className="w-full relative overflow-hidden rounded-xl border border-slate-200/80 hover:border-emerald-400 bg-white hover:bg-slate-50/90 transition-all duration-200 text-left cursor-pointer group shadow-2xs hover:shadow-xs active:scale-[0.985] p-2"
            >
              {/* Visual herd volume fill bar behind content ("nhìn trực quan") */}
              <div
                className={`absolute inset-y-0 left-0 transition-all duration-700 ease-out pointer-events-none rounded-l-xl ${
                  isEndangeredGroup
                    ? 'bg-gradient-to-r from-rose-500/15 via-amber-500/10 to-transparent'
                    : 'bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent'
                }`}
                style={{ width: `${Math.max(12, percentage)}%` }}
              />

              <div className="relative z-10 flex items-center justify-between gap-2.5">
                {/* Left: Medal / Rank Badge + Facility Name & Commune */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {/* Distinctive Rank Medal Badge */}
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 shadow-2xs transition-transform duration-200 group-hover:scale-105 ${
                      rank === 1
                        ? 'bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 text-amber-950 ring-1 ring-amber-300 shadow-amber-500/20'
                        : rank === 2
                        ? 'bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 text-slate-800 ring-1 ring-slate-300'
                        : rank === 3
                        ? 'bg-gradient-to-br from-amber-100 via-orange-100 to-amber-200 text-amber-900 ring-1 ring-amber-300/80'
                        : 'bg-slate-100/90 text-slate-600 border border-slate-200/90'
                    }`}
                  >
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                  </div>

                  {/* Info: Name, Commune & Species details */}
                  <div className="min-w-0 flex-1 leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-xs text-slate-900 truncate group-hover:text-emerald-800 transition-colors">
                        {fac.name}
                      </span>
                      {rank === 1 && (
                        <span className="text-[9px] bg-amber-400/25 text-amber-900 border border-amber-300/60 font-black px-1 rounded-sm leading-none flex items-center">
                          TOP 1
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                      <span className="text-slate-600 font-semibold">{fac.commune}</span>
                      {fac.details && (
                        <span className="text-slate-400"> • {fac.details}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Quantity Badge & Volume */}
                <div className="flex-shrink-0 text-right">
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-xs font-black font-mono shadow-2xs whitespace-nowrap transition-colors duration-200 ${
                      isEndangeredGroup
                        ? 'text-rose-900 bg-rose-50/90 border-rose-200 group-hover:bg-rose-100 group-hover:border-rose-300'
                        : 'text-emerald-950 bg-emerald-50/90 border-emerald-200 group-hover:bg-emerald-100 group-hover:border-emerald-300'
                    }`}
                  >
                    <span>{fac.count.toLocaleString('vi-VN')}</span>
                    <span className="text-[10px] font-sans font-extrabold opacity-75">con</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="space-y-2 select-none"
    >
      {/* 1. Header with dynamic Category Badge and Smooth Arrows */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-700 border border-amber-300/50 flex items-center justify-center shadow-2xs">
            <Trophy className="w-3.5 h-3.5 stroke-[2.4]" />
          </div>
          <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Bảng Xếp Hạng Nuôi
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[9px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300/80 px-1.5 py-0.5 rounded-md shadow-2xs">
            Top 5
          </span>
          
          {/* Arrow navigation buttons */}
          <button
            type="button"
            onClick={() => handleSlideChange(activeSlide === 0 ? 1 : 0)}
            className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-200/80 rounded-md transition-colors cursor-pointer"
            title="Xem danh mục trước"
          >
            <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={() => handleSlideChange(activeSlide === 0 ? 1 : 0)}
            className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-200/80 rounded-md transition-colors cursor-pointer"
            title="Xem danh mục tiếp theo"
          >
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* 2. Main Card Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-2.5 space-y-2.5 overflow-hidden transition-all duration-300">
        
        {/* Animated Sliding Segmented Tabs */}
        <div className="relative grid grid-cols-2 p-1 bg-slate-100/90 rounded-xl border border-slate-200/70 overflow-hidden">
          {/* Gliding active pill background */}
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg transition-all duration-300 ease-out shadow-xs pointer-events-none ${
              activeSlide === 0
                ? 'left-1 bg-gradient-to-r from-rose-600 to-amber-600'
                : 'left-[calc(50%+2px)] bg-gradient-to-r from-emerald-700 to-teal-700'
            }`}
          />

          <button
            type="button"
            onClick={() => handleSlideChange(0)}
            className={`relative z-10 flex items-center justify-center gap-1.5 py-1.5 px-2 text-[10px] font-black transition-colors duration-200 cursor-pointer ${
              activeSlide === 0 ? 'text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${activeSlide === 0 ? 'text-amber-300 animate-pulse' : 'text-rose-500'}`} />
            <span className="truncate">Nguy cấp, quý hiếm</span>
          </button>

          <button
            type="button"
            onClick={() => handleSlideChange(1)}
            className={`relative z-10 flex items-center justify-center gap-1.5 py-1.5 px-2 text-[10px] font-black transition-colors duration-200 cursor-pointer ${
              activeSlide === 1 ? 'text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Leaf className={`w-3.5 h-3.5 ${activeSlide === 1 ? 'text-emerald-200' : 'text-emerald-600'}`} />
            <span className="truncate">Thông thường</span>
          </button>
        </div>

        {/* Subtitle & Real-time Auto-slide indicator */}
        <div className="flex items-center justify-between px-1 text-[10px]">
          <span className="font-black text-slate-600 flex items-center gap-1">
            {isEndangered ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block animate-ping" />
                Nhóm IB, IIB & CITES
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                Động vật rừng thông thường
              </>
            )}
          </span>

          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md transition-colors ${
              isPaused
                ? 'text-amber-800 bg-amber-50 border border-amber-200'
                : 'text-slate-400 bg-slate-50'
            }`}
          >
            {isPaused ? '⏸️ Đang dừng để xem' : '🔄 Tự động chuyển (5s)'}
          </span>
        </div>

        {/* 3. True Smooth Sliding Carousel Viewport */}
        <div className="overflow-hidden w-full relative">
          <div
            className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] w-[200%]"
            style={{ transform: `translateX(-${activeSlide * 50}%)` }}
          >
            {/* Slide 1: Endangered species */}
            <div className="w-1/2 flex-shrink-0 pr-1">
              {renderRankingList(topEndangered, maxEndangered, true)}
            </div>

            {/* Slide 2: Common species */}
            <div className="w-1/2 flex-shrink-0 pl-1">
              {renderRankingList(topCommon, maxCommon, false)}
            </div>
          </div>
        </div>

        {/* 4. Smooth 5-Second Countdown Progress Ticker Bar */}
        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <div
            key={tickerKey}
            className={`h-full rounded-full transition-all duration-300 ${
              isEndangered
                ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500'
            }`}
            style={{
              animation: isPaused ? 'none' : 'slideTicker 5s linear forwards',
              width: isPaused ? '100%' : undefined,
            }}
          />
        </div>

        {/* 5. Footer with Click Hint and Slide Dots */}
        <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
          <span className="truncate text-slate-500 font-medium">Nhấp vào cơ sở để xem Sổ Mẫu II</span>

          {/* Interactive Slide Dots */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => handleSlideChange(0)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeSlide === 0
                  ? 'w-5 bg-gradient-to-r from-rose-600 to-amber-500'
                  : 'w-1.5 bg-slate-200 hover:bg-slate-300'
              }`}
              title="Xem nhóm Nguy cấp, quý hiếm"
            />
            <button
              type="button"
              onClick={() => handleSlideChange(1)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeSlide === 1
                  ? 'w-5 bg-gradient-to-r from-emerald-600 to-teal-600'
                  : 'w-1.5 bg-slate-200 hover:bg-slate-300'
              }`}
              title="Xem nhóm Thông thường"
            />
          </div>
        </div>

      </div>

      {/* Inline styles for the smooth 5s ticker animation */}
      <style>{`
        @keyframes slideTicker {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </section>
  );
}
