import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, CheckCircle2, Share, ShieldCheck, WifiOff, Plus } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [manualModalOpen, setManualModalOpen] = useState(false);

  useEffect(() => {
    // Check if already running as standalone PWA
    const inStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    setIsStandalone(inStandalone);
    if (inStandalone) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(iosDevice);

    // Listen for Chrome / Android / Edge PWA prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const dismissedUntil = localStorage.getItem('dvhd_pwa_dismissed_until');
      if (!dismissedUntil || Date.now() > Number(dismissedUntil)) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show prompt for iOS if not dismissed recently
    const dismissedUntil = localStorage.getItem('dvhd_pwa_dismissed_until');
    if (iosDevice && (!dismissedUntil || Date.now() > Number(dismissedUntil))) {
      setIsVisible(true);
    }

    // Custom event to allow opening from Settings or Menu
    const handleManualOpen = () => {
      setManualModalOpen(true);
    };
    window.addEventListener('open-pwa-install', handleManualOpen);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('open-pwa-install', handleManualOpen);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('[PWA] User accepted installation');
        setIsVisible(false);
        setManualModalOpen(false);
      }
      setDeferredPrompt(null);
    } else {
      setManualModalOpen(true);
    }
  };

  const handleDismiss = (days = 3) => {
    setIsVisible(false);
    setManualModalOpen(false);
    const expiry = Date.now() + days * 24 * 60 * 60 * 1000;
    localStorage.setItem('dvhd_pwa_dismissed_until', expiry.toString());
  };

  // If already running inside standalone app, don't show prompt banner
  if (isStandalone && !manualModalOpen) return null;

  return (
    <>
      {/* 1. Floating Bottom Banner (Tự động xuất hiện cho người dùng di động / máy tính) */}
      {isVisible && !manualModalOpen && (
        <div className="fixed bottom-20 lg:bottom-5 left-3 right-3 sm:left-auto sm:right-5 sm:max-w-md bg-gradient-to-br from-slate-900/98 via-emerald-950/95 to-slate-900/98 backdrop-blur-xl text-white p-4 rounded-3xl shadow-2xl border border-emerald-500/40 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start justify-between gap-3">
            {/* App Icon */}
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 border border-emerald-400/50 p-1 flex-shrink-0 flex items-center justify-center shadow-md overflow-hidden">
              <img
                src="./pwa-192x192.png"
                alt="Logo Kiểm Lâm"
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-xs font-black uppercase tracking-wide text-white">
                  Cài Đặt App Kiểm Lâm Krông Bông
                </h4>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-400/30">
                  PWA Offline
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug font-medium">
                Cài ứng dụng lên màn hình chính: Mở nhanh tức thì, không vướng thanh trình duyệt, hoạt động 100% khi mất sóng 4G.
              </p>

              {isIOS ? (
                <div className="mt-2.5 text-xs bg-slate-800/80 p-2.5 rounded-2xl text-emerald-200 border border-emerald-500/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                    <Share className="w-3.5 h-3.5 text-sky-400" />
                    <span>Cách cài đặt trên iPhone / iPad:</span>
                  </div>
                  <p className="text-[11px] text-slate-200 leading-relaxed">
                    1. Nhấn nút <strong>Chia sẻ (Share) 📤</strong> ở thanh dưới Safari<br />
                    2. Chọn <strong>"Thêm vào MH chính" (Add to Home Screen) ➕</strong>
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-2.5 px-4 rounded-xl text-xs font-black shadow-lg shadow-emerald-950/50 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Cài Đặt Ứng Dụng Ngay</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleDismiss(3)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors flex-shrink-0 cursor-pointer"
              title="Để sau"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Manual Instruction Modal (Khi người dùng bấm từ Menu Cài Đặt hoặc muốn xem chi tiết) */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-[750] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/90 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 p-1 flex items-center justify-center shadow-inner">
                  <img src="./pwa-192x192.png" alt="Kiểm Lâm" className="w-full h-full object-contain rounded-xl" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <span>Cài Đặt App Kiểm Lâm Krông Bông</span>
                  </h3>
                  <p className="text-xs text-emerald-200/80 font-medium mt-0.5">
                    Chạy độc lập như App di động & Hỗ trợ Ngoại tuyến (Offline)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setManualModalOpen(false)}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/70">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs mb-1">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>Toàn màn hình</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Không vướng thanh địa chỉ, mở bằng icon Kiểm lâm trên màn hình chính.
                  </p>
                </div>
                <div className="p-3 bg-teal-50/80 rounded-2xl border border-teal-200/70">
                  <div className="flex items-center gap-1.5 text-teal-800 font-bold text-xs mb-1">
                    <WifiOff className="w-4 h-4 text-teal-600" />
                    <span>Xem Offline 100%</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Tra cứu 43 cơ sở nuôi và Sổ Mẫu II ngay cả khi đi kiểm tra buôn/thôn mất sóng.
                  </p>
                </div>
              </div>

              {/* Step-by-step instructions */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">
                  Hướng Dẫn Cài Đặt Theo Thiết Bị:
                </h4>

                {/* Android / Chrome / Edge */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>🤖 Điện thoại Android / Trình duyệt Chrome, Edge:</span>
                    </span>
                    {deferredPrompt && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        Sẵn sàng cài đặt
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Bấm nút <strong>"Cài Đặt Ngay"</strong> bên dưới. Nếu không thấy nút bấm, nhấn vào menu <strong>(dấu 3 chấm ⋮)</strong> ở góc trên bên phải Chrome ➔ Chọn <strong>"Cài đặt ứng dụng"</strong> hoặc <strong>"Thêm vào Màn hình chính"</strong>.
                  </p>
                  {deferredPrompt && (
                    <button
                      type="button"
                      onClick={handleInstallClick}
                      className="mt-2 w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-4 rounded-xl text-xs font-black shadow-md cursor-pointer transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Bấm vào đây để Cài Đặt Ngay</span>
                    </button>
                  )}
                </div>

                {/* iPhone / iPad */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>🍎 Điện thoại iPhone / iPad (Trình duyệt Safari):</span>
                  </span>
                  <div className="text-xs text-slate-600 space-y-1.5 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[11px] flex-shrink-0">
                        1
                      </span>
                      <span>Mở trang bằng trình duyệt <strong>Safari</strong> trên iPhone.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[11px] flex-shrink-0">
                        2
                      </span>
                      <span>Nhấn vào biểu tượng <strong>Chia sẻ (Share) 📤</strong> ở thanh công cụ dưới đáy màn hình.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[11px] flex-shrink-0">
                        3
                      </span>
                      <span>Cuộn xuống và chọn mục <strong>"Thêm vào Màn hình chính" (Add to Home Screen) ➕</strong>.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[11px] flex-shrink-0">
                        4
                      </span>
                      <span>Nhấn <strong>"Thêm" (Add)</strong> ở góc trên bên phải. Icon ứng dụng Kiểm lâm sẽ xuất hiện trên màn hình chính!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                Hạt Kiểm lâm khu vực Krông Bông
              </span>
              <button
                type="button"
                onClick={() => setManualModalOpen(false)}
                className="px-5 py-2 text-xs font-extrabold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-all cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
