import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

const WILDLIFE_SHOWCASE = [
  {
    name: 'Cầy Vòi Hương',
    group: 'Nhóm IIB',
    img: './images/cay_voi.jpg',
    delay: '0s',
  },
  {
    name: 'Dúi Mốc Lớn',
    group: 'Thông thường',
    img: './images/dui_moc.jpg',
    delay: '0.6s',
  },
  {
    name: 'Nhím Bờm',
    group: 'Thông thường',
    img: './images/nhim.jpg',
    delay: '1.2s',
  },
  {
    name: 'Chim Chào Mào',
    group: 'Lớp Chim',
    img: './images/chao_mao.jpg',
    delay: '1.8s',
  },
];

export default function HeroBanner() {
  return (
    <div className="mb-4 relative w-full h-[155px] sm:h-[168px] lg:h-[180px] rounded-2xl overflow-hidden border border-emerald-700/30 shadow-md bg-gradient-to-r from-[#042217] via-[#073726] to-[#0a4631] select-none group">
      {/* Subtle Ambient Forest Background Layer */}
      <img
        src="./images/banner.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-15 blur-[2px] scale-105 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#042217]/95 via-[#073726]/85 to-[#042217]/60 pointer-events-none" />

      {/* Decorative Glowing Orbs */}
      <div className="absolute -left-12 -top-12 w-48 h-48 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-1/4 -bottom-16 w-56 h-56 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Flex Container */}
      <div className="relative z-10 h-full w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* LEFT: Official Title & Identity */}
        <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1.5 sm:space-y-2">
          {/* Top Agency Badge */}
          <div className="inline-flex items-center gap-2 self-start bg-white/10 backdrop-blur-md border border-emerald-400/25 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-emerald-200 uppercase truncate">
              Hạt Kiểm lâm khu vực Krông Bông
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-base sm:text-xl lg:text-2xl xl:text-[26px] font-black text-white tracking-tight leading-tight">
            QUẢN LÝ CƠ SỞ NUÔI{' '}
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
              ĐỘNG VẬT HOANG DÃ
            </span>
          </h1>

          {/* Subtitle / Legal Basis */}
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-emerald-100/85 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 hidden sm:block" />
            <p className="truncate">
              Sổ theo dõi điện tử Mẫu II · Theo Thông tư 85/2025/TT-BNNMT & NĐ 84/2021/NĐ-CP
            </p>
          </div>
        </div>

        {/* RIGHT: Panoramic Animated Wildlife Showcase (4 Angled Cards) */}
        <div className="hidden md:flex items-center gap-2.5 lg:gap-3 h-[126px] lg:h-[138px] flex-shrink-0 pr-1">
          {WILDLIFE_SHOWCASE.map((item) => (
            <div
              key={item.name}
              style={{ animationDelay: item.delay }}
              className="relative w-24 lg:w-32 xl:w-36 h-full rounded-xl overflow-hidden border border-white/20 shadow-lg bg-slate-900 transform -skew-x-3 hover:skew-x-0 hover:scale-105 transition-all duration-500 group/card"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover object-center scale-110 group-hover/card:scale-125 transition-transform duration-700 animate-[pulse_8s_ease-in-out_infinite]"
              />
              {/* Bottom gradient overlay with species label */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-1.5 left-2 right-2">
                <div className="text-[10px] lg:text-[11px] font-bold text-white leading-tight truncate">
                  {item.name}
                </div>
                <div className="text-[9px] text-emerald-300 font-semibold truncate flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-300 flex-shrink-0" />
                  <span>{item.group}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Compact Wildlife Thumbnails (Shown on sm/xs screens) */}
        <div className="flex md:hidden items-center -space-x-2.5 flex-shrink-0">
          {WILDLIFE_SHOWCASE.slice(0, 3).map((item) => (
            <div
              key={item.name}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-emerald-400/60 shadow-md bg-slate-900"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
