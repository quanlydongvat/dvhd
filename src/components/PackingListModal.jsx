import React, { useState, useEffect } from 'react';
import { X, Save, FileCheck2, Building2, Sparkles, MapPin, Feather, Plus, HelpCircle } from 'lucide-react';
import { PRESET_SPECIES_CATALOG } from './SpeciesModal';
import VietnameseDatePicker from './VietnameseDatePicker';

export default function PackingListModal({
  isOpen,
  onClose,
  onSave,
  editItem = null,
  facilitiesList = [],
  nextDefaultSoVaoSo = '01/2026/14',
  nextDefaultStt = 1,
}) {
  const isAddMode = !editItem || !editItem.id;

  const [formData, setFormData] = useState({
    stt: nextDefaultStt,
    soVaoSo: nextDefaultSoVaoSo,
    ngayXacNhan: new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
    facilityId: '',
    tenChuLamSan: '',
    diaChi: '',
    tongLamSan: '',
    ghiChu: '',
  });

  // Helper inputs for creating tongLamSan text easily
  const [helperSpecies, setHelperSpecies] = useState('');
  const [helperCount, setHelperCount] = useState('');
  const [helperWeight, setHelperWeight] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editItem && editItem.id) {
        setFormData({ ...editItem });
      } else {
        const todayStr = new Date().toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        setFormData({
          stt: nextDefaultStt,
          soVaoSo: nextDefaultSoVaoSo,
          ngayXacNhan: todayStr,
          facilityId: '',
          tenChuLamSan: '',
          diaChi: '',
          tongLamSan: '',
          ghiChu: '',
        });
      }
      setHelperSpecies('');
      setHelperCount('');
      setHelperWeight('');
    }
  }, [isOpen, editItem, nextDefaultSoVaoSo, nextDefaultStt]);

  if (!isOpen) return null;

  // Handle selecting an existing facility from dropdown
  const handleSelectFacility = (facId) => {
    if (!facId) {
      setFormData((prev) => ({ ...prev, facilityId: '' }));
      return;
    }
    const fac = facilitiesList.find((f) => f.id === facId);
    if (fac) {
      const address = fac.address || (fac.commune ? `${fac.commune}, Đắk Lắk` : '');
      setFormData((prev) => ({
        ...prev,
        facilityId: fac.id,
        tenChuLamSan: fac.ownerName || fac.facilityName || '',
        diaChi: address,
      }));

      // If facility has species, set first species as helper
      if (fac.speciesList && fac.speciesList.length > 0) {
        setHelperSpecies(fac.speciesList[0].vietnameseName || '');
      }
    }
  };

  // Helper: Format wildlife description automatically
  const handleApplyHelper = () => {
    if (!helperSpecies) {
      alert('Vui lòng chọn hoặc nhập tên loài động vật!');
      return;
    }
    const countNum = parseInt(helperCount, 10);
    const countStr = isNaN(countNum)
      ? (helperCount || '01')
      : String(countNum).padStart(2, '0');
    
    let text = `${countStr} cá thể ${helperSpecies}`;
    if (helperWeight) {
      const wFormatted = String(helperWeight).replace('.', ',');
      text += `; khối lượng ${wFormatted} kg`;
    }

    setFormData((prev) => ({
      ...prev,
      tongLamSan: prev.tongLamSan ? `${prev.tongLamSan}, ${text}` : text,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.soVaoSo.trim()) {
      alert('Vui lòng nhập Số vào sổ bảng kê!');
      return;
    }
    if (!formData.tenChuLamSan.trim()) {
      alert('Vui lòng nhập Tên chủ lâm sản!');
      return;
    }
    if (!formData.tongLamSan.trim()) {
      alert('Vui lòng nhập Thông tin tổng lâm sản xác nhận!');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-emerald-400/30 shadow-inner">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-wide uppercase">
                {isAddMode ? 'Lập Bảng Kê Lâm Sản Mới' : 'Chỉnh Sửa Bảng Kê Lâm Sản'}
              </h3>
              <p className="text-xs text-emerald-200/90 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Sổ theo dõi xác nhận bảng kê lâm sản (TT85/2025/TT-BNNMT)</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto scrollbar-thin font-sans text-xs">
          
          {/* Row 1: STT & Số vào sổ & Ngày xác nhận */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Số TT <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.stt || ''}
                onChange={(e) => setFormData({ ...formData, stt: parseInt(e.target.value, 10) || 1 })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-2xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Số vào sổ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: 44/2026/14"
                value={formData.soVaoSo || ''}
                onChange={(e) => setFormData({ ...formData, soVaoSo: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-black text-emerald-950 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-2xs"
                required
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Định dạng: Số/Năm/14</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ngày xác nhận <span className="text-rose-500">*</span>
              </label>
              <VietnameseDatePicker
                value={formData.ngayXacNhan || ''}
                onChange={(val) => setFormData({ ...formData, ngayXacNhan: val })}
                outputFormat="DD/MM/YYYY"
                required
              />
            </div>
          </div>

          {/* Row 2: Chọn nhanh cơ sở có sẵn trong hệ thống */}
          <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/60 border border-emerald-200/90 rounded-2xl p-3 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>⚡ Chọn nhanh từ Cơ sở nuôi đã đăng ký:</span>
              </label>
              <span className="text-[10px] text-emerald-800 font-bold bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                Tự động điền chủ & địa chỉ
              </span>
            </div>
            <select
              value={formData.facilityId || ''}
              onChange={(e) => handleSelectFacility(e.target.value)}
              className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-emerald-600 cursor-pointer shadow-2xs"
            >
              <option value="">-- Chọn cơ sở trong huyện ({facilitiesList.length} cơ sở) hoặc tự gõ tay --</option>
              {facilitiesList.map((fac) => (
                <option key={fac.id} value={fac.id}>
                  {fac.ownerName || fac.facilityName} - {fac.commune || 'Krông Bông'} ({fac.speciesList?.map(s => s.vietnameseName).join(', ') || 'Chưa có loài'})
                </option>
              ))}
            </select>
          </div>

          {/* Row 3: Tên chủ lâm sản & Địa chỉ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tên chủ lâm sản <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: Nguyễn Hữu Đô"
                value={formData.tenChuLamSan || ''}
                onChange={(e) => setFormData({ ...formData, tenChuLamSan: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-2xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Địa chỉ của chủ lâm sản <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="VD: Thôn 3, xã Cư Pui, Đắk Lắk"
                value={formData.diaChi || ''}
                onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-2xs"
                required
              />
            </div>
          </div>

          {/* Row 4: Công cụ hỗ trợ tạo nội dung lâm sản thông minh */}
          <div className="bg-amber-50/60 border border-amber-200/90 rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Công cụ tạo nhanh thông tin lâm sản xuất bán:</span>
              </label>
              <span className="text-[10px] text-amber-800 font-bold">
                (Tùy chọn tạo nhanh hoặc tự gõ vào ô dưới)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  list="species-preset-list"
                  placeholder="Loài nuôi (VD: Cầy vòi hương)"
                  value={helperSpecies}
                  onChange={(e) => setHelperSpecies(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-amber-600"
                />
                <datalist id="species-preset-list">
                  {PRESET_SPECIES_CATALOG.map((sp) => (
                    <option key={sp.vietnameseName} value={sp.vietnameseName} />
                  ))}
                </datalist>
              </div>

              <div>
                <input
                  type="number"
                  min="1"
                  placeholder="Số cá thể"
                  value={helperCount}
                  onChange={(e) => setHelperCount(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Khối lượng kg (VD: 4)"
                  value={helperWeight}
                  onChange={(e) => setHelperWeight(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleApplyHelper}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Chèn vào ô nội dung bên dưới</span>
              </button>
            </div>
          </div>

          {/* Row 5: Tổng lâm sản xác nhận (Textarea chính) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tổng lâm sản xác nhận <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="VD: 02 cá thể Cầy vòi hương; khối lượng 4 kg"
              value={formData.tongLamSan || ''}
              onChange={(e) => setFormData({ ...formData, tongLamSan: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs leading-relaxed"
              required
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Mẫu chuẩn: <em>02 cá thể Cầy vòi hương; khối lượng 4 kg</em> hoặc <em>30 cá thể Dúi má đào; tổng trọng lượng 32 kg</em>
            </span>
          </div>

          {/* Row 6: Ghi chú thêm */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ghi chú thêm (Tùy chọn)
            </label>
            <input
              type="text"
              placeholder="Ghi chú người mua, vận chuyển hoặc số hồ sơ..."
              value={formData.ghiChu || ''}
              onChange={(e) => setFormData({ ...formData, ghiChu: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white shadow-2xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-700/20 transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isAddMode ? 'Lưu Bảng Kê Vào Sổ' : 'Cập Nhật Thay Đổi'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
