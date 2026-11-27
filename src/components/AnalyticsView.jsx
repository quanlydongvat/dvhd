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
import { TrendingUp, TrendingDown, Calendar, Filter, MapPin, Feather, Download, Award, BarChart3, PieChart, Activity, RefreshCw, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { isBirdSpecies, isMammalSpecies, getFacilityCategory, computeLogbookTable, getCanonicalSpecies } from '../utils/calculations';

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
  const [selectedBreedingSpecies, setSelectedBreedingSpecies] = useState('ALL');
  const [showSpeciesBreedingTable, setShowSpeciesBreedingTable] = useState(false);

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
      (fac.speciesList || []).forEach((sp) => {
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
    const now = new Date();
    const currentRealYear = now.getFullYear();
    const currentRealMonthIdx = now.getMonth(); // 0-indexed (e.g. 7 for August)

    let runningTotal = initialTotal;
    monthlyStats.forEach((st, idx) => {
      st.net = st.inc - st.dec;
      runningTotal += st.net;

      // If selected year is current year and month is in the future (> currentRealMonthIdx)
      if (selectedYear === currentRealYear && idx > currentRealMonthIdx) {
        const hasFutureEvents = monthlyStats.slice(idx).some(m => m.inc > 0 || m.dec > 0);
        if (!hasFutureEvents) {
          st.totalEnd = null; // Stop plotting trend line at current month
        } else {
          st.totalEnd = runningTotal;
        }
      } else {
        st.totalEnd = runningTotal;
      }
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

  // Aggregate Period Totals for KPIs (Separating Real Decrease from Internal Group Transfers)
  const kpiStats = useMemo(() => {
    let realInc = 0;
    let realDec = 0;
    let internalTransferCount = 0;
    let totalSold = 0;
    let totalDeath = 0;
    let totalTransferOut = 0;
    let totalOtherDec = 0;

    filteredFacilities.forEach((fac) => {
      (fac.speciesList || []).forEach((sp) => {
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

            if (inc === 0 && dec === 0) return;

            const reason = (row.reason || '').toLowerCase();
            const isInternalByReason =
              reason.includes('xác định giới tính') ||
              reason.includes('chuyển cá thể') ||
              reason.includes('nội bộ') ||
              reason.includes('chuyển đàn') ||
              reason.includes('phân loại');

            // If net total stock change is 0 (inc === dec) OR reason is internal reclassification -> Internal transfer!
            if (inc === dec || (isInternalByReason && inc > 0 && dec > 0)) {
              internalTransferCount += Math.max(inc, dec);
            } else {
              // Net real increase or net real decrease for this row
              if (inc > dec) {
                realInc += (inc - dec);
              } else if (dec > inc) {
                const decAmount = dec - inc;
                realDec += decAmount;

                if (reason.includes('xuất') || reason.includes('bán') || reason.includes('thương mại')) {
                  totalSold += decAmount;
                } else if (reason.includes('chết') || reason.includes('bệnh') || reason.includes('rủi ro') || reason.includes('hủy') || reason.includes('sổng')) {
                  totalDeath += decAmount;
                } else if (reason.includes('tặng') || reason.includes('chuyển') || reason.includes('nhượng') || reason.includes('cho')) {
                  totalTransferOut += decAmount;
                } else {
                  totalOtherDec += decAmount;
                }
              }
            }
          }
        });
      });
    });

    const netGrowth = realInc - realDec;
    return {
      realInc,
      realDec,
      internalTransferCount,
      totalSold,
      totalDeath,
      totalTransferOut,
      totalOtherDec,
      netGrowth,
    };
  }, [filteredFacilities, selectedYear, timeMode, selectedMonth]);

  // Commune Distribution Data for Doughnut Chart
  const communeDistribution = useMemo(() => {
    const communeTotals = COMMUNES.map((cName) => {
      let total = 0;
      let facCount = 0;

      facilitiesList.forEach((fac) => {
        if ((fac.commune || '') === cName) {
          facCount++;
          (fac.speciesList || []).forEach((sp) => {
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
      (fac.speciesList || []).forEach((sp) => {
        const canonical = getCanonicalSpecies(sp.vietnameseName, sp.scientificName);
        const name = canonical.vietnameseName;
        const processedRows = computeLogbookTable(sp.baseline || {}, sp.fluctuations || []);
        const lastRow = processedRows[processedRows.length - 1];
        const total = lastRow ? lastRow.total : 0;

        if (!speciesMap[canonical.key]) {
          speciesMap[canonical.key] = { name, total: 0, isBird: canonical.isBird || isBirdSpecies(sp) };
        }
        speciesMap[canonical.key].total += total;
      });
    });

    return Object.values(speciesMap).sort((a, b) => b.total - a.total);
  }, [filteredFacilities]);

  // 1. Top 5 Facilities Ranking
  const topFacilities = useMemo(() => {
    const list = filteredFacilities.map((fac) => {
      let facTotal = 0;
      const spList = [];

      (fac.speciesList || []).forEach((sp) => {
        const processedRows = computeLogbookTable(sp.baseline || {}, sp.fluctuations || []);
        const lastRow = processedRows[processedRows.length - 1];
        const count = lastRow ? lastRow.total : 0;
        if (count > 0) {
          facTotal += count;
          spList.push(sp.vietnameseName);
        }
      });

      return {
        id: fac.id,
        facilityName: fac.facilityName,
        ownerName: fac.ownerName,
        commune: fac.commune,
        registrationCode: fac.registrationCode,
        totalAnimals: facTotal,
        speciesCount: spList.length,
        speciesNames: spList.join(', '),
      };
    });

    list.sort((a, b) => b.totalAnimals - a.totalAnimals);
    return list.slice(0, 5);
  }, [filteredFacilities]);

  // 2. Gender & Breeding Structure Breakdown per Species
  const speciesBreedingStats = useMemo(() => {
    const speciesMap = {};
    let allFather = 0;
    let allMother = 0;
    let allOtherMale = 0;
    let allOtherFemale = 0;
    let allOtherUnknown = 0;

    filteredFacilities.forEach((fac) => {
      fac.speciesList?.forEach((sp) => {
        const canonical = getCanonicalSpecies(sp.vietnameseName, sp.scientificName);
        const key = canonical.key;
        const name = canonical.vietnameseName || sp.vietnameseName?.trim() || 'Khác';
        if (!speciesMap[key]) {
          speciesMap[key] = {
            name,
            scientificName: canonical.scientificName || sp.scientificName || '',
            group: canonical.group || sp.group || '',
            father: 0,
            mother: 0,
            otherMale: 0,
            otherFemale: 0,
            otherUnknown: 0,
            facilitiesCount: new Set(),
          };
        }
        speciesMap[key].facilitiesCount.add(fac.id);

        const processedRows = computeLogbookTable(sp.baseline || {}, sp.fluctuations || []);
        const lastRow = processedRows[processedRows.length - 1];
        if (lastRow && speciesMap[key]) {
          const f = Number(lastRow.father) || 0;
          const m = Number(lastRow.mother) || 0;
          const om = Number(lastRow.otherMale) || 0;
          const of = Number(lastRow.otherFemale) || 0;
          const ou = Number(lastRow.otherUnknown) || 0;

          speciesMap[key].father += f;
          speciesMap[key].mother += m;
          speciesMap[key].otherMale += om;
          speciesMap[key].otherFemale += of;
          speciesMap[key].otherUnknown += ou;

          allFather += f;
          allMother += m;
          allOtherMale += om;
          allOtherFemale += of;
          allOtherUnknown += ou;
        }
      });
    });

    const speciesList = Object.values(speciesMap).map((item) => {
      const grandTotal = item.father + item.mother + item.otherMale + item.otherFemale + item.otherUnknown;
      const breedingTotal = item.father + item.mother;
      const youngTotal = item.otherMale + item.otherFemale + item.otherUnknown;
      const ratioMotherToFather = item.father > 0 ? (item.mother / item.father).toFixed(1) : (item.mother > 0 ? '---' : '0');
      return {
        ...item,
        facilitiesCount: item.facilitiesCount.size,
        grandTotal,
        breedingTotal,
        youngTotal,
        ratioMotherToFather,
        fatherPct: grandTotal > 0 ? Math.round((item.father / grandTotal) * 100) : 0,
        motherPct: grandTotal > 0 ? Math.round((item.mother / grandTotal) * 100) : 0,
        youngPct: grandTotal > 0 ? Math.round((youngTotal / grandTotal) * 100) : 0,
      };
    });

    // Sort by largest total population
    speciesList.sort((a, b) => b.grandTotal - a.grandTotal);

    const allGrandTotal = allFather + allMother + allOtherMale + allOtherFemale + allOtherUnknown || 1;
    const allBreedingTotal = allFather + allMother;
    const allYoungTotal = allOtherMale + allOtherFemale + allOtherUnknown;
    const allRatio = allFather > 0 ? (allMother / allFather).toFixed(1) : 0;

    const allStats = {
      name: 'Tất cả loài',
      scientificName: 'Tổng hợp toàn huyện',
      father: allFather,
      mother: allMother,
      otherMale: allOtherMale,
      otherFemale: allOtherFemale,
      otherUnknown: allOtherUnknown,
      grandTotal: allGrandTotal,
      breedingTotal: allBreedingTotal,
      youngTotal: allYoungTotal,
      ratioMotherToFather: allRatio,
      fatherPct: Math.round((allFather / allGrandTotal) * 100),
      motherPct: Math.round((allMother / allGrandTotal) * 100),
      youngPct: Math.round((allYoungTotal / allGrandTotal) * 100),
      facilitiesCount: filteredFacilities.length,
    };

    return {
      speciesList,
      speciesMap,
      allStats,
    };
  }, [filteredFacilities]);

  // Active breakdown depending on user selection
  const currentBreedingData = useMemo(() => {
    if (selectedBreedingSpecies === 'ALL') {
      return speciesBreedingStats.allStats;
    }
    const found = speciesBreedingStats.speciesList.find(s => s.name === selectedBreedingSpecies);
    return found || speciesBreedingStats.allStats;
  }, [selectedBreedingSpecies, speciesBreedingStats]);

  // 3. Animal Class Breakdown (Lớp Thú - Mammalia & Lớp Chim - Aves)
  const animalClassBreakdown = useMemo(() => {
    let mammalsCount = 0; // Lớp Thú (Dúi, Cầy, Nhím, Don...)
    let birdsCount = 0;   // Lớp Chim (Chim chào mào, chim cu gáy...)

    filteredFacilities.forEach((fac) => {
      (fac.speciesList || []).forEach((sp) => {
        const processedRows = computeLogbookTable(sp.baseline || {}, sp.fluctuations || []);
        const lastRow = processedRows[processedRows.length - 1];
        const count = lastRow ? Number(lastRow.total) || 0 : 0;
        if (count <= 0) return;

        const canonical = getCanonicalSpecies(sp.vietnameseName, sp.scientificName);
        if (canonical.isBird || isBirdSpecies(sp)) {
          birdsCount += count;
        } else {
          mammalsCount += count;
        }
      });
    });

    const total = mammalsCount + birdsCount || 1;

    return {
      mammalsCount,
      birdsCount,
      total,
      mammalsPct: Math.round((mammalsCount / total) * 100),
      birdsPct: Math.round((birdsCount / total) * 100),
    };
  }, [filteredFacilities]);

  // 4. Decrease Reasons Breakdown (Commercial vs Loss/Death vs Other)
  const decreaseReasons = useMemo(() => {
    let sold = 0;
    let death = 0;
    let transfer = 0;
    let other = 0;

    filteredFacilities.forEach((fac) => {
      (fac.speciesList || []).forEach((sp) => {
        const processedRows = computeLogbookTable(sp.baseline || {}, sp.fluctuations || []);
        processedRows.forEach((row) => {
          if (row.isBaseline || !row.date) return;
          const dec =
            (row.decFather || 0) +
            (row.decMother || 0) +
            (row.decOtherMale || 0) +
            (row.decOtherFemale || 0) +
            (row.decOtherUnknown || 0);

          if (dec > 0) {
            const reason = (row.reason || '').toLowerCase();
            if (reason.includes('xuất bán') || reason.includes('bán')) {
              sold += dec;
            } else if (reason.includes('chết') || reason.includes('bệnh') || reason.includes('rủi ro') || reason.includes('sổng')) {
              death += dec;
            } else if (reason.includes('tặng') || reason.includes('chuyển') || reason.includes('nhượng')) {
              transfer += dec;
            } else {
              other += dec;
            }
          }
        });
      });
    });

    const totalDec = sold + death + transfer + other || 1;

    return {
      sold,
      death,
      transfer,
      other,
      totalDec,
      soldPct: Math.round((sold / totalDec) * 100),
      deathPct: Math.round((death / totalDec) * 100),
      transferPct: Math.round((transfer / totalDec) * 100),
    };
  }, [filteredFacilities]);

  // Combo Chart Configurations (Bar + Line)
  // Calculate max values for bar Y-axis scaling to prevent overlapping with line chart
  const maxBarVal = useMemo(() => {
    let max = 0;
    chartData.targetStats.forEach((s) => {
      if (s.inc > max) max = s.inc;
      if (s.dec > max) max = s.dec;
    });
    return max === 0 ? 10 : max;
  }, [chartData]);

  // Combo Chart Configurations (Bar + Line)
  const mainChartDataConfig = {
    labels: chartData.targetStats.map((s) => s.monthLabel),
    datasets: [
      {
        type: 'line',
        label: 'Quy mô tổng đàn (Con)',
        data: chartData.targetStats.map((s) => s.totalEnd),
        borderColor: '#0284c7', // Sky Blue 600
        backgroundColor: 'rgba(2, 132, 199, 0.12)',
        borderWidth: 3.5,
        tension: 0.35,
        fill: true,
        yAxisID: 'y1',
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#0284c7',
        pointBorderWidth: 3,
        order: 1,
      },
      {
        type: 'bar',
        label: 'Số lượng Tăng đàn (+)',
        data: chartData.targetStats.map((s) => s.inc),
        backgroundColor: '#10b981', // Emerald 500
        hoverBackgroundColor: '#059669',
        borderRadius: { topLeft: 6, topRight: 6 },
        maxBarThickness: 28,
        categoryPercentage: 0.65,
        barPercentage: 0.75,
        yAxisID: 'y',
        order: 2,
      },
      {
        type: 'bar',
        label: 'Số lượng Giảm đàn (-)',
        data: chartData.targetStats.map((s) => s.dec),
        backgroundColor: '#f43f5e', // Rose 500
        hoverBackgroundColor: '#e11d48',
        borderRadius: { topLeft: 6, topRight: 6 },
        maxBarThickness: 28,
        categoryPercentage: 0.65,
        barPercentage: 0.75,
        yAxisID: 'y',
        order: 2,
      },
    ],
  };

  const mainChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'center',
        labels: {
          font: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' },
          usePointStyle: true,
          padding: 15,
          boxWidth: 8,
          boxHeight: 8,
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { size: 12, weight: 'bold', family: 'Plus Jakarta Sans' },
        bodyFont: { size: 11, family: 'Plus Jakarta Sans' },
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.dataset.type === 'bar') {
                const isInc = context.datasetIndex === 1;
                label += `${isInc ? '+' : '-'}${context.parsed.y} con`;
              } else {
                label += `${context.parsed.y.toLocaleString('vi-VN')} con`;
              }
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' },
          color: '#475569',
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Biến động (+/- con)',
          font: { size: 10, weight: 'bold' },
          color: '#64748b',
        },
        suggestedMin: 0,
        suggestedMax: Math.ceil(maxBarVal * 2.5),
        grid: { color: '#f1f5f9' },
        ticks: {
          font: { size: 10, weight: 'bold' },
          color: '#64748b',
          precision: 0,
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Tổng quy mô đàn (con)',
          font: { size: 10, weight: 'bold' },
          color: '#0284c7',
        },
        grid: { drawOnChartArea: false },
        ticks: {
          font: { size: 10, weight: 'bold' },
          color: '#0284c7',
          callback: function (val) {
            return val.toLocaleString('vi-VN');
          },
        },
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
  const handleExportAnalyticsExcel = async () => {
    const XLSX = await import('xlsx');
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
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-300">
      {/* 1. Executive Toolbar Header (Light, Clean & Cohesive) */}
      <div className="bg-white rounded-2xl p-4 sm:px-5 sm:py-4 shadow-2xs border border-slate-200/90 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 relative overflow-hidden">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Báo cáo thống kê & Diễn biến đàn nuôi
              </h2>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                Năm {selectedYear}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Theo dõi tốc độ sinh sản, tăng giảm cá thể theo từng tháng, 6 tháng (H1/H2) và cả năm
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportAnalyticsExcel}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md active:scale-95 w-full sm:w-auto cursor-pointer flex-shrink-0"
        >
          <Download className="w-4 h-4 stroke-[2.2]" />
          <span>Xuất báo cáo Excel</span>
        </button>
      </div>

      {/* 2. Filter & Time Mode Controls Bar (Placed ABOVE KPIs per UX Best Practices) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:px-4 sm:py-3 flex flex-col md:flex-row items-center justify-between gap-2.5 shadow-2xs">
        {/* Time Mode Segmented Switcher */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold w-full md:w-auto overflow-x-auto scrollbar-none whitespace-nowrap">
          <button
            type="button"
            onClick={() => setTimeMode('YEAR')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              timeMode === 'YEAR' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Cả năm {selectedYear}</span>
          </button>
          <button
            type="button"
            onClick={() => setTimeMode('H1')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              timeMode === 'H1' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            6 tháng đầu (H1)
          </button>
          <button
            type="button"
            onClick={() => setTimeMode('H2')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              timeMode === 'H2' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            6 tháng cuối (H2)
          </button>
          <button
            type="button"
            onClick={() => setTimeMode('MONTH')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              timeMode === 'MONTH' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            Theo tháng
          </button>
        </div>

        {/* Month + Geographic & Category Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs w-full md:w-auto justify-end">
          {timeMode === 'MONTH' && (
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Tháng {i + 1} / {selectedYear}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Commune Filter */}
          <div className="relative flex items-center flex-1 sm:flex-initial">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 absolute left-2.5 pointer-events-none" />
            <select
              value={selectedCommune}
              onChange={(e) => setSelectedCommune(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl pl-7 pr-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer transition-colors"
            >
              <option value="ALL">Tất cả 5 Xã</option>
              {COMMUNES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="relative flex items-center flex-1 sm:flex-initial">
            <Filter className="w-3.5 h-3.5 text-emerald-600 absolute left-2.5 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl pl-7 pr-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer transition-colors"
            >
              <option value="ALL">Tất cả nhóm loài</option>
              <option value="MAMMAL_REPTILE">Động vật Lớp Thú</option>
              <option value="BIRD">Động vật Lớp Chim</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. KPI Cards (Unified Modern Bento Style) - 5 Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Animals Card */}
        <div className="bg-white border border-slate-200/90 hover:border-emerald-300/80 rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Quy mô hiện tại</span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-mono tracking-tight">
              {chartData.finalTotal.toLocaleString('vi-VN')} <span className="text-[11px] font-sans font-medium text-slate-400">con</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:block mt-0.5">Toàn bộ các cơ sở</span>
          </div>
          <div className="p-2.5 bg-slate-100 text-slate-700 rounded-xl border border-slate-200/70">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>

        {/* Real Increase Card */}
        <div className="bg-white border border-slate-200/90 hover:border-emerald-300/80 rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Tổng tăng thực tế</span>
            <div className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1 font-mono tracking-tight">
              +{kpiStats.realInc} <span className="text-[11px] font-sans font-medium text-slate-400">con</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:block mt-0.5">Sinh sản & Nhập ngoài</span>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200/70">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Real Decrease Card (Leaving Facility) */}
        <div className="bg-white border border-slate-200/90 hover:border-rose-300/80 rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Giảm thực tế (Rời đàn)</span>
            <div className="text-xl sm:text-2xl font-bold text-rose-600 mt-1 font-mono tracking-tight">
              -{kpiStats.realDec} <span className="text-[11px] font-sans font-medium text-slate-400">con</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:block mt-0.5">
              Bán: <strong className="text-slate-700">{kpiStats.totalSold}</strong> · Chết: <strong className="text-slate-700">{kpiStats.totalDeath}</strong>
              {kpiStats.totalTransferOut > 0 && <> · Tặng: <strong className="text-slate-700">{kpiStats.totalTransferOut}</strong></>}
              {kpiStats.totalOtherDec > 0 && <> · Khác: <strong className="text-slate-700">{kpiStats.totalOtherDec}</strong></>}
            </span>
          </div>
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-200/70">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        {/* Internal Group Transfer Card (Net 0) */}
        <div className="bg-white border border-slate-200/90 hover:border-amber-300/80 rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Luân chuyển nội bộ</span>
            <div className="text-xl sm:text-2xl font-bold text-amber-600 mt-1 font-mono tracking-tight">
              {kpiStats.internalTransferCount} <span className="text-[11px] font-sans font-medium text-slate-400">con</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:block mt-0.5">Chuyển sang bố mẹ</span>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-200/70">
            <RefreshCw className="w-5 h-5" />
          </div>
        </div>

        {/* Net Growth Card */}
        <div className="bg-white border border-slate-200/90 hover:border-indigo-300/80 rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Tăng trưởng ròng</span>
            <div className={`text-xl sm:text-2xl font-bold mt-1 font-mono tracking-tight ${kpiStats.netGrowth >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
              {kpiStats.netGrowth >= 0 ? `+${kpiStats.netGrowth}` : kpiStats.netGrowth} <span className="text-[11px] font-sans font-medium text-slate-400">con</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:block mt-0.5">Tăng thực - Giảm thực</span>
          </div>
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-200/70">
            <Award className="w-5 h-5" />
          </div>
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
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>Thống kê cơ cấu quy mô các loài nuôi chủ lực</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Sắp xếp theo tổng số lượng cá thể hiện có tại các cơ sở
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {speciesBreakdown.map((sp, idx) => (
            <div
              key={sp.name}
              className="bg-slate-50/70 hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-200 rounded-xl p-3 flex items-center justify-between transition-colors"
            >
              <div className="space-y-0.5 min-w-0 pr-2">
                <span className="text-[10px] font-semibold text-slate-400 font-mono block">
                  #{String(idx + 1).padStart(2, '0')} · {sp.isBird ? 'Lớp Chim' : 'Lớp Thú'}
                </span>
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {sp.name}
                </h4>
              </div>
              <span className="text-sm sm:text-base font-bold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/70 flex-shrink-0">
                {sp.total}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2 Grid Columns Section: Top 5 Facilities & Gender / Age Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        {/* Top 5 Facilities Leaderboard (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>Top 5 cơ sở nuôi quy mô lớn nhất huyện</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Xếp hạng các cơ sở theo tổng số lượng cá thể đang quản lý
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {topFacilities.map((fac, rank) => {
                const pct = chartData.finalTotal > 0 ? Math.round((fac.totalAnimals / chartData.finalTotal) * 100) : 0;
                const badgeColors = [
                  'bg-amber-100 text-amber-800 border-amber-300 font-bold',
                  'bg-slate-200 text-slate-700 border-slate-300 font-bold',
                  'bg-amber-700/10 text-amber-900 border-amber-300 font-bold',
                  'bg-slate-100 text-slate-600 border-slate-200 font-semibold',
                  'bg-slate-100 text-slate-600 border-slate-200 font-semibold',
                ];

                return (
                  <div key={fac.id} className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 space-y-2 hover:bg-emerald-50/40 hover:border-emerald-200/80 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center border flex-shrink-0 ${badgeColors[rank]}`}>
                          #{rank + 1}
                        </span>
                        <div className="truncate">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {fac.facilityName}
                          </h4>
                          <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                            <span>Chủ hộ: {fac.ownerName}</span>
                            <span>·</span>
                            <MapPin className="w-3 h-3 text-emerald-600 inline" />
                            <span>{fac.commune}</span>
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="text-sm sm:text-base font-bold font-mono text-emerald-700">
                          {fac.totalAnimals} <span className="text-[10px] font-sans font-normal text-slate-400">con</span>
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(5, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Gender & Breed Ratio Breakdown per Species (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Card Header with Title and Species Select Dropdown */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 gap-2 flex-wrap">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Feather className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Cấu trúc đàn & Giới tính</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Tỷ lệ Bố / Mẹ sinh sản & Động vật non / Hậu bị
                </p>
              </div>

              {/* Species Selector Dropdown */}
              <select
                value={selectedBreedingSpecies}
                onChange={(e) => setSelectedBreedingSpecies(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 font-semibold text-slate-800 px-2.5 py-1.5 rounded-xl outline-none focus:border-emerald-500 cursor-pointer max-w-[200px] truncate"
              >
                <option value="ALL">Tất cả loài (Toàn huyện)</option>
                {speciesBreedingStats.speciesList.map((sp) => (
                  <option key={sp.name} value={sp.name}>
                    {sp.name} ({sp.grandTotal} con)
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Horizontal Species Tabs / Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedBreedingSpecies('ALL')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedBreedingSpecies === 'ALL'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                Tất cả loài
              </button>
              {speciesBreedingStats.speciesList.map((sp) => (
                <button
                  type="button"
                  key={sp.name}
                  onClick={() => setSelectedBreedingSpecies(sp.name)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    selectedBreedingSpecies === sp.name
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                  }`}
                >
                  {sp.name}
                </button>
              ))}
            </div>

            {/* Selected Species Information Header Badge */}
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl px-3 py-2.5 flex items-center justify-between text-xs">
              <div className="min-w-0">
                <span className="font-bold text-slate-900 truncate block">
                  {currentBreedingData.name}
                  {currentBreedingData.scientificName && currentBreedingData.scientificName !== 'Tổng hợp toàn huyện' && (
                    <span className="text-[11px] font-normal italic text-slate-500 ml-1.5">
                      ({currentBreedingData.scientificName})
                    </span>
                  )}
                </span>
                <span className="text-[11px] text-slate-500">
                  {selectedBreedingSpecies === 'ALL' ? `${facilitiesList.length} cơ sở toàn huyện` : `Phân bố tại ${currentBreedingData.facilitiesCount} cơ sở nuôi`}
                </span>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-[10px] font-semibold text-slate-400 block">Tổng đàn</span>
                <strong className="text-sm font-bold text-emerald-700 font-mono">
                  {currentBreedingData.grandTotal.toLocaleString('vi-VN')} <span className="text-[10px] font-sans font-normal text-slate-500">con</span>
                </strong>
              </div>
            </div>

            {/* Father & Mother 2-col Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-center">
              <div className="bg-sky-50/70 border border-sky-200/80 rounded-xl p-2.5">
                <span className="text-[11px] font-semibold text-sky-700 block">Đực bố (♂)</span>
                <span className="text-lg font-bold text-sky-900 font-mono">{currentBreedingData.father}</span>
                <span className="text-[10px] text-sky-600 block mt-0.5">{currentBreedingData.fatherPct}% đàn</span>
              </div>

              <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-2.5">
                <span className="text-[11px] font-semibold text-rose-700 block">Cái mẹ (♀)</span>
                <span className="text-lg font-bold text-rose-900 font-mono">{currentBreedingData.mother}</span>
                <span className="text-[10px] text-rose-600 block mt-0.5">{currentBreedingData.motherPct}% đàn</span>
              </div>
            </div>

            {/* Breeding Ratio Box for this specific species */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-emerald-900 block">Tỷ lệ phối giống sinh sản</span>
                <span className="text-[11px] text-emerald-700">
                  {selectedBreedingSpecies === 'ALL' ? 'Trung bình chung: 1 Đực bố phối với' : `Tỷ lệ ghép giống của ${currentBreedingData.name}:`}
                </span>
              </div>
              <span className="text-sm sm:text-base font-bold text-emerald-900 font-mono bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                {currentBreedingData.father > 0 ? `1 ♂ : ${currentBreedingData.ratioMotherToFather} ♀` : 'Chưa có đực bố'}
              </span>
            </div>

            {/* Young / Sub-adults breakdown */}
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-2.5 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-700 font-medium">
                <span>Đàn non / Hậu bị / Khác:</span>
                <strong className="font-mono text-slate-900">{currentBreedingData.youngTotal} con ({currentBreedingData.youngPct}%)</strong>
              </div>
              <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-slate-200/80 text-[11px] text-slate-600">
                <div className="bg-white p-1.5 rounded-lg border border-slate-200/70 text-center">
                  <span className="block text-[10px] text-slate-400">Đực hậu bị</span>
                  <strong className="font-mono text-sky-700">{currentBreedingData.otherMale || 0}</strong>
                </div>
                <div className="bg-white p-1.5 rounded-lg border border-slate-200/70 text-center">
                  <span className="block text-[10px] text-slate-400">Cái hậu bị</span>
                  <strong className="font-mono text-rose-700">{currentBreedingData.otherFemale || 0}</strong>
                </div>
                <div className="bg-white p-1.5 rounded-lg border border-slate-200/70 text-center">
                  <span className="block text-[10px] text-slate-400">Chưa rõ tính</span>
                  <strong className="font-mono text-slate-700">{currentBreedingData.otherUnknown || 0}</strong>
                </div>
              </div>
            </div>

            {/* Toggle Button for Species Comparison Table */}
            <button
              type="button"
              onClick={() => setShowSpeciesBreedingTable(!showSpeciesBreedingTable)}
              className="w-full flex items-center justify-between px-3 py-2 bg-slate-100/80 hover:bg-slate-200/70 rounded-xl text-xs font-semibold text-slate-700 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-emerald-700">
                <Layers className="w-3.5 h-3.5" />
                <span>Bảng so sánh cơ cấu đàn tất cả các loài ({speciesBreedingStats.speciesList.length} loài)</span>
              </div>
              {showSpeciesBreedingTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Expandable Species Comparison Table */}
            {showSpeciesBreedingTable && (
              <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-600 font-bold sticky top-0 border-b border-slate-200 text-[10px] uppercase">
                    <tr>
                      <th className="p-2">Tên loài</th>
                      <th className="p-2 text-center">Tổng</th>
                      <th className="p-2 text-center text-sky-700">Đực bố</th>
                      <th className="p-2 text-center text-rose-700">Cái mẹ</th>
                      <th className="p-2 text-center text-emerald-700">Tỷ lệ ♂:♀</th>
                      <th className="p-2 text-center">Hậu bị/Non</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {speciesBreedingStats.speciesList.map((sp) => (
                      <tr
                        key={sp.name}
                        onClick={() => setSelectedBreedingSpecies(sp.name)}
                        className={`hover:bg-emerald-50/50 cursor-pointer transition-colors ${
                          selectedBreedingSpecies === sp.name ? 'bg-emerald-50 font-semibold' : ''
                        }`}
                      >
                        <td className="p-2">
                          <strong className="text-slate-900">{sp.name}</strong>
                          <span className="block text-[10px] text-slate-400 font-normal italic">{sp.scientificName}</span>
                        </td>
                        <td className="p-2 text-center font-mono font-bold text-slate-800">{sp.grandTotal}</td>
                        <td className="p-2 text-center font-mono text-sky-700">{sp.father}</td>
                        <td className="p-2 text-center font-mono text-rose-700">{sp.mother}</td>
                        <td className="p-2 text-center font-mono font-bold text-emerald-700">
                          {sp.father > 0 ? `1 : ${sp.ratioMotherToFather}` : '---'}
                        </td>
                        <td className="p-2 text-center font-mono text-slate-600">{sp.youngTotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2 Grid Columns Section: Animal Class Classification & Decrease Reasons Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        {/* Animal Class Classification: Lớp Thú (Mammalia) & Lớp Chim (Aves) (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Phân loại theo Lớp Động vật (Thú & Chim)</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Cơ cấu số lượng cá thể giữa Lớp Thú (Mammalia) và Lớp Chim (Aves)
                </p>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                Lớp sinh học
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Lớp Thú - Mammalia */}
              <div className="bg-amber-50/50 border border-amber-200/70 rounded-xl p-3 space-y-1.5 transition-all">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    <span>Động vật Lớp Thú - Mammalia (Dúi, Cầy, Nhím, Don...)</span>
                  </span>
                  <strong className="font-mono text-amber-900 font-bold text-sm whitespace-nowrap">
                    {animalClassBreakdown.mammalsCount.toLocaleString('vi-VN')} con ({animalClassBreakdown.mammalsPct}%)
                  </strong>
                </div>
                <div className="w-full bg-amber-200/50 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${animalClassBreakdown.mammalsPct}%` }}
                  />
                </div>
              </div>

              {/* Lớp Chim - Aves */}
              <div className="bg-emerald-50/50 border border-emerald-200/70 rounded-xl p-3 space-y-1.5 transition-all">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    <span>Động vật Lớp Chim - Aves (Chim chào mào, cu gáy...)</span>
                  </span>
                  <strong className="font-mono text-emerald-900 font-bold text-sm whitespace-nowrap">
                    {animalClassBreakdown.birdsCount.toLocaleString('vi-VN')} con ({animalClassBreakdown.birdsPct}%)
                  </strong>
                </div>
                <div className="w-full bg-emerald-200/50 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${animalClassBreakdown.birdsPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decrease Reasons Analysis (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>Phân tích lý do giảm đàn trong kỳ</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Tỷ lệ giữa xuất bán thương mại, chuyển nhượng và rủi ro bệnh/chết
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center text-xs pt-1">
              <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-xl p-3 space-y-1">
                <span className="text-[11px] font-semibold text-emerald-800 block">Xuất bán</span>
                <span className="text-lg font-bold text-emerald-900 font-mono block">{decreaseReasons.sold} con</span>
                <span className="text-[11px] text-emerald-700 block font-medium">{decreaseReasons.soldPct}%</span>
              </div>

              <div className="bg-rose-50/60 border border-rose-200/70 rounded-xl p-3 space-y-1">
                <span className="text-[11px] font-semibold text-rose-800 block">Rủi ro / Chết</span>
                <span className="text-lg font-bold text-rose-900 font-mono block">{decreaseReasons.death} con</span>
                <span className="text-[11px] text-rose-700 block font-medium">{decreaseReasons.deathPct}%</span>
              </div>

              <div className="bg-sky-50/60 border border-sky-200/70 rounded-xl p-3 space-y-1">
                <span className="text-[11px] font-semibold text-sky-800 block">Chuyển nhượng</span>
                <span className="text-lg font-bold text-sky-900 font-mono block">{decreaseReasons.transfer} con</span>
                <span className="text-[11px] text-sky-700 block font-medium">{decreaseReasons.transferPct}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
