import React, { useState, useMemo } from 'react';
import { Printer, ShieldAlert, FileText, CheckCircle2, Building2, MapPin } from 'lucide-react';
import { computeLogbookTable } from '../utils/calculations';

export default function CitesSummaryTable({ facilitiesList = [] }) {
  const [selectedCommune, setSelectedCommune] = useState('ALL');
  const COMMUNES = ['xã Hòa Sơn', 'xã Yang Mao', 'xã Cư Pui', 'Xã Krông Bông', 'Xã Dang Kang'];

  // Aggregate species statistics
  const { citesSpecies, commonSpecies, grandTotalAnimals, totalCitesAnimals, totalCommonAnimals } = useMemo(() => {
    const speciesMap = {};

    facilitiesList.forEach((fac) => {
      if (selectedCommune !== 'ALL' && fac.commune !== selectedCommune) return;

      fac.speciesList.forEach((sp) => {
        const name = sp.vietnameseName;
        const processedRows = computeLogbookTable(sp.baseline || {}, sp.fluctuations || []);
        const lastRow = processedRows[processedRows.length - 1];
        const totalAnimals = lastRow ? (lastRow.total || 0) : 0;

        const isRegistered =
          fac.registrationCode &&
          fac.registrationCode.trim() !== '' &&
          !fac.registrationCode.toLowerCase().includes('chưa') &&
          !fac.registrationCode.toLowerCase().includes('cập nhật');

        // Check if Endangered / Quý hiếm / CITES
        const groupStr = (sp.group || '') + ' ' + (sp.citesAppendix || '');
        const isCites =
          groupStr.includes('IB') ||
          groupStr.includes('IIB') ||
          groupStr.toLowerCase().includes('cites') ||
          groupStr.toLowerCase().includes('nguy cấp');

        if (!speciesMap[name]) {
          speciesMap[name] = {
            vietnameseName: name,
            scientificName: sp.scientificName || '',
            isCites,
            group: sp.group || '',
            citesAppendix: sp.citesAppendix || '',
            totalAnimals: 0,
            facilitiesSet: new Set(),
            registeredFacilitiesSet: new Set(),
          };
        }

        speciesMap[name].totalAnimals += totalAnimals;
        speciesMap[name].facilitiesSet.add(fac.id);
        if (isRegistered) {
          speciesMap[name].registeredFacilitiesSet.add(fac.id);
        }
      });
    });

    const citesList = Object.values(speciesMap).filter((s) => s.isCites);
    const commonList = Object.values(speciesMap).filter((s) => !s.isCites);

    let totCites = 0;
    citesList.forEach((s) => (totCites += s.totalAnimals));

    let totCommon = 0;
    commonList.forEach((s) => (totCommon += s.totalAnimals));

    return {
      citesSpecies: citesList,
      commonSpecies: commonList,
      totalCitesAnimals: totCites,
      totalCommonAnimals: totCommon,
      grandTotalAnimals: totCites + totCommon,
    };
  }, [facilitiesList, selectedCommune]);

  // Print view handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-xl space-y-6 animate-in fade-in duration-300">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-300 no-print">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 border border-indigo-300 rounded-xl text-indigo-700 shadow-xs">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>Bảng 1.2: Thống Kê Loài CITES & Động Vật Rừng Thông Thường</span>
              <span className="text-xs bg-indigo-100 text-indigo-800 border border-indigo-300 px-2.5 py-0.5 rounded-full font-bold">
                Mẫu Báo Cáo Kiểm Lâm
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Số liệu tổng hợp phân loại theo Động vật nguy cấp, quý, hiếm / Phụ lục CITES và Động vật thông thường
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Commune Filter */}
          <select
            value={selectedCommune}
            onChange={(e) => setSelectedCommune(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-emerald-500 cursor-pointer shadow-xs"
          >
            <option value="ALL">📍 Tất cả 5 Xã</option>
            {COMMUNES.map((c) => (
              <option key={c} value={c}>
                📍 {c}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            {/* We only keep the print button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 rounded-xl text-sm font-bold border border-slate-300 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>In Báo Cáo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Government Table Title Block */}
      <div className="text-center space-y-1 py-2">
        <h1 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-tight">
          1.2. Số liệu tổng hợp về các loài động vật nguy cấp, quý, hiếm; động vật thuộc Phụ lục CITES và động vật rừng thông thường nuôi trên địa bàn
        </h1>
        {selectedCommune !== 'ALL' && (
          <p className="text-xs font-bold text-emerald-700">
            📍 Địa bàn: {selectedCommune} - Huyện Krông Bông
          </p>
        )}
      </div>

      {/* Official Government Table Layout */}
      <div className="overflow-x-auto scrollbar-thin rounded-xl border border-slate-300">
        <table className="w-full text-xs text-left border-collapse min-w-[750px]">
          <thead>
            <tr className="bg-slate-100 text-slate-900 text-center font-extrabold border-b border-slate-300">
              <th rowSpan={2} className="p-3 border-r border-slate-300 w-12 bg-slate-200">
                TT
              </th>
              <th colSpan={2} className="p-2 border-r border-slate-300">
                Tên loài nuôi
              </th>
              <th colSpan={3} className="p-2 border-r border-slate-300 bg-emerald-50">
                Số lượng
              </th>
              <th rowSpan={2} className="p-3 border-slate-300 w-28">
                Ghi chú
              </th>
            </tr>

            <tr className="bg-slate-50 text-slate-800 text-center font-bold border-b border-slate-300">
              <th className="p-2 border-r border-slate-300 w-44">Tên tiếng Việt</th>
              <th className="p-2 border-r border-slate-300 w-52 italic font-mono text-[11px]">Tên khoa học</th>
              <th className="p-2 border-r border-slate-300 w-28 bg-emerald-100 text-emerald-950 font-black">
                Tổng số cá thể
              </th>
              <th className="p-2 border-r border-slate-300 w-28">Tổng số cơ sở nuôi</th>
              <th className="p-2 border-r border-slate-300 w-36">
                Số cơ sở đã đăng ký mã số
              </th>
            </tr>

            <tr className="bg-slate-100/80 text-slate-600 text-center font-mono text-[10px] border-b border-slate-300 italic">
              <td className="p-1 border-r border-slate-300"><u>1</u></td>
              <td className="p-1 border-r border-slate-300"><u>2</u></td>
              <td className="p-1 border-r border-slate-300"><u>3</u></td>
              <td className="p-1 border-r border-slate-300 font-bold"><u>4</u></td>
              <td className="p-1 border-r border-slate-300 font-bold"><u>5=6+7</u></td>
              <td className="p-1 border-r border-slate-300 font-bold"><u>6</u></td>
              <td className="p-1"><u>7</u></td>
            </tr>

          </thead>

          <tbody className="divide-y divide-slate-300 font-medium">
            {/* SECTION I: ĐỘNG VẬT NGUY CẤP, QUÝ, HIẾM; CITES */}
            <tr className="bg-amber-100/80 text-amber-950 font-extrabold border-y-2 border-slate-400">
              <td className="p-2 text-center border-r border-slate-300 font-mono">I</td>
              <td colSpan={6} className="p-2 uppercase tracking-wide">
                Động vật nguy cấp, quý, hiếm; động vật thuộc Phụ lục CITES
              </td>
            </tr>

            {citesSpecies.map((sp, idx) => (
              <tr key={sp.vietnameseName} className="hover:bg-slate-50 transition-colors">
                <td className="p-2.5 text-center font-mono font-bold border-r border-slate-300 text-slate-700">
                  {idx + 1}
                </td>
                <td className="p-2.5 font-bold border-r border-slate-300 text-slate-900">
                  {sp.vietnameseName}
                </td>
                <td className="p-2.5 italic border-r border-slate-300 text-slate-700 font-mono text-[11px]">
                  {sp.scientificName}
                </td>
                <td className="p-2.5 text-center font-mono font-black text-emerald-800 bg-emerald-50/60 border-r border-slate-300 text-sm">
                  {sp.totalAnimals}
                </td>
                <td className="p-2.5 text-center font-mono font-bold border-r border-slate-300 text-slate-800">
                  {sp.facilitiesSet.size}
                </td>
                <td className="p-2.5 text-center font-mono font-bold border-r border-slate-300 text-indigo-700">
                  {sp.registeredFacilitiesSet.size || '---'}
                </td>
                <td className="p-2.5 text-slate-500 text-[11px]">
                  {sp.group || sp.citesAppendix ? `${sp.group} ${sp.citesAppendix}`.trim() : ''}
                </td>
              </tr>
            ))}

            {/* Subtotal Section I */}
            <tr className="bg-amber-50 font-bold border-b border-slate-300 text-amber-900">
              <td className="p-2 text-center border-r border-slate-300"></td>
              <td colSpan={2} className="p-2 text-right uppercase text-[11px]">
                Cộng Nhóm I (CITES / Nguy cấp):
              </td>
              <td className="p-2 text-center font-mono font-black text-amber-900 border-r border-slate-300 text-sm">
                {totalCitesAnimals}
              </td>
              <td colSpan={3} className="p-2"></td>
            </tr>

            {/* SECTION II: ĐỘNG VẬT RỪNG THÔNG THƯỜNG */}
            <tr className="bg-teal-100/80 text-teal-950 font-extrabold border-y-2 border-slate-400">
              <td className="p-2 text-center border-r border-slate-300 font-mono">II</td>
              <td colSpan={6} className="p-2 uppercase tracking-wide">
                Động vật rừng thông thường
              </td>
            </tr>

            {commonSpecies.map((sp, idx) => (
              <tr key={sp.vietnameseName} className="hover:bg-slate-50 transition-colors">
                <td className="p-2.5 text-center font-mono font-bold border-r border-slate-300 text-slate-700">
                  {idx + 1}
                </td>
                <td className="p-2.5 font-bold border-r border-slate-300 text-slate-900">
                  {sp.vietnameseName}
                </td>
                <td className="p-2.5 italic border-r border-slate-300 text-slate-700 font-mono text-[11px]">
                  {sp.scientificName}
                </td>
                <td className="p-2.5 text-center font-mono font-black text-emerald-800 bg-emerald-50/60 border-r border-slate-300 text-sm">
                  {sp.totalAnimals}
                </td>
                <td className="p-2.5 text-center font-mono font-bold border-r border-slate-300 text-slate-800">
                  {sp.facilitiesSet.size}
                </td>
                <td className="p-2.5 text-center font-mono font-bold border-r border-slate-300 text-indigo-700">
                  {sp.registeredFacilitiesSet.size || '---'}
                </td>
                <td className="p-2.5 text-slate-500 text-[11px]">
                  Khai báo kiểm lâm
                </td>
              </tr>
            ))}

            {/* Subtotal Section II */}
            <tr className="bg-teal-50 font-bold border-b border-slate-300 text-teal-900">
              <td className="p-2 text-center border-r border-slate-300"></td>
              <td colSpan={2} className="p-2 text-right uppercase text-[11px]">
                Cộng Nhóm II (Động vật thông thường):
              </td>
              <td className="p-2 text-center font-mono font-black text-teal-900 border-r border-slate-300 text-sm">
                {totalCommonAnimals}
              </td>
              <td colSpan={3} className="p-2"></td>
            </tr>

            {/* GRAND TOTAL ROW */}
            <tr className="bg-slate-900 text-white font-extrabold border-t-2 border-slate-900 text-sm">
              <td className="p-3 text-center border-r border-slate-700 font-mono">---</td>
              <td colSpan={2} className="p-3 text-right uppercase tracking-wider text-amber-300">
                Tổng cộng toàn bộ:
              </td>
              <td className="p-3 text-center font-mono font-black text-amber-300 border-r border-slate-700 text-base">
                {grandTotalAnimals}
              </td>
              <td colSpan={3} className="p-3 text-xs text-slate-300 font-normal italic">
                Cá thể đang được nuôi tại các cơ sở trên địa bàn
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
