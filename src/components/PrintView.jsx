import React from 'react';
import { X, Printer } from 'lucide-react';
import { formatDateVN, PURPOSE_CODES } from '../utils/calculations';

export default function PrintView({
  isOpen,
  onClose,
  species,
  rows,
  facilityInfo,
}) {
  if (!isOpen) return null;

  const purposeObj = PURPOSE_CODES.find((p) => p.code === (species?.purposeCode || facilityInfo?.purposeCode));
  const purposeStr = purposeObj ? `${purposeObj.code} - ${purposeObj.name}` : (species?.purposeCode || '');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md overflow-y-auto p-4 sm:p-8 flex flex-col items-center">
      {/* Top Action Bar (Hidden during printing) */}
      <div className="no-print bg-slate-900 border border-slate-700 max-w-6xl w-full p-4 rounded-2xl flex items-center justify-between shadow-2xl mb-6">
        <div className="text-white">
          <h3 className="font-bold text-base">Xem Trước Bản In (Khổ Giấy A4 Ngang)</h3>
          <p className="text-xs text-slate-400">Bản in 19 cột tiêu chuẩn để trình Kiểm lâm / Thủy sản ký duyệt</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm px-5 py-2 rounded-xl shadow-lg transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>In Bản Chuẩn</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Printable Sheet (White A4 Landscape format) */}
      <div className="print-area bg-white text-black p-8 shadow-2xl rounded-sm max-w-[1200px] w-full text-[11px] leading-tight font-serif">
        {/* Header Title Block */}
        <div className="text-center font-bold space-y-1 mb-4">
          <h1 className="text-base uppercase tracking-wide">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </h1>
          <h2 className="text-sm font-semibold underline underline-offset-4 mb-3">
            Độc lập - Tự do - Hạnh phúc
          </h2>
          <h2 className="text-lg uppercase mt-4 tracking-wider text-black font-extrabold">
            SỔ THEO DÕI ĐỘNG VẬT HOANG DÃ
          </h2>
          <p className="text-xs font-semibold italic text-gray-700">
            (II. ĐỐI VỚI CƠ SỞ NUÔI SINH SẢN)
          </p>
        </div>

        {/* Facility Info Header */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 mb-4 border-b border-gray-300 pb-3 text-xs font-sans">
          <div>
            <strong>1. Tên cơ sở nuôi:</strong> {facilityInfo.facilityName}
          </div>
          <div>
            <strong>Mã số cơ sở:</strong> {facilityInfo.registrationCode || '..............'}
          </div>
          <div>
            <strong>2. Họ tên chủ cơ sở:</strong> {facilityInfo.ownerName}
          </div>
          <div>
            <strong>Địa chỉ:</strong> {facilityInfo.address}
          </div>
          <div>
            <strong>3. Tên loài động vật:</strong> <span className="font-bold">{species?.vietnameseName}</span> (<i>{species?.scientificName}</i>)
          </div>
          <div>
            <strong>4. Mã mục đích nuôi:</strong> {purposeStr}
          </div>
        </div>

        {/* 19-Column Table */}
        <table className="w-full border-collapse border border-black text-center text-[10px]">
          <thead>
            {/* Header Row 1 */}
            <tr className="bg-gray-100 font-bold">
              <th rowSpan={4} className="border border-black p-1 w-8">
                STT/ Dòng
              </th>
              <th rowSpan={4} className="border border-black p-1 w-20">
                Ngày/ tháng/ năm
              </th>
              <th colSpan={6} className="border border-black p-1">
                Hiện trạng nuôi
              </th>
              <th colSpan={10} className="border border-black p-1">
                Biến động
              </th>
              <th rowSpan={4} className="border border-black p-1.5 w-40 text-left">
                Nguyên nhân biến động (sinh sản (ghi rõ thế hệ F1, F2...), khai thác, mua, bán, tặng cho, chết, v.v)
              </th>
              <th rowSpan={4} className="border border-black p-1.5 w-32 text-left">
                Xác nhận của cơ quan kiểm lâm sở tại/ Cơ quan thủy sản
              </th>
            </tr>

            {/* Header Row 2 */}
            <tr className="bg-gray-100 font-bold">
              <th rowSpan={3} className="border border-black p-1 w-12">
                Tổng số cá thể
              </th>
              <th colSpan={2} className="border border-black p-1">
                Bố mẹ
              </th>
              <th colSpan={3} className="border border-black p-1">
                Các cá thể khác
              </th>
              <th colSpan={5} className="border border-black p-1">
                Tăng đàn
              </th>
              <th colSpan={5} className="border border-black p-1">
                Giảm đàn
              </th>
            </tr>

            {/* Header Row 3 */}
            <tr className="bg-gray-100 font-semibold">
              <th rowSpan={2} className="border border-black p-1 w-8">Bố</th>
              <th rowSpan={2} className="border border-black p-1 w-8">Mẹ</th>
              <th rowSpan={2} className="border border-black p-1 w-8">Đực</th>
              <th rowSpan={2} className="border border-black p-1 w-8">Cái</th>
              <th rowSpan={2} className="border border-black p-1 w-12">Chưa xác định được giới tính</th>

              <th colSpan={2} className="border border-black p-0.5">Bố mẹ</th>
              <th colSpan={3} className="border border-black p-0.5">Cá thể khác</th>

              <th colSpan={2} className="border border-black p-0.5">Bố mẹ</th>
              <th colSpan={3} className="border border-black p-0.5">Cá thể khác</th>
            </tr>

            {/* Header Row 4 */}
            <tr className="bg-gray-100 font-semibold">
              <th className="border border-black p-0.5 w-8">Bố</th>
              <th className="border border-black p-0.5 w-8">Mẹ</th>
              <th className="border border-black p-0.5 w-8">Đực</th>
              <th className="border border-black p-0.5 w-8">Cái</th>
              <th className="border border-black p-0.5 w-10">Chưa XĐ</th>

              <th className="border border-black p-0.5 w-8">Bố</th>
              <th className="border border-black p-0.5 w-8">Mẹ</th>
              <th className="border border-black p-0.5 w-8">Đực</th>
              <th className="border border-black p-0.5 w-8">Cái</th>
              <th className="border border-black p-0.5 w-10">Chưa XĐ</th>
            </tr>

            {/* Column Numbers 1 to 19 (Underlined) */}
            <tr className="bg-gray-200 font-mono text-[9px] italic font-semibold">
              <th className="border border-black p-0.5">Label</th>
              <th className="border border-black p-0.5"><u>1</u></th>
              <th className="border border-black p-0.5 font-bold"><u>2</u></th>
              <th className="border border-black p-0.5"><u>3</u></th>
              <th className="border border-black p-0.5"><u>4</u></th>
              <th className="border border-black p-0.5"><u>5</u></th>
              <th className="border border-black p-0.5"><u>6</u></th>
              <th className="border border-black p-0.5"><u>7</u></th>
              <th className="border border-black p-0.5"><u>8</u></th>
              <th className="border border-black p-0.5"><u>9</u></th>
              <th className="border border-black p-0.5"><u>10</u></th>
              <th className="border border-black p-0.5"><u>11</u></th>
              <th className="border border-black p-0.5"><u>12</u></th>
              <th className="border border-black p-0.5"><u>13</u></th>
              <th className="border border-black p-0.5"><u>14</u></th>
              <th className="border border-black p-0.5"><u>15</u></th>
              <th className="border border-black p-0.5"><u>16</u></th>
              <th className="border border-black p-0.5"><u>17</u></th>
              <th className="border border-black p-0.5"><u>18</u></th>
              <th className="border border-black p-0.5"><u>19</u></th>
            </tr>

          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.rowId} className="font-mono">
                <td className="border border-black p-1 font-bold font-sans">{row.label}</td>
                <td className="border border-black p-1 font-sans">{formatDateVN(row.date)}</td>
                <td className="border border-black p-1 font-bold text-xs">{row.total}</td>
                <td className="border border-black p-1">{row.father}</td>
                <td className="border border-black p-1">{row.mother}</td>
                <td className="border border-black p-1">{row.otherMale}</td>
                <td className="border border-black p-1">{row.otherFemale}</td>
                <td className="border border-black p-1">{row.otherUnknown}</td>

                <td className="border border-black p-1">{row.isBaseline ? '-' : row.incFather || '-'}</td>
                <td className="border border-black p-1">{row.isBaseline ? '-' : row.incMother || '-'}</td>
                <td className="border border-black p-1">{row.isBaseline ? '-' : row.incOtherMale || '-'}</td>
                <td className="border border-black p-1">{row.isBaseline ? '-' : row.incOtherFemale || '-'}</td>
                <td className="border border-black p-1">{row.isBaseline ? '-' : row.incOtherUnknown || '-'}</td>

                <td className="border border-black p-1">{row.isBaseline ? '-' : row.decFather || '-'}</td>
                <td className="border border-black p-1">{row.isBaseline ? '-' : row.decMother || '-'}</td>
                <td className="border border-black p-1">{row.isBaseline ? '-' : row.decOtherMale || '-'}</td>
                <td className="border border-black p-1">{row.isBaseline ? '-' : row.decOtherFemale || '-'}</td>
                <td className="border border-black p-1">{row.isBaseline ? '-' : row.decOtherUnknown || '-'}</td>

                <td className="border border-black p-1 text-left font-sans">{row.reason}</td>
                <td className="border border-black p-1 text-left font-sans">{row.verifier}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Signature Footer */}
        <div className="grid grid-cols-2 gap-8 mt-12 text-center text-xs font-sans">
          <div>
            <p className="font-semibold italic">..... ngày ..... tháng ..... năm 20...</p>
            <p className="font-bold uppercase mt-1">XÁC NHẬN CỦA CƠ QUAN KIỂM LÂM / THỦY SẢN</p>
            <p className="text-[10px] italic text-gray-500 mb-16">(Ký, ghi rõ họ tên và đóng dấu)</p>
          </div>
          <div>
            <p className="font-semibold italic">..... ngày ..... tháng ..... năm 20...</p>
            <p className="font-bold uppercase mt-1">CHỦ CƠ SỞ NUÔI SINH SẢN</p>
            <p className="text-[10px] italic text-gray-500 mb-16">(Ký và ghi rõ họ tên)</p>
            <p className="font-bold uppercase">{facilityInfo.ownerName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
