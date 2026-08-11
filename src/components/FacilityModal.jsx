import React, { useState, useEffect } from 'react';
import { X, Save, Building2, PlusCircle, MapPin, Feather } from 'lucide-react';
import { PURPOSE_CODES } from '../utils/calculations';
import { PRESET_SPECIES_CATALOG } from './SpeciesModal';
import LocationPickerModal from './LocationPickerModal';

const COMMUNES = ['xã Hòa Sơn', 'xã Yang Mao', 'xã Cư Pui', 'Xã Krông Bông', 'Xã Dang Kang'];

export default function FacilityModal({
  isOpen,
  onClose,
  onSave,
  editFacility = null,
}) {
  const isAddMode = !editFacility || !editFacility.id;

  const [formData, setFormData] = useState({});
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editFacility && editFacility.id) {
        setFormData({ ...editFacility });
      } else {
        // Reset to initial empty form for new facility creation
        setFormData({
          facilityName: '',
          ownerName: '',
          registrationCode: '',
          registrationDate: new Date().toISOString().split('T')[0],
          commune: 'xã Hòa Sơn',
          address: '',
          phone: '',
          purposeCode: 'T',
          note: '',
          lat: '',
          lng: '',
          // Initial species defaults for new facility
          initialSpeciesName: 'Cầy vòi Hương',
          initialScientificName: 'Paradoxurus hermaphroditus',
          initialGroup: 'Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)',
          initialCites: 'Phụ lục II CITES',
          father: 0,
          mother: 0,
          otherMale: 0,
          otherFemale: 0,
          otherUnknown: 0,
        });
      }
    }
  }, [editFacility, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.facilityName?.trim()) {
      alert('Vui lòng nhập Tên cơ sở nuôi!');
      return;
    }
    if (!formData.ownerName?.trim()) {
      alert('Vui lòng nhập Họ và tên chủ cơ sở!');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 px-6 py-4 flex items-center justify-between text-white border-b border-emerald-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-400/30 shadow-inner">
              {isAddMode ? <PlusCircle className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-lg font-extrabold tracking-wide">
                {isAddMode ? 'Thêm Cơ Sở Nuôi Sinh Sản Mới' : 'Chỉnh Sửa Thông Tin Cơ Sở Nuôi'}
              </h3>
              <p className="text-xs text-emerald-300/90 font-medium">
                {isAddMode
                  ? 'Khai báo cơ sở nuôi mới vào hệ thống quản lý địa bàn'
                  : 'Cập nhật thông tin chi tiết đơn vị quản lý'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto scrollbar-thin">
          {/* Section 1: Facility Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                1. Thông tin định danh cơ sở nuôi
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên cơ sở nuôi sinh sản <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Cơ sở nuôi Nguyễn Văn A"
                  value={formData.facilityName || ''}
                  onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-semibold focus:outline-none focus:border-emerald-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên chủ cơ sở <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={formData.ownerName || ''}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-semibold focus:outline-none focus:border-emerald-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Đơn vị quản lý / Xã</label>
                <select
                  value={formData.commune || 'xã Hòa Sơn'}
                  onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-semibold focus:outline-none focus:border-emerald-500 shadow-xs cursor-pointer"
                >
                  {COMMUNES.map((c) => (
                    <option key={c} value={c}>
                      📍 {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mã số đăng ký cơ sở</label>
                <input
                  type="text"
                  placeholder="Ví dụ: IIB-DLC-088 hoặc Chưa có mã số"
                  value={formData.registrationCode || ''}
                  onChange={(e) => setFormData({ ...formData, registrationCode: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ngày đăng ký / Cấp phép</label>
                <input
                  type="date"
                  value={formData.registrationDate || ''}
                  onChange={(e) => setFormData({ ...formData, registrationDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-500 shadow-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Địa chỉ chi tiết (Thôn/Buôn/TDP)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Thôn 3, xã Hòa Sơn, Huyện Krông Bông, Tỉnh Đắk Lắk"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại liên hệ</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 0912 345 678"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mục đích nuôi mặc định</label>
                <select
                  value={formData.purposeCode || 'T'}
                  onChange={(e) => setFormData({ ...formData, purposeCode: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-500 shadow-xs cursor-pointer"
                >
                  {PURPOSE_CODES.map((p) => (
                    <option key={p.code} value={p.code}>
                      ({p.code}) {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú cơ sở (nếu có)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Đang nuôi thử nghiệm, Nghỉ nuôi, Đang cập nhật..."
                  value={formData.note || ''}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-500 shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: GPS Coordinates */}
          <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                Tọa Độ GPS Định Vị Bản Đồ (Google Hybrid GIS)
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsMapOpen(true)}
                  className="text-[11px] font-bold text-emerald-800 bg-white hover:bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-xl transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3" /> Chọn trên bản đồ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          setFormData({
                            ...formData,
                            lat: pos.coords.latitude.toFixed(6),
                            lng: pos.coords.longitude.toFixed(6),
                          });
                          alert(`Đã lấy vị trí GPS hiện tại: ${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`);
                        },
                        (err) => {
                          alert('Không thể lấy vị trí GPS hiện tại: ' + err.message);
                        }
                      );
                    } else {
                      alert('Trình duyệt không hỗ trợ định vị GPS.');
                    }
                  }}
                  className="text-[11px] font-bold text-emerald-800 bg-white hover:bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-xl transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                >
                  📡 Lấy GPS hiện tại
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Latitude (Vĩ độ)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 12.48325"
                  value={formData.lat || ''}
                  onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Longitude (Kinh độ)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 108.31842"
                  value={formData.lng || ''}
                  onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Initial Species setup (ONLY ON ADD MODE) */}
          {isAddMode && (
            <div className="bg-amber-50/60 border border-amber-200/90 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-amber-200/80">
                <Feather className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-extrabold text-amber-950 uppercase tracking-wider">
                  2. Loài động vật đăng ký nuôi ban đầu
                </span>
              </div>

              {/* Quick Select Preset Species Dropdown */}
              <div className="bg-white border border-amber-200/80 rounded-xl p-2.5 space-y-1 shadow-2xs">
                <label className="block text-[11px] font-extrabold text-amber-950">
                  📋 Chọn nhanh loài từ danh mục có sẵn:
                </label>
                <select
                  onChange={(e) => {
                    const preset = PRESET_SPECIES_CATALOG.find((s) => s.vietnameseName === e.target.value);
                    if (preset) {
                      setFormData({
                        ...formData,
                        initialSpeciesName: preset.vietnameseName,
                        initialScientificName: preset.scientificName,
                        initialGroup: preset.group,
                        initialCites: preset.citesAppendix,
                      });
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="">✏️ -- Tự nhập loài mới (Chưa có trong danh mục) --</option>
                  {PRESET_SPECIES_CATALOG.map((sp) => (
                    <option key={sp.vietnameseName} value={sp.vietnameseName}>
                      {sp.vietnameseName} ({sp.scientificName}) - {sp.group}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên tiếng Việt loài nuôi</label>
                  <input
                    type="text"
                    value={formData.initialSpeciesName || ''}
                    onChange={(e) => setFormData({ ...formData, initialSpeciesName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-amber-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên khoa học</label>
                  <input
                    type="text"
                    value={formData.initialScientificName || ''}
                    onChange={(e) => setFormData({ ...formData, initialScientificName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-amber-500 shadow-2xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phân nhóm quản lý</label>
                  <input
                    type="text"
                    value={formData.initialGroup || ''}
                    onChange={(e) => setFormData({ ...formData, initialGroup: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500 shadow-2xs"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-amber-200/60">
                <span className="block text-[11px] font-extrabold text-amber-900 mb-2">
                  Số lượng hiện trạng đăng ký ban đầu (Dòng A):
                </span>

                <div className="grid grid-cols-5 gap-2 text-center">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Bố (Đực)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.father ?? 0}
                      onChange={(e) => setFormData({ ...formData, father: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded-lg py-1 px-1 text-center text-xs font-extrabold text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Mẹ (Cái)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.mother ?? 0}
                      onChange={(e) => setFormData({ ...formData, mother: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded-lg py-1 px-1 text-center text-xs font-extrabold text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Đực khác</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.otherMale ?? 0}
                      onChange={(e) => setFormData({ ...formData, otherMale: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded-lg py-1 px-1 text-center text-xs font-extrabold text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Cái khác</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.otherFemale ?? 0}
                      onChange={(e) => setFormData({ ...formData, otherFemale: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded-lg py-1 px-1 text-center text-xs font-extrabold text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Chưa XD</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.otherUnknown ?? 0}
                      onChange={(e) => setFormData({ ...formData, otherUnknown: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded-lg py-1 px-1 text-center text-xs font-extrabold text-slate-900 focus:outline-none focus:border-amber-500 shadow-2xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors shadow-xs"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isAddMode ? 'Tạo Cơ Sở Mới' : 'Lưu Thay Đổi'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        initialLat={formData.lat ? parseFloat(formData.lat) : undefined}
        initialLng={formData.lng ? parseFloat(formData.lng) : undefined}
        onConfirm={(lat, lng) => {
          setFormData({
            ...formData,
            lat: lat.toFixed(6),
            lng: lng.toFixed(6),
          });
        }}
      />
    </div>
  );
}
