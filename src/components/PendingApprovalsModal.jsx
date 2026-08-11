import React from 'react';
import { Bell, CheckCircle2, XCircle, Clock, Building2, Calendar, FileText, X } from 'lucide-react';

export default function PendingApprovalsModal({
  isOpen,
  onClose,
  pendingRequests = [],
  onApprove,
  onReject,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in no-print font-sans">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 border border-amber-400/30 rounded-2xl relative">
              <Bell className="w-5 h-5 animate-bounce" />
              {pendingRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-md">
                  {pendingRequests.length}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                Biến Động Chờ Phê Duyệt
                <span className="text-xs bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black">
                  {pendingRequests.length} yêu cầu
                </span>
              </h3>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Các biến động do cơ sở nuôi đăng báo - Cần Hạt Kiểm Lâm kiểm tra & phê duyệt
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 bg-slate-50/50">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800">Không có biến động nào đang chờ duyệt!</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Tất cả các biến động do cơ sở nuôi báo cáo đã được Hạt Kiểm Lâm phê duyệt vào hệ thống.
              </p>
            </div>
          ) : (
            pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-slate-200/90 hover:border-emerald-400 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200/60">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                        {req.facilityName || 'Cơ sở nuôi'}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Tài khoản gửi: <span className="text-slate-800 font-bold">{req.submittedBy || 'Cơ sở'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 animate-spin text-amber-600" />
                      Chờ Hạt Duyệt
                    </span>
                  </div>
                </div>

              {(() => {
                const incFather = Number(req.incFather || 0);
                const incMother = Number(req.incMother || 0);
                const incOtherMale = Number(req.incOtherMale || 0);
                const incOtherFemale = Number(req.incOtherFemale || 0);
                const incUnknown = Number(req.incOtherUnknown || 0);
                const totalIncMale = incFather + incOtherMale;
                const totalIncFemale = incMother + incOtherFemale;
                const totalInc = totalIncMale + totalIncFemale + incUnknown;

                const decFather = Number(req.decFather || 0);
                const decMother = Number(req.decMother || 0);
                const decOtherMale = Number(req.decOtherMale || 0);
                const decOtherFemale = Number(req.decOtherFemale || 0);
                const decUnknown = Number(req.decOtherUnknown || 0);
                const totalDecMale = decFather + decOtherMale;
                const totalDecFemale = decMother + decOtherFemale;
                const totalDec = totalDecMale + totalDecFemale + decUnknown;

                let typeBadgeText = 'Biến động';
                let typeBadgeClass = 'bg-slate-100 text-slate-800 border border-slate-300';
                let detailsText = '';

                if (totalInc > 0 && totalDec === 0) {
                  typeBadgeText = `🟢 TĂNG ĐÀN (+${totalInc})`;
                  typeBadgeClass = 'bg-emerald-100 text-emerald-950 border border-emerald-300 font-black';
                  
                  const parts = [];
                  if (incFather > 0) parts.push(`Đực bố: +${incFather}`);
                  if (incMother > 0) parts.push(`Cái mẹ: +${incMother}`);
                  if (incOtherMale > 0) parts.push(`Đực con/hậu bị: +${incOtherMale}`);
                  if (incOtherFemale > 0) parts.push(`Cái con/hậu bị: +${incOtherFemale}`);
                  if (incUnknown > 0) parts.push(`KXD (mới nở/sinh): +${incUnknown}`);
                  
                  detailsText = parts.length > 0 ? parts.join(', ') : `+${totalInc} cá thể`;
                } else if (totalDec > 0 && totalInc === 0) {
                  typeBadgeText = `🔴 GIẢM ĐÀN (-${totalDec})`;
                  typeBadgeClass = 'bg-rose-100 text-rose-950 border border-rose-300 font-black';
                  
                  const parts = [];
                  if (decFather > 0) parts.push(`Đực bố: -${decFather}`);
                  if (decMother > 0) parts.push(`Cái mẹ: -${decMother}`);
                  if (decOtherMale > 0) parts.push(`Đực con/hậu bị: -${decOtherMale}`);
                  if (decOtherFemale > 0) parts.push(`Cái con/hậu bị: -${decOtherFemale}`);
                  if (decUnknown > 0) parts.push(`KXD: -${decUnknown}`);
                  
                  detailsText = parts.length > 0 ? parts.join(', ') : `-${totalDec} cá thể`;
                } else if (totalInc > 0 && totalDec > 0) {
                  typeBadgeText = `🔄 TÁCH/CHUYỂN ĐÀN`;
                  typeBadgeClass = 'bg-amber-100 text-amber-950 border border-amber-300 font-black';
                  detailsText = `Tăng: +${totalInc} cá thể | Giảm: -${totalDec} cá thể`;
                } else {
                  // Fallback for custom male/female props if any
                  const fbMale = req.male || 0;
                  const fbFemale = req.female || 0;
                  const fbUnsexed = req.unsexed || 0;
                  const fbTotal = fbMale + fbFemale + fbUnsexed;
                  if (fbTotal > 0) {
                    typeBadgeText = `📊 BIẾN ĐỘNG (${fbTotal})`;
                    detailsText = `${fbMale} Đực / ${fbFemale} Cái / ${fbUnsexed} KXD`;
                  } else {
                    typeBadgeText = `⚠️ 0 cá thể`;
                    detailsText = `Chưa có thông số số lượng`;
                  }
                }

                return (
                  <>
                    {/* Details grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Loài ĐVHD</span>
                        <strong className="text-emerald-950 font-extrabold text-xs">{req.speciesName || 'Loài'}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Ngày phát sinh</span>
                        <strong className="text-slate-800 font-semibold">{req.date || 'Chưa có'}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Loại biến động</span>
                        <span className={`inline-block text-xs px-2 py-0.5 rounded shadow-2xs ${typeBadgeClass}`}>
                          {typeBadgeText}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Tổng biến động</span>
                        <strong className="text-slate-900 font-extrabold text-xs">
                          {totalInc > 0 && totalDec === 0 && `+${totalInc} cá thể`}
                          {totalDec > 0 && totalInc === 0 && `-${totalDec} cá thể`}
                          {totalInc > 0 && totalDec > 0 && `+${totalInc} / -${totalDec}`}
                          {totalInc === 0 && totalDec === 0 && `0 cá thể`}
                        </strong>
                      </div>
                    </div>

                    {/* Quantity Detail Breakdown */}
                    <div className="bg-emerald-50/70 border border-emerald-200/60 p-2.5 rounded-xl text-xs flex items-center gap-2">
                      <span className="text-[11px] font-extrabold text-emerald-900 uppercase tracking-wider flex-shrink-0">
                        Chi tiết số lượng:
                      </span>
                      <span className="text-emerald-950 font-extrabold bg-white px-2.5 py-0.5 rounded border border-emerald-300 shadow-2xs">
                        {detailsText}
                      </span>
                    </div>

                    {(req.reason || req.description || req.note) && (
                      <div className="text-xs text-slate-600 bg-amber-50/60 border border-amber-200/50 p-2.5 rounded-xl flex items-start gap-2">
                        <FileText className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-amber-900 font-semibold">Lý do / Chứng từ: </strong>
                          <span>{req.reason || req.description || req.note}</span>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onReject && onReject(req)}
                    className="px-3.5 py-2 text-xs font-extrabold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/90 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Từ Chối</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onApprove && onApprove(req)}
                    className="px-4 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-md shadow-emerald-600/20 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Phê Duyệt & Cập Nhật</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Hạt Kiểm Lâm Khu Vực Krông Bông</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
