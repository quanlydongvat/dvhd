import React, { useState, useEffect } from 'react';
import { X, Save, FolderPlus, Sparkles, CheckCircle2 } from 'lucide-react';
import { PURPOSE_CODES } from '../utils/calculations';

// Predefined Species Catalog Dictionary (Danh mục loài mẫu phổ biến)
export const PRESET_SPECIES_CATALOG = [
  {
    vietnameseName: 'Cầy vòi Hương',
    scientificName: 'Paradoxurus hermaphroditus',
    group: 'Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)',
    citesAppendix: 'Phụ lục II CITES',
    isBird: false,
  },
  {
    vietnameseName: 'Cầy vòi mốc',
    scientificName: 'Paguma larvata',
    group: 'Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)',
    citesAppendix: 'Phụ lục II CITES',
    isBird: false,
  },
  {
    vietnameseName: 'Don',
    scientificName: 'Atherurus macrourus',
    group: 'Động vật rừng (Nhóm IIB)',
    citesAppendix: 'Phụ lục II CITES',
    isBird: false,
  },
  {
    vietnameseName: 'Nhím',
    scientificName: 'Hystrix brachyura',
    group: 'Động vật rừng thông thường',
    citesAppendix: 'Khai báo kiểm lâm',
    isBird: false,
  },
  {
    vietnameseName: 'Dúi má đào',
    scientificName: 'Rhizomys sumatrensis',
    group: 'Động vật rừng (Nhóm IIB)',
    citesAppendix: 'Phụ lục II CITES',
    isBird: false,
  },
  {
    vietnameseName: 'Dúi mốc lớn',
    scientificName: 'Rhizomys pruinosus',
    group: 'Động vật rừng thông thường',
    citesAppendix: 'Khai báo kiểm lâm',
    isBird: false,
  },
  {
    vietnameseName: 'Hổ Đông Dương',
    scientificName: 'Panthera tigris corbetti',
    group: 'Động vật rừng nguy cấp, quý, hiếm (Nhóm IB)',
    citesAppendix: 'Phụ lục I CITES',
    isBird: false,
  },
  {
    vietnameseName: 'Trăn đất',
    scientificName: 'Python bivittatus',
    group: 'Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)',
    citesAppendix: 'Phụ lục II CITES',
    isBird: false,
  },
  {
    vietnameseName: 'Trăn gấm',
    scientificName: 'Malayopython reticulatus',
    group: 'Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)',
    citesAppendix: 'Phụ lục II CITES',
    isBird: false,
  },
  {
    vietnameseName: 'Kỳ đà hoa',
    scientificName: 'Varanus salvator',
    group: 'Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)',
    citesAppendix: 'Phụ lục II CITES',
    isBird: false,
  },
  {
    vietnameseName: 'Chim Chào mào',
    scientificName: 'Pycnonotus jocosus',
    group: 'Động vật rừng thông thường (Lớp Chim)',
    citesAppendix: 'Khai báo kiểm lâm',
    isBird: true,
  },
  {
    vietnameseName: 'Chim Chích chòe lửa',
    scientificName: 'Copsychus malabaricus',
    group: 'Động vật rừng thông thường (Lớp Chim)',
    citesAppendix: 'Khai báo kiểm lâm',
    isBird: true,
  },
  {
    vietnameseName: 'Chim Họa mi',
    scientificName: 'Garrulax canorus',
    group: 'Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)',
    citesAppendix: 'Phụ lục II CITES',
    isBird: true,
  },
  {
    vietnameseName: 'Vẹt ngực hồng',
    scientificName: 'Psittacula alexandri',
    group: 'Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)',
    citesAppendix: 'Phụ lục II CITES',
    isBird: true,
  },
];

