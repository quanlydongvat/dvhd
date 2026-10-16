import React, { useState, useEffect } from 'react';
import { ShieldCheck, Download, X, Clock, CheckCircle2, Database, Sparkles } from 'lucide-react';

export default function BackupReminderBanner({
  appData,
  packingListData = [],
  facilitiesList = [],
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reminderReason, setReminderReason] = useState('MONTHLY'); // 'FIRST_DAY' | 'WEEKLY'

  useEffect(() => {
    // 1. Kiểm tra thời gian hoãn nhắc nhở (Snooze)
    const snoozedUntil = Number(localStorage.getItem('wildlife_backup_snooze_until') || 0);
    if (Date.now() < snoozedUntil) {
      return;
    }

    // 2. Kiểm tra ngày đầu tháng
    const now = new Date();
    const isFirstDay = now.getDate() === 1;

    // 3. Kiểm tra ngày sao lưu gần nhất
    const lastBackupStr = localStorage.getItem('wildlife_last_backup_date');
    const todayStr = now.toISOString().slice(0, 10);

    // Nếu hôm nay đã sao lưu rồi thì không cần nhắc
    if (lastBackupStr === todayStr) {
      return;
    }

    let shouldShow = false;

    if (isFirstDay) {
      shouldShow = true;
      setReminderReason('FIRST_DAY');
    } else if (!lastBackupStr) {
      // Chưa từng sao lưu lần nào
      shouldShow = true;
      setReminderReason('WEEKLY');
    } else {
      // Tính số ngày kể từ lần sao lưu gần nhất
      const lastDate = new Date(lastBackupStr);
      const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
      if (diffDays >= 7) {
        shouldShow = true;
        setReminderReason('WEEKLY');
      }
    }

    if (shouldShow) {
      // Xuất hiện nhẹ nhàng sau khi trang tải 2 giây
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // 1-Click Backup Download
  const handleExecuteBackup = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const backupObj = {
      exportedAt: new Date().toISOString(),
      agency: 'Hạt Kiểm lâm khu vực Krông Bông',
      title: 'Sổ theo dõi & Quản lý cơ sở nuôi động vật rừng điện tử',
      version: 'TT85/2025/TT-BNNMT',
      totalFacilities: facilitiesList.length || (appData?.facilitiesList || []).length,
      facilitiesList: facilitiesList.length > 0 ? facilitiesList : (appData?.facilitiesList || []),
      totalPackingList: packingListData.length,
      packingListData: packingListData,
      backupSource: 'AUTO_REMINDER_ONE_CLICK',
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Sao_Luu_Kiem_Lam_Krong_Bong_${todayStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    // Lưu mốc ngày sao lưu thành công
    localStorage.setItem('wildlife_last_backup_date', todayStr);

    // Hiển thị trạng thái thành công
    setIsSuccess(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsSuccess(false);
    }, 3200);
  };

  // Snooze nhắc lại sau 3 ngày
  const handleSnooze = () => {
    const threeDaysLater = Date.now() + 3 * 24 * 60 * 60 * 1000;
    localStorage.setItem('wildlife_backup_snooze_until', String(threeDaysLater));
    setIsOpen(false);
  };

  // Đóng cho phiên làm việc hiện tại
  const handleDismiss = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <aside
      aria-label="Thông báo nhắc nhở sao lưu dự phòng"
      className="fixed bottom-20 left-3 right-3 sm:left-6 sm:right-auto sm:max-w-md z-45 bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-emerald-400 shadow-2xl shadow-slate-900/15 animate-in slide-in-from-bottom-5 fade-in duration-300 font-sans"
    >
      {/* Decorative ambient gradient */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-300/20 rounded-full blur-2xl pointer-events-none" />

      {isSuccess ? (
        <div className="flex items-center gap-3 py-2 text-emerald-800">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0 shadow-inner">
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="font-black text-sm text-emerald-950">Sao Lưu An Toàn Thành Công!</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Tệp JSON dự phòng đã được tải về máy tính của bạn. Dữ liệu được bảo vệ an toàn.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Header Tag & Close Button */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                <span>Bảo Vệ Dữ Liệu • Hạt Kiểm Lâm</span>
              </span>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Đóng thông báo này"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Main Title & Content */}
          <div className="space-y-1">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
              {reminderReason === 'FIRST_DAY'
                ? 'Hôm nay là đầu tháng, bạn có muốn tải bản sao lưu dự phòng an toàn về máy tính không?'
                : 'Đã đến lịch sao lưu định kỳ, bạn có muốn tải bản sao lưu dự phòng an toàn về máy tính không?'}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Bao gồm đầy đủ <strong>{facilitiesList.length} cơ sở nuôi</strong>, nhật ký biến động đàn &amp;{' '}
              <strong>{packingListData.length} hồ sơ bảng kê lâm sản</strong>.
            </p>
          </div>

          {/* 1-Click Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleExecuteBackup}
              className="flex-1 py-2 px-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-700/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Tải Sao Lưu Ngay (1-chạm)</span>
            </button>

            <button
              type="button"
              onClick={handleSnooze}
              className="py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer flex items-center gap-1"
              title="Tạm hoãn nhắc lại sau 3 ngày"
            >
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Để sau</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
