import React, { useState, useMemo } from 'react';
import {
  FileCheck2,
  Plus,
  Download,
  Printer,
  Search,
  Filter,
  Building2,
  Calendar,
  Sparkles,
  Edit2,
  Trash2,
  MapPin,
  RefreshCw,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { exportPackingListToExcel } from '../utils/exportPackingList';

export default function PackingListView({
  packingListData = [],
  onOpenAdd,
  onOpenEdit,
  onDelete,
  facilitiesList = [],
  currentUser = null,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const COMMUNES = ['xã Hòa Sơn', 'xã Yang Mao', 'xã Cư Pui', 'Xã Krông Bông', 'Xã Dang Kang'];

  // Filtered List
  const filteredData = useMemo(() => {
    return packingListData.filter((item) => {
      // 1. Commune Filter
      if (selectedCommune !== 'ALL') {
        const addressLower = (item.diaChi || '').toLowerCase();
        const communeLower = selectedCommune.toLowerCase().replace('xã ', '').trim();
        if (!addressLower.includes(communeLower)) return false;
      }

      // 2. Year Filter
      if (selectedYear !== 'ALL') {
        if (!item.ngayXacNhan || !item.ngayXacNhan.includes(selectedYear)) return false;
      }

      // 3. Search Term
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        const matchSo = (item.soVaoSo || '').toLowerCase().includes(term);
        const matchChu = (item.tenChuLamSan || '').toLowerCase().includes(term);
        const matchDiaChi = (item.diaChi || '').toLowerCase().includes(term);
        const matchLamSan = (item.tongLamSan || '').toLowerCase().includes(term);
        if (!matchSo && !matchChu && !matchDiaChi && !matchLamSan) return false;
      }

      return true;
    });
  }, [packingListData, selectedCommune, selectedYear, searchTerm]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalCount = packingListData.length;
    const uniqueOwners = new Set(packingListData.map((i) => i.tenChuLamSan)).size;
    const latestItem = packingListData[packingListData.length - 1];

    // Count mentions of popular animals in tongLamSan
    const speciesCounts = {};
    packingListData.forEach((item) => {
      const text = (item.tongLamSan || '').toLowerCase();
      if (text.includes('cầy vòi hương') || text.includes('cầy hương')) {
        speciesCounts['Cầy vòi hương'] = (speciesCounts['Cầy vòi hương'] || 0) + 1;
      }
      if (text.includes('dúi má đào') || text.includes('dúi')) {
        speciesCounts['Dúi'] = (speciesCounts['Dúi'] || 0) + 1;
      }
      if (text.includes('chim chào mào') || text.includes('chào mào')) {
        speciesCounts['Chào mào'] = (speciesCounts['Chào mào'] || 0) + 1;
      }
      if (text.includes('chim cu gáy') || text.includes('cu gáy')) {
        speciesCounts['Cu gáy'] = (speciesCounts['Cu gáy'] || 0) + 1;
      }
    });

    const topSpecies = Object.entries(speciesCounts).sort((a, b) => b[1] - a[1])[0];

    return {
      totalCount,
      uniqueOwners,
      latestDate: latestItem?.ngayXacNhan || '---',
      topSpeciesName: topSpecies ? `${topSpecies[0]} (${topSpecies[1]} đợt)` : 'Cầy, Dúi, Chim...',
    };
  }, [packingListData]);

  const handleExportExcel = () => {
    exportPackingListToExcel(filteredData);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Header Banner & Action Buttons */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Nghiệp Vụ Kiểm Lâm • TT85/2025</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            SỔ THEO DÕI XÁC NHẬN BẢNG KÊ LÂM SẢN
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Theo dõi, cập nhật nhật ký xác nhận lâm sản xuất bán từ các cơ sở nuôi động vật hoang dã
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Add New Button */}
          <button
            type="button"
            onClick={onOpenAdd}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-emerald-700/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Lập Bảng Kê Mới</span>
          </button>

          {/* Export Excel Button */}
          <button
            type="button"
            onClick={handleExportExcel}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 hover:text-emerald-950 font-bold text-xs rounded-2xl border border-slate-300 shadow-2xs transition-all cursor-pointer flex items-center gap-2"
            title="Tải về file Excel chuẩn biểu mẫu"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Xuất Excel ({filteredData.length})</span>
          </button>

          {/* Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="p-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl border border-slate-300 shadow-2xs transition-colors cursor-pointer"
            title="In sổ theo dõi"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Key Performance Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Tổng số bảng kê */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 shadow-inner">
            <FileCheck2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tổng số bảng kê</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-0.5">
              {metrics.totalCount} <span className="text-xs font-bold text-slate-500">lượt</span>
            </div>
          </div>
        </div>

        {/* Card 2: Chủ lâm sản */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center flex-shrink-0 shadow-inner">
            <Building2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cơ sở xuất bán</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-0.5">
              {metrics.uniqueOwners} <span className="text-xs font-bold text-slate-500">chủ cơ sở</span>
            </div>
          </div>
        </div>

        {/* Card 3: Đợt xuất gần nhất */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 shadow-inner">
            <Calendar className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Xác nhận gần nhất</div>
            <div className="text-base sm:text-lg font-black text-emerald-900 font-mono mt-0.5">
              {metrics.latestDate}
            </div>
          </div>
        </div>

        {/* Card 4: Loài phổ biến */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center flex-shrink-0 shadow-inner">
            <TrendingUp className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Loài xuất nhiều nhất</div>
            <div className="text-xs sm:text-sm font-black text-indigo-950 mt-0.5 truncate max-w-[140px]">
              {metrics.topSpeciesName}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Search Bar & Filter Options */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo số vào sổ, tên chủ, xã, loài..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ×
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Commune Filter */}
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCommune}
              onChange={(e) => setSelectedCommune(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              <option value="ALL">Tất cả các xã</option>
              {COMMUNES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {(searchTerm || selectedCommune !== 'ALL' || selectedYear !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCommune('ALL');
                setSelectedYear('ALL');
              }}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Đặt lại</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Table: Sổ theo dõi xác nhận bảng kê lâm sản */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white font-extrabold text-[11px] uppercase tracking-wider border-b border-emerald-800">
                <th className="py-3 px-3 text-center w-14">Số TT</th>
                <th className="py-3 px-4 w-36">Số vào sổ</th>
                <th className="py-3 px-4 w-36">Ngày xác nhận</th>
                <th className="py-3 px-4 w-48">Tên chủ lâm sản</th>
                <th className="py-3 px-4 w-64">Địa chỉ chủ lâm sản</th>
                <th className="py-3 px-4">Tổng lâm sản xác nhận</th>
                <th className="py-3 px-3 text-center w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <FileCheck2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-sm text-slate-600">Không tìm thấy bản ghi bảng kê nào</p>
                    <p className="text-xs text-slate-400 mt-0.5">Thử đổi từ khóa tìm kiếm hoặc lọc theo xã khác</p>
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => {
                  return (
                    <tr
                      key={item.id || index}
                      className="hover:bg-emerald-50/40 transition-colors group"
                    >
                      {/* Cột 1: STT */}
                      <td className="py-3 px-3 text-center font-bold text-slate-500 font-mono">
                        {item.stt || (index + 1)}
                      </td>

                      {/* Cột 2: Số vào sổ */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-black text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs shadow-2xs inline-block">
                          {item.soVaoSo}
                        </span>
                      </td>

                      {/* Cột 3: Ngày xác nhận */}
                      <td className="py-3 px-4 font-bold text-slate-700 font-mono">
                        {item.ngayXacNhan}
                      </td>

                      {/* Cột 4: Tên chủ lâm sản */}
                      <td className="py-3 px-4 font-extrabold text-slate-900 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                        <span className="truncate">{item.tenChuLamSan}</span>
                      </td>

                      {/* Cột 5: Địa chỉ */}
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{item.diaChi}</span>
                        </div>
                      </td>

                      {/* Cột 6: Tổng lâm sản xác nhận */}
                      <td className="py-3 px-4">
                        <div className="inline-block bg-slate-50 group-hover:bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 shadow-2xs">
                          {item.tongLamSan}
                        </div>
                        {item.ghiChu && (
                          <div className="text-[10px] text-slate-400 mt-0.5 italic">
                            Ghi chú: {item.ghiChu}
                          </div>
                        )}
                      </td>

                      {/* Cột 7: Thao tác (Sửa / Xóa) */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 opacity-90 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => onOpenEdit(item)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                            title="Chỉnh sửa bản ghi này"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Bạn có chắc chắn muốn xóa Bảng kê số "${item.soVaoSo}" của "${item.tenChuLamSan}"?`)) {
                                onDelete(item.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Xóa bản ghi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info Count */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-bold gap-2">
          <div>
            Hiển thị <span className="text-emerald-800 font-black">{filteredData.length}</span> / {packingListData.length} bản ghi xác nhận bảng kê
          </div>
          <div className="text-[11px] text-slate-400">
            Dữ liệu đồng bộ tự động với Cloud Firestore & lưu trữ an toàn trên thiết bị
          </div>
        </div>
      </div>

    </div>
  );
}
