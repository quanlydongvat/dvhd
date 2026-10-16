import React from 'react';
import { LogIn, Trees, Lock } from 'lucide-react';
import Login from './Login';

export default function HomeLandingPage({ onLoginSuccess }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white flex flex-col font-sans antialiased overflow-x-hidden relative">
      {/* Background ambient glow orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* ===== TOP NAV BAR: Đã bỏ chữ góc trái trên cùng cho cân đối ===== */}
      <nav className="relative z-20 px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-1.5 shadow-lg flex items-center justify-center flex-shrink-0">
            <img
              src="./images/logo_kiem_lam.png"
              alt="Logo Kiểm Lâm"
              className="w-full h-full object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => document.getElementById('login-form-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-emerald-400/30 transition-all duration-300 active:scale-95 cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          <span>Đăng nhập</span>
        </button>
      </nav>

      {/* ===== MAIN CONTENT: 2 CỘT CÂN ĐỐI ĐẸP MẮT (50% - 50%) ===== */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-10 flex flex-col justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* CỘT 1 (BÊN TRÁI): THÔNG TIN ĐƠN VỊ, VIDEO BANNER & LOÀI NUÔI */}
          <div className="flex flex-col space-y-4">
            
            {/* TIÊU ĐỀ & MÔ TẢ ĐƠN VỊ */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/25 text-emerald-300 text-xs font-bold w-fit mb-0.5">
                <span>🌲 Hạt Kiểm lâm khu vực Krông Bông</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
                Quản Lý Động Vật Hoang Dã
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 font-semibold leading-relaxed">
                Ứng Dụng <span className="text-amber-300 font-extrabold">Sổ Theo Dõi Quản Lý</span> Điện Tử (Mẫu II)
              </p>
              <p className="text-[11px] sm:text-xs text-white/60 font-medium leading-normal">
                Hệ thống theo dõi hiện trạng & biến động tăng giảm đàn động vật hoang dã nuôi sinh sản trên địa bàn quản lý.
              </p>
            </div>

            {/* VIDEO BANNER */}
            <div className="relative rounded-3xl overflow-hidden border border-emerald-500/20 shadow-2xl shadow-emerald-950/60 aspect-video max-h-[285px] w-full bg-slate-900/60 group">
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
              
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              
              {/* Corner accents */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-emerald-400/40 rounded-tl-lg pointer-events-none" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-emerald-400/40 rounded-tr-lg pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-400/40 rounded-bl-lg pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-400/40 rounded-br-lg pointer-events-none" />
            </div>

            {/* WILDLIFE SHOWCASE CARDS (KHÔNG TRUNCATE TÊN LOÀI) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-0.5">
              {[
                { emoji: '🐆', name: 'Cầy Vòi Hương', img: './images/cay_voi.jpg' },
                { emoji: '🦔', name: 'Nhím', img: './images/nhim.jpg' },
                { emoji: '🐦', name: 'Chào Mào', img: './images/chao_mao.jpg' },
                { emoji: '🐁', name: 'Dúi Mốc', img: './images/dui_moc.jpg' },
              ].map((animal, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-400/40 bg-white/5 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 cursor-default"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={animal.img}
                      alt={animal.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-1.5 sm:p-2 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent">
                    <div className="flex items-center gap-1">
                      <span className="text-xs sm:text-sm flex-shrink-0">{animal.emoji}</span>
                      <span className="text-[10px] sm:text-[11px] font-extrabold text-white leading-tight drop-shadow-md">
                        {animal.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ghi chú hướng dẫn nhỏ */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-[11px] font-medium backdrop-blur-sm w-fit">
              <Trees className="w-3.5 h-3.5 text-emerald-400/80 flex-shrink-0" />
              <span>Cán bộ Kiểm lâm hoặc Chủ cơ sở vui lòng đăng nhập để thao tác.</span>
            </div>
          </div>

          {/* CỘT 2 (BÊN PHẢI): KHUNG ĐĂNG NHẬP CÂN ĐỐI */}
          <div id="login-form-section" className="flex justify-center w-full">
            <div className="w-full max-w-md">
              <Login onLoginSuccess={onLoginSuccess} isEmbedded={true} />
            </div>
          </div>

        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-white/5 py-3 text-center">
        <div className="space-y-0.5 px-4">
          <p className="text-xs font-extrabold text-emerald-400/80">© Hạt Kiểm lâm khu vực Krông Bông</p>
          <p className="text-[10px] text-white/40 font-medium">
            Sử dụng và lưu hành trong phạm vi quản lý của đơn vị.
          </p>
        </div>
      </footer>
    </div>
  );
}
