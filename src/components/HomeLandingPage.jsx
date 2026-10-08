import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, MapPin, LogIn, QrCode, ChevronRight, Trees, Leaf } from 'lucide-react';

export default function HomeLandingPage({ onOpenLogin }) {
  // Animated text state - cycle through flash colors
  const [glowPhase, setGlowPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowPhase((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Split title into individual characters for staggered animation
  const titleText = 'HẠT KIỂM LÂM KHU VỰC KRÔNG BÔNG';
  const titleChars = titleText.split('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white flex flex-col font-sans antialiased overflow-hidden relative">
      
      {/* ===== ANIMATED BACKGROUND PARTICLES ===== */}
      <div className="landing-particles pointer-events-none" aria-hidden="true">
        <div className="landing-particle landing-particle-1" />
        <div className="landing-particle landing-particle-2" />
        <div className="landing-particle landing-particle-3" />
        <div className="landing-particle landing-particle-4" />
        <div className="landing-particle landing-particle-5" />
        <div className="landing-particle landing-particle-6" />
      </div>

      {/* ===== AMBIENT GLOW ORBS ===== */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* ===== TOP NAV BAR ===== */}
      <nav className="relative z-20 px-4 sm:px-8 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-1.5 shadow-lg flex items-center justify-center">
            <img
              src="./images/logo_kiem_lam.png"
              alt="Logo Kiểm Lâm"
              className="w-full h-full object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-emerald-300/80 uppercase tracking-widest">Chi cục Kiểm lâm Đắk Lắk</p>
            <p className="text-[10px] text-white/50 font-medium">Ứng dụng Quản lý ĐVHD Mẫu II</p>
          </div>
        </div>
        <button
          onClick={onOpenLogin}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white px-4 py-2.5 rounded-xl text-xs font-bold border border-white/15 hover:border-white/30 transition-all duration-300 active:scale-95 cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          <span className="hidden sm:inline">Đăng nhập</span>
        </button>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 sm:px-8 py-6 sm:py-10">
        
        {/* VIDEO BANNER */}
        <div className="w-full max-w-5xl mb-6 sm:mb-8 relative group">
          <div className="relative rounded-3xl overflow-hidden border border-emerald-500/20 shadow-2xl shadow-emerald-900/30 aspect-video max-h-[380px] sm:max-h-[420px]">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster="./images/banner.jpg"
              className="w-full h-full object-cover object-center block"
            >
              <source src="./banner.mp4" type="video/mp4" />
              <source src="./images/banner.mp4" type="video/mp4" />
              <img
                src="./images/banner.jpg"
                alt="Banner Hạt Kiểm lâm khu vực Krông Bông"
                className="w-full h-full object-cover object-center block"
              />
            </video>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 via-transparent to-emerald-950/40 pointer-events-none" />
            
            {/* Decorative corner accents */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-emerald-400/40 rounded-tl-xl pointer-events-none" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-emerald-400/40 rounded-tr-xl pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-400/40 rounded-bl-xl pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400/40 rounded-br-xl pointer-events-none" />
          </div>
        </div>

        {/* ===== FLASH TITLE ===== */}
        <div className="text-center space-y-4 sm:space-y-5 max-w-4xl mx-auto mb-6 sm:mb-8">
          
          {/* Badge pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] sm:text-xs landing-fade-in" style={{ animationDelay: '0.2s' }}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-extrabold backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>TT 85/2025/TT-BNNMT</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 font-extrabold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Nuôi Sinh Sản & Sinh Trưởng</span>
            </span>
          </div>

          {/* Logo chính thức */}
          <div className="landing-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-2.5 shadow-2xl landing-logo-pulse">
              <img
                src="./images/logo_kiem_lam.png"
                alt="Phù Hiệu Kiểm Lâm Việt Nam"
                className="w-full h-full object-contain drop-shadow-lg"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          </div>

          {/* ===== ANIMATED FLASH TITLE ===== */}
          <div className="landing-fade-in" style={{ animationDelay: '0.6s' }}>
            <h1 className="landing-flash-title text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-tight" aria-label={titleText}>
              {titleChars.map((char, i) => (
                <span
                  key={i}
                  className="landing-flash-char"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>
            {/* Shimmer overlay on title */}
            <div className="landing-shimmer-overlay" aria-hidden="true" />
          </div>

          {/* Subtitle */}
          <div className="landing-fade-in" style={{ animationDelay: '0.8s' }}>
            <p className="text-sm sm:text-base md:text-lg text-emerald-100/80 font-semibold max-w-2xl mx-auto leading-relaxed">
              Ứng Dụng <span className="text-amber-300 font-extrabold">Sổ Theo Dõi Quản Lý</span> Động Vật Hoang Dã Điện Tử
            </p>
            <p className="text-xs sm:text-sm text-white/40 font-medium mt-1.5">
              Hệ thống quản lý hiện trạng & biến động tăng giảm đàn theo Thông tư 85/2025/TT-BNNMT
            </p>
          </div>
        </div>

        {/* ===== CTA BUTTONS ===== */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-8 sm:mb-10 landing-fade-in" style={{ animationDelay: '1s' }}>
          <button
            onClick={onOpenLogin}
            className="group flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 active:scale-95 cursor-pointer border border-emerald-400/40"
          >
            <LogIn className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span>Đăng Nhập Tài Khoản</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <div className="flex items-center gap-2 text-white/30 text-xs font-bold">
            <div className="w-6 h-px bg-white/20" />
            hoặc
            <div className="w-6 h-px bg-white/20" />
          </div>

          <button
            onClick={onOpenLogin}
            className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-extrabold text-sm sm:text-base border border-white/15 hover:border-amber-400/40 transition-all duration-300 active:scale-95 cursor-pointer shadow-lg"
          >
            <QrCode className="w-5 h-5 text-amber-400 transition-transform group-hover:scale-110" />
            <span>Quét Mã QR Cơ Sở</span>
          </button>
        </div>

        {/* ===== WILDLIFE SHOWCASE CARDS ===== */}
        <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 landing-fade-in" style={{ animationDelay: '1.2s' }}>
          {[
            { emoji: '🐆', name: 'Cầy Vòi Hương', img: './images/cay_voi.jpg', color: 'emerald' },
            { emoji: '🦔', name: 'Nhím', img: './images/nhim.jpg', color: 'amber' },
            { emoji: '🐦', name: 'Chào Mào', img: './images/chao_mao.jpg', color: 'teal' },
            { emoji: '🐁', name: 'Dúi Mốc', img: './images/dui_moc.jpg', color: 'rose' },
          ].map((animal, idx) => (
            <div
              key={idx}
              className="landing-animal-card group relative rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-400/30 bg-white/5 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500 cursor-default"
              style={{ animationDelay: `${1.2 + idx * 0.1}s` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={animal.img}
                  alt={animal.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg">{animal.emoji}</span>
                  <span className="text-xs sm:text-sm font-extrabold text-white truncate drop-shadow-md">{animal.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info note */}
        <div className="text-center landing-fade-in" style={{ animationDelay: '1.4s' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] sm:text-xs font-semibold backdrop-blur-sm">
            <Trees className="w-3.5 h-3.5 text-emerald-400/60" />
            <span>Vui lòng <strong className="text-emerald-300">đăng nhập</strong> hoặc <strong className="text-amber-300">quét mã QR</strong> dán tại cơ sở nuôi để xem thông tin chi tiết</span>
          </div>
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-white/5 py-4 text-center">
        <div className="space-y-1 px-4">
          <p className="text-xs font-extrabold text-emerald-400/70">© Hạt Kiểm lâm khu vực Krông Bông</p>
          <p className="text-[10px] text-white/30 font-medium">
            Sử dụng và lưu hành trong phạm vi quản lý của đơn vị.
          </p>
        </div>
      </footer>

      {/* Login Modal handled by parent */}
    </div>
  );
}