export default function SpeciesModal({
  isOpen,
  onClose,
  onSave,
  editSpecies = null,
}) {
  const [selectedPresetKey, setSelectedPresetKey] = useState('CUSTOM');

  const [formData, setFormData] = useState({
    vietnameseName: '',
    scientificName: '',
    group: 'Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)',
    citesAppendix: 'Phụ lục II CITES',
    purposeCode: 'T',
    // Baseline Row A stock numbers
    baselineDate: new Date().toISOString().slice(0, 10),
    father: 0,
    mother: 0,
    otherMale: 0,
    otherFemale: 0,
    otherUnknown: 0,
    baselineNote: 'Số lượng vật nuôi hiện có ban đầu',
    verifier: '',
  });

  useEffect(() => {
    if (editSpecies) {
      const matched = PRESET_SPECIES_CATALOG.find(
        (s) => s.vietnameseName.toLowerCase() === (editSpecies.vietnameseName || '').toLowerCase()
      );
      setSelectedPresetKey(matched ? matched.vietnameseName : 'CUSTOM');

      setFormData({
        vietnameseName: editSpecies.vietnameseName || '',
        scientificName: editSpecies.scientificName || '',
        group: editSpecies.group || 'Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)',
        citesAppendix: editSpecies.citesAppendix || 'Phụ lục II CITES',
        purposeCode: editSpecies.purposeCode || 'T',
        baselineDate: editSpecies.baseline?.date || new Date().toISOString().slice(0, 10),
        father: Number(editSpecies.baseline?.father) || 0,
        mother: Number(editSpecies.baseline?.mother) || 0,
        otherMale: Number(editSpecies.baseline?.otherMale) || 0,
        otherFemale: Number(editSpecies.baseline?.otherFemale) || 0,
        otherUnknown: Number(editSpecies.baseline?.otherUnknown) || 0,
        baselineNote: editSpecies.baseline?.note || 'Số lượng vật nuôi hiện có ban đầu',
        verifier: editSpecies.baseline?.verifier || '',
      });
    } else {
      setSelectedPresetKey('CUSTOM');
      setFormData({
        vietnameseName: '',
        scientificName: '',
        group: 'Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)',
        citesAppendix: 'Phụ lục II CITES',
        purposeCode: 'T',
        baselineDate: new Date().toISOString().slice(0, 10),
        father: 0,
        mother: 0,
        otherMale: 0,
        otherFemale: 0,
        otherUnknown: 0,
        baselineNote: 'Số lượng vật nuôi hiện có ban đầu',
        verifier: '',
      });
    }
  }, [editSpecies, isOpen]);

  if (!isOpen) return null;

  // Handle Preset Dropdown Selection
  const handleSelectPreset = (e) => {
    const key = e.target.value;
    setSelectedPresetKey(key);

    if (key === 'CUSTOM') {
      return;
    }

    const preset = PRESET_SPECIES_CATALOG.find((s) => s.vietnameseName === key);
    if (preset) {
      setFormData((prev) => ({
        ...prev,
        vietnameseName: preset.vietnameseName,
        scientificName: preset.scientificName,
        group: preset.group,
        citesAppendix: preset.citesAppendix,
      }));
    }
  };

  const totalBaseline =
    (parseInt(formData.father) || 0) +
    (parseInt(formData.mother) || 0) +
    (parseInt(formData.otherMale) || 0) +
    (parseInt(formData.otherFemale) || 0) +
    (parseInt(formData.otherUnknown) || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.vietnameseName.trim()) {
      alert('Vui lòng chọn hoặc nhập tên tiếng Việt của loài!');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-200">
              <FolderPlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {editSpecies ? 'Sửa Thông Tin Loài & Dòng A' : 'Tạo Sổ Theo Dõi Loài Mới'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Mỗi loài lập 01 sổ theo dõi riêng theo Hướng dẫn Ghi chú 8
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[82vh] overflow-y-auto scrollbar-thin">
          {/* Thông tin loài */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                1. Thông tin chung về loài
              </h4>
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Chọn nhanh từ danh mục có sẵn</span>
              </span>
            </div>

            {/* Quick Preset Dropdown Selection Bar */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/90 rounded-2xl p-3.5 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
                  <span>📋 Chọn nhanh tên loài nuôi từ danh mục:</span>
                </label>
                {selectedPresetKey !== 'CUSTOM' && (
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Đã điền tự động
                  </span>
                )}
              </div>

              <select
                value={selectedPresetKey}
                onChange={handleSelectPreset}
                className="w-full bg-white border border-emerald-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-emerald-600 cursor-pointer shadow-2xs"
              >
                <option value="CUSTOM">✏️ -- Tự nhập loài mới (Chưa có trong danh mục) --</option>
                <optgroup label="🦔 Lớp Thú & Bò Sát Phổ Biến">
                  {PRESET_SPECIES_CATALOG.filter((s) => !s.isBird).map((sp) => (
                    <option key={sp.vietnameseName} value={sp.vietnameseName}>
                      {sp.vietnameseName} ({sp.scientificName}) - {sp.group}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🦜 Lớp Chim Phổ Biến">
                  {PRESET_SPECIES_CATALOG.filter((s) => s.isBird).map((sp) => (
                    <option key={sp.vietnameseName} value={sp.vietnameseName}>
                      {sp.vietnameseName} ({sp.scientificName}) - {sp.group}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên tiếng Việt <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.vietnameseName}
                  onChange={(e) => {
                    setFormData({ ...formData, vietnameseName: e.target.value });
                    setSelectedPresetKey('CUSTOM');
                  }}
                  placeholder="VD: Dúi mốc lớn, Chim Chào mào..."
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-bold focus:outline-none focus:border-emerald-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên khoa học</label>
                <input
                  type="text"
                  value={formData.scientificName}
                  onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
                  placeholder="VD: Rhizomys pruinosus"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-500 shadow-xs font-mono italic"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phân loại danh mục</label>
                <input
                  type="text"
                  value={formData.group}
                  onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                  placeholder="VD: Nhóm IB / Nhóm IIB / Thông thường"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-semibold focus:outline-none focus:border-emerald-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mục đích nuôi chính</label>
                <select
                  value={formData.purposeCode}
                  onChange={(e) => setFormData({ ...formData, purposeCode: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-semibold focus:outline-none focus:border-emerald-500 shadow-xs cursor-pointer"
                >
                  {PURPOSE_CODES.map((p) => (
                    <option key={p.code} value={p.code}>
                      ({p.code}) {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dòng A: Hiện trạng ban đầu */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-800">
                2. Hiện trạng vật nuôi ban đầu (Số liệu Dòng A)
              </h4>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300">
                Tổng Cột (2) = {totalBaseline}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ngày ghi nhận ban đầu (Cột 1)
                </label>
                <input
                  type="date"
                  value={formData.baselineDate}
                  onChange={(e) => setFormData({ ...formData, baselineDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú Dòng A</label>
                <input
                  type="text"
                  value={formData.baselineNote}
                  onChange={(e) => setFormData({ ...formData, baselineNote: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-500 shadow-xs"
                />
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="text-xs font-bold text-slate-700">
                Số lượng từng loại cá thể ban đầu:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Bố (Col 3):</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.father}
                    onChange={(e) => setFormData({ ...formData, father: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-extrabold focus:border-indigo-500 shadow-xs text-center"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Mẹ (Col 4):</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.mother}
                    onChange={(e) => setFormData({ ...formData, mother: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-extrabold focus:border-indigo-500 shadow-xs text-center"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Đực (Col 5):</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.otherMale}
                    onChange={(e) => setFormData({ ...formData, otherMale: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-extrabold focus:border-indigo-500 shadow-xs text-center"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Cái (Col 6):</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.otherFemale}
                    onChange={(e) => setFormData({ ...formData, otherFemale: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-extrabold focus:border-indigo-500 shadow-xs text-center"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Chưa XĐ (Col 7):</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.otherUnknown}
                    onChange={(e) => setFormData({ ...formData, otherUnknown: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-extrabold focus:border-indigo-500 shadow-xs text-center"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{editSpecies ? 'Lưu Thông Tin Loài' : 'Tạo Sổ Theo Dõi Mới'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
