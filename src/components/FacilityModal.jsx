import React, { useState, useEffect } from 'react';
import { X, Save, Building2 } from 'lucide-react';
import { PURPOSE_CODES } from '../utils/calculations';

export default function FacilityModal({
  isOpen,
  onClose,
  onSave,
  facilityInfo,
}) {
  const [formData, setFormData] = useState(facilityInfo || {});

  useEffect(() => {
    setFormData(facilityInfo || {});
  }, [facilityInfo, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.facilityName?.trim()) {
      alert('Vui lòng nhập Tên cơ sở nuôi!');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Chỉnh Sửa Thông Tin Cơ Sở Nuôi</h3>
              <p className="text-xs text-slate-500 font-medium">Cập nhật thông tin đơn vị quản lý</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tên cơ sở nuôi sinh sản <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.facilityName || ''}
              onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-500 shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên chủ cơ sở</label>
              <input
                type="text"
                value={formData.ownerName || ''}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mã số đăng ký cơ sở</label>
              <input
                type="text"
                value={formData.registrationCode || ''}
                onChange={(e) => setFormData({ ...formData, registrationCode: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-500 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Địa chỉ cơ sở nuôi</label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-500 shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại liên hệ</label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mục đích nuôi mặc định</label>
              <select
                value={formData.purposeCode || 'T'}
                onChange={(e) => setFormData({ ...formData, purposeCode: e.target.value })}
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

          {/* GPS Coordinates Section */}
          <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-xl p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
                📍 Tọa Độ GPS Định Vị Bản Đồ (Google Hybrid GIS)
              </span>
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
                className="text-[11px] font-bold text-emerald-700 bg-white hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
              >
                📡 Lấy tọa độ GPS hiện tại
              </button>
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
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Thông Tin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
