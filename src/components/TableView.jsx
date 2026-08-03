import React, { useState } from 'react';
import { Edit2, Trash2, Info, ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { formatDateVN, PURPOSE_CODES } from '../utils/calculations';

export default function TableView({
  rows = [],
  species,
  facilityInfo,
  onEditRow,
  onDeleteRow,
  onEditBaseline,
  onOpenAddSpecies,
  onOpenEditFacility,
  onOpenBackupModal,
}) {
  const [showNotes, setShowNotes] = useState(true);

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
      {/* Species Header Banner for Display */}
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

      {/* Main 19-Column Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-xs text-left border-collapse min-w-[1550px]">
            {/* Table Header matching official 19-column government standard */}
            <thead>
              {/* Row 1 Header */}
              <tr className="bg-slate-100 text-slate-800 text-center font-bold border-b border-slate-200">
                <th rowSpan={4} className="p-3 border-r border-slate-200 w-14 bg-slate-200/60">
                  Dòng
                </th>
                <th rowSpan={4} className="p-3 border-r border-slate-200 w-28 bg-slate-200/60">
                  Ngày/ tháng/ năm
                </th>
                <th colSpan={6} className="p-3 border-r border-slate-200 bg-emerald-100/80 text-emerald-950 font-extrabold text-sm">
                  Hiện trạng nuôi
                </th>
                <th colSpan={10} className="p-3 border-r border-slate-200 bg-indigo-100/80 text-indigo-950 font-extrabold text-sm">
                  Biến động
                </th>
                <th rowSpan={4} className="p-3 border-r border-slate-200 min-w-[260px] text-slate-900 bg-slate-100 text-xs">
                  Nguyên nhân biến động<br />
                  <span className="font-normal text-[10px] text-slate-500">
                    (sinh sản F1, F2..., khai thác, mua, bán, tặng, chết, v.v)
                  </span>
                </th>
                <th rowSpan={4} className="p-3 min-w-[220px] text-slate-900 border-r border-slate-200 bg-slate-100 text-xs">
                  Xác nhận của cơ quan kiểm lâm sở tại/Thủy sản
                </th>
                <th rowSpan={4} className="p-2 w-20 no-print bg-slate-100">
                  Thao tác
                </th>
              </tr>

              {/* Row 2 Header */}
              <tr className="bg-slate-100 text-slate-800 text-center font-bold border-b border-slate-200">
                <th rowSpan={3} className="p-2.5 border-r border-slate-200 bg-emerald-200/60 text-emerald-950 font-black w-20 text-xs">
                  Tổng số cá thể
                </th>
                <th colSpan={2} className="p-2 border-r border-slate-200 bg-emerald-100/40 text-emerald-900 font-bold">
                  Bố mẹ
                </th>
                <th colSpan={3} className="p-2 border-r border-slate-200 bg-emerald-100/40 text-emerald-900 font-bold">
                  Các cá thể khác
                </th>
                <th colSpan={5} className="p-2 border-r border-slate-200 bg-teal-100/70 text-teal-950 font-extrabold">
                  Tăng đàn
                </th>
                <th colSpan={5} className="p-2 border-r border-slate-200 bg-rose-100/70 text-rose-950 font-extrabold">
                  Giảm đàn
                </th>
              </tr>

              {/* Row 3 Header */}
              <tr className="bg-slate-50 text-slate-700 text-center font-semibold border-b border-slate-200">
                <th rowSpan={2} className="p-2 border-r border-slate-200 w-12">Bố</th>
                <th rowSpan={2} className="p-2 border-r border-slate-200 w-12">Mẹ</th>
                <th rowSpan={2} className="p-2 border-r border-slate-200 w-12">Đực</th>
                <th rowSpan={2} className="p-2 border-r border-slate-200 w-12">Cái</th>
                <th rowSpan={2} className="p-2 border-r border-slate-200 w-20">Chưa xác định giới tính</th>

                <th colSpan={2} className="p-1.5 border-r border-slate-200 bg-teal-50 text-teal-900 font-semibold">Bố mẹ</th>
                <th colSpan={3} className="p-1.5 border-r border-slate-200 bg-teal-50 text-teal-900 font-semibold">Cá thể khác</th>

                <th colSpan={2} className="p-1.5 border-r border-slate-200 bg-rose-50 text-rose-900 font-semibold">Bố mẹ</th>
                <th colSpan={3} className="p-1.5 border-r border-slate-200 bg-rose-50 text-rose-900 font-semibold">Cá thể khác</th>
              </tr>

              {/* Row 4 Header */}
              <tr className="bg-slate-50 text-slate-700 text-center font-semibold border-b border-slate-200">
                <th className="p-1.5 border-r border-slate-200 w-12 bg-teal-50 text-teal-900">Bố</th>
                <th className="p-1.5 border-r border-slate-200 w-12 bg-teal-50 text-teal-900">Mẹ</th>
                <th className="p-1.5 border-r border-slate-200 w-12 bg-teal-50 text-teal-900">Đực</th>
                <th className="p-1.5 border-r border-slate-200 w-12 bg-teal-50 text-teal-900">Cái</th>
                <th className="p-1.5 border-r border-slate-200 w-16 bg-teal-50 text-teal-900">Chưa XĐ</th>

                <th className="p-1.5 border-r border-slate-200 w-12 bg-rose-50 text-rose-900">Bố</th>
                <th className="p-1.5 border-r border-slate-200 w-12 bg-rose-50 text-rose-900">Mẹ</th>
                <th className="p-1.5 border-r border-slate-200 w-12 bg-rose-50 text-rose-900">Đực</th>
                <th className="p-1.5 border-r border-slate-200 w-12 bg-rose-50 text-rose-900">Cái</th>
                <th className="p-1.5 border-r border-slate-200 w-16 bg-rose-50 text-rose-900">Chưa XĐ</th>
              </tr>

              {/* Row 5: Official Column Numbers 1 to 19 (Underlined & Smaller Font Size) */}
              <tr className="bg-slate-200/90 text-slate-600 text-center font-mono text-[10px] italic font-semibold border-b-2 border-slate-300">
                <th className="py-1.5 border-r border-slate-300 font-normal">STT</th>
                <th className="py-1.5 border-r border-slate-300 text-emerald-900 underline"><u>1</u></th>
                <th className="py-1.5 border-r border-slate-300 font-extrabold text-emerald-900 bg-emerald-100/80 underline"><u>2</u></th>
                <th className="py-1.5 border-r border-slate-300 underline"><u>3</u></th>
                <th className="py-1.5 border-r border-slate-300 underline"><u>4</u></th>
                <th className="py-1.5 border-r border-slate-300 underline"><u>5</u></th>
                <th className="py-1.5 border-r border-slate-300 underline"><u>6</u></th>
                <th className="py-1.5 border-r border-slate-300 underline"><u>7</u></th>
                <th className="py-1.5 border-r border-slate-300 text-teal-800 underline"><u>8</u></th>
                <th className="py-1.5 border-r border-slate-300 text-teal-800 underline"><u>9</u></th>
                <th className="py-1.5 border-r border-slate-300 text-teal-800 underline"><u>10</u></th>
                <th className="py-1.5 border-r border-slate-300 text-teal-800 underline"><u>11</u></th>
                <th className="py-1.5 border-r border-slate-300 text-teal-800 underline"><u>12</u></th>
                <th className="py-1.5 border-r border-slate-300 text-rose-800 underline"><u>13</u></th>
                <th className="py-1.5 border-r border-slate-300 text-rose-800 underline"><u>14</u></th>
                <th className="py-1.5 border-r border-slate-300 text-rose-800 underline"><u>15</u></th>
                <th className="py-1.5 border-r border-slate-300 text-rose-800 underline"><u>16</u></th>
                <th className="py-1.5 border-r border-slate-300 text-rose-800 underline"><u>17</u></th>
                <th className="py-1.5 border-r border-slate-300 underline"><u>18</u></th>
                <th className="py-1.5 border-r border-slate-300 underline"><u>19</u></th>
                <th className="py-1.5 no-print">#</th>
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
                    <td className="p-3 font-bold border-r border-slate-200 text-slate-800">
                      <span className={`px-2.5 py-1 rounded-md font-sans text-xs shadow-2xs ${isBaseline ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-200 text-slate-800'}`}>
                        {row.label}
                      </span>
                    </td>

                    {/* Col 1: Date */}
                    <td className="p-3 border-r border-slate-200 whitespace-nowrap text-slate-800 font-sans text-xs font-bold">
                      {formatDateVN(row.date)}
                      {row.time && <span className="text-[11px] text-slate-500 block font-mono font-normal mt-0.5">{row.time}</span>}
                    </td>

                    {/* Col 2: Total (Computed = 3 + 4 + 5 + 6 + 7) */}
                    <td className="p-3 border-r border-slate-200 font-black text-base text-emerald-800 bg-emerald-50/90 font-mono">
                      {row.total}
                      {row.hasWarning && (
                        <AlertTriangle className="w-4 h-4 text-amber-500 inline ml-1" title="Cảnh báo: Có chỉ số hiện trạng bị âm!" />
                      )}
                    </td>

                    {/* Cols 3-7: Current status */}
                    <td className="p-2.5 border-r border-slate-200 font-bold text-slate-900 text-sm">{row.father}</td>
                    <td className="p-2.5 border-r border-slate-200 font-bold text-slate-900 text-sm">{row.mother}</td>
                    <td className="p-2.5 border-r border-slate-200 text-slate-800 text-sm">{row.otherMale}</td>
                    <td className="p-2.5 border-r border-slate-200 text-slate-800 text-sm">{row.otherFemale}</td>
                    <td className="p-2.5 border-r border-slate-200 text-slate-800 text-sm">{row.otherUnknown}</td>

                    {/* Cols 8-12: Increases */}
                    <td className={`p-2.5 border-r border-slate-200 text-sm ${row.incFather > 0 ? 'text-teal-700 font-black bg-teal-100/70' : 'text-slate-400'}`}>
                      {isBaseline ? '-' : row.incFather || '-'}
                    </td>
                    <td className={`p-2.5 border-r border-slate-200 text-sm ${row.incMother > 0 ? 'text-teal-700 font-black bg-teal-100/70' : 'text-slate-400'}`}>
                      {isBaseline ? '-' : row.incMother || '-'}
                    </td>
                    <td className={`p-2.5 border-r border-slate-200 text-sm ${row.incOtherMale > 0 ? 'text-teal-700 font-black bg-teal-100/70' : 'text-slate-400'}`}>
                      {isBaseline ? '-' : row.incOtherMale || '-'}
                    </td>
                    <td className={`p-2.5 border-r border-slate-200 text-sm ${row.incOtherFemale > 0 ? 'text-teal-700 font-black bg-teal-100/70' : 'text-slate-400'}`}>
                      {isBaseline ? '-' : row.incOtherFemale || '-'}
                    </td>
                    <td className={`p-2.5 border-r border-slate-200 text-sm ${row.incOtherUnknown > 0 ? 'text-teal-700 font-black bg-teal-100/70' : 'text-slate-400'}`}>
                      {isBaseline ? '-' : row.incOtherUnknown || '-'}
                    </td>

                    {/* Cols 13-17: Decreases */}
                    <td className={`p-2.5 border-r border-slate-200 text-sm ${row.decFather > 0 ? 'text-rose-700 font-black bg-rose-100/70' : 'text-slate-400'}`}>
                      {isBaseline ? '-' : row.decFather || '-'}
                    </td>
                    <td className={`p-2.5 border-r border-slate-200 text-sm ${row.decMother > 0 ? 'text-rose-700 font-black bg-rose-100/70' : 'text-slate-400'}`}>
                      {isBaseline ? '-' : row.decMother || '-'}
                    </td>
                    <td className={`p-2.5 border-r border-slate-200 text-sm ${row.decOtherMale > 0 ? 'text-rose-700 font-black bg-rose-100/70' : 'text-slate-400'}`}>
                      {isBaseline ? '-' : row.decOtherMale || '-'}
                    </td>
                    <td className={`p-2.5 border-r border-slate-200 text-sm ${row.decOtherFemale > 0 ? 'text-rose-700 font-black bg-rose-100/70' : 'text-slate-400'}`}>
                      {isBaseline ? '-' : row.decOtherFemale || '-'}
                    </td>
                    <td className={`p-2.5 border-r border-slate-200 text-sm ${row.decOtherUnknown > 0 ? 'text-rose-700 font-black bg-rose-100/70' : 'text-slate-400'}`}>
                      {isBaseline ? '-' : row.decOtherUnknown || '-'}
                    </td>

                    {/* Col 18: Reason */}
                    <td className="p-3 border-r border-slate-200 text-left font-sans text-xs text-slate-900 font-medium leading-relaxed whitespace-normal min-w-[260px]" title={row.reason}>
                      {row.reason}
                    </td>

                    {/* Col 19: Verifier */}
                    <td className="p-3 border-r border-slate-200 text-left font-sans text-xs text-slate-800 font-semibold leading-relaxed whitespace-normal min-w-[220px]" title={row.verifier}>
                      {row.verifier || '---'}
                    </td>


                    {/* Actions */}
                    <td className="p-2 no-print">
                      <div className="flex items-center justify-center gap-1">
                        {isBaseline ? (
                          <button
                            onClick={onEditBaseline}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                            title="Sửa dòng A (Số liệu ban đầu)"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => onEditRow(row)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                              title="Sửa thông tin dòng này"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteRow(row.rowId)}
                              className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                              title="Xóa biến động này"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
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
            <span>GHI CHÚ HƯỚNG DẪN ĐIỀN NỘI DUNG (Trích Thông tư Kiểm lâm / Sổ Mẫu II)</span>
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

