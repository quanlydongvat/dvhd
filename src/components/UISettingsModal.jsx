import React from 'react';
import {
  Settings,
  X,
  Palette,
  Type,
  Map,
  RotateCcw,
  Check,
  Table,
  Sparkles,
  Moon,
  Sun,
  Layers,
} from 'lucide-react';

export const DEFAULT_UI_SETTINGS = {
  theme: 'EMERALD', // 'EMERALD' | 'INDIGO' | 'DARK'
  density: 'STANDARD', // 'COMPACT' | 'STANDARD' | 'SPACIOUS'
  fontSize: 'MEDIUM', // 'SMALL' | 'MEDIUM' | 'LARGE'
  underlineColNumbers: true,
  defaultMapTile: 'HYBRID', // 'HYBRID' | 'SATELLITE' | 'STREETS' | 'TERRAIN'
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
    <div className="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200/90 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* Premium Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white px-6 py-4 flex items-center justify-between flex-shrink-0 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 rounded-2xl shadow-inner backdrop-blur-xs">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Cài Đặt Giao Diện Làm Việc</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-xs text-emerald-200/80 font-medium mt-0.5">
                Tùy chỉnh tông màu, độ nén bảng và lớp bản đồ GIS
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all relative z-10 cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
          
          {/* 1. Theme Selection */}
          <div>
            <label className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider mb-3">
              <Palette className="w-4 h-4 text-emerald-600" />
              <span>Chủ Đề & Tông Màu Giao Diện</span>
            </label>

            <div className="grid grid-cols-3 gap-3">
              {/* Emerald */}
              <button
                type="button"
                onClick={() => handleChange('theme', 'EMERALD')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                  uiSettings.theme === 'EMERALD'
                    ? 'border-emerald-500 bg-emerald-50/90 ring-2 ring-emerald-500/30 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-600 ring-2 ring-emerald-200" />
                  {uiSettings.theme === 'EMERALD' && (
                    <div className="p-0.5 bg-emerald-600 text-white rounded-full">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <span className="block text-xs font-extrabold text-slate-900">Xanh Kiểm Lâm</span>
                <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">Mặc định chuẩn</span>
              </button>

              {/* Indigo */}
              <button
                type="button"
                onClick={() => handleChange('theme', 'INDIGO')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                  uiSettings.theme === 'INDIGO'
                    ? 'border-indigo-500 bg-indigo-50/90 ring-2 ring-indigo-500/30 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-4 h-4 rounded-full bg-indigo-600 ring-2 ring-indigo-200" />
                  {uiSettings.theme === 'INDIGO' && (
                    <div className="p-0.5 bg-indigo-600 text-white rounded-full">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <span className="block text-xs font-extrabold text-slate-900">Xanh Đại Dương</span>
                <span className="text-[10px] text-indigo-700 font-semibold mt-0.5 block">Phong cách Navy</span>
              </button>

              {/* Dark */}
              <button
                type="button"
                onClick={() => handleChange('theme', 'DARK')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                  uiSettings.theme === 'DARK'
                    ? 'border-slate-800 bg-slate-900 text-white ring-2 ring-slate-700/50 shadow-md'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Moon className="w-4 h-4 text-amber-400" />
                  {uiSettings.theme === 'DARK' && (
                    <div className="p-0.5 bg-emerald-500 text-slate-950 rounded-full">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <span className={`block text-xs font-extrabold ${uiSettings.theme === 'DARK' ? 'text-white' : 'text-slate-900'}`}>Tối Sang Trọng</span>
                <span className={`text-[10px] ${uiSettings.theme === 'DARK' ? 'text-slate-400' : 'text-slate-500'} font-semibold mt-0.5 block`}>Chế độ làm việc ban đêm</span>
              </button>
            </div>
          </div>

          {/* 2. Table Density */}
          <div>
            <label className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider mb-3">
              <Table className="w-4 h-4 text-emerald-600" />
              <span>Mật Độ Hiển Thị Bảng (Density)</span>
            </label>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleChange('density', 'COMPACT')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  uiSettings.density === 'COMPACT'
                    ? 'border-emerald-500 bg-emerald-50/90 font-extrabold text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'
                }`}
              >
                <span className="block text-xs">📊 Siêu Nén Gọn</span>
                <span className="text-[10px] text-slate-500 font-normal mt-0.5 block">Nhiều dòng dữ liệu</span>
              </button>

              <button
                type="button"
                onClick={() => handleChange('density', 'STANDARD')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  uiSettings.density === 'STANDARD'
                    ? 'border-emerald-500 bg-emerald-50/90 font-extrabold text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'
                }`}
              >
                <span className="block text-xs">⚖️ Tiêu Chuẩn</span>
                <span className="text-[10px] text-slate-500 font-normal mt-0.5 block">Cân đối & Dễ nhìn</span>
              </button>

              <button
                type="button"
                onClick={() => handleChange('density', 'SPACIOUS')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  uiSettings.density === 'SPACIOUS'
                    ? 'border-emerald-500 bg-emerald-50/90 font-extrabold text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'
                }`}
              >
                <span className="block text-xs">🌿 Thoáng Rộng</span>
                <span className="text-[10px] text-slate-500 font-normal mt-0.5 block">Khoảng cách rộng</span>
              </button>
            </div>
          </div>

          {/* 3. Font Size & Map Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                <Type className="w-4 h-4 text-emerald-600" />
                <span>Kích Thước Chữ (Font Size)</span>
              </label>

              <select
                value={uiSettings.fontSize || 'MEDIUM'}
                onChange={(e) => handleChange('fontSize', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
              >
                <option value="SMALL">Cỡ nhỏ (11px) - Màn hình nhỏ</option>
                <option value="MEDIUM">Cỡ vừa (12px) - Chuẩn mặc định</option>
                <option value="LARGE">Cỡ lớn (14px) - Dễ đọc hơn</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Lớp Bản Đồ GIS Mặc Định</span>
              </label>

              <select
                value={uiSettings.defaultMapTile || 'HYBRID'}
                onChange={(e) => handleChange('defaultMapTile', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
              >
                <option value="HYBRID">🛰️ Google Hybrid (Vệ Tinh + Đường)</option>
                <option value="SATELLITE">🌍 Google Satellite (Vệ Tinh)</option>
                <option value="STREETS">🗺️ Google Streets (Bản Đồ Đường)</option>
                <option value="TERRAIN">⛰️ Google Terrain (Địa Hình)</option>
              </select>
            </div>
          </div>

          {/* 4. Regulation Toggle Switch */}
          <div className="border-t border-slate-200/80 pt-4">
            <div className="flex items-center justify-between p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/80">
              <div className="pr-4">
                <span className="block text-xs font-bold text-slate-900">
                  Gạch chân số thứ tự các cột (<u>1</u>, <u>2</u>, ... <u>19</u>)
                </span>
                <span className="text-[11px] text-slate-500 leading-normal block mt-0.5">
                  Theo Quy định Kiểm lâm: Giúp phân biệt rõ số thứ tự cột với số lượng cá thể loài
                </span>
              </div>

              {/* iOS Style Custom Toggle Switch */}
              <button
                type="button"
                onClick={() => handleToggle('underlineColNumbers')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                  uiSettings.underlineColNumbers ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
                    uiSettings.underlineColNumbers ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50/90 px-6 py-3.5 border-t border-slate-200/80 flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={onResetSettings}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục mặc định</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            Áp Dụng & Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

