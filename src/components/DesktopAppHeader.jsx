import React, { useState, useEffect } from 'react';
import {
  Monitor,
  Maximize2,
  Minimize2,
  Keyboard,
  Sliders,
  Check,
  Zap,
  HardDrive,
  Clock,
  Shield,
  HelpCircle,
  X,
  Sparkles,
} from 'lucide-react';

export default function DesktopAppHeader({
  onToggleFullscreen,
  isFullscreen,
  density,
  onChangeDensity,
  onOpenShortcutsModal,
  onOpenUISettings,
}) {

  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
          ' - ' +
          now.toLocaleDateString('vi-VN')
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs font-mono select-none sticky top-0 z-40 shadow-lg">
      {/* Left App Brand & OS Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold tracking-wide">
          <Monitor className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>WILDLIFE MANAGER DESKTOP v2.5</span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400 border-l border-slate-700 pl-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-emerald-400 font-bold">ONLINE</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
            <span>Auto-Saved LocalStorage</span>
          </span>
        </div>
      </div>

      {/* Right Desktop Quick Controls */}
      <div className="flex items-center gap-2">
        {/* Desktop Density Selector */}
        <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
          <button
            onClick={() => onChangeDensity('COMPACT')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
              density === 'COMPACT'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Chế độ máy tính hiển thị nén gọn (Phù hợp màn hình 1080p / 2K)"
          >
            📊 Máy tính Nén Gọn
          </button>
          <button
            onClick={() => onChangeDensity('SPACIOUS')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
              density === 'SPACIOUS'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Chế độ máy tính rộng rãi"
          >
            🌿 Rộng Rãi
          </button>
        </div>

        {/* UI Settings Button */}
        <button
          onClick={onOpenUISettings}
          className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 rounded-lg border border-slate-700 transition-all font-sans font-semibold text-[11px]"
          title="Tùy chỉnh giao diện làm việc, màu sắc, cỡ chữ và mật độ bảng"
        >
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Cài Đặt Giao Diện</span>
        </button>

        {/* Shortcuts Button */}
        <button
          onClick={onOpenShortcutsModal}
          className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-indigo-200 rounded-lg border border-slate-700 transition-all font-sans font-semibold text-[11px]"
          title="Xem danh sách phím tắt máy tính (Alt+1, Alt+2, Alt+3, Alt+4, Alt+N...)"
        >
          <Keyboard className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Phím Tắt</span>
        </button>


        {/* Fullscreen Button */}
        <button
          onClick={onToggleFullscreen}
          className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-lg transition-all font-sans font-bold text-[11px] shadow-sm active:scale-95"
          title="Bật/Tắt chế độ Toàn màn hình Máy tính (Fullscreen F11)"
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Thoát F11</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Toàn Màn Hình</span>
            </>
          )}
        </button>

        {/* Desktop Realtime Clock */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/80 text-amber-300 font-mono text-[11px]">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>{timeString}</span>
        </div>
      </div>
    </div>
  );
}
