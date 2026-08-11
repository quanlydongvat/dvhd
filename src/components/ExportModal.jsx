import React, { useState } from 'react';
import { X, Download, MapPin } from 'lucide-react';
import { COMMUNES } from '../utils/exportExcel';

export default function ExportModal({ onClose, onExport }) {
  const [selectedCommune, setSelectedCommune] = useState('ALL');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Xuất Báo Cáo Tổng Hợp</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto">
          <p className="text-sm text-slate-600 mb-4">
            Vui lòng chọn phạm vi xuất báo cáo. Bạn có thể xuất báo cáo cho toàn huyện hoặc chọn từng xã cụ thể.
          </p>

          <label className="block text-sm font-bold text-slate-700 mb-1.5">Phạm vi dữ liệu:</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-emerald-500" />
            </div>
            <select
              value={selectedCommune}
              onChange={(e) => setSelectedCommune(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-slate-900 font-medium"
            >
              <option value="ALL">Toàn 5 Xã (Toàn huyện)</option>
              {COMMUNES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              onExport(selectedCommune);
              onClose();
            }}
            className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>
    </div>
  );
}
