import React, { useState, useEffect } from 'react';
import { X, Printer, Copy, QrCode, Building, User, FileText, MapPin, Loader2 } from 'lucide-react';
import QRCode from 'qrcode';

export default function QRCodeModal({ isOpen, onClose, facility }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const appDomain = typeof window !== 'undefined' ? window.location.origin : 'https://quanlydongvat.xyz';
  const qrUrl = facility ? `${appDomain}/?facId=${facility.id}` : '';

  useEffect(() => {
    if (isOpen && facility) {
      setIsGenerating(true);
      QRCode.toDataURL(qrUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#064e3b',
          light: '#ffffff',
        },
      })
        .then((url) => {
          setQrDataUrl(url);
          setIsGenerating(false);
        })
        .catch((err) => {
          console.warn('Local QR Code generation error:', err);
          setQrDataUrl(`https://quickchart.io/qr?text=${encodeURIComponent(qrUrl)}&size=300`);
          setIsGenerating(false);
        });
    }
  }, [isOpen, facility, qrUrl]);

  if (!isOpen || !facility) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrUrl);
    alert(`Đã sao chép đường dẫn QR Code:\n${qrUrl}`);
  };

  const handlePrint = () => {
    document.body.classList.add('printing-qr-badge');
    window.print();
    setTimeout(() => {
      document.body.classList.remove('printing-qr-badge');
    }, 1000);
  };

  return (
    <div className="qr-modal-wrapper fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="qr-modal-content bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="qr-modal-header bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 rounded-2xl">
              <QrCode className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Mã QR Định Danh Cơ Sở</h3>
              <p className="text-xs text-slate-300 font-medium mt-0.5">Quét để truy cập ngay Sổ Mẫu II & Bản đồ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Printable Card Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1 bg-slate-50/50">
          {/* Printable Badge Frame */}
          <div className="print-area bg-white border-2 border-emerald-600 rounded-3xl p-4 sm:p-6 shadow-xl text-center space-y-3 sm:space-y-4 relative overflow-hidden">
            {/* Background Seal Accent */}
            <div className="absolute -right-12 -top-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Official Header Badge */}
            <div className="border-b border-slate-200 pb-2.5 sm:pb-3 space-y-1">
              <h4 className="text-xs sm:text-sm font-black uppercase text-slate-900 tracking-tight">HẠT KIỂM LÂM KHU VỰC KRÔNG BÔNG</h4>
              <div className="inline-block bg-emerald-700 text-white text-[10px] sm:text-[11px] font-black uppercase px-2.5 sm:px-3 py-1 rounded-full shadow-xs mt-1">
                MÃ QR ĐỊNH DANH CƠ SỞ NUÔI ĐVHD
              </div>
            </div>

            {/* Big QR Code Image (Local Offline Rendered) */}
            <div className="flex flex-col items-center justify-center my-2 sm:my-3">
              <div className="p-2.5 sm:p-3 bg-white border-3 sm:border-4 border-emerald-600 rounded-2xl shadow-md inline-block min-w-[180px] min-h-[180px] flex items-center justify-center">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-2 py-8 text-emerald-700 font-bold text-xs">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    <span>Đang tạo mã QR...</span>
                  </div>
                ) : qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`Mã QR ${facility.facilityName}`}
                    className="w-40 h-40 sm:w-48 sm:h-48 object-contain mx-auto"
                  />
                ) : (
                  <div className="text-xs text-rose-500 font-bold p-4">Không thể tạo mã QR</div>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-1.5 font-bold">ID: {facility.id}</p>
            </div>

            {/* Facility Information Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-extrabold text-slate-900 text-sm">{facility.facilityName}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>Chủ cơ sở: <strong className="text-slate-800 font-bold">{facility.ownerName}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>Mã số đăng ký: <strong className="text-indigo-700 font-mono font-bold">{facility.registrationCode || 'Chưa cấp'}</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>Địa chỉ: <strong className="text-slate-800 font-semibold">{facility.address} ({facility.commune || 'Xã Krông Bông'})</strong></span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 italic font-medium pt-1">
              * Dùng camera điện thoại hoặc ứng dụng quét mã QR để mở Sổ Mẫu II trực tiếp.
            </p>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="qr-modal-footer bg-slate-100 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-4 h-4 text-slate-500" />
            <span>Sao chép Link QR</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-300 rounded-xl transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4 text-white" />
              <span>In Thẻ QR (Paper)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
