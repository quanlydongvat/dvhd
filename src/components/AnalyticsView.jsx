import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  BarController,
  LineController,
  DoughnutController,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, Calendar, Filter, MapPin, Feather, Download, Award, BarChart3, PieChart, Activity } from 'lucide-react';
import * as XLSX from 'xlsx';
import { isBirdSpecies, getFacilityCategory, computeLogbookTable } from '../utils/calculations';

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  BarController,
  LineController,
  DoughnutController,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsView({ facilitiesList = [] }) {
  const [timeMode, setTimeMode] = useState('YEAR'); // 'YEAR' | 'H1' | 'H2' | 'MONTH'
  const [selectedMonth, setSelectedMonth] = useState(3); // 1-12
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedCommune, setSelectedCommune] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL'); // 'ALL' | 'MAMMAL_REPTILE' | 'BIRD'
  const [selectedFacilityId, setSelectedFacilityId] = useState('ALL');

  const COMMUNES = ['xã Hòa Sơn', 'xã Yang Mao', 'xã Cư Pui', 'Xã Krông Bông', 'Xã Dang Kang'];

  // Filter facilities
  const filteredFacilities = useMemo(() => {
    return facilitiesList.filter((fac) => {
      const matchCommune = selectedCommune === 'ALL' || fac.commune === selectedCommune;
      const matchFac = selectedFacilityId === 'ALL' || fac.id === selectedFacilityId;

      const cat = getFacilityCategory(fac);
      let matchCategory = true;
      if (selectedCategory === 'BIRD') {
        matchCategory = cat === 'BIRD' || cat === 'MIXED';
      } else if (selectedCategory === 'MAMMAL_REPTILE') {
        matchCategory = cat === 'MAMMAL_REPTILE' || cat === 'MIXED';
      }

      return matchCommune && matchFac && matchCategory;
    });
  }, [facilitiesList, selectedCommune, selectedCategory, selectedFacilityId]);

  // Build Time Series Data (Monthly for the Year 2026, or breakdown by days if MONTH mode)
  const chartData = useMemo(() => {
    // 12 Months baseline
    const monthlyStats = Array.from({ length: 12 }, (_, idx) => ({
      month: idx + 1,
      monthLabel: `Tháng ${idx + 1}`,
      inc: 0,
      dec: 0,
      net: 0,
      totalEnd: 0,
    }));

    let initialTotal = 0; // Accumulated total right before the start of selectedYear

    filteredFacilities.forEach((fac) => {
      fac.speciesList.forEach((sp) => {
        const b = sp.baseline || {};
        let currentSpTotal =
          (Number(b.father) || 0) +
          (Number(b.mother) || 0) +
          (Number(b.otherMale) || 0) +
          (Number(b.otherFemale) || 0) +
          (Number(b.otherUnknown) || 0);

        const processedRows = computeLogbookTable(b, sp.fluctuations || []);

        processedRows.forEach((row) => {
          if (row.isBaseline || !row.date) return;
          const rowDate = new Date(row.date);
          const monthIdx = rowDate.getMonth(); // 0 - 11
          const year = rowDate.getFullYear();

          const inc =
            (row.incFather || 0) +
            (row.incMother || 0) +
            (row.incOtherMale || 0) +
            (row.incOtherFemale || 0) +
            (row.incOtherUnknown || 0);

          const dec =
            (row.decFather || 0) +
            (row.decMother || 0) +
            (row.decOtherMale || 0) +
            (row.decOtherFemale || 0) +
            (row.decOtherUnknown || 0);

          if (year < selectedYear) {
             currentSpTotal += (inc - dec);
          } else if (year === selectedYear && monthIdx >= 0 && monthIdx < 12) {
            monthlyStats[monthIdx].inc += inc;
            monthlyStats[monthIdx].dec += dec;
          }
        });
        initialTotal += currentSpTotal;
      });
    });

    // Compute cumulative running total at end of each month
    let runningTotal = initialTotal;
    monthlyStats.forEach((st) => {
      st.net = st.inc - st.dec;
      runningTotal += st.net;
      st.totalEnd = runningTotal;
    });

    // Slice based on time mode
    let targetStats = monthlyStats;
    if (timeMode === 'H1') {
      targetStats = monthlyStats.slice(0, 6);
    } else if (timeMode === 'H2') {
      targetStats = monthlyStats.slice(6, 12);
    } else if (timeMode === 'MONTH') {
      targetStats = [monthlyStats[selectedMonth - 1]];
    }

    return {
      monthlyStats,
      targetStats,
      initialTotal,
      finalTotal: runningTotal,
    };
  }, [filteredFacilities, timeMode, selectedMonth, selectedYear]);

  // Aggregate Period Totals for KPIs
  const kpiStats = useMemo(() => {
    let totalInc = 0;
    let totalDec = 0;
    let totalSold = 0;

    filteredFacilities.forEach((fac) => {
      fac.speciesList.forEach((sp) => {
        const processedRows = computeLogbookTable(sp.baseline || {}, sp.fluctuations || []);
        processedRows.forEach((row) => {
          if (row.isBaseline || !row.date) return;
          const rowDate = new Date(row.date);
          const monthIdx = rowDate.getMonth();
          const year = rowDate.getFullYear();

          let isTargetPeriod = false;
          if (year === selectedYear) {
             if (timeMode === 'YEAR') isTargetPeriod = true;
             else if (timeMode === 'H1' && monthIdx < 6) isTargetPeriod = true;
             else if (timeMode === 'H2' && monthIdx >= 6) isTargetPeriod = true;
             else if (timeMode === 'MONTH' && monthIdx === selectedMonth - 1) isTargetPeriod = true;
          }

          if (isTargetPeriod) {
            const dec =
              (row.decFather || 0) +
              (row.decMother || 0) +
              (row.decOtherMale || 0) +
              (row.decOtherFemale || 0) +
              (row.decOtherUnknown || 0);
            
            if (dec > 0 && (row.reason || '').toLowerCase().includes('xuất bán')) {
               totalSold += dec;
            }
          }
        });
      });
    });

    chartData.targetStats.forEach((st) => {
      totalInc += st.inc;
      totalDec += st.dec;
    });

    const netGrowth = totalInc - totalDec;
    return { totalInc, totalDec, totalSold, netGrowth };
  }, [chartData, filteredFacilities, selectedYear, timeMode, selectedMonth]);

  // Commune Distribution Data for Doughnut Chart
  const communeDistribution = useMemo(() => {
    const communeTotals = COMMUNES.map((cName) => {
      let total = 0;
      let facCount = 0;

      facilitiesList.forEach((fac) => {
        if ((fac.commune || '') === cName) {
          facCount++;
          fac.speciesList.forEach((sp) => {
            const processedRows = computeLogbookTable(sp.baseline || {}, sp.fluctuations || []);
            const lastRow = processedRows[processedRows.length - 1];
            if (lastRow) total += lastRow.total;
          });
        }
      });

      return { communeName: cName, total, facCount };
    });

    return communeTotals;
  }, [facilitiesList]);

  // Species Breakdown Data
  const speciesBreakdown = useMemo(() => {
    const speciesMap = {};

    filteredFacilities.forEach((fac) => {
      fac.speciesList.forEach((sp) => {
        const name = sp.vietnameseName;
        const processedRows = computeLogbookTable(sp.baseline || {}, sp.fluctuations || []);
        const lastRow = processedRows[processedRows.length - 1];
        const total = lastRow ? lastRow.total : 0;

        if (!speciesMap[name]) {
          speciesMap[name] = { name, total: 0, isBird: isBirdSpecies(sp) };
        }
        speciesMap[name].total += total;
      });
    });

    return Object.values(speciesMap).sort((a, b) => b.total - a.total);
  }, [filteredFacilities]);

  // Combo Chart Configurations (Bar + Line)
  const mainChartDataConfig = {
    labels: chartData.targetStats.map((s) => s.monthLabel),
    datasets: [
      {
        type: 'line',
        label: 'Quy mô tổng đàn (Con)',
        data: chartData.targetStats.map((s) => s.totalEnd),
        borderColor: '#0284c7', // Sky Blue
        backgroundColor: 'rgba(2, 132, 199, 0.1)',
        borderWidth: 3,
        tension: 0.3,
        fill: true,
        yAxisID: 'y1',
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        type: 'bar',
        label: 'Số lượng Tăng đàn (+)',
        data: chartData.targetStats.map((s) => s.inc),
        backgroundColor: '#10b981', // Emerald Green
        borderRadius: 8,
        yAxisID: 'y',
      },
      {
        type: 'bar',
        label: 'Số lượng Giảm đàn (-)',
        data: chartData.targetStats.map((s) => s.dec),
        backgroundColor: '#f43f5e', // Rose Red
        borderRadius: 8,
        yAxisID: 'y',
      },
    ],
  };

  const mainChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' },
          usePointStyle: true,
          padding: 10,
          boxWidth: 10,
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 11 },
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { family: 'Plus Jakarta Sans', size: 10, weight: 'bold' },
          maxRotation: 45,
          minRotation: 0,
          autoSkip: true,
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: false },
        grid: { color: '#f1f5f9' },
        ticks: { font: { size: 10 } },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: false },
        grid: { drawOnChartArea: false },
        ticks: { font: { size: 10 } },
      },
    },
  };

  // Doughnut Chart Configuration (Distribution by Commune)
  const doughnutChartConfig = {
    labels: communeDistribution.map((c) => c.communeName),
    datasets: [
      {
        label: 'Số lượng cá thể',
        data: communeDistribution.map((c) => c.total),
        backgroundColor: ['#10b981', '#06b6d4', '#6366f1', '#f59e0b', '#ec4899'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  // Export Analytics to Excel
  const handleExportAnalyticsExcel = () => {
    const sheetData = [];
    sheetData.push([`BẢNG THỐNG KÊ PHÁT TRIỂN & BIẾN ĐỘNG ĐÀN CƠ SỞ NUÔI NĂM ${selectedYear}`]);
    sheetData.push([`Kỳ thống kê: ${timeMode === 'YEAR' ? 'Cả năm' : timeMode === 'H1' ? '6 tháng đầu năm (H1)' : timeMode === 'H2' ? '6 tháng cuối năm (H2)' : `Tháng ${selectedMonth}`}`]);
    sheetData.push([]);

    sheetData.push(['Tháng', 'Tổng cá thể Tăng đàn (+)', 'Tổng cá thể Giảm đàn (-)', 'Tăng trưởng ròng (Net)', 'Quy mô tổng đàn cuối tháng']);

    chartData.targetStats.forEach((st) => {
      sheetData.push([st.monthLabel, st.inc, st.dec, st.net, st.totalEnd]);
    });

    sheetData.push([]);
    sheetData.push(['THỐNG KÊ THEO XÃ']);
    sheetData.push(['Tên Xã', 'Số lượng cơ sở', 'Tổng cá thể hiện có']);
    communeDistribution.forEach((c) => {
      sheetData.push([c.communeName, c.facCount, c.total]);
    });

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Thong_Ke_Phat_Trien');
    XLSX.writeFile(wb, `Bao_Cao_Thong_Ke_Phat_Trien_${selectedYear}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
      {/* Analytics Banner Header */}
      <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-4 sm:p-6 shadow-xl border border-emerald-500/20 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>Biểu Đồ Trực Quan & Phân Tích Tăng Trưởng</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
            Báo Cáo Thống Kê Sự Phát Triển Đàn Vật Nuôi
          </h2>
          <p className="text-xs text-emerald-200/90 font-medium mt-1">
            Theo dõi tốc độ sinh sản, tăng giảm số lượng cá thể theo Từng tháng, 6 tháng (H1/H2) và Cả năm 2026
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportAnalyticsExcel}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-4 py-3 rounded-2xl text-xs font-black transition-all shadow-md active:scale-95 w-full sm:w-auto relative z-10 cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          <span>Xuất Báo Cáo Thống Kê Excel</span>
        </button>
      </div>

      {/* KPI Cards (Key Performance Indicators) - Optimized 2 cols grid on Mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Animals Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 block uppercase">Quy mô hiện tại</span>
            <div className="text-lg sm:text-2xl font-extrabold text-slate-900 mt-0.5 sm:mt-1 font-mono">{chartData.finalTotal} <span className="text-[10px] sm:text-xs font-sans font-normal text-slate-500">con</span></div>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:block">Toàn bộ các cơ sở</span>
          </div>
          <div className="p-2 sm:p-3 bg-sky-50 text-sky-600 rounded-xl sm:rounded-2xl border border-sky-200">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Total Increase Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-teal-700 block uppercase">Tổng Tăng Đàn</span>
            <div className="text-lg sm:text-2xl font-extrabold text-teal-700 mt-0.5 sm:mt-1 font-mono">+{kpiStats.totalInc} <span className="text-[10px] sm:text-xs font-sans font-normal text-slate-500">con</span></div>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:block">Sinh sản & Nhập đàn</span>
          </div>
          <div className="p-2 sm:p-3 bg-teal-50 text-teal-600 rounded-xl sm:rounded-2xl border border-teal-200">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Total Decrease Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-rose-700 block uppercase">Tổng Giảm Đàn</span>
            <div className="text-lg sm:text-2xl font-extrabold text-rose-700 mt-0.5 sm:mt-1 font-mono">-{kpiStats.totalDec} <span className="text-[10px] sm:text-xs font-sans font-normal text-slate-500">con</span></div>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:block">Trong đó xuất bán: <strong className="text-rose-800">{kpiStats.totalSold}</strong> con</span>
          </div>
          <div className="p-2 sm:p-3 bg-rose-50 text-rose-600 rounded-xl sm:rounded-2xl border border-rose-200">
            <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Net Growth Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-indigo-700 block uppercase">Tăng trưởng ròng</span>
            <div className={`text-lg sm:text-2xl font-extrabold mt-0.5 sm:mt-1 font-mono ${kpiStats.netGrowth >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {kpiStats.netGrowth >= 0 ? `+${kpiStats.netGrowth}` : kpiStats.netGrowth} <span className="text-[10px] sm:text-xs font-sans font-normal text-slate-500">con</span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:block">Số cá thể tăng nét</span>
          </div>
          <div className="p-2 sm:p-3 bg-indigo-50 text-indigo-600 rounded-xl sm:rounded-2xl border border-indigo-200">
            <Award className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Time Mode Controls Bar - Scrollable on mobile */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        {/* Time Mode Segmented Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold w-full md:w-auto overflow-x-auto scrollbar-none whitespace-nowrap">
          <button
            onClick={() => setTimeMode('YEAR')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
              timeMode === 'YEAR' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-700 hover:bg-white/80'
            }`}
          >
            🗓️ Cả năm 2026
          </button>
          <button
            onClick={() => setTimeMode('H1')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
              timeMode === 'H1' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-700 hover:bg-white/80'
            }`}
          >
            📊 6 tháng đầu năm (H1)
          </button>
          <button
            onClick={() => setTimeMode('H2')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
              timeMode === 'H2' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-700 hover:bg-white/80'
            }`}
          >
            📈 6 tháng cuối năm (H2)
          </button>
          <button
            onClick={() => setTimeMode('MONTH')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all ${
              timeMode === 'MONTH' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-700 hover:bg-white/80'
            }`}
          >
            📅 Theo Tháng
          </button>
        </div>

        {/* Month Selector Dropdown if MONTH mode */}
        {timeMode === 'MONTH' && (
          <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
            <Calendar className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full sm:w-auto bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-emerald-500 cursor-pointer shadow-xs"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Tháng {i + 1} / {selectedYear}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Geographic & Category Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs w-full md:w-auto">
          {/* Commune Filter */}
          <select
            value={selectedCommune}
            onChange={(e) => setSelectedCommune(e.target.value)}
            className="flex-1 sm:flex-initial bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-emerald-500 cursor-pointer shadow-xs"
          >
            <option value="ALL">📍 Tất cả 5 Xã</option>
            {COMMUNES.map((c) => (
              <option key={c} value={c}>
                📍 {c}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 sm:flex-initial bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-emerald-500 cursor-pointer shadow-xs"
          >
            <option value="ALL">🐾 Tất cả nhóm loài</option>
            <option value="MAMMAL_REPTILE">🦔 Lớp Thú</option>
            <option value="BIRD">🦜 Nhóm Chim</option>
          </select>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Main Growth Trend Combo Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Biểu Đồ Diễn Biến Tăng / Giảm & Tổng Đàn</span>
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                Cột xanh (Tăng) / Cột đỏ (Giảm) & Đường tổng quy mô đàn
              </p>
            </div>
          </div>

          <div className="relative w-full h-[260px] sm:h-[340px] min-w-0">
            <Line data={mainChartDataConfig} options={mainChartOptions} />
          </div>
        </div>

        {/* Commune Distribution Doughnut Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>Tỷ Lệ Phân Bố Theo Xã</span>
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                Số lượng cá thể phân bố trên địa bàn 5 Xã
              </p>
            </div>
          </div>

          <div className="relative w-full h-[200px] sm:h-[240px] flex items-center justify-center min-w-0">
            <Doughnut
              data={doughnutChartConfig}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { font: { size: 10, weight: 'bold' } } } },
              }}
            />
          </div>

          {/* Commune Subtotals List */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {communeDistribution.map((c) => (
              <div key={c.communeName} className="flex items-center justify-between text-slate-700 font-medium text-[11px] sm:text-xs">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                  {c.communeName} ({c.facCount} CS):
                </span>
                <strong className="font-mono text-slate-900 font-bold">{c.total} con</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Breakdown by Species Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>Thống Kê Cơ Cấu Quy Mô Các Loài Nuôi Chủ Lực</span>
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
              Sắp xếp theo tổng số lượng cá thể hiện có tại các cơ sở
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {speciesBreakdown.map((sp, idx) => (
            <div
              key={sp.name}
              className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3 flex items-center justify-between shadow-2xs"
            >
              <div className="space-y-0.5 min-w-0 pr-1">
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 font-mono">#0{idx + 1}</span>
                <h4 className="text-[11px] sm:text-xs font-extrabold text-slate-900 truncate">
                  {sp.isBird ? '🦜' : '🦔'} {sp.name}
                </h4>
              </div>
              <span className="text-base sm:text-lg font-extrabold font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-300 flex-shrink-0">
                {sp.total}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
