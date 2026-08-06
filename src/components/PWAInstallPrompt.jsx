import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, CheckCircle2, Share } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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

    // Listen for Chrome / Android PWA prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show prompt for iOS if not dismissed
    const dismissed = localStorage.getItem('dvhd_pwa_dismissed');
    if (iosDevice && !dismissed) {
      setIsVisible(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('[PWA] User accepted installation');
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('dvhd_pwa_dismissed', 'true');
  };

  if (!isVisible || isStandalone) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-5 left-4 right-4 sm:left-auto sm:right-5 sm:max-w-sm bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/30 z-50 animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-start justify-between gap-3">
        <div className="p-2.5 bg-emerald-600/30 border border-emerald-400/40 rounded-xl text-emerald-400">
          <Smartphone className="w-6 h-6 animate-pulse" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wide text-white">
              Cài đặt Web App Sổ ĐVHD
            </h4>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">
              PWA
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1 leading-relaxed font-medium">
            Thêm ứng dụng vào Màn hình chính để sử dụng mượt mà như app gốc & hoạt động offline không cần mạng!
          </p>

          {isIOS ? (
            <div className="mt-2.5 text-[10px] bg-slate-800 p-2 rounded-lg text-emerald-300 font-medium border border-slate-700 flex items-center gap-1.5">
              <span>Bấm nút chia sẻ <Share className="w-3 h-3 inline text-sky-400" /> rồi chọn <strong>"Thêm vào MH chính"</strong></span>
            </div>
          ) : (
            <button
              onClick={handleInstallClick}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-3 rounded-xl text-xs font-bold shadow-md shadow-emerald-900/40 transition-all active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              <span>Cài đặt Web App ngay</span>
            </button>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          title="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
