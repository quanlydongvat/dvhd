import React from 'react';
import {
  Settings,
  X,
  Palette,
  Eye,
  Type,
  Map,
  Volume2,
  VolumeX,
  RotateCcw,
  Check,
  Sparkles,
  Monitor,
  Moon,
  Sun,
  Maximize2,
  Table,
} from 'lucide-react';

export const DEFAULT_UI_SETTINGS = {
  theme: 'EMERALD', // 'EMERALD' | 'INDIGO' | 'DARK' | 'LIGHT'
  density: 'STANDARD', // 'COMPACT' | 'STANDARD' | 'SPACIOUS'
  fontSize: 'MEDIUM', // 'SMALL' | 'MEDIUM' | 'LARGE'
  underlineColNumbers: true,
  defaultMapTile: 'HYBRID', // 'HYBRID' | 'SATELLITE' | 'STREETS' | 'TERRAIN'
  enableSoundEffects: true,
  autoSaveInterval: 'REALTIME', // 'REALTIME' | '5MIN' | 'MANUAL'
};

export default function UISettingsModal({
  isOpen,
  onClose,
  uiSettings = DEFAULT_UI_SETTINGS,
  onUpdateSettings,
  onResetSettings,
}) {
  if (!isOpen) return null;

  const handleToggle = (key) => {
    onUpdateSettings({ ...uiSettings, [key]: !uiSettings[key] });
  };

  const handleChange = (key, value) => {
    onUpdateSettings({ ...uiSettings, [key]: value });
  };

  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Cài Đặt Giao Diện Làm Việc</h3>
              <p className="text-xs text-slate-300 font-mono">Tùy chỉnh màu sắc, mật độ bảng, cỡ chữ & bản đồ GIS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
          {/* 1. Theme Color Selection */}
          <div>
            <label className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
              <Palette className="w-4 h-4 text-emerald-600" />
              <span>Chủ Đề & Tông Màu Giao Diện</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Emerald */}
              <button
                onClick={() => handleChange('theme', 'EMERALD')}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  uiSettings.theme === 'EMERALD'
                    ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-600" />
                  {uiSettings.theme === 'EMERALD' && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <span className="block text-xs font-bold text-slate-900">Xanh Kiểm Lâm</span>
                <span className="text-[10px] text-slate-500 font-medium">Mặc định chính thức</span>
              </button>

              {/* Indigo */}
              <button
                onClick={() => handleChange('theme', 'INDIGO')}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  uiSettings.theme === 'INDIGO'
                    ? 'border-indigo-500 bg-indigo-50/80 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-4 h-4 rounded-full bg-indigo-600" />
                  {uiSettings.theme === 'INDIGO' && <Check className="w-4 h-4 text-indigo-600" />}
                </div>
                <span className="block text-xs font-bold text-slate-900">Xanh Đại Dương</span>
                <span className="text-[10px] text-slate-500 font-medium">Phong cách Navy</span>
              </button>

              {/* Dark */}
              <button
                onClick={() => handleChange('theme', 'DARK')}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  uiSettings.theme === 'DARK'
                    ? 'border-slate-700 bg-slate-900 text-white ring-2 ring-slate-700/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Moon className="w-4 h-4 text-amber-400" />
                  {uiSettings.theme === 'DARK' && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <span className={`block text-xs font-bold ${uiSettings.theme === 'DARK' ? 'text-white' : 'text-slate-900'}`}>Tối Sang Trọng</span>
                <span className={`text-[10px] ${uiSettings.theme === 'DARK' ? 'text-slate-400' : 'text-slate-500'} font-medium`}>Chế độ làm việc ban đêm</span>
              </button>

              {/* Light */}
              <button
                onClick={() => handleChange('theme', 'LIGHT')}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  uiSettings.theme === 'LIGHT'
                    ? 'border-slate-400 bg-white ring-2 ring-slate-400/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Sun className="w-4 h-4 text-amber-500" />
                  {uiSettings.theme === 'LIGHT' && <Check className="w-4 h-4 text-slate-900" />}
                </div>
                <span className="block text-xs font-bold text-slate-900">Sáng Tối Giản</span>
                <span className="text-[10px] text-slate-500 font-medium">Độ tương phản cao</span>
              </button>
            </div>
          </div>

          {/* 2. Density & Table Spacing */}
          <div>
            <label className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
              <Table className="w-4 h-4 text-emerald-600" />
              <span>Mật Độ Hiển Thị Bảng (Density)</span>
            </label>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleChange('density', 'COMPACT')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  uiSettings.density === 'COMPACT'
                    ? 'border-emerald-500 bg-emerald-50 font-bold text-emerald-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="block text-xs font-bold">📊 Siêu Nén Gọn</span>
                <span className="text-[10px] text-slate-500 font-medium">Hiển thị nhiều dòng nhất</span>
              </button>

              <button
                onClick={() => handleChange('density', 'STANDARD')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  uiSettings.density === 'STANDARD'
                    ? 'border-emerald-500 bg-emerald-50 font-bold text-emerald-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="block text-xs font-bold">⚖️ Tiêu Chuẩn</span>
                <span className="text-[10px] text-slate-500 font-medium">Cân đối & Dễ nhìn</span>
              </button>

              <button
                onClick={() => handleChange('density', 'SPACIOUS')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  uiSettings.density === 'SPACIOUS'
                    ? 'border-emerald-500 bg-emerald-50 font-bold text-emerald-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="block text-xs font-bold">🌿 Thoáng Rộng</span>
                <span className="text-[10px] text-slate-500 font-medium">Khoảng cách ô rộng rãi</span>
              </button>
            </div>
          </div>

          {/* 3. Font Size & Formatting Rules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                <Type className="w-4 h-4 text-emerald-600" />
                <span>Kích Thước Chữ (Font Size)</span>
              </label>

              <select
                value={uiSettings.fontSize}
                onChange={(e) => handleChange('fontSize', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
              >
                <option value="SMALL">Cỡ nhỏ (11px) - Tối ưu màn hình nhỏ</option>
                <option value="MEDIUM">Cỡ vừa (12px) - Chuẩn mặc định</option>
                <option value="LARGE">Cỡ lớn (14px) - Cho cán bộ dễ đọc</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
                <Map className="w-4 h-4 text-emerald-600" />
                <span>Lớp Bản Đồ GIS Mặc Định</span>
              </label>

              <select
                value={uiSettings.defaultMapTile}
                onChange={(e) => handleChange('defaultMapTile', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
              >
                <option value="HYBRID">🛰️ Google Hybrid (Vệ Tinh + Đường)</option>
                <option value="SATELLITE">🌍 Google Satellite (Vệ Tinh)</option>
                <option value="STREETS">🗺️ Google Streets (Bản Đồ Đường)</option>
                <option value="TERRAIN">⛰️ Google Terrain (Địa Hình)</option>
              </select>
            </div>
          </div>

          {/* 4. Formatting Toggles */}
          <div className="border-t border-slate-200 pt-4 space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div>
                <span className="block text-xs font-bold text-slate-900">Gạch chân số thứ tự các cột (<u>1</u>, <u>2</u>, ... <u>19</u>)</span>
                <span className="text-[11px] text-slate-500">Quy định Kiểm lâm: Dễ phân biệt số thứ tự cột với số lượng cá thể loài</span>
              </div>
              <input
                type="checkbox"
                checked={uiSettings.underlineColNumbers}
                onChange={() => handleToggle('underlineColNumbers')}
                className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div>
                <span className="block text-xs font-bold text-slate-900">Âm thanh phản hồi khi thao tác (Sound Effects)</span>
                <span className="text-[11px] text-slate-500">Phát âm thanh nhẹ khi thêm, sửa hoặc lưu nhật ký biến động</span>
              </div>
              <input
                type="checkbox"
                checked={uiSettings.enableSoundEffects}
                onChange={() => handleToggle('enableSoundEffects')}
                className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <button
            onClick={onResetSettings}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Khôi phục mặc định</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all scale-105"
          >
            Áp Dụng & Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
