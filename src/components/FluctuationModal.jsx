import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, PlusCircle, MinusCircle, Calculator, RefreshCw, AlertTriangle } from 'lucide-react';
import { PURPOSE_CODES, INTERNAL_TRANSFER_REASONS, processInternalTransfer, validateInternalTransfer } from '../utils/calculations';

export default function FluctuationModal({
  isOpen,
  onClose,
  onSave,
  editData = null,
  species,
  lastRowState = null,
}) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    time: new Date().toTimeString().slice(0, 5),
    incFather: 0,
    incMother: 0,
    incOtherMale: 0,
    incOtherFemale: 0,
    incOtherUnknown: 0,
    decFather: 0,
    decMother: 0,
    decOtherMale: 0,
    decOtherFemale: 0,
    decOtherUnknown: 0,
    reason: '',
    purpose: species?.purposeCode || 'T',
    verifier: '',
  });

  const QUICK_REASONS = [
    ...INTERNAL_TRANSFER_REASONS,
    'Sinh sản lứa F1 mới nở/sinh',
    'Sinh sản lứa F2 mới nở/sinh',
    'Khai thác/nhập mua thêm con giống',
    'Xuất bán thương mại cho cơ sở B',
    'Tặng cho/chuyển nhượng theo quyết định',
    'Chết do thời tiết/bệnh lý',
    'Xác định giới tính thế hệ F1',
  ];

  useEffect(() => {
    if (editData) {
      setFormData({
        date: editData.date || new Date().toISOString().slice(0, 10),
        time: editData.time || '',
        incFather: editData.incFather || 0,
        incMother: editData.incMother || 0,
        incOtherMale: editData.incOtherMale || 0,
        incOtherFemale: editData.incOtherFemale || 0,
        incOtherUnknown: editData.incOtherUnknown || 0,
        decFather: editData.decFather || 0,
        decMother: editData.decMother || 0,
        decOtherMale: editData.decOtherMale || 0,
        decOtherFemale: editData.decOtherFemale || 0,
        decOtherUnknown: editData.decOtherUnknown || 0,
        reason: editData.reason || '',
        purpose: editData.purpose || species?.purposeCode || 'T',
        verifier: editData.verifier || '',
      });
    } else {
      setFormData({
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toTimeString().slice(0, 5),
        incFather: 0,
        incMother: 0,
        incOtherMale: 0,
        incOtherFemale: 0,
        incOtherUnknown: 0,
        decFather: 0,
        decMother: 0,
        decOtherMale: 0,
        decOtherFemale: 0,
        decOtherUnknown: 0,
        reason: '',
        purpose: species?.purposeCode || 'T',
        verifier: '',
      });
    }
  }, [editData, species, isOpen]);

  if (!isOpen) return null;

  // Real-time calculation preview
  const prevF = lastRowState?.father || 0;
  const prevM = lastRowState?.mother || 0;
  const prevOM = lastRowState?.otherMale || 0;
  const prevOF = lastRowState?.otherFemale || 0;
  const prevOU = lastRowState?.otherUnknown || 0;

  const incF = Math.max(0, parseInt(formData.incFather) || 0);
  const incM = Math.max(0, parseInt(formData.incMother) || 0);
  const incOM = Math.max(0, parseInt(formData.incOtherMale) || 0);
  const incOF = Math.max(0, parseInt(formData.incOtherFemale) || 0);
  const incOU = Math.max(0, parseInt(formData.incOtherUnknown) || 0);

  const decF = Math.max(0, parseInt(formData.decFather) || 0);
  const decM = Math.max(0, parseInt(formData.decMother) || 0);
  const decOM = Math.max(0, parseInt(formData.decOtherMale) || 0);
  const decOF = Math.max(0, parseInt(formData.decOtherFemale) || 0);
  const decOU = Math.max(0, parseInt(formData.decOtherUnknown) || 0);

  const newF = prevF + incF - decF;
  const newM = prevM + incM - decM;
  const newOM = prevOM + incOM - decOM;
  const newOF = prevOF + incOF - decOF;
  const newOU = prevOU + incOU - decOU;
  const newTotal = newF + newM + newOM + newOF + newOU;

  const totalInc = incF + incM + incOM + incOF + incOU;
  const totalDec = decF + decM + decOM + decOF + decOU;

  // Circular 85/2025 validation state
  const isTransferringParents = incF > 0 || incM > 0;
  const isTransferMismatch = isTransferringParents && (incF !== decOM || incM !== decOF);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check Circular 85/2025 rule: B8 = B15 and B9 = B16
    const validation = validateInternalTransfer(formData);
    if (!validation.isValid) {
      alert(`⚠️ ${validation.message}`);
      return;
    }

    if (!formData.reason.trim()) {
      alert('Vui lòng nhập Nguyên nhân biến động (Cột 18)!');
      return;
    }
    if (totalInc === 0 && totalDec === 0) {
      alert('Vui lòng nhập số liệu Tăng đàn hoặc Giảm đàn (ít nhất 1 chỉ số lớn hơn 0)!');
      return;
    }
    onSave(formData);
    onClose();
  };

  // Handler for number changes with Circular 85/2025 auto-assign rule (Yêu cầu 5 & 6)
  const handleNumChange = (field, val) => {
    const num = Math.max(0, parseInt(val) || 0);
    
    setFormData((prev) => {
      const updated = { ...prev, [field]: num };

      // Rule 5: If user inputs B8 = X => auto-assign B15 = X
      if (field === 'incFather') {
        updated.decOtherMale = num;
        if (!updated.reason || INTERNAL_TRANSFER_REASONS.includes(updated.reason)) {
          if (num > 0 && updated.incMother > 0) {
            updated.reason = 'Chuyển cá thể đực và cái đủ tuổi vào đàn bố mẹ.';
          } else if (num > 0) {
            updated.reason = 'Chuyển cá thể đực đủ tuổi vào đàn bố mẹ.';
          }
        }
      }

      // Rule 5: If user inputs B9 = Y => auto-assign B16 = Y
      if (field === 'incMother') {
        updated.decOtherFemale = num;
        if (!updated.reason || INTERNAL_TRANSFER_REASONS.includes(updated.reason)) {
          if (num > 0 && updated.incFather > 0) {
            updated.reason = 'Chuyển cá thể đực và cái đủ tuổi vào đàn bố mẹ.';
          } else if (num > 0) {
            updated.reason = 'Chuyển cá thể cái đủ tuổi vào đàn bố mẹ.';
          }
        }
      }

      return updated;
    });
  };

  // Quick Action Button: Auto-Fill Internal Transfer
  const handleAutoFillTransfer = (type) => {
    if (type === 'MALE') {
      const count = prevOM > 0 ? 1 : 0;
      setFormData((prev) => ({
        ...prev,
        incFather: count,
        decOtherMale: count,
        reason: 'Chuyển cá thể đực đủ tuổi vào đàn bố mẹ.',
      }));
    } else if (type === 'FEMALE') {
      const count = prevOF > 0 ? 1 : 0;
      setFormData((prev) => ({
        ...prev,
        incMother: count,
        decOtherFemale: count,
        reason: 'Chuyển cá thể cái đủ tuổi vào đàn bố mẹ.',
      }));
    } else if (type === 'BOTH') {
      const countM = prevOM > 0 ? 1 : 0;
      const countF = prevOF > 0 ? 1 : 0;
      setFormData((prev) => ({
        ...prev,
        incFather: countM,
        decOtherMale: countM,
        incMother: countF,
        decOtherFemale: countF,
        reason: 'Chuyển cá thể đực và cái đủ tuổi vào đàn bố mẹ.',
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {editData ? 'Chỉnh Sửa Biến Động Đàn' : 'Khai Báo Biến Động Tăng / Giảm Đàn'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Loài: <strong className="text-emerald-700">{species?.vietnameseName}</strong> (Tuân thủ TT 85/2025/TT-BNNMT)
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Quick Preset: Chuyển nhóm nội bộ sang Đàn bố mẹ theo Thông tư 85/2025 */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-extrabold text-emerald-900 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-600" />
                <span>CHUYỂN NHÓM NỘI BỘ SANG ĐÀN BỐ MẸ (Thông tư 85/2025/TT-BNNMT):</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold border border-emerald-300">
                Không đổi tổng đàn
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              Tự động gán tăng Bố mẹ đực/cái (Cột B8/B9) và giảm Cá thể khác đực/cái (Cột B15/B16) khi cá thể đủ tuổi sinh sản.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleAutoFillTransfer('MALE')}
                className="bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-lg font-bold transition-all shadow-2xs"
              >
                + 🔄 Chuyển 01 Đực vào Bố (B8=1, B15=1)
              </button>
              <button
                type="button"
                onClick={() => handleAutoFillTransfer('FEMALE')}
                className="bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-lg font-bold transition-all shadow-2xs"
              >
                + 🔄 Chuyển 01 Cái vào Mẹ (B9=1, B16=1)
              </button>
              <button
                type="button"
                onClick={() => handleAutoFillTransfer('BOTH')}
                className="bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-lg font-bold transition-all shadow-2xs"
              >
                + 🔄 Chuyển cả Đực & Cái (1 Đực + 1 Cái)
              </button>
            </div>
          </div>

          {/* Warning Banner if B8 != B15 or B9 != B16 (Yêu cầu 5) */}
          {isTransferMismatch && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-start gap-2 text-xs text-amber-900 font-bold shadow-2xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span>Chuyển cá thể từ đàn khác sang đàn bố mẹ phải ghi đồng thời:</span>
                <span className="block font-mono text-[11px] text-amber-800 font-extrabold mt-0.5">
                  B8 ({incF}) = B15 ({decOM}) và B9 ({incM}) = B16 ({decOF})
                </span>
              </div>
            </div>
          )}

          {/* Section 1: Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ngày biến động (Cột 1) <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-500 shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Giờ ghi nhận (để sắp xếp theo thứ tự)
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-500 shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mục đích nuôi (Mã Ghi chú 1)
              </label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-500 shadow-xs cursor-pointer"
              >
                {PURPOSE_CODES.map((p) => (
                  <option key={p.code} value={p.code}>
                    ({p.code}) {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 2: Numbers Input (Tăng Đàn & Giảm Đàn) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Increase Box (Cột 8 - 12) */}
            <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-teal-200 pb-2">
                <h4 className="text-sm font-extrabold text-teal-950 flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-teal-600" />
                  TĂNG ĐÀN (Cột 8 - 12)
                </h4>
                <span className="text-xs font-extrabold text-teal-800 bg-teal-100 px-2 py-0.5 rounded border border-teal-300">
                  Total +{totalInc}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Bố (B8):</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.incFather}
                    onChange={(e) => handleNumChange('incFather', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-teal-800 font-extrabold focus:border-teal-500 shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Mẹ (B9):</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.incMother}
                    onChange={(e) => handleNumChange('incMother', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-teal-800 font-extrabold focus:border-teal-500 shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Đực khác (B10):</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.incOtherMale}
                    onChange={(e) => handleNumChange('incOtherMale', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-bold focus:border-teal-500 shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Cái khác (B11):</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.incOtherFemale}
                    onChange={(e) => handleNumChange('incOtherFemale', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-bold focus:border-teal-500 shadow-xs"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Chưa xác định giới tính (B12):</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.incOtherUnknown}
                    onChange={(e) => handleNumChange('incOtherUnknown', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-bold focus:border-teal-500 shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Decrease Box (Cột 13 - 17) */}
            <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-rose-200 pb-2">
                <h4 className="text-sm font-extrabold text-rose-950 flex items-center gap-2">
                  <MinusCircle className="w-4 h-4 text-rose-600" />
                  GIẢM ĐÀN (Cột 13 - 17)
                </h4>
                <span className="text-xs font-extrabold text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
                  Total -{totalDec}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Bố (B13):</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.decFather}
                    onChange={(e) => handleNumChange('decFather', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-rose-800 font-extrabold focus:border-rose-500 shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Mẹ (B14):</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.decMother}
                    onChange={(e) => handleNumChange('decMother', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-rose-800 font-extrabold focus:border-rose-500 shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center justify-between">
                    <span>Đực khác (B15):</span>
                    {incF > 0 && <span className="text-[10px] text-teal-700 font-bold">(tự gán = B8)</span>}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.decOtherMale}
                    onChange={(e) => handleNumChange('decOtherMale', e.target.value)}
                    className={`w-full bg-white border rounded-lg px-2.5 py-1.5 font-extrabold focus:border-rose-500 shadow-xs ${
                      incF > 0 && incF !== decOM ? 'border-amber-400 text-amber-900 bg-amber-50' : 'border-slate-300 text-slate-800'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center justify-between">
                    <span>Cái khác (B16):</span>
                    {incM > 0 && <span className="text-[10px] text-teal-700 font-bold">(tự gán = B9)</span>}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.decOtherFemale}
                    onChange={(e) => handleNumChange('decOtherFemale', e.target.value)}
                    className={`w-full bg-white border rounded-lg px-2.5 py-1.5 font-extrabold focus:border-rose-500 shadow-xs ${
                      incM > 0 && incM !== decOF ? 'border-amber-400 text-amber-900 bg-amber-50' : 'border-slate-300 text-slate-800'
                    }`}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Chưa xác định giới tính (B17):</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.decOtherUnknown}
                    onChange={(e) => handleNumChange('decOtherUnknown', e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-bold focus:border-rose-500 shadow-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Result Calculation Preview Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-2 shadow-xs">
            <div className="font-bold text-emerald-800 flex items-center justify-between">
              <span>Xem trước kết quả tự động tính toán cho dòng mới:</span>
              <span className="text-emerald-800 font-mono text-sm font-extrabold bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300">
                Cột 2 (Tổng cá thể) = {newTotal}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2 text-center font-mono pt-1 border-t border-slate-200">
              <div className="bg-white p-1.5 rounded border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block text-[10px] font-sans">Bố (Col 3)</span>
                <span className={`font-bold ${newF < 0 ? 'text-rose-600' : 'text-slate-900'}`}>{newF}</span>
              </div>
              <div className="bg-white p-1.5 rounded border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block text-[10px] font-sans">Mẹ (Col 4)</span>
                <span className={`font-bold ${newM < 0 ? 'text-rose-600' : 'text-slate-900'}`}>{newM}</span>
              </div>
              <div className="bg-white p-1.5 rounded border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block text-[10px] font-sans">Đực (Col 5)</span>
                <span className={`font-bold ${newOM < 0 ? 'text-rose-600' : 'text-slate-900'}`}>{newOM}</span>
              </div>
              <div className="bg-white p-1.5 rounded border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block text-[10px] font-sans">Cái (Col 6)</span>
                <span className={`font-bold ${newOF < 0 ? 'text-rose-600' : 'text-slate-900'}`}>{newOF}</span>
              </div>
              <div className="bg-white p-1.5 rounded border border-slate-200 shadow-2xs">
                <span className="text-slate-500 block text-[10px] font-sans">Chưa XĐ (Col 7)</span>
                <span className={`font-bold ${newOU < 0 ? 'text-rose-600' : 'text-slate-900'}`}>{newOU}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Reason & Verifier */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Nguyên nhân biến động (Cột 18) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-500 font-medium">Gợi ý gõ nhanh:</span>
              </div>

              {/* Quick Chips */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {QUICK_REASONS.map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData({ ...formData, reason: r })}
                    className="text-[11px] bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 border border-slate-300 px-2 py-0.5 rounded transition-colors font-medium"
                  >
                    + {r}
                  </button>
                ))}
              </div>

              <textarea
                rows={2}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Ghi rõ thông tin sinh sản thế hệ F1, F2..., chuyển cá thể đủ tuổi vào đàn bố mẹ, hợp đồng mua bán..."
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Xác nhận của cơ quan Kiểm lâm / Thủy sản (Cột 19)
              </label>
              <input
                type="text"
                value={formData.verifier}
                onChange={(e) => setFormData({ ...formData, verifier: e.target.value })}
                placeholder="VD: Hạt Kiểm lâm Krông Bông xác nhận ngày DD/MM/YYYY"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-500 shadow-xs"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors shadow-xs"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{editData ? 'Lưu Thay Đổi' : 'Tạo Nhật Ký Biến Động'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

