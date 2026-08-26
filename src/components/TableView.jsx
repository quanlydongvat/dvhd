import React, { useState } from 'react';
import { Edit2, Trash2, Info, ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp, AlertTriangle, Eye, Building2, Lock, UserCheck, MapPin, FileText, User } from 'lucide-react';
import { formatDateVN, PURPOSE_CODES } from '../utils/calculations';

export default function TableView({
  rows = [],
  species,
  speciesList = [],
  onSelectSpecies,
  facilityInfo,
  onEditRow,
  onDeleteRow,
  onEditBaseline,
  onOpenAddSpecies,
  onOpenEditFacility,
  onOpenBackupModal,
  onApprovePending,
  onRejectPending,
  currentUser,
  isReadOnly = false,
  onOpenLogin,
}) {
  const [showNotes, setShowNotes] = useState(true);
  const [mobileViewMode, setMobileViewMode] = useState('TABLE'); // 'TABLE' | 'CARDS'

  if (!species) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto my-12 shadow-xl">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <Info className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-slate-900">Chưa Có Dữ Liệu Loài Động Vật Hoang Dã</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Dữ liệu hiện đang trống. Bạn có thể bắt đầu nhập thông tin cơ sở nuôi mới, thêm các loài nuôi bằng tay hoặc nạp từ file Excel (.xlsx).
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenEditFacility}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-sm"
          >
            <span>🏢 Cập nhật cơ sở nuôi</span>
          </button>

          <button
            onClick={onOpenAddSpecies}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <span>➕ Thêm loài mới bằng tay</span>
          </button>

          <button
            onClick={onOpenBackupModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-md"
          >
            <span>📊 Nhập từ Excel / Sao lưu</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* QR Code Scan Read-Only Notification Banner */}
      {isReadOnly && (
        <div className="bg-amber-500/10 border-2 border-amber-400 text-amber-950 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-md animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-400 text-slate-950 rounded-xl font-bold flex-shrink-0">
              <Eye className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-black text-sm text-slate-900">
                Chế Độ Quét Mã QR Code: Chỉ Xem Sổ Theo Dõi Mẫu II (Read-Only)
              </h4>
              <p className="text-xs text-slate-700 font-semibold mt-0.5">
                Dữ liệu thuộc về cơ sở <strong>{facilityInfo?.facilityName}</strong> (Chủ cơ sở: {facilityInfo?.ownerName}). Bạn đang truy cập ở chế độ chỉ đọc và không thể chỉnh sửa hay xóa số liệu.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block text-xs font-black text-amber-900 bg-amber-200 border border-amber-300 px-3 py-1.5 rounded-xl whitespace-nowrap">
            🔒 Khóa chỉnh sửa
          </span>
        </div>
      )}

      {/* Short Facility Banner for QR Reader / Public View */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg space-y-3 border border-emerald-700/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-700/50 pb-3">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30 inline-block">
              HẠT KIỂM LÂM KHU VỰC KRÔNG BÔNG
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2">
              <Building2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <span>{facilityInfo?.facilityName || 'Cơ sở nuôi động vật hoang dã'}</span>
            </h2>
          </div>

          {!currentUser ? (
            <button
              onClick={onOpenLogin}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              title="Đăng nhập tài khoản để khai báo biến động tăng giảm đàn"
            >
              <Lock className="w-4 h-4 text-slate-950" />
              <span>🔐 Khai báo biến động (Đăng nhập)</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/40">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Đang đăng nhập: {currentUser.username || currentUser.name}</span>
            </div>
          )}
        </div>

        {/* Short Facility Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-emerald-200 block">Chủ cơ sở</span>
              <strong className="text-white font-bold">{facilityInfo?.ownerName || '---'}</strong>
            </div>
          </div>

          <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-indigo-200 block">Mã số đăng ký</span>
              <strong className="text-amber-300 font-mono font-bold">{facilityInfo?.registrationCode || 'Chưa cấp'}</strong>
            </div>
          </div>

          <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 col-span-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-rose-200 block">Địa chỉ cơ sở</span>
              <strong className="text-white font-semibold">{facilityInfo?.address} ({facilityInfo?.commune || 'Xã Krông Bông'})</strong>
            </div>
          </div>
        </div>

        {/* Species Switcher Tabs (If facility has multiple species) */}
        {speciesList && speciesList.length > 1 && (
          <div className="pt-2 border-t border-emerald-800/60 flex items-center gap-1.5 overflow-x-auto">
            <span className="text-xs font-bold text-slate-300 mr-1 whitespace-nowrap">Loài nuôi ({speciesList.length}):</span>
            {speciesList.map((sp) => (
              <button
                key={sp.id}
                onClick={() => onSelectSpecies && onSelectSpecies(sp.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  species?.id === sp.id
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md scale-105'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                {sp.vietnameseName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Species Sub-Header for Display */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-slate-100 border border-emerald-200/80 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-emerald-700 flex items-center gap-1.5">
              <span>Sổ theo dõi sinh sản & biến động đàn</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1 flex items-center gap-3">
              <span>{species?.vietnameseName}</span>
              <span className="text-base font-semibold italic text-emerald-700">({species?.scientificName})</span>
            </h2>
            <div className="flex flex-wrap gap-4 text-xs text-slate-600 mt-2">
              <div>Phân nhóm: <span className="text-slate-900 font-semibold">{species?.group || '---'}</span></div>
              <div>Công ước CITES: <span className="text-slate-900 font-semibold">{species?.citesAppendix || '---'}</span></div>
              <div>Tổng đàn hiện tại: <span className="text-emerald-800 font-bold text-sm bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-300 shadow-xs">{rows[rows.length - 1]?.total || 0} cá thể</span></div>
            </div>
          </div>

          <div className="bg-white/90 border border-slate-200/80 rounded-xl p-3 text-xs space-y-1 text-slate-600 min-w-[240px] shadow-sm">
            <div className="font-bold text-emerald-800 border-b border-slate-100 pb-1 mb-1">
              Công thức tính toán tự động:
            </div>
            <div>• Tổng số (Cột 2) = (3) + (4) + (5) + (6) + (7)</div>
            <div>• Bố (3) = A3 + B8 (Tăng) - B13 (Giảm)</div>
            <div>• Mẹ (4) = A4 + B9 (Tăng) - B14 (Giảm)</div>
            <div>• Đực (5) = A5 + B10 (Tăng) - B15 (Giảm)</div>
            <div>• Cái (6) = A6 + B11 (Tăng) - B16 (Giảm)</div>
            <div>• Chưa XĐ (7) = A7 + B12 (Tăng) - B17 (Giảm)</div>
          </div>
        </div>
      </div>

      {/* Mobile Display Mode Switcher (Chế độ Thẻ di động vs Bảng 19 cột A4) */}
      <div className="flex sm:hidden items-center justify-between bg-slate-100 p-2 rounded-2xl border border-slate-200 shadow-inner text-xs">
        <span className="font-extrabold text-slate-700">Chế độ xem Sổ di động:</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMobileViewMode('CARDS')}
            className={`px-3 py-1.5 rounded-xl font-extrabold transition-all ${
              mobileViewMode === 'CARDS'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            📋 Thẻ di động
          </button>
          <button
            onClick={() => setMobileViewMode('TABLE')}
            className={`px-3 py-1.5 rounded-xl font-extrabold transition-all ${
              mobileViewMode === 'TABLE'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            📊 Bảng A4
          </button>
        </div>
      </div>

      {/* Mobile Card List View (Shown on small viewports when mobileViewMode === 'CARDS') */}
      {mobileViewMode === 'CARDS' && (
        <div className="sm:hidden space-y-3">
          {rows.map((row) => {
            const isBaseline = row.isBaseline;
            const incTotal = (row.incFather || 0) + (row.incMother || 0) + (row.incOtherMale || 0) + (row.incOtherFemale || 0) + (row.incOtherUnknown || 0);
            const decTotal = (row.decFather || 0) + (row.decMother || 0) + (row.decOtherMale || 0) + (row.decOtherFemale || 0) + (row.decOtherUnknown || 0);

            return (
              <div
                key={row.rowId}
                className={`p-4 rounded-2xl border shadow-md space-y-3 transition-all ${
                  isBaseline
                    ? 'bg-gradient-to-r from-indigo-50 to-slate-50 border-indigo-300'
                    : row.approvalStatus === 'PENDING'
                    ? 'bg-gradient-to-r from-amber-50/70 to-white border-amber-300 shadow-amber-100/50'
                    : incTotal > 0 && decTotal > 0
                    ? 'bg-white border-amber-300'
                    : incTotal > 0
                    ? 'bg-gradient-to-r from-teal-50/80 to-white border-teal-300'
                    : decTotal > 0
                    ? 'bg-gradient-to-r from-rose-50/80 to-white border-rose-300'
                    : 'bg-white border-slate-200'
                }`}
              >
                {/* Header Row: Label & Date */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-black ${isBaseline ? 'bg-indigo-600 text-white' : row.approvalStatus === 'PENDING' ? 'bg-amber-500 text-white' : 'bg-slate-800 text-white'}`}>
                      Dòng {row.label}
                    </span>
                    <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                      {formatDateVN(row.date)} {row.time && <span className="text-[10px] text-slate-500 font-mono font-normal">({row.time})</span>}
                      {row.approvalStatus === 'PENDING' && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
                          🕒 Chờ duyệt
                        </span>
                      )}
                    </span>
                  </div>

                  <span className="text-xs font-black font-mono bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-xl border border-emerald-300">
                    Tổng = {row.total} cá thể
                  </span>
                </div>

                {/* Current Status Numbers Grid */}
                <div className="grid grid-cols-5 gap-1.5 text-center font-mono text-xs">
                  <div className="bg-slate-100 p-1.5 rounded-lg border border-slate-200">
                    <span className="text-[9px] text-slate-500 block font-sans">Bố (col 3)</span>
                    <strong className="text-slate-900">{row.father}</strong>
                  </div>
                  <div className="bg-slate-100 p-1.5 rounded-lg border border-slate-200">
                    <span className="text-[9px] text-slate-500 block font-sans">Mẹ (col 4)</span>
                    <strong className="text-slate-900">{row.mother}</strong>
                  </div>
                  <div className="bg-slate-100 p-1.5 rounded-lg border border-slate-200">
                    <span className="text-[9px] text-slate-500 block font-sans">Đực (col 5)</span>
                    <span className="text-slate-700 font-bold">{row.otherMale}</span>
                  </div>
                  <div className="bg-slate-100 p-1.5 rounded-lg border border-slate-200">
                    <span className="text-[9px] text-slate-500 block font-sans">Cái (col 6)</span>
                    <span className="text-slate-700 font-bold">{row.otherFemale}</span>
                  </div>
                  <div className="bg-slate-100 p-1.5 rounded-lg border border-slate-200">
                    <span className="text-[9px] text-slate-500 block font-sans">Chưa XĐ</span>
                    <span className="text-slate-700 font-bold">{row.otherUnknown}</span>
                  </div>
                </div>

                {/* Fluctuation Badges (Increase vs Decrease) */}
                {!isBaseline && (incTotal > 0 || decTotal > 0) && (
                  <div className="space-y-1.5 text-xs pt-1 border-t border-slate-100">
                    {incTotal > 0 && (
                      <div className="flex items-center gap-1.5 text-teal-800 bg-teal-100/70 p-2 rounded-xl border border-teal-200 font-bold">
                        <ArrowUpRight className="w-4 h-4 text-teal-600 flex-shrink-0" />
                        <span>TĂNG ĐÀN (+{incTotal}):</span>
                        <span className="font-mono text-[11px] font-normal">
                          {[
                            row.incFather > 0 && `Bố:${row.incFather}`,
                            row.incMother > 0 && `Mẹ:${row.incMother}`,
                            row.incOtherMale > 0 && `Đực:${row.incOtherMale}`,
                            row.incOtherFemale > 0 && `Cái:${row.incOtherFemale}`,
                            row.incOtherUnknown > 0 && `Chưa XĐ:${row.incOtherUnknown}`,
                          ].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}

                    {decTotal > 0 && (
                      <div className="flex items-center gap-1.5 text-rose-800 bg-rose-100/70 p-2 rounded-xl border border-rose-200 font-bold">
                        <ArrowDownRight className="w-4 h-4 text-rose-600 flex-shrink-0" />
                        <span>GIẢM ĐÀN (-{decTotal}):</span>
                        <span className="font-mono text-[11px] font-normal">
                          {[
                            row.decFather > 0 && `Bố:${row.decFather}`,
                            row.decMother > 0 && `Mẹ:${row.decMother}`,
                            row.decOtherMale > 0 && `Đực:${row.decOtherMale}`,
                            row.decOtherFemale > 0 && `Cái:${row.decOtherFemale}`,
                            row.decOtherUnknown > 0 && `Chưa XĐ:${row.decOtherUnknown}`,
                          ].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Reason & Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-xs">
                  <div className="min-w-0 pr-2">
                    <span className="text-slate-500 text-[10px] block">Nguyên nhân:</span>
                    <span className="font-semibold text-slate-900 truncate block">{row.reason}</span>
                  </div>

                  {!isReadOnly && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {isBaseline ? (
                        <button
                          onClick={onEditBaseline}
                          className="px-2.5 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-lg text-xs font-bold border border-indigo-300"
                        >
                          Sửa Dòng A
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => onEditRow(row)}
                            className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-300"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => onDeleteRow(row.rowId)}
                            className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg text-xs font-bold border border-rose-300"
                          >
                            Xóa
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main 19-Column Table Container (Hidden on mobile when mobileViewMode === 'CARDS') */}
      <div className={`bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden ${mobileViewMode === 'CARDS' ? 'hidden sm:block' : 'block'}`}>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-xs text-left border-collapse min-w-[960px]">
            {/* Table Header matching official 19-column government standard */}
            <thead>
              {/* Row 1 Header */}
              <tr className="bg-slate-100 text-slate-800 text-center font-bold border-b border-slate-200">
                <th rowSpan={4} className="px-1 py-1 border-r border-slate-200 w-8 bg-slate-200/60 whitespace-nowrap text-center">
                  Dòng
                </th>
                <th rowSpan={4} className="px-1 py-1 border-r border-slate-200 w-20 bg-slate-200/60 whitespace-nowrap text-center">
                  Ngày/tháng
                </th>
                <th colSpan={6} className="px-1.5 py-1 border-r border-slate-200 bg-emerald-100/80 text-emerald-950 font-extrabold text-[11px]">
                  Hiện trạng nuôi
                </th>
                <th colSpan={10} className="px-1.5 py-1 border-r border-slate-200 bg-indigo-100/80 text-indigo-950 font-extrabold text-[11px]">
                  Biến động
                </th>
                <th rowSpan={4} className="px-1.5 py-1 border-r border-slate-200 min-w-[120px] max-w-[150px] text-slate-900 bg-slate-100 text-[11px]">
                  Nguyên nhân biến động<br />
                  <span className="font-normal text-[9px] text-slate-500">
                    (sinh sản, mua, bán, chết...)
                  </span>
                </th>
                <th rowSpan={4} className="px-1.5 py-1 min-w-[100px] max-w-[130px] text-slate-900 border-r border-slate-200 bg-slate-100 text-[11px]">
                  Xác nhận Kiểm lâm / Thủy sản
                </th>
                <th rowSpan={4} className="px-1 py-1 w-14 no-print bg-slate-100 text-center">
                  #
                </th>
              </tr>

              {/* Row 2 Header */}
              <tr className="bg-slate-100 text-slate-800 text-center font-bold border-b border-slate-200">
                <th rowSpan={3} className="px-1 py-0.5 border-r border-slate-200 bg-emerald-200/60 text-emerald-950 font-black w-12 text-[11px] whitespace-nowrap">
                  Tổng số
                </th>
                <th colSpan={2} className="px-0.5 py-0.5 border-r border-slate-200 bg-emerald-100/40 text-emerald-900 font-bold text-[11px]">
                  Bố mẹ
                </th>
                <th colSpan={3} className="px-0.5 py-0.5 border-r border-slate-200 bg-emerald-100/40 text-emerald-900 font-bold text-[11px]">
                  Cá thể khác
                </th>
                <th colSpan={5} className="px-0.5 py-0.5 border-r border-slate-200 bg-teal-100/70 text-teal-950 font-extrabold text-[11px]">
                  Tăng đàn
                </th>
                <th colSpan={5} className="px-0.5 py-0.5 border-r border-slate-200 bg-rose-100/70 text-rose-950 font-extrabold text-[11px]">
                  Giảm đàn
                </th>
              </tr>

              {/* Row 3 Header */}
              <tr className="bg-slate-50 text-slate-700 text-center font-semibold border-b border-slate-200 text-[11px]">
                <th rowSpan={2} className="px-0.5 py-0.5 border-r border-slate-200 w-8">Bố</th>
                <th rowSpan={2} className="px-0.5 py-0.5 border-r border-slate-200 w-8">Mẹ</th>
                <th rowSpan={2} className="px-0.5 py-0.5 border-r border-slate-200 w-8">Đực</th>
                <th rowSpan={2} className="px-0.5 py-0.5 border-r border-slate-200 w-8">Cái</th>
                <th rowSpan={2} className="px-0.5 py-0.5 border-r border-slate-200 w-10 text-[10px]">Chưa XĐ</th>

                <th colSpan={2} className="px-0.5 py-0.5 border-r border-slate-200 bg-teal-50 text-teal-900 font-semibold text-[10px]">Bố mẹ</th>
                <th colSpan={3} className="px-0.5 py-0.5 border-r border-slate-200 bg-teal-50 text-teal-900 font-semibold text-[10px]">Cá thể khác</th>

                <th colSpan={2} className="px-0.5 py-0.5 border-r border-slate-200 bg-rose-50 text-rose-900 font-semibold text-[10px]">Bố mẹ</th>
                <th colSpan={3} className="px-0.5 py-0.5 border-r border-slate-200 bg-rose-50 text-rose-900 font-semibold text-[10px]">Cá thể khác</th>
              </tr>

              {/* Row 4 Header */}
              <tr className="bg-slate-50 text-slate-700 text-center font-semibold border-b border-slate-200 text-[10px]">
                <th className="px-0.5 py-0.5 border-r border-slate-200 w-8 bg-teal-50 text-teal-900">Bố</th>
                <th className="px-0.5 py-0.5 border-r border-slate-200 w-8 bg-teal-50 text-teal-900">Mẹ</th>
                <th className="px-0.5 py-0.5 border-r border-slate-200 w-8 bg-teal-50 text-teal-900">Đực</th>
                <th className="px-0.5 py-0.5 border-r border-slate-200 w-8 bg-teal-50 text-teal-900">Cái</th>
                <th className="px-0.5 py-0.5 border-r border-slate-200 w-9 bg-teal-50 text-teal-900 text-[9px]">Chưa XĐ</th>

                <th className="px-0.5 py-0.5 border-r border-slate-200 w-8 bg-rose-50 text-rose-900">Bố</th>
                <th className="px-0.5 py-0.5 border-r border-slate-200 w-8 bg-rose-50 text-rose-900">Mẹ</th>
                <th className="px-0.5 py-0.5 border-r border-slate-200 w-8 bg-rose-50 text-rose-900">Đực</th>
                <th className="px-0.5 py-0.5 border-r border-slate-200 w-8 bg-rose-50 text-rose-900">Cái</th>
                <th className="px-0.5 py-0.5 border-r border-slate-200 w-9 bg-rose-50 text-rose-900 text-[9px]">Chưa XĐ</th>
              </tr>

              {/* Row 5: Official Column Numbers 1 to 19 (Underlined & Smaller Font Size) */}
              <tr className="bg-slate-200/90 text-slate-600 text-center font-mono text-[9px] italic font-semibold border-b-2 border-slate-300">
                <th className="py-0.5 border-r border-slate-300 font-normal">STT</th>
                <th className="py-0.5 border-r border-slate-300 text-emerald-900 underline"><u>1</u></th>
                <th className="py-0.5 border-r border-slate-300 font-extrabold text-emerald-900 bg-emerald-100/80 underline"><u>2</u></th>
                <th className="py-0.5 border-r border-slate-300 underline"><u>3</u></th>
                <th className="py-0.5 border-r border-slate-300 underline"><u>4</u></th>
                <th className="py-0.5 border-r border-slate-300 underline"><u>5</u></th>
                <th className="py-0.5 border-r border-slate-300 underline"><u>6</u></th>
                <th className="py-0.5 border-r border-slate-300 underline"><u>7</u></th>
                <th className="py-0.5 border-r border-slate-300 text-teal-800 underline"><u>8</u></th>
                <th className="py-0.5 border-r border-slate-300 text-teal-800 underline"><u>9</u></th>
                <th className="py-0.5 border-r border-slate-300 text-teal-800 underline"><u>10</u></th>
                <th className="py-0.5 border-r border-slate-300 text-teal-800 underline"><u>11</u></th>
                <th className="py-0.5 border-r border-slate-300 text-teal-800 underline"><u>12</u></th>
                <th className="py-0.5 border-r border-slate-300 text-rose-800 underline"><u>13</u></th>
                <th className="py-0.5 border-r border-slate-300 text-rose-800 underline"><u>14</u></th>
                <th className="py-0.5 border-r border-slate-300 text-rose-800 underline"><u>15</u></th>
                <th className="py-0.5 border-r border-slate-300 text-rose-800 underline"><u>16</u></th>
                <th className="py-0.5 border-r border-slate-300 text-rose-800 underline"><u>17</u></th>
                <th className="py-0.5 border-r border-slate-300 underline"><u>18</u></th>
                <th className="py-0.5 border-r border-slate-300 underline"><u>19</u></th>
                <th className="py-0.5 no-print">#</th>
              </tr>

            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-200">
              {rows.map((row) => {
                const isBaseline = row.isBaseline;
                const hasInc =
                  (row.incFather || 0) + (row.incMother || 0) + (row.incOtherMale || 0) + (row.incOtherFemale || 0) + (row.incOtherUnknown || 0) > 0;
                const hasDec =
                  (row.decFather || 0) + (row.decMother || 0) + (row.decOtherMale || 0) + (row.decOtherFemale || 0) + (row.decOtherUnknown || 0) > 0;

                return (
                  <tr
                    key={row.rowId}
                    className={`transition-colors text-center font-mono ${
                      isBaseline
                        ? 'bg-indigo-50/80 font-bold text-slate-900 border-b border-indigo-100'
                        : row.approvalStatus === 'PENDING'
                        ? 'bg-amber-50/75 hover:bg-amber-100/90 text-slate-800 font-medium'
                        : hasInc && hasDec
                        ? 'hover:bg-slate-100 text-slate-800'
                        : hasInc
                        ? 'bg-teal-50/50 hover:bg-teal-100/60 text-slate-800'
                        : hasDec
                        ? 'bg-rose-50/50 hover:bg-rose-100/60 text-slate-800'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    {/* Row Label (A, B, C...) */}
                    <td className="px-0.5 py-0.5 font-bold border-r border-slate-200 text-slate-800 text-center relative">
                      <span className={`px-1.5 py-0.5 rounded font-sans text-xs shadow-2xs ${isBaseline ? 'bg-indigo-600 text-white font-bold' : row.approvalStatus === 'PENDING' ? 'bg-amber-500 text-white font-extrabold' : 'bg-slate-200 text-slate-800'}`}>
                        {row.label}
                      </span>
                      {row.approvalStatus === 'PENDING' && (
                        <span className="absolute top-0.5 right-0.5 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                      )}
                    </td>

                    {/* Col 1: Date */}
                    <td className="px-1 py-0.5 border-r border-slate-200 whitespace-nowrap text-slate-800 font-sans text-[11px] font-bold text-center">
                      {formatDateVN(row.date)}
                      {row.time && <span className="text-[9px] text-slate-500 block font-mono font-normal mt-0.5">{row.time}</span>}
                      {row.approvalStatus === 'PENDING' && (
                        <div className="flex flex-col gap-0.5 items-center mt-1">
                          <span className="text-[8px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 font-sans font-black block leading-none w-max mx-auto shadow-2xs">
                            🕒 Chờ duyệt
                          </span>
                          {(currentUser?.role === 'ADMIN' || currentUser?.role === 'STAFF') && (
                            <div className="flex items-center gap-1 mt-0.5 no-print">
                              <button
                                type="button"
                                onClick={() => onApprovePending && onApprovePending({
                                  id: row.rowId,
                                  fluctuationId: row.rowId,
                                  facilityId: facilityInfo?.id,
                                  speciesId: species?.id,
                                  facilityName: facilityInfo?.facilityName,
                                  speciesName: species?.vietnameseName,
                                  date: row.date,
                                  reason: row.reason,
                                  ...row,
                                })}
                                className="px-1.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-black rounded shadow-2xs cursor-pointer transition-all hover:scale-105"
                                title="Phê duyệt số liệu biến động này"
                              >
                                ✓ Duyệt
                              </button>
                              <button
                                type="button"
                                onClick={() => onRejectPending && onRejectPending({
                                  id: row.rowId,
                                  fluctuationId: row.rowId,
                                  facilityId: facilityInfo?.id,
                                  speciesId: species?.id,
                                  facilityName: facilityInfo?.facilityName,
                                  speciesName: species?.vietnameseName,
                                  date: row.date,
                                  reason: row.reason,
                                  ...row,
                                })}
                                className="px-1.5 py-0.5 bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-black rounded shadow-2xs cursor-pointer transition-all hover:scale-105"
                                title="Từ chối biến động này"
                              >
                                ✗ Xóa
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Col 2: Total (Computed = 3 + 4 + 5 + 6 + 7) */}
                    <td className="px-1 py-0.5 border-r border-slate-200 font-black text-xs text-emerald-800 bg-emerald-50/90 font-mono text-center">
                      {row.total}
                      {row.hasWarning && (
                        <AlertTriangle className="w-3 h-3 text-amber-500 inline ml-0.5" title="Cảnh báo: Có chỉ số hiện trạng bị âm!" />
                      )}
                    </td>

                    {/* Cols 3-7: Current status */}
                    <td className="px-0.5 py-0.5 border-r border-slate-200 font-bold text-slate-900 text-xs text-center">{row.father}</td>
                    <td className="px-0.5 py-0.5 border-r border-slate-200 font-bold text-slate-900 text-xs text-center">{row.mother}</td>
                    <td className="px-0.5 py-0.5 border-r border-slate-200 text-slate-800 text-xs text-center">{row.otherMale}</td>
                    <td className="px-0.5 py-0.5 border-r border-slate-200 text-slate-800 text-xs text-center">{row.otherFemale}</td>
                    <td className="px-0.5 py-0.5 border-r border-slate-200 text-slate-800 text-xs text-center">{row.otherUnknown}</td>

                    {/* Cols 8-12: Increases */}
                    <td className={`px-0.5 py-0.5 border-r border-slate-200 text-xs text-center ${row.incFather > 0 ? 'text-teal-700 font-black bg-teal-100/70' : 'text-slate-400'}`}>
                      {isBaseline ? '-' : row.incFather || '-'}
                    </td>
                    <td className={`px-0.5 py-0.5 border-r border-slate-200 text-xs text-center ${row.incMother > 0 ? 'text-teal-700 font-black bg-teal-100/70' : 'text-slate-400'}`}>
                      {isBaseline ? '-' : row.incMother || '-'}
                    </td>
                    <td className={`px-0.5 py-0.5 border-r border-slate-200 text-xs text-center ${row.incOtherMale > 0 ? 'text-teal-700 font-black bg-teal-100/70' : 'text-slate-400'}`}>
                      {isBaseline ? '-' : row.incOtherMale || '-'}
                    </td>
                    <td className={`px-0.5 py-0.5 border-r border-slate-200 text-xs text-center ${row.incOtherFemale > 0 ? 'text-teal-700 font-black bg-teal-100/70' : 'text-slate-400'}`}>
                      {isBaseline ? '-' : row.incOtherFemale || '-'}
                    </td>
                    <td className={`px-0.5 py-0.5 border-r border-slate-200 text-xs text-center ${row.incOtherUnknown > 0 ? 'text-teal-700 font-black bg-teal-100/70' : 'text-slate-400'}`}>
                      {isBaseline ? '-' : row.incOtherUnknown || '-'}
                    </td>

                    {/* Cols 13-17: Decreases */}
                    <td className={`px-0.5 py-0.5 border-r border-slate-200 text-xs text-center ${row.decFather > 0 ? 'text-rose-700 font-black bg-rose-100/70' : 'text-slate-400'}`}>
                      {isBaseline ? '-' : row.decFather || '-'}
                    </td>
                    <td className={`px-0.5 py-0.5 border-r border-slate-200 text-xs text-center ${row.decMother > 0 ? 'text-rose-700 font-black bg-rose-100/70' : 'text-slate-400'}`}>
                      {isBaseline ? '-' : row.decMother || '-'}
                    </td>
                    <td className={`px-0.5 py-0.5 border-r border-slate-200 text-xs text-center ${row.decOtherMale > 0 ? 'text-rose-700 font-black bg-rose-100/70' : 'text-slate-400'}`}>
                      {isBaseline ? '-' : row.decOtherMale || '-'}
                    </td>
                    <td className={`px-0.5 py-0.5 border-r border-slate-200 text-xs text-center ${row.decOtherFemale > 0 ? 'text-rose-700 font-black bg-rose-100/70' : 'text-slate-400'}`}>
                      {isBaseline ? '-' : row.decOtherFemale || '-'}
                    </td>
                    <td className={`px-0.5 py-0.5 border-r border-slate-200 text-xs text-center ${row.decOtherUnknown > 0 ? 'text-rose-700 font-black bg-rose-100/70' : 'text-slate-400'}`}>
                      {isBaseline ? '-' : row.decOtherUnknown || '-'}
                    </td>

                    {/* Col 18: Reason */}
                    <td className="px-1.5 py-0.5 border-r border-slate-200 text-left font-sans text-[11px] text-slate-900 font-medium leading-tight whitespace-normal min-w-[120px] max-w-[150px]" title={row.reason}>
                      {row.reason}
                    </td>

                    {/* Col 19: Verifier */}
                    <td className="px-1.5 py-0.5 border-r border-slate-200 text-left font-sans text-[11px] text-slate-800 font-semibold leading-tight whitespace-normal min-w-[100px] max-w-[130px]" title={row.verifier}>
                      {row.verifier || '---'}
                    </td>


                    {/* Actions */}
                    {!isReadOnly && (
                      <td className="px-0.5 py-0.5 no-print text-center">
                        <div className="flex items-center justify-center gap-0.5">
                          {isBaseline ? (
                            <button
                              onClick={onEditBaseline}
                              className="p-1 text-indigo-600 hover:bg-indigo-100 rounded transition-colors"
                              title="Sửa dòng A (Số liệu ban đầu)"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => onEditRow(row)}
                                className="p-1 text-emerald-600 hover:bg-emerald-100 rounded transition-colors"
                                title="Sửa thông tin dòng này"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteRow(row.rowId)}
                                className="p-1 text-rose-600 hover:bg-rose-100 rounded transition-colors"
                                title="Xóa biến động này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Accordion Footer: Official Guidelines & Notes */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 shadow-sm">
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="w-full flex items-center justify-between font-bold text-slate-800 hover:text-emerald-700 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>GHI CHÚ HƯỚNG DẪN ĐIỀN NỘI DUNG (Trích Thông tư số 85/2025/TT-BNNMT / Sổ Mẫu II)</span>
          </div>
          {showNotes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showNotes && (
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-slate-600 leading-relaxed font-sans">
            <p>
              <strong>1. Mã mục đích nuôi được quy định:</strong> (T) Thương mại; (Z) Vườn thú, trưng bày; (Q) Biểu diễn xiếc; (R) Cứu hộ; (S) Nghiên cứu khoa học; (C) Bảo tồn; (E) Du lịch sinh thái; (O) Khác (ví dụ làm cảnh).
            </p>
            <p>
              <strong>2. Cột 1:</strong> Ghi ngày/tháng/năm biến động đàn. Trường hợp trong cùng một ngày vừa có nhập vừa có xuất hoặc nhiều lần nhập/xuất phải ghi đầy đủ theo từng lần nhập, xuất và theo trình tự thời gian, không ghi gộp thông tin trong ngày.
            </p>
            <p>
              <strong>3. Tổng số cá thể (cột 2):</strong> Tự động tính toán = (3) + (4) + (5) + (6) + (7).
            </p>
            <p>
              <strong>4. Dòng A:</strong> Ghi chép số lượng vật nuôi hiện có ban đầu.
            </p>
            <p>
              <strong>5. Dòng B, C, D...:</strong> Ghi chép đầy đủ thông tin khi có biến động tăng/giảm đàn.
              <br />
              <span className="font-mono text-[11px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 inline-block mt-1">
                a) (B3) = (A3) + (B8) - (B13) &nbsp;|&nbsp; b) (B4) = (A4) + (B9) - (B14) &nbsp;|&nbsp; c) (B5) = (A5) + (B10) - (B15) &nbsp;|&nbsp; d) (B6) = (A6) + (B11) - (B16) &nbsp;|&nbsp; đ) (B7) = (A7) + (B12) - (B17)
              </span>
            </p>
            <p className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-2 text-emerald-950 font-medium">
              <strong> Quy tắc chuyển đàn theo Thông tư 85/2025/TT-BNNMT:</strong> Khi cá thể đủ điều kiện sinh sản (ví dụ cầy vòi hương từ 12 tháng tuổi), đây là chuyển nhóm nội bộ (không phải nhập mới/xuat bán). Phải ghi đồng thời: 
              <br />
              + Cá thể đực: Tăng Bố (B8) = X, Giảm Đực khác (B15) = X
              <br />
              + Cá thể cái: Tăng Mẹ (B9) = Y, Giảm Cái khác (B16) = Y
              <br />
              Đảm bảo tổng số cá thể cơ sở không thay đổi: (B3+B4+B5+B6+B7) = (A3+A4+A5+A6+A7).
            </p>
            <p>
              <strong>6. Trường hợp nuôi sinh sản:</strong> Tổ chức, cá nhân phải ghi đầy đủ thông tin của đàn bố, mẹ vào các cột 3, 4, 8, 9, 13 và 14.
            </p>
            <p>
              <strong>7. Cột 19:</strong> Cơ quan kiểm lâm sở tại/Cơ quan quản lý nhà nước về thủy sản ký xác nhận, ghi rõ họ tên, đóng dấu khi kiểm tra đột xuất, định kỳ hoặc khi tổ chức xuất bán động vật.
            </p>
            <p>
              <strong>8. Quản lý sổ:</strong> Mỗi loài động vật được lập 01 sổ theo dõi riêng biệt.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

