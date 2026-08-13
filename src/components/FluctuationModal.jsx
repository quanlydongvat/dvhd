import React, { useState, useEffect, useMemo } from 'react';
import { X, Save, Calculator, RefreshCw, AlertTriangle, PlusCircle, MinusCircle, ShoppingCart, Building2, Feather, Users } from 'lucide-react';
import {
  PURPOSE_CODES,
  INTERNAL_TRANSFER_REASONS,
  validateInternalTransfer,
  isPurchaseFromOutside,
  computeLogbookTable,
} from '../utils/calculations';

export default function FluctuationModal({
  isOpen,
  onClose,
  onSave,
  editData = null,
  facilitiesList = [],
  activeFacilityId = null,
  species = null,
  lastRowState = null,
}) {
  const [selectedFacilityId, setSelectedFacilityId] = useState(activeFacilityId);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState(species?.id);

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
    isPurchaseMode: false,
    isGenderIdentifyMode: false,
  });

  const QUICK_REASONS = [
    'Xác định giới tính con con',
    'Mua từ cơ sở nuôi sinh sản khác',
    'Khai thác/nhập mua thêm con giống',
    'Chuyển cá thể đực đủ tuổi vào đàn bố mẹ.',
    'Chuyển cá thể cái đủ tuổi vào đàn bố mẹ.',
    'Chuyển cá thể đực và cái đủ tuổi vào đàn bố mẹ.',
    'Sinh sản lứa F1 mới nở/sinh',
    'Sinh sản lứa F2 mới nở/sinh',
    'Xuất bán thương mại cho cơ sở B',
    'Tặng cho/chuyển nhượng theo quyết định',
    'Chết do thời tiết/bệnh lý',
  ];

  useEffect(() => {
    if (isOpen) {
      const initialFacId = activeFacilityId || facilitiesList[0]?.id || '';
      setSelectedFacilityId(initialFacId);

      const targetFac = facilitiesList.find((f) => f.id === initialFacId) || facilitiesList[0];
      const initialSpId = species?.id || targetFac?.speciesList?.[0]?.id || '';
      setSelectedSpeciesId(initialSpId);

      if (editData) {
        const isPurchase = isPurchaseFromOutside(editData.reason);
        const isGenderIdentify = editData.reason?.includes('Xác định giới tính con con') || editData.isGenderIdentifyMode || false;
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
          isPurchaseMode: isPurchase,
          isGenderIdentifyMode: isGenderIdentify,
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
          isPurchaseMode: false,
          isGenderIdentifyMode: false,
        });
      }
    }
  }, [editData, species, activeFacilityId, facilitiesList, isOpen]);

  if (!isOpen) return null;

  // Selected Facility & Species Objects
  const currentFacility = facilitiesList.find((f) => f.id === selectedFacilityId) || facilitiesList[0];
  const currentFacilitySpeciesList = currentFacility?.speciesList || [];
  const currentSelectedSpecies =
    currentFacilitySpeciesList.find((s) => s.id === selectedSpeciesId) || currentFacilitySpeciesList[0] || species;

  // Dynamically calculate last row state for selected species
  const effectiveLastRowState = () => {
    if (currentSelectedSpecies && currentSelectedSpecies.baseline) {
      const computedRows = computeLogbookTable(
        currentSelectedSpecies.baseline,
        currentSelectedSpecies.fluctuations || []
      );
      if (computedRows && computedRows.length > 0) {
        return computedRows[computedRows.length - 1];
      }
    }
    return lastRowState;
  };

  const activeLastRow = effectiveLastRowState();

  // Handle facility dropdown change
  const handleFacilityChange = (facId) => {
    setSelectedFacilityId(facId);
    const fac = facilitiesList.find((f) => f.id === facId);
    if (fac && fac.speciesList && fac.speciesList.length > 0) {
      setSelectedSpeciesId(fac.speciesList[0].id);
      setFormData((prev) => ({
        ...prev,
        purpose: fac.speciesList[0].purposeCode || 'T',
      }));
    } else {
      setSelectedSpeciesId('');
    }
  };

  // Handle species dropdown change
  const handleSpeciesChange = (spId) => {
    setSelectedSpeciesId(spId);
    const sp = currentFacilitySpeciesList.find((s) => s.id === spId);
    if (sp) {
      setFormData((prev) => ({
        ...prev,
        purpose: sp.purposeCode || 'T',
      }));
    }
  };

  // Real-time calculation preview
  const prevF = Number(activeLastRow?.father) || 0;
  const prevM = Number(activeLastRow?.mother) || 0;
  const prevOM = Number(activeLastRow?.otherMale) || 0;
  const prevOF = Number(activeLastRow?.otherFemale) || 0;
  const prevOU = Number(activeLastRow?.otherUnknown) || 0;

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
  const isPurchasingOutside = formData.isPurchaseMode || isPurchaseFromOutside(formData.reason);
  const isTransferringParents = (incF > 0 || incM > 0) && !isPurchasingOutside;
  const isTransferMismatch = isTransferringParents && (incF !== decOM || incM !== decOF);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFacilityId) {
      alert('Vui lòng chọn cơ sở nuôi!');
      return;
    }
    if (!selectedSpeciesId) {
      alert('Vui lòng chọn loài nuôi!');
      return;
    }

    // Validate internal transfer
    const validation = validateInternalTransfer(formData);
    if (!validation.isValid) {
      alert(`⚠️ ${validation.message}`);
      return;
    }

    if (formData.isGenderIdentifyMode) {
      if (formData.decOtherUnknown !== (formData.incOtherMale + formData.incOtherFemale)) {
        alert('⚠️ Lỗi: Số lượng chưa xác định giới tính giảm (B17) phải bằng tổng số lượng đực khác (B10) và cái khác (B11) tăng!');
        return;
      }
      if (formData.decOtherUnknown <= 0) {
        alert('⚠️ Vui lòng nhập số lượng đực khác hoặc cái khác tăng để xác định giới tính!');
        return;
      }
      const prevOU = Number(activeLastRow?.otherUnknown) || 0;
      if (formData.decOtherUnknown > prevOU) {
        alert(`⚠️ Số lượng cá thể chưa xác định giới tính hiện tại trong đàn (${prevOU}) không đủ để thực hiện chuyển nhóm ${formData.decOtherUnknown} cá thể!`);
        return;
      }
      if (!formData.reason.toLowerCase().includes('xác định giới tính con con')) {
        alert('⚠️ Đối với hình thức này, nguyên nhân biến động bắt buộc phải chọn hoặc chứa từ khóa "Xác định giới tính con con"!');
        return;
      }
    }

    if (!formData.reason.trim()) {
      alert('Vui lòng nhập Nguyên nhân biến động (Cột 18)!');
      return;
    }
    if (totalInc === 0 && totalDec === 0) {
      alert('Vui lòng nhập số liệu Tăng đàn hoặc Giảm đàn (ít nhất 1 chỉ số lớn hơn 0)!');
      return;
    }

    onSave({
      ...formData,
      targetFacilityId: selectedFacilityId,
      targetSpeciesId: selectedSpeciesId,
    });
    onClose();
  };

  // Handler for number changes
  const handleNumChange = (field, val) => {
    const num = Math.max(0, parseInt(val) || 0);
    setFormData((prev) => {
      const next = { ...prev, [field]: num };
      if (prev.isGenderIdentifyMode) {
        if (field === 'incOtherMale' || field === 'incOtherFemale') {
          next.decOtherUnknown = (next.incOtherMale || 0) + (next.incOtherFemale || 0);
        }
      }
      return next;
    });
  };

  // Explicit action: Apply Gender Identification (B12 -> B10, B11)
  const handleApplyGenderIdentify = () => {
    setFormData((prev) => ({
      ...prev,
      incFather: 0,
      incMother: 0,
      incOtherMale: prev.incOtherMale,
      incOtherFemale: prev.incOtherFemale,
      incOtherUnknown: 0,
      decFather: 0,
      decMother: 0,
      decOtherMale: 0,
      decOtherFemale: 0,
      decOtherUnknown: prev.incOtherMale + prev.incOtherFemale,
      reason: 'Xác định giới tính con con',
      isPurchaseMode: false,
      isGenderIdentifyMode: true,
    }));
  };

  // Explicit action: Apply Internal Transfer matching B15=B8, B16=B9
  const handleApplyInternalTransfer = () => {
    setFormData((prev) => {
      const incF = prev.incFather;
      const incM = prev.incMother;
      let reasonStr = 'Chuyển cá thể đủ tuổi vào đàn bố mẹ.';
      if (incF > 0 && incM > 0) {
        reasonStr = 'Chuyển cá thể đực và cái đủ tuổi vào đàn bố mẹ.';
      } else if (incF > 0) {
        reasonStr = 'Chuyển cá thể đực đủ tuổi vào đàn bố mẹ.';
      } else if (incM > 0) {
        reasonStr = 'Chuyển cá thể cái đủ tuổi vào đàn bố mẹ.';
      }
      return {
        ...prev,
        decOtherMale: incF,
        decOtherFemale: incM,
        reason: reasonStr,
        isPurchaseMode: false,
      };
    });
  };

  // Explicit action: Apply External Purchase (Zero out B15 & B16)
  const handleApplyPurchase = () => {
    setFormData((prev) => ({
      ...prev,
      decOtherMale: 0,
      decOtherFemale: 0,
      decOtherUnknown: 0,
      reason: 'Mua từ cơ sở nuôi sinh sản khác',
      isPurchaseMode: true,
      isGenderIdentifyMode: false,
    }));
  };

  // Select Quick Reason Chip
  const handleSelectReason = (reasonStr) => {
    const isPurchase = isPurchaseFromOutside(reasonStr);
    const isInternal = INTERNAL_TRANSFER_REASONS.includes(reasonStr);
    const isGender = reasonStr.includes('Xác định giới tính con con');

    setFormData((prev) => {
      const next = {
        ...prev,
        reason: reasonStr,
        isPurchaseMode: isPurchase,
        isGenderIdentifyMode: isGender,
        decOtherMale: isInternal ? prev.incFather : isPurchase ? 0 : prev.decOtherMale,
        decOtherFemale: isInternal ? prev.incMother : isPurchase ? 0 : prev.decOtherFemale,
      };
      if (isGender) {
        next.incFather = 0;
        next.incMother = 0;
        next.incOtherUnknown = 0;
        next.decFather = 0;
        next.decMother = 0;
        next.decOtherMale = 0;
        next.decOtherFemale = 0;
        next.decOtherUnknown = prev.incOtherMale + prev.incOtherFemale;
      }
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full shadow-2xl flex flex-col max-h-[95vh] animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {editData ? 'Chỉnh Sửa Biến Động Đàn' : 'Khai Báo Biến Động Tăng / Giảm Đàn'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Tuân thủ Hướng dẫn và Biểu mẫu Thông tư số 85/2025/TT-BNNMT
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
        <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden min-h-0">
          <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1 scrollbar-thin">
            {/* TOP FACILITY & SPECIES SELECTOR CARD (Nơi chọn cơ sở & loài trước tiên) */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border-2 border-emerald-300 rounded-2xl p-3.5 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <span>Xác nhận cơ sở & Loài nuôi ghi nhận biến động:</span>
                </span>
                <span className="text-[11px] font-extrabold text-emerald-800 bg-white border border-emerald-300 px-2.5 py-0.5 rounded-full shadow-2xs">
                  📌 Chọn đúng cơ sở tránh nhập nhầm
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Dropdown 1: Cơ sở nuôi */}
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                    🏛️ 1. Chọn Cơ sở nuôi sinh sản:
                  </label>
                  <select
                    value={selectedFacilityId || ''}
                    onChange={(e) => handleFacilityChange(e.target.value)}
                    className="w-full bg-white border border-emerald-400 rounded-xl px-3 py-2 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-emerald-600 cursor-pointer shadow-2xs"
                  >
                    {facilitiesList.map((fac) => (
                      <option key={fac.id} value={fac.id}>
                        {fac.ownerName} ({fac.commune || 'Chưa rõ xã'}) - {fac.registrationCode || 'Chưa mã số'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dropdown 2: Loài nuôi */}
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
                    🐾 2. Chọn Loài động vật nuôi:
                  </label>
                  <select
                    value={selectedSpeciesId || ''}
                    onChange={(e) => handleSpeciesChange(e.target.value)}
                    className="w-full bg-white border border-emerald-400 rounded-xl px-3 py-2 text-xs font-extrabold text-emerald-950 focus:outline-none focus:border-emerald-600 cursor-pointer shadow-2xs"
                  >
                    {currentFacilitySpeciesList.length > 0 ? (
                      currentFacilitySpeciesList.map((sp) => (
                        <option key={sp.id} value={sp.id}>
                          {sp.vietnameseName} ({sp.scientificName})
                        </option>
                      ))
                    ) : (
                      <option value="">(Cơ sở chưa có loài nuôi nào)</option>
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Fluctuation Type Selector Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={handleApplyPurchase}
                className={`p-3 rounded-xl border text-left font-extrabold transition-all flex items-center gap-2.5 shadow-sm cursor-pointer ${
                  isPurchasingOutside && !formData.isGenderIdentifyMode
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400'
                    : 'bg-white hover:bg-emerald-50 text-slate-800 border-slate-300'
                }`}
              >
                <ShoppingCart className="w-5 h-5 flex-shrink-0" />
                <div>
                  <span className="block text-xs uppercase tracking-wide">1. Nhập giống ngoài</span>
                  <span className="text-[10px] opacity-90 block font-normal">+ Tăng tổng đàn (B15, B16, B17=0)</span>
                </div>
              </button>

              <button
                type="button"
                onClick={handleApplyInternalTransfer}
                className={`p-3 rounded-xl border text-left font-extrabold transition-all flex items-center gap-2.5 shadow-sm cursor-pointer ${
                  !isPurchasingOutside && !formData.isGenderIdentifyMode && (incF > 0 || incM > 0)
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-400'
                    : 'bg-white hover:bg-indigo-50 text-slate-800 border-slate-300'
                }`}
              >
                <RefreshCw className="w-5 h-5 flex-shrink-0" />
                <div>
                  <span className="block text-xs uppercase tracking-wide">2. Chuyển sang bố mẹ</span>
                  <span className="text-[10px] opacity-90 block font-normal">Giữ nguyên tổng đàn (B15=B8, B16=B9)</span>
                </div>
              </button>

              <button
                type="button"
                onClick={handleApplyGenderIdentify}
                className={`p-3 rounded-xl border text-left font-extrabold transition-all flex items-center gap-2.5 shadow-sm cursor-pointer ${
                  formData.isGenderIdentifyMode
                    ? 'bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-400'
                    : 'bg-white hover:bg-amber-50 text-slate-800 border-slate-300'
                }`}
              >
                <Users className="w-5 h-5 flex-shrink-0" />
                <div>
                  <span className="block text-xs uppercase tracking-wide">3. Xác định giới tính</span>
                  <span className="text-[10px] opacity-90 block font-normal">Chuyển từ Chưa XĐ (B12) sang Đực/Cái (B10, B11)</span>
                </div>
              </button>
            </div>

            {/* Warning Banner if B8 != B15 or B9 != B16 during internal transfer */}
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
                  <span className="text-xs font-extrabold text-teal-800 bg-teal-100 px-2 py-0.5 rounded border border-teal-300 font-mono">
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
                      disabled={formData.isGenderIdentifyMode}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-teal-800 font-extrabold focus:border-teal-500 shadow-xs text-center disabled:bg-slate-100 disabled:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Mẹ (B9):</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.incMother}
                      onChange={(e) => handleNumChange('incMother', e.target.value)}
                      disabled={formData.isGenderIdentifyMode}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-teal-800 font-extrabold focus:border-teal-500 shadow-xs text-center disabled:bg-slate-100 disabled:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Đực khác (B10):</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.incOtherMale}
                      onChange={(e) => handleNumChange('incOtherMale', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-bold focus:border-teal-500 shadow-xs text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Cái khác (B11):</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.incOtherFemale}
                      onChange={(e) => handleNumChange('incOtherFemale', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-bold focus:border-teal-500 shadow-xs text-center"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-slate-700 font-bold mb-1">Chưa xác định giới tính (B12):</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.incOtherUnknown}
                      onChange={(e) => handleNumChange('incOtherUnknown', e.target.value)}
                      disabled={formData.isGenderIdentifyMode}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-bold focus:border-teal-500 shadow-xs text-center disabled:bg-slate-100 disabled:text-slate-400"
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
                  <span className="text-xs font-extrabold text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-300 font-mono">
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
                      disabled={formData.isGenderIdentifyMode}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-rose-800 font-extrabold focus:border-rose-500 shadow-xs text-center disabled:bg-slate-100 disabled:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Mẹ (B14):</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.decMother}
                      onChange={(e) => handleNumChange('decMother', e.target.value)}
                      disabled={formData.isGenderIdentifyMode}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-rose-800 font-extrabold focus:border-rose-500 shadow-xs text-center disabled:bg-slate-100 disabled:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1 flex items-center justify-between">
                      <span>Đực khác (B15):</span>
                      {incF > 0 && !isPurchasingOutside && (
                        <span className="text-[10px] text-teal-700 font-bold">(tự gán = B8)</span>
                      )}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.decOtherMale}
                      onChange={(e) => handleNumChange('decOtherMale', e.target.value)}
                      disabled={formData.isGenderIdentifyMode}
                      className={`w-full bg-white border rounded-lg px-2.5 py-1.5 font-extrabold focus:border-rose-500 shadow-xs text-center disabled:bg-slate-100 disabled:text-slate-400 ${
                        incF > 0 && !isPurchasingOutside && incF !== decOM
                          ? 'border-amber-400 text-amber-900 bg-amber-50'
                          : 'border-slate-300 text-slate-800'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1 flex items-center justify-between">
                      <span>Cái khác (B16):</span>
                      {incM > 0 && !isPurchasingOutside && (
                        <span className="text-[10px] text-teal-700 font-bold">(tự gán = B9)</span>
                      )}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.decOtherFemale}
                      onChange={(e) => handleNumChange('decOtherFemale', e.target.value)}
                      disabled={formData.isGenderIdentifyMode}
                      className={`w-full bg-white border rounded-lg px-2.5 py-1.5 font-extrabold focus:border-rose-500 shadow-xs text-center disabled:bg-slate-100 disabled:text-slate-400 ${
                        incM > 0 && !isPurchasingOutside && incM !== decOF
                          ? 'border-amber-400 text-amber-900 bg-amber-50'
                          : 'border-slate-300 text-slate-800'
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
                      disabled={formData.isGenderIdentifyMode}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-bold focus:border-rose-500 shadow-xs text-center disabled:bg-slate-100 disabled:text-slate-400"
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
                  {QUICK_REASONS.map((r, i) => {
                    const isCur = formData.reason === r;
                    const isPurch = isPurchaseFromOutside(r);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectReason(r)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg transition-all font-bold border cursor-pointer ${
                          isCur
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                            : isPurch
                            ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-200'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                        }`}
                      >
                        + {r}
                      </button>
                    );
                  })}
                </div>

                <textarea
                  rows={2}
                  value={formData.reason}
                  onChange={(e) => {
                    const val = e.target.value;
                    const isPurch = isPurchaseFromOutside(val);
                    setFormData((prev) => ({
                      ...prev,
                      reason: val,
                      isPurchaseMode: isPurch,
                      decOtherMale: isPurch ? 0 : prev.decOtherMale,
                      decOtherFemale: isPurch ? 0 : prev.decOtherFemale,
                    }));
                  }}
                  placeholder="Ghi rõ thông tin sinh sản thế hệ F1, F2..., chuyển cá thể đủ tuổi vào đàn bố mẹ, mua bán giống từ cơ sở khác..."
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
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-4 border-t border-slate-200 bg-slate-50 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
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
