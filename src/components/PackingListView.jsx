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
  Trophy,
  Crown,
  Award,
  Flame,
  Feather,
  PawPrint,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Layers,
  ArrowUpRight,
  X,
} from 'lucide-react';
import { exportPackingListToExcel } from '../utils/exportPackingList';

// Helper: Phân tích chi tiết một dòng bảng kê (Lớp, Số cá thể, Khối lượng, Loài)
export function parsePackingItem(item) {
  const text = (item.tongLamSan || '').trim();
  const lower = text.toLowerCase();

  // 1. Phân lớp động vật: Lớp Chim (Aves) vs Lớp Thú (Mammalia)
  const isBird =
    lower.includes('chim') ||
    lower.includes('chào mào') ||
    lower.includes('cu gáy') ||
    lower.includes('trĩ') ||
    lower.includes('vẹt') ||
    lower.includes('khướu') ||
    lower.includes('họa mi') ||
    lower.includes('sáo');

  const isMammal =
    lower.includes('cầy') ||
    lower.includes('dúi') ||
    lower.includes('chồn') ||
    lower.includes('hươu') ||
    lower.includes('nai') ||
    lower.includes('nhím') ||
    lower.includes('lợn') ||
    lower.includes('heo') ||
    lower.includes('thỏ') ||
    lower.includes('khỉ');

  const animalClass = isBird ? 'CHIM' : isMammal ? 'THU' : 'KHAC';
  const categoryLabel =
    animalClass === 'CHIM' ? 'Lớp Chim (Aves)' : animalClass === 'THU' ? 'Lớp Thú (Mammalia)' : 'Động vật khác';

  // 2. Nhận diện tên loài chính
  let speciesName = 'Động vật rừng';
  if (lower.includes('chào mào')) speciesName = 'Chim chào mào';
  else if (lower.includes('cu gáy')) speciesName = 'Chim cu gáy';
  else if (lower.includes('cầy vòi hương') || lower.includes('cầy hương')) speciesName = 'Cầy vòi hương';
  else if (lower.includes('dúi má đào')) speciesName = 'Dúi má đào';
  else if (lower.includes('dúi mốc lớn')) speciesName = 'Dúi mốc lớn';
  else if (lower.includes('dúi mốc đuôi') || lower.includes('dúi')) speciesName = 'Dúi rừng';
  else if (lower.includes('hươu')) speciesName = 'Hươu sao';

  // 3. Bóc tách số lượng cá thể
  let count = 0;
  const matchDoi = lower.match(/(\d+)\s*(?:đôi|cặp)/);
  if (matchDoi) {
    count = parseInt(matchDoi[1], 10) * 2;
  } else {
    const matchCount = text.match(/(\d+)\s*(?:cá thể|con)/i) || text.match(/^(\d+)/);
    if (matchCount) {
      count = parseInt(matchCount[1], 10);
    }
  }

  // 4. Bóc tách khối lượng (kg)
  let weight = 0;
  const matchWeight = text.match(/(?:khối lượng|trọng lượng|nặng)\s*:?\s*([\d,.]+)\s*kg/i);
  if (matchWeight) {
    weight = parseFloat(matchWeight[1].replace(',', '.'));
  }

  return {
    ...item,
    animalClass,
    categoryLabel,
    speciesName,
    count: count || 0,
    weight: isNaN(weight) ? 0 : weight,
  };
}

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
  const [filterOwner, setFilterOwner] = useState(null);

  // Leaderboard states
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(true);
  const [rankClassTab, setRankClassTab] = useState('THU'); // 'THU' | 'CHIM' | 'ALL'
  const [rankSortMetric, setRankSortMetric] = useState('COUNT'); // 'COUNT' | 'WEIGHT' | 'BATCHES'

  const COMMUNES = ['xã Hòa Sơn', 'xã Yang Mao', 'xã Cư Pui', 'Xã Krông Bông', 'Xã Dang Kang'];

  // Parse all records
  const parsedRecords = useMemo(() => {
    return packingListData.map(parsePackingItem);
  }, [packingListData]);

  // Comprehensive Analytics & Rankings by Class
  const analytics = useMemo(() => {
    let totalCount = 0;
    let totalWeight = 0;
    const thuStats = { count: 0, weight: 0, batches: 0, facilities: new Set(), speciesMap: {} };
    const chimStats = { count: 0, weight: 0, batches: 0, facilities: new Set(), speciesMap: {} };

    // Grouping by Facility & Class
    const facilityMap = {
      ALL: {},
      THU: {},
      CHIM: {},
    };

    parsedRecords.forEach((item) => {
      totalCount += item.count;
      totalWeight += item.weight;

      const owner = item.tenChuLamSan || 'Chưa rõ';
      const cls = item.animalClass; // 'THU' | 'CHIM' | 'KHAC'

      // Overall stats by class
      if (cls === 'THU') {
        thuStats.count += item.count;
        thuStats.weight += item.weight;
        thuStats.batches += 1;
        thuStats.facilities.add(owner);
        thuStats.speciesMap[item.speciesName] = (thuStats.speciesMap[item.speciesName] || 0) + item.count;
      } else if (cls === 'CHIM') {
        chimStats.count += item.count;
        chimStats.weight += item.weight;
        chimStats.batches += 1;
        chimStats.facilities.add(owner);
        chimStats.speciesMap[item.speciesName] = (chimStats.speciesMap[item.speciesName] || 0) + item.count;
      }

      // Group per facility helper
      const addToGroup = (groupKey) => {
        if (!facilityMap[groupKey][owner]) {
          facilityMap[groupKey][owner] = {
            name: owner,
            diaChi: item.diaChi,
            count: 0,
            weight: 0,
            batches: 0,
            classes: new Set(),
            speciesMap: {},
          };
        }
        facilityMap[groupKey][owner].count += item.count;
        facilityMap[groupKey][owner].weight += item.weight;
        facilityMap[groupKey][owner].batches += 1;
        facilityMap[groupKey][owner].classes.add(cls);
        facilityMap[groupKey][owner].speciesMap[item.speciesName] =
          (facilityMap[groupKey][owner].speciesMap[item.speciesName] || 0) + item.count;
      };

      addToGroup('ALL');
      if (cls === 'THU') addToGroup('THU');
      if (cls === 'CHIM') addToGroup('CHIM');
    });

    // Converter to sorted list
    const buildRankList = (groupKey) => {
      const list = Object.values(facilityMap[groupKey] || {}).map((fac) => {
        const topSpeciesList = Object.entries(fac.speciesMap)
          .sort((a, b) => b[1] - a[1])
          .map(([name, qty]) => `${name} (${qty})`);

        return {
          ...fac,
          weight: Math.round(fac.weight * 10) / 10,
          topSpeciesText: topSpeciesList.slice(0, 2).join(', '),
          allSpeciesText: topSpeciesList.join(' • '),
        };
      });

      // Sort according to metric
      list.sort((a, b) => {
        if (rankSortMetric === 'WEIGHT') return b.weight - a.weight || b.count - a.count;
        if (rankSortMetric === 'BATCHES') return b.batches - a.batches || b.count - a.count;
        return b.count - a.count || b.weight - a.weight;
      });

      const maxMetricValue = list.length > 0 ? (rankSortMetric === 'WEIGHT' ? list[0].weight : list[0].count) || 1 : 1;

      return list.map((item, idx) => ({
        ...item,
        rank: idx + 1,
        percentBar: Math.min(
          100,
          Math.max(8, Math.round(((rankSortMetric === 'WEIGHT' ? item.weight : item.count) / maxMetricValue) * 100))
        ),
      }));
    };

    return {
      totalCount,
      totalWeight: Math.round(totalWeight * 10) / 10,
      thuStats: {
        ...thuStats,
        weight: Math.round(thuStats.weight * 10) / 10,
        uniqueFacilities: thuStats.facilities.size,
        topSpecies: Object.entries(thuStats.speciesMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Dúi, Cầy',
      },
      chimStats: {
        ...chimStats,
        weight: Math.round(chimStats.weight * 10) / 10,
        uniqueFacilities: chimStats.facilities.size,
        topSpecies: Object.entries(chimStats.speciesMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Chào mào, Cu gáy',
      },
      rankings: {
        ALL: buildRankList('ALL'),
        THU: buildRankList('THU'),
        CHIM: buildRankList('CHIM'),
      },
    };
  }, [parsedRecords, rankSortMetric]);

  // Current active ranking list based on tab
  const activeRankingList = analytics.rankings[rankClassTab] || [];
  const top1Facility = activeRankingList[0] || null;
  const top2Facility = activeRankingList[1] || null;
  const top3Facility = activeRankingList[2] || null;
  const remainingFacilities = activeRankingList.slice(3);

  // Filtered List for Table
  const filteredData = useMemo(() => {
    return packingListData.filter((item) => {
      // 0. Filter Owner if set from Leaderboard click
      if (filterOwner && item.tenChuLamSan !== filterOwner) {
        return false;
      }

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
  }, [packingListData, selectedCommune, selectedYear, searchTerm, filterOwner]);

  const handleExportExcel = () => {
    exportPackingListToExcel(filteredData);
  };

  const handlePrint = () => {
    window.print();
  };

  // Quick filter by owner from Leaderboard
  const handleSelectOwnerFilter = (ownerName) => {
    if (filterOwner === ownerName) {
      setFilterOwner(null);
    } else {
      setFilterOwner(ownerName);
      // Smooth scroll down to table
      const el = document.getElementById('packing-list-table-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
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
          {/* Toggle Leaderboard */}
          <button
            type="button"
            onClick={() => setIsLeaderboardOpen(!isLeaderboardOpen)}
            className={`px-3.5 py-2.5 rounded-2xl font-black text-xs border transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
              isLeaderboardOpen
                ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
            title="Bật/tắt bảng xếp hạng top cơ sở kinh doanh"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>{isLeaderboardOpen ? 'Thu gọn Top Xuất Bán' : 'Xem Top Xuất Bán'}</span>
            {isLeaderboardOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

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
              {packingListData.length} <span className="text-xs font-bold text-slate-500">lượt</span>
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
              {new Set(packingListData.map((i) => i.tenChuLamSan)).size}{' '}
              <span className="text-xs font-bold text-slate-500">chủ cơ sở</span>
            </div>
          </div>
        </div>

        {/* Card 3: Tổng cá thể xuất bán */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 shadow-inner">
            <Flame className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tổng cá thể xuất bán</div>
            <div className="text-xl sm:text-2xl font-black text-amber-900 font-mono mt-0.5">
              {analytics.totalCount} <span className="text-xs font-bold text-slate-500">con (~{analytics.totalWeight} kg)</span>
            </div>
          </div>
        </div>

        {/* Card 4: Đối sánh 2 lớp */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center flex-shrink-0 shadow-inner">
            <BarChart3 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Thị phần Chim & Thú</div>
            <div className="text-xs sm:text-sm font-black text-indigo-950 mt-0.5">
              🐾 Thú: <span className="text-amber-800">{analytics.thuStats.count} con</span> • 🦅 Chim:{' '}
              <span className="text-emerald-700">{analytics.chimStats.count} con</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BẢNG XẾP HẠNG TOP KINH DOANH & XUẤT BÁN (LỚP THÚ & LỚP CHIM) - VIVID LEADERBOARD */}
      {isLeaderboardOpen && (
        <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white rounded-3xl p-5 sm:p-6 border border-emerald-500/30 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Background Ambient Glow */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Leaderboard Header with Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg">
                  <Crown className="w-5 h-5 fill-slate-950" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                    <span>TOP CƠ SỞ KINH DOANH & XUẤT BÁN NHIỀU NHẤT</span>
                    <span className="text-[10px] font-extrabold uppercase bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full shadow-2xs">
                      Bảng Xếp Hạng
                    </span>
                  </h2>
                  <p className="text-xs text-emerald-200/80 font-medium">
                    Phân tích thị phần và quy mô thương mại động vật hoang dã trên toàn địa bàn huyện
                  </p>
                </div>
              </div>
            </div>

            {/* Class Tabs & Sort Metric Selector */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Tabs: Lớp Thú vs Lớp Chim vs Tất Cả */}
              <div className="flex items-center p-1 bg-black/40 rounded-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setRankClassTab('THU')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    rankClassTab === 'THU'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <PawPrint className="w-3.5 h-3.5" />
                  <span>🐾 Lớp Thú ({analytics.thuStats.uniqueFacilities} CS)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRankClassTab('CHIM')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    rankClassTab === 'CHIM'
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Feather className="w-3.5 h-3.5" />
                  <span>🦅 Lớp Chim ({analytics.chimStats.uniqueFacilities} CS)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRankClassTab('ALL')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    rankClassTab === 'ALL'
                      ? 'bg-white text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>Toàn Bộ</span>
                </button>
              </div>

              {/* Metric Selector */}
              <div className="flex items-center gap-1 bg-black/40 px-2 py-1.5 rounded-2xl border border-white/10 text-xs">
                <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">Xếp theo:</span>
                <button
                  type="button"
                  onClick={() => setRankSortMetric('COUNT')}
                  className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                    rankSortMetric === 'COUNT' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cá thể
                </button>
                <button
                  type="button"
                  onClick={() => setRankSortMetric('WEIGHT')}
                  className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                    rankSortMetric === 'WEIGHT' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Khối lượng (Kg)
                </button>
                <button
                  type="button"
                  onClick={() => setRankSortMetric('BATCHES')}
                  className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                    rankSortMetric === 'BATCHES' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Số đợt xuất
                </button>
              </div>
            </div>
          </div>

          {/* Class Ratio Proportion Bar */}
          <div className="my-4 bg-white/5 p-3 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-black flex items-center gap-1">
                  <PawPrint className="w-3.5 h-3.5" /> Lớp Thú: {analytics.thuStats.count} con (~{analytics.thuStats.weight} kg)
                </span>
                <span className="text-[11px] text-slate-400">({analytics.thuStats.uniqueFacilities} cơ sở xuất bán)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-black flex items-center gap-1">
                  <Feather className="w-3.5 h-3.5" /> Lớp Chim: {analytics.chimStats.count} con (~{analytics.chimStats.weight} kg)
                </span>
                <span className="text-[11px] text-slate-400">({analytics.chimStats.uniqueFacilities} cơ sở • {analytics.chimStats.batches} đợt)</span>
              </div>
            </div>

            {/* Split Progress Bar */}
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex shadow-inner">
              <div
                style={{
                  width: `${Math.round((analytics.thuStats.count / (analytics.totalCount || 1)) * 100)}%`,
                }}
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 h-full transition-all duration-500 relative group cursor-pointer"
                onClick={() => setRankClassTab('THU')}
                title={`Lớp Thú chiếm ${Math.round((analytics.thuStats.count / (analytics.totalCount || 1)) * 100)}% tổng cá thể`}
              />
              <div
                style={{
                  width: `${Math.round((analytics.chimStats.count / (analytics.totalCount || 1)) * 100)}%`,
                }}
                className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 h-full transition-all duration-500 relative group cursor-pointer"
                onClick={() => setRankClassTab('CHIM')}
                title={`Lớp Chim chiếm ${Math.round((analytics.chimStats.count / (analytics.totalCount || 1)) * 100)}% tổng cá thể`}
              />
            </div>
          </div>

          {/* TOP 3 PODIUM DISPLAY - BỤC VINH DANH TOP 1, 2, 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 my-4">
            {/* TOP 1 - QUÁN QUÂN XUẤT BÁN */}
            {top1Facility && (
              <div
                className={`bg-gradient-to-b from-amber-500/20 via-yellow-500/10 to-transparent rounded-2xl p-4 border-2 border-amber-400/80 shadow-lg relative overflow-hidden transition-all hover:scale-[1.01] ${
                  filterOwner === top1Facility.name ? 'ring-2 ring-amber-400 shadow-amber-500/30' : ''
                }`}
              >
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
                      👑 1
                    </span>
                    <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
                      QUÁN QUÂN XUẤT BÁN
                    </span>
                  </div>
                  <span className="text-xl">🥇</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-black text-white hover:text-amber-300 transition-colors">
                    {top1Facility.name}
                  </h3>
                  <p className="text-[11px] text-slate-300 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-amber-400 flex-shrink-0" />
                    <span>{top1Facility.diaChi}</span>
                  </p>
                </div>

                {/* Big Metric Display */}
                <div className="my-3 p-2.5 bg-black/40 rounded-xl border border-amber-400/30 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-amber-300/80 font-bold uppercase">Sản lượng xuất bán</div>
                    <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                      {top1Facility.count} <span className="text-xs font-bold text-white">cá thể</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-medium">Khối lượng</div>
                    <div className="text-sm font-black text-white font-mono">{top1Facility.weight} kg</div>
                    <div className="text-[10px] text-emerald-300 font-bold">{top1Facility.batches} đợt xuất</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 mb-2 truncate">
                  <span className="text-slate-400 font-medium">Loài chủ lực:</span>{' '}
                  <strong className="text-amber-200">{top1Facility.topSpeciesText}</strong>
                </div>

                {/* Filter Table Button */}
                <button
                  type="button"
                  onClick={() => handleSelectOwnerFilter(top1Facility.name)}
                  className={`w-full py-1.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    filterOwner === top1Facility.name
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'bg-white/10 hover:bg-white/20 text-amber-200 border border-amber-400/30'
                  }`}
                >
                  <span>{filterOwner === top1Facility.name ? 'Đang lọc cơ sở này' : 'Xem chi tiết các đợt xuất'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* TOP 2 - Á QUÂN */}
            {top2Facility && (
              <div
                className={`bg-gradient-to-b from-slate-300/20 via-sky-200/10 to-transparent rounded-2xl p-4 border border-slate-300/60 shadow-md relative overflow-hidden transition-all hover:scale-[1.01] ${
                  filterOwner === top2Facility.name ? 'ring-2 ring-sky-300' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-7 h-7 rounded-xl bg-slate-300 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
                      2
                    </span>
                    <span className="text-[10px] font-black uppercase text-sky-200 tracking-wider">
                      Á QUÂN THƯƠNG MẠI
                    </span>
                  </div>
                  <span className="text-xl">🥈</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-black text-white hover:text-sky-300 transition-colors">
                    {top2Facility.name}
                  </h3>
                  <p className="text-[11px] text-slate-300 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-sky-300 flex-shrink-0" />
                    <span>{top2Facility.diaChi}</span>
                  </p>
                </div>

                {/* Big Metric Display */}
                <div className="my-3 p-2.5 bg-black/40 rounded-xl border border-slate-400/30 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-sky-200/80 font-bold uppercase">Sản lượng xuất bán</div>
                    <div className="text-xl sm:text-2xl font-black text-sky-300 font-mono">
                      {top2Facility.count} <span className="text-xs font-bold text-white">cá thể</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-medium">Khối lượng</div>
                    <div className="text-sm font-black text-white font-mono">{top2Facility.weight} kg</div>
                    <div className="text-[10px] text-emerald-300 font-bold">{top2Facility.batches} đợt xuất</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 mb-2 truncate">
                  <span className="text-slate-400 font-medium">Loài chủ lực:</span>{' '}
                  <strong className="text-sky-100">{top2Facility.topSpeciesText}</strong>
                </div>

                {/* Filter Table Button */}
                <button
                  type="button"
                  onClick={() => handleSelectOwnerFilter(top2Facility.name)}
                  className={`w-full py-1.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    filterOwner === top2Facility.name
                      ? 'bg-sky-400 text-slate-950 font-black'
                      : 'bg-white/10 hover:bg-white/20 text-sky-200 border border-slate-300/30'
                  }`}
                >
                  <span>{filterOwner === top2Facility.name ? 'Đang lọc cơ sở này' : 'Xem chi tiết các đợt xuất'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* TOP 3 - HẠNG BA */}
            {top3Facility && (
              <div
                className={`bg-gradient-to-b from-amber-700/20 via-orange-600/10 to-transparent rounded-2xl p-4 border border-amber-600/40 shadow-md relative overflow-hidden transition-all hover:scale-[1.01] ${
                  filterOwner === top3Facility.name ? 'ring-2 ring-amber-600' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-7 h-7 rounded-xl bg-amber-700 text-amber-100 font-black text-xs flex items-center justify-center shadow-md">
                      3
                    </span>
                    <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
                      HẠNG BA
                    </span>
                  </div>
                  <span className="text-xl">🥉</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-black text-white hover:text-amber-300 transition-colors">
                    {top3Facility.name}
                  </h3>
                  <p className="text-[11px] text-slate-300 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-amber-500 flex-shrink-0" />
                    <span>{top3Facility.diaChi}</span>
                  </p>
                </div>

                {/* Big Metric Display */}
                <div className="my-3 p-2.5 bg-black/40 rounded-xl border border-amber-600/30 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-amber-400/80 font-bold uppercase">Sản lượng xuất bán</div>
                    <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                      {top3Facility.count} <span className="text-xs font-bold text-white">cá thể</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-medium">Khối lượng</div>
                    <div className="text-sm font-black text-white font-mono">{top3Facility.weight} kg</div>
                    <div className="text-[10px] text-emerald-300 font-bold">{top3Facility.batches} đợt xuất</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 mb-2 truncate">
                  <span className="text-slate-400 font-medium">Loài chủ lực:</span>{' '}
                  <strong className="text-amber-200">{top3Facility.topSpeciesText}</strong>
                </div>

                {/* Filter Table Button */}
                <button
                  type="button"
                  onClick={() => handleSelectOwnerFilter(top3Facility.name)}
                  className={`w-full py-1.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    filterOwner === top3Facility.name
                      ? 'bg-amber-600 text-white font-black'
                      : 'bg-white/10 hover:bg-white/20 text-amber-200 border border-amber-600/30'
                  }`}
                >
                  <span>{filterOwner === top3Facility.name ? 'Đang lọc cơ sở này' : 'Xem chi tiết các đợt xuất'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* FULL RANKING TABLE FOR REMAINING FACILITIES */}
          {remainingFacilities.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-xs font-extrabold text-slate-300 mb-2.5 flex items-center justify-between">
                <span>Các cơ sở tiếp theo trong bảng xếp hạng ({remainingFacilities.length} cơ sở)</span>
                <span className="text-[10px] text-slate-400 font-medium">Bấm vào cơ sở để xem nhật ký xuất bán chi tiết</span>
              </div>

              <div className="space-y-2">
                {remainingFacilities.map((fac) => {
                  const isSelected = filterOwner === fac.name;
                  return (
                    <div
                      key={fac.name}
                      onClick={() => handleSelectOwnerFilter(fac.name)}
                      className={`p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSelected ? 'border-emerald-400 bg-emerald-950/40 ring-1 ring-emerald-400' : 'border-white/10'
                      }`}
                    >
                      {/* Left info: Rank, Name, Address */}
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono font-black text-xs flex items-center justify-center flex-shrink-0">
                          #{fac.rank}
                        </span>
                        <div className="overflow-hidden">
                          <div className="font-black text-xs text-white truncate flex items-center gap-2">
                            <span>{fac.name}</span>
                            <span className="text-[10px] text-emerald-300 font-bold bg-emerald-900/60 px-1.5 py-0.2 rounded">
                              {fac.batches} đợt xuất
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                            <MapPin className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />
                            <span>{fac.diaChi}</span>
                            <span className="mx-1">•</span>
                            <span className="text-amber-300/90 font-medium">{fac.allSpeciesText}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right info: Metric Numbers & Visual Progress Bar */}
                      <div className="flex items-center gap-4 flex-shrink-0">
                        {/* Progress Bar */}
                        <div className="w-28 sm:w-36 hidden md:block">
                          <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                            <span>Tỷ trọng</span>
                            <span>{fac.percentBar}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              style={{ width: `${fac.percentBar}%` }}
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                            />
                          </div>
                        </div>

                        {/* Numbers */}
                        <div className="text-right font-mono">
                          <div className="text-sm font-black text-emerald-400">
                            {fac.count} <span className="text-[10px] font-bold text-slate-400">cá thể</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold">{fac.weight} kg</div>
                        </div>

                        <div className="p-1 rounded-lg bg-white/10 text-slate-300 group-hover:text-white">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 4. Search Bar & Filter Options */}
      <div id="packing-list-table-section" className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs space-y-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
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
          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
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
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filters */}
            {(searchTerm || selectedCommune !== 'ALL' || selectedYear !== 'ALL' || filterOwner) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCommune('ALL');
                  setSelectedYear('ALL');
                  setFilterOwner(null);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Đặt lại</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Owner Filter Tag */}
        {filterOwner && (
          <div className="flex items-center gap-2 pt-1 text-xs">
            <span className="text-slate-500 font-medium">Đang lọc xem riêng cơ sở:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-950 font-black rounded-full border border-amber-300 shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-amber-700" />
              <span>{filterOwner}</span>
              <button
                type="button"
                onClick={() => setFilterOwner(null)}
                className="ml-1 text-amber-700 hover:text-rose-600 font-black cursor-pointer"
                title="Bỏ lọc cơ sở này"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
            <span className="text-[11px] text-slate-400 italic">({filteredData.length} đợt cấp bảng kê)</span>
          </div>
        )}
      </div>

      {/* 5. Main Packing List Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white uppercase text-[11px] font-black tracking-wider">
                <th className="py-3.5 px-3 text-center w-12 border-b border-emerald-800">Số TT</th>
                <th className="py-3.5 px-4 w-32 border-b border-emerald-800">Số vào sổ</th>
                <th className="py-3.5 px-4 w-36 border-b border-emerald-800">Ngày xác nhận</th>
                <th className="py-3.5 px-4 border-b border-emerald-800">Tên chủ lâm sản</th>
                <th className="py-3.5 px-4 border-b border-emerald-800">Địa chỉ chủ lâm sản</th>
                <th className="py-3.5 px-4 border-b border-emerald-800">Tổng lâm sản xác nhận</th>
                <th className="py-3.5 px-3 text-center w-24 border-b border-emerald-800">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <FileCheck2 className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="font-extrabold text-slate-600">Không tìm thấy bản ghi bảng kê nào</p>
                      <p className="text-[11px] text-slate-400">
                        Thử thay đổi từ khóa tìm kiếm, bộ lọc xã hoặc bấm <strong>+ Lập Bảng Kê Mới</strong>
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => {
                  const parsed = parsePackingItem(item);
                  const isBird = parsed.animalClass === 'CHIM';

                  return (
                    <tr key={item.id || index} className="hover:bg-emerald-50/40 transition-colors group">
                      {/* Cột 1: STT */}
                      <td className="py-3 px-3 text-center font-bold text-slate-500 font-mono">
                        {item.stt || index + 1}
                      </td>

                      {/* Cột 2: Số vào sổ */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-black text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs shadow-2xs inline-block">
                          {item.soVaoSo}
                        </span>
                      </td>

                      {/* Cột 3: Ngày xác nhận */}
                      <td className="py-3 px-4 font-bold text-slate-700 font-mono">{item.ngayXacNhan}</td>

                      {/* Cột 4: Tên chủ lâm sản */}
                      <td className="py-3 px-4 font-extrabold text-slate-900">
                        <div
                          className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-700 transition-colors"
                          onClick={() => handleSelectOwnerFilter(item.tenChuLamSan)}
                          title="Bấm để lọc riêng cơ sở này"
                        >
                          <Building2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                          <span className="truncate">{item.tenChuLamSan}</span>
                        </div>
                      </td>

                      {/* Cột 5: Địa chỉ */}
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{item.diaChi}</span>
                        </div>
                      </td>

                      {/* Cột 6: Tổng lâm sản xác nhận với Class Badge */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-black flex items-center gap-0.5 shadow-2xs ${
                              isBird
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {isBird ? <Feather className="w-3 h-3" /> : <PawPrint className="w-3 h-3" />}
                            <span>{isBird ? 'Lớp Chim' : 'Lớp Thú'}</span>
                          </span>

                          <div className="inline-block bg-slate-50 group-hover:bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 shadow-2xs">
                            {item.tongLamSan}
                          </div>
                        </div>

                        {item.ghiChu && (
                          <div className="text-[10px] text-slate-400 mt-0.5 italic">Ghi chú: {item.ghiChu}</div>
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
                              if (
                                window.confirm(
                                  `Bạn có chắc chắn muốn xóa Bảng kê số "${item.soVaoSo}" của "${item.tenChuLamSan}"?`
                                )
                              ) {
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
            Hiển thị <span className="text-emerald-800 font-black">{filteredData.length}</span> / {packingListData.length}{' '}
            bản ghi xác nhận bảng kê
          </div>
          <div className="text-[11px] text-slate-400">
            Dữ liệu đồng bộ tự động với Cloud Firestore & lưu trữ an toàn trên thiết bị
          </div>
        </div>
      </div>
    </div>
  );
}
