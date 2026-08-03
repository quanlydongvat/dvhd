import React from 'react';
import { Keyboard, X, Sparkles, Command } from 'lucide-react';

export default function DesktopShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcutsList = [
    { key: 'Alt + 1', desc: 'Chuyển sang Sổ Theo Dõi Mẫu II (19 cột)' },
    { key: 'Alt + 2', desc: 'Chuyển sang Bảng Tổng Hợp 31 Cơ Sở Phân Theo 5 Xã' },
    { key: 'Alt + 3', desc: 'Chuyển sang Biểu Đồ Thống Kê & Phân Tích Tăng Trưởng' },
    { key: 'Alt + 4', desc: 'Chuyển sang Bản Đồ Định Vị GIS Google Hybrid' },
    { key: 'Alt + N', desc: 'Mở cửa sổ Thêm Nhật Ký Biến Động Đàn Mới' },
    { key: 'Alt + E', desc: 'Xuất file Báo Cáo Excel chuẩn 19 cột' },
    { key: 'Alt + P', desc: 'Xem & In Sổ Theo Dõi khổ A4 Ngang' },
    { key: 'Alt + F', desc: 'Mở thanh tìm kiếm cơ sở nhanh' },
    { key: 'F11', desc: 'Bật / Tắt chế độ Toàn Màn Hình máy tính (Fullscreen)' },
  ];

  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden my-8">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Danh Sách Phím Tắt Máy Tính (Desktop Shortcuts)</h3>
              <p className="text-xs text-slate-300 font-mono">Tối ưu thao tác nhanh cho cán bộ Kiểm lâm</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <p className="text-xs text-slate-600 font-medium">
            Sử dụng các tổ hợp phím tắt bên dưới trên bàn phím máy tính để thực hiện thao tác nhanh không cần dùng chuột:
          </p>

          <div className="space-y-2 border-t border-slate-200 pt-3">
            {shortcutsList.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-200/80 transition-colors"
              >
                <span className="text-xs text-slate-800 font-medium">{item.desc}</span>
                <span className="font-mono text-xs font-bold bg-slate-900 text-emerald-400 px-2.5 py-1 rounded-lg border border-slate-700 shadow-2xs">
                  {item.key}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all"
          >
            Đã Hiểu (Đóng)
          </button>
        </div>
      </div>
    </div>
  );
}
