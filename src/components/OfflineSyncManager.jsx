import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function OfflineSyncManager({ onSyncWithCloud }) {
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [showSyncSuccessToast, setShowSyncSuccessToast] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = async () => {
      console.log('[Network] Internet restored. Auto-syncing data to cloud...');
      setIsOnline(true);
      setIsSyncing(true);
      
      try {
        if (onSyncWithCloud) {
          await onSyncWithCloud();
        }
        setShowSyncSuccessToast(true);
        setTimeout(() => {
          setShowSyncSuccessToast(false);
        }, 4500);
      } catch (err) {
        console.warn('[Network] Auto-sync after reconnect failed:', err);
      } finally {
        setIsSyncing(false);
      }
    };

    const handleOffline = () => {
      console.log('[Network] Lost connection. Operating in offline PWA mode.');
      setIsOnline(false);
      setShowSyncSuccessToast(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Heartbeat check every 4 seconds in case browser state changes silently
    const interval = setInterval(() => {
      if (typeof navigator !== 'undefined' && navigator.onLine !== isOnline) {
        if (!navigator.onLine) {
          handleOffline();
        } else {
          handleOnline();
        }
      }
    }, 4000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [onSyncWithCloud, isOnline]);

  return (
    <>
      {/* 1. Offline Banner: Hiện khi mất sóng / không có mạng internet */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[999] bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white px-4 py-2 text-xs shadow-lg flex items-center justify-between animate-in slide-in-from-top-full duration-300">
          <div className="flex items-center gap-2.5 max-w-5xl mx-auto w-full">
            <div className="p-1 bg-white/20 rounded-lg flex-shrink-0">
              <WifiOff className="w-4 h-4 text-amber-200 animate-pulse" />
            </div>
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="font-extrabold uppercase tracking-wide text-amber-200 text-[11px] sm:text-xs">
                Chế độ Ngoại tuyến (Offline):
              </span>
              <span className="font-medium text-amber-50 text-[11px] sm:text-xs">
                Đang mất sóng hoặc không có mạng. Bạn vẫn xem & tra cứu bình thường toàn bộ 43 cơ sở và Sổ Mẫu II từ bộ nhớ máy.
              </span>
            </div>
            <span className="hidden md:inline-flex items-center gap-1 bg-amber-900/60 text-amber-200 px-2.5 py-1 rounded-full text-[10px] font-bold border border-amber-500/40">
              Tự động đồng bộ khi có mạng
            </span>
          </div>
        </div>
      )}

      {/* 2. Syncing Toast: Khi vừa có mạng trở lại và đang gửi dữ liệu lên Firestore */}
      {isSyncing && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-[999] bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3">
          <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
          <div className="text-xs">
            <p className="font-bold text-white">Đã kết nối lại Internet</p>
            <p className="text-[11px] text-emerald-300">Đang tự động đồng bộ dữ liệu lên máy chủ...</p>
          </div>
        </div>
      )}

      {/* 3. Sync Success Toast: Thông báo đồng bộ hoàn tất */}
      {showSyncSuccessToast && !isSyncing && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-[999] bg-emerald-900/95 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-400/50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="p-1.5 bg-emerald-500/20 rounded-xl text-emerald-400">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-white">Đã đồng bộ thành công!</p>
            <p className="text-[11px] text-emerald-200">Dữ liệu trên máy và máy chủ đã được đồng nhất an toàn.</p>
          </div>
        </div>
      )}
    </>
  );
}
