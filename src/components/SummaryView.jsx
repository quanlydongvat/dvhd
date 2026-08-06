import React, { useState, useMemo } from 'react';
import { Building2, Search, Filter, ArrowRight, Download, Feather, ShieldCheck, MapPin, FileText, Table, ChevronDown, ChevronRight, CheckSquare, Square, Eye, EyeOff, Layers, Check } from 'lucide-react';
import * as XLSX from 'xlsx';
import { isBirdSpecies, getFacilityCategory } from '../utils/calculations';
import CitesSummaryTable from './CitesSummaryTable';

export default function SummaryView({
  facilitiesList = [],
  activeFacilityId,
  onSelectFacility,
  onOpenAddFacility,
  onOpenMapFacility,
}) {

  const [summarySubTab, setSummarySubTab] = useState('TABLE_1_1'); // 'TABLE_1_1' | 'TABLE_1_2'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL'); // 'ALL' | 'MAMMAL_REPTILE' | 'BIRD'


  const COMMUNES = ['xã Hòa Sơn', 'xã Yang Mao', 'xã Cư Pui', 'Xã Krông Bông', 'Xã Dang Kang'];

  // State: Expanded state for each Commune accordion (default: ALL COLLAPSED so main page is clean & summarized)
  const [expandedCommunes, setExpandedCommunes] = useState(() => {
    const init = {};
    COMMUNES.forEach((c) => (init[c] = false));
    return init;
  });

  // State: Facility Selection Filter (IDs of specific facilities user wants to show)
  const [selectedFacilityIds, setSelectedFacilityIds] = useState(() => facilitiesList.map((f) => f.id));
  const [isFacilityPickerOpen, setIsFacilityPickerOpen] = useState(false);
  const [facilitySearchTerm, setFacilitySearchTerm] = useState('');

  // Handle Commune Selection Click
  const handleCommuneSelect = (communeName) => {
    if (selectedCommune === communeName) {
      // Toggle off -> collapse all & show summary overview
      setSelectedCommune('ALL');
      const next = {};
      COMMUNES.forEach((c) => (next[c] = false));
      setExpandedCommunes(next);
    } else {
      // Select commune -> expand ONLY this commune
      setSelectedCommune(communeName);
      const next = {};
      COMMUNES.forEach((c) => (next[c] = c === communeName));
      setExpandedCommunes(next);
    }
  };

  // Toggle Commune Expand/Collapse manually
  const toggleCommuneExpand = (communeName) => {
    setExpandedCommunes((prev) => ({
      ...prev,
      [communeName]: !prev[communeName],
    }));
  };

  const expandAllCommunes = () => {
    const next = {};
    COMMUNES.forEach((c) => (next[c] = true));
    setExpandedCommunes(next);
  };

  const collapseAllCommunes = () => {
    const next = {};
    COMMUNES.forEach((c) => (next[c] = false));
    setExpandedCommunes(next);
  };

  // Toggle Individual Facility Selection
  const toggleFacilitySelected = (facId) => {
    setSelectedFacilityIds((prev) => {
      if (prev.includes(facId)) {
        return prev.filter((id) => id !== facId);
      } else {
        return [...prev, facId];
      }
    });
  };

  const selectAllFacilities = () => {
    setSelectedFacilityIds(facilitiesList.map((f) => f.id));
  };

  const deselectAllFacilities = () => {
    setSelectedFacilityIds([]);
  };

  const selectCommuneFacilities = (communeName) => {
    const communeFacIds = facilitiesList.filter((f) => (f.commune || '') === communeName).map((f) => f.id);
    setSelectedFacilityIds(communeFacIds);
  };

  // Categorize & Filter facilities
  const filteredFacilities = facilitiesList.filter((fac) => {
    const matchSelectedFacility = selectedFacilityIds.includes(fac.id);

    const matchSearch =
      fac.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.registrationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.speciesList.some((sp) => sp.vietnameseName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchCommune = selectedCommune === 'ALL' || fac.commune === selectedCommune;

    const cat = getFacilityCategory(fac);
    let matchCategory = true;
    if (selectedCategory === 'BIRD') {
      matchCategory = cat === 'BIRD' || cat === 'MIXED';
    } else if (selectedCategory === 'MAMMAL_REPTILE') {
      matchCategory = cat === 'MAMMAL_REPTILE' || cat === 'MIXED';
    }

    return matchSelectedFacility && matchSearch && matchCommune && matchCategory;
  });


  // Calculate totals
  let grandTotal = 0;
  let grandFather = 0;
  let grandMother = 0;
  let grandMale = 0;
  let grandFemale = 0;
  let grandUnknown = 0;
  let birdFacilitiesCount = 0;
  let mammalFacilitiesCount = 0;

  facilitiesList.forEach((fac) => {
    const cat = getFacilityCategory(fac);
    if (cat === 'BIRD') birdFacilitiesCount++;
    else mammalFacilitiesCount++;

    fac.speciesList.forEach((sp) => {
      const b = sp.baseline || {};
      const father = Number(b.father) || 0;
      const mother = Number(b.mother) || 0;
      const otherMale = Number(b.otherMale) || 0;
      const otherFemale = Number(b.otherFemale) || 0;
      const otherUnknown = Number(b.otherUnknown) || 0;

      const total = father + mother + otherMale + otherFemale + otherUnknown;

      grandTotal += total;
      grandFather += father;
      grandMother += mother;
      grandMale += otherMale;
      grandFemale += otherFemale;
      grandUnknown += otherUnknown;
    });
  });

  // Group facilities by Commune
  const groupedByCommune = COMMUNES.map((communeName) => {
    const communeFacs = filteredFacilities.filter((f) => (f.commune || '') === communeName);
    
    // Subtotals for commune
    let communeTotalAnimals = 0;
    let communeBirdFacs = 0;
    let communeMammalFacs = 0;

    communeFacs.forEach((fac) => {
      const cat = getFacilityCategory(fac);
      if (cat === 'BIRD') communeBirdFacs++;
      else communeMammalFacs++;

      fac.speciesList.forEach((sp) => {
        const b = sp.baseline || {};
        communeTotalAnimals += (b.father || 0) + (b.mother || 0) + (b.otherMale || 0) + (b.otherFemale || 0) + (b.otherUnknown || 0);
      });
    });

    return {
      communeName,
      facilities: communeFacs,
      totalAnimals: communeTotalAnimals,
      birdFacs: communeBirdFacs,
      mammalFacs: communeMammalFacs,
    };
  });

  // Export summary to Excel (grouped by Commune & Category)
  const handleExportSummaryExcel = () => {
    const sheetData = [];
    sheetData.push(['BẢNG TỔNG HỢP DANH SÁCH CÁC CƠ SỞ NUÔI ĐỘNG VẬT HOANG DÃ THEO XÃ & NHÓM LOÀI']);
    sheetData.push(['Huyện Krông Bông - Tỉnh Đắk Lắk']);
    sheetData.push([]);

    sheetData.push([
      'STT',
      'Xã',
      'Phân nhóm loài',
      'Thôn/Buôn/TDP',
      'Họ tên chủ nuôi',
      'Tên tiếng Việt',
      'Tên khoa học',
      'Tổng số',
      'Bố (Đực)',
      'Mẹ (Cái)',
      'Đực khác',
      'Cái khác',
      'Chưa XĐ',
      'Mã số CS BTĐDSH',
      'Ngày cấp mã số',
      'Mục đích nuôi',
      'Ghi chú'
    ]);

    let stt = 1;
    groupedByCommune.forEach((communeGroup) => {
      communeGroup.facilities.forEach((fac) => {
        const facCat = getFacilityCategory(fac);
        const catLabel = facCat === 'BIRD' ? 'Nhóm Chim' : 'Nhóm Thú / Bò sát';

        fac.speciesList.forEach((sp) => {
          const b = sp.baseline || {};
          const total = (b.father || 0) + (b.mother || 0) + (b.otherMale || 0) + (b.otherFemale || 0) + (b.otherUnknown || 0);

          sheetData.push([
            stt++,
            fac.commune || '',
            catLabel,
            fac.address ? fac.address.split(',')[0] : '',
            fac.ownerName,
            sp.vietnameseName,
            sp.scientificName,
            total,
            b.father || 0,
            b.mother || 0,
            b.otherMale || 0,
            b.otherFemale || 0,
            b.otherUnknown || 0,
            fac.registrationCode,
            fac.registrationDate || '',
            sp.purposeCode || fac.purposeCode || 'T',
            fac.note || ''
          ]);
        });
      });
    });

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tong_Hop_Co_So_Theo_Xa');
    XLSX.writeFile(wb, `Bang_Tong_Hop_Co_So_Theo_Xa_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-2xl p-6 shadow-lg text-white flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-200">
            <Building2 className="w-4 h-4 text-emerald-200" />
            <span>Quản Lý Tổng Hợp Các Cơ Sở Nuôi Động Vật Hoang Dã Phân Theo Xã</span>
          </div>
          <p className="text-xs text-emerald-100 mt-1">
            Quản lý tổng số 31 cơ sở (21 cơ sở Thú/Bò sát & 10 cơ sở Chim cảnh) thuộc 5 Xã địa bàn Hạt Kiểm lâm khu vực Krông Bông quản lý
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 text-xs">
          <div className="text-center p-2 bg-white/10 rounded-lg">
            <span className="text-emerald-100 block text-[11px]">Tổng số cơ sở:</span>
            <span className="text-xl font-extrabold text-white">{facilitiesList.length} CS</span>
          </div>
          <div className="text-center p-2 bg-white/10 rounded-lg">
            <span className="text-emerald-100 block text-[11px]">Tổng cá thể:</span>
            <span className="text-xl font-extrabold text-amber-300">{grandTotal}</span>
          </div>
          <div className="text-center p-2 bg-white/10 rounded-lg">
            <span className="text-emerald-100 block text-[11px]">🦔 Nhóm Thú / Bò sát:</span>
            <span className="text-sm font-bold text-teal-100">{mammalFacilitiesCount} cơ sở</span>
          </div>
          <div className="text-center p-2 bg-white/10 rounded-lg">
            <span className="text-emerald-100 block text-[11px]">🦜 Nhóm Chim:</span>
            <span className="text-sm font-bold text-amber-200">{birdFacilitiesCount} cơ sở</span>
          </div>
        </div>
      </div>

      {/* Table Format Sub-Tabs Switcher (Bảng 1.1 vs Bảng 1.2) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-100/90 p-2 rounded-2xl border border-slate-200 shadow-inner">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setSummarySubTab('TABLE_1_1')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all w-full sm:w-auto justify-center ${
              summarySubTab === 'TABLE_1_1'
                ? 'bg-white text-emerald-800 shadow-md border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Table className="w-4 h-4 text-emerald-600" />
            <span>Bảng 1.1: Danh Sách Chi Tiết 31 Cơ Sở Nuôi</span>
          </button>

          <button
            onClick={() => setSummarySubTab('TABLE_1_2')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all w-full sm:w-auto justify-center ${
              summarySubTab === 'TABLE_1_2'
                ? 'bg-white text-indigo-800 shadow-md border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Bảng 1.2: Tổng Hợp Loài CITES & Động Vật Thông Thường</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium px-2">
          {summarySubTab === 'TABLE_1_1'
            ? '📌 Hiển thị bảng chi tiết danh sách cơ sở nuôi nhóm theo 5 xã'
            : '📌 Hiển thị mẫu tổng hợp loài nguy cấp/CITES & thông thường theo chuẩn Thông tư số 85/2025/TT-BNNMT'}
        </div>
      </div>

      {/* Render Bảng 1.2 if selected */}
      {summarySubTab === 'TABLE_1_2' ? (
        <CitesSummaryTable facilitiesList={facilitiesList} />
      ) : (
        <>


      {/* 5 Communes Overview Cards (Gom cơ sở theo từng xã - Redesigned for ultra visual appeal) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {COMMUNES.map((communeName) => {
          const communeFacsAll = facilitiesList.filter((f) => (f.commune || '') === communeName);
          const isSelected = selectedCommune === communeName;
          
          let cBirds = 0;
          let cMammals = 0;
          let cTotalAnimals = 0;

          communeFacsAll.forEach((f) => {
            if (getFacilityCategory(f) === 'BIRD') cBirds++;
            else cMammals++;

            f.speciesList.forEach((sp) => {
              const b = sp.baseline || {};
              cTotalAnimals += (b.father || 0) + (b.mother || 0) + (b.otherMale || 0) + (b.otherFemale || 0) + (b.otherUnknown || 0);
            });
          });

          return (
            <button
              key={communeName}
              onClick={() => handleCommuneSelect(communeName)}
              className={`p-4 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group shadow-md flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-emerald-600 via-teal-600 to-indigo-700 text-white border-emerald-400 shadow-xl ring-2 ring-emerald-400 scale-[1.03]'
                  : 'bg-gradient-to-br from-white to-slate-50 hover:to-emerald-50/40 border-slate-200 text-slate-800 hover:border-emerald-400 hover:shadow-xl hover:scale-[1.02]'
              }`}
            >
              {/* Background Decorative Glow */}
              <div
                className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-2xl transition-all ${
                  isSelected ? 'bg-amber-300/30' : 'bg-emerald-500/10 group-hover:bg-emerald-500/20'
                }`}
              />

              <div className="relative z-10 space-y-2 w-full">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-black uppercase tracking-wider flex items-center gap-1 ${
                      isSelected ? 'text-emerald-100' : 'text-emerald-800'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{communeName}</span>
                  </span>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-2xs ${
                      isSelected
                        ? 'bg-white/20 text-white border border-white/30 backdrop-blur-sm'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    }`}
                  >
                    {communeFacsAll.length} CS
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div
                    className={`text-2xl font-black font-mono tracking-tight ${
                      isSelected ? 'text-amber-300' : 'text-slate-900'
                    }`}
                  >
                    {cTotalAnimals}{' '}
                    <span className={`text-xs font-sans font-semibold ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                      cá thể
                    </span>
                  </div>

                  {isSelected && (
                    <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-2xs">
                      Đang xem
                    </span>
                  )}
                </div>

                <div
                  className={`pt-2.5 border-t text-[11px] flex items-center justify-between font-bold ${
                    isSelected ? 'border-white/20 text-emerald-100' : 'border-slate-200/80 text-slate-600'
                  }`}
                >
                  <span className="flex items-center gap-1">🦔 Thú/Bò sát: <strong className={isSelected ? 'text-white' : 'text-slate-900'}>{cMammals}</strong></span>
                  <span className="flex items-center gap-1">🦜 Chim: <strong className={isSelected ? 'text-amber-300' : 'text-slate-900'}>{cBirds}</strong></span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter and Group Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm tên chủ cơ sở, loài, địa chỉ..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-xs font-medium"
            />
          </div>

          {/* Commune Filter Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={selectedCommune}
              onChange={(e) => setSelectedCommune(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-emerald-500 cursor-pointer shadow-xs"
            >
              <option value="ALL">📍 Tất cả 5 Xã ({facilitiesList.length} cơ sở)</option>
              {COMMUNES.map((c) => (
                <option key={c} value={c}>
                  📍 {c} ({facilitiesList.filter((f) => (f.commune || '') === c).length} CS)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tách Riêng Nhóm Chim vs Nhóm Thú / Bò Sát (Category Segmented Buttons) */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-white/80'
            }`}
          >
            Tất cả nhóm ({facilitiesList.length})
          </button>
          <button
            onClick={() => setSelectedCategory('MAMMAL_REPTILE')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
              selectedCategory === 'MAMMAL_REPTILE'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-white/80'
            }`}
          >
            <span>🦔 Nhóm Thú & Bò Sát ({mammalFacilitiesCount})</span>
          </button>
          <button
            onClick={() => setSelectedCategory('BIRD')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
              selectedCategory === 'BIRD'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-900 hover:bg-white/80'
            }`}
          >
            <Feather className="w-3.5 h-3.5" />
            <span>🦜 Nhóm Chim ({birdFacilitiesCount})</span>
          </button>
        </div>

        <button
          onClick={handleExportSummaryExcel}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] w-full md:w-auto justify-center"
        >
          <Download className="w-4 h-4" />
          <span>Xuất Bảng Excel 5 Xã</span>
        </button>
      </div>

      {/* Interactive Accordion Controls & Facility Picker Bar */}
      <div className="bg-slate-100/90 border border-slate-200 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner text-xs">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <span className="font-extrabold text-slate-700 flex items-center gap-1.5 mr-1">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Quản Lý Hiển Thị Các Cơ Sở:</span>
          </span>

          <button
            onClick={expandAllCommunes}
            className="flex items-center gap-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-slate-200 px-3 py-1.5 rounded-xl font-bold transition-all shadow-xs"
          >
            <ChevronDown className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mở rộng 5 Xã</span>
          </button>

          <button
            onClick={collapseAllCommunes}
            className="flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl font-bold transition-all shadow-xs"
          >
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span>Thu gọn 5 Xã</span>
          </button>
        </div>

        {/* Custom Facility Picker Button */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setIsFacilityPickerOpen(!isFacilityPickerOpen)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-xl font-extrabold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto justify-center"
          >
            <Eye className="w-4 h-4" />
            <span>
              Chọn cơ sở cần hiển thị ({selectedFacilityIds.length}/{facilitiesList.length})
            </span>
          </button>

          {/* Facility Selection Popover Panel */}
          {isFacilityPickerOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-300 rounded-2xl shadow-2xl p-4 z-40 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs">
                  <CheckSquare className="w-4 h-4 text-indigo-600" />
                  <span>Chọn các cơ sở hiển thị trong bảng</span>
                </h4>
                <button
                  onClick={() => setIsFacilityPickerOpen(false)}
                  className="text-slate-400 hover:text-slate-700 text-xs font-bold px-2 py-0.5 rounded-lg bg-slate-100"
                >
                  ✕ Đóng
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-2 text-[11px] font-bold">
                <button
                  onClick={selectAllFacilities}
                  className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-300 hover:bg-emerald-200"
                >
                  ✓ Chọn tất cả ({facilitiesList.length})
                </button>
                <button
                  onClick={deselectAllFacilities}
                  className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-300 hover:bg-slate-200"
                >
                  ✕ Bỏ chọn tất cả
                </button>
              </div>

              {/* Facility Search Input inside Popover */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={facilitySearchTerm}
                  onChange={(e) => setFacilitySearchTerm(e.target.value)}
                  placeholder="Tìm tên hộ nuôi..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-1 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              {/* Facilities Checklist by Commune */}
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1 scrollbar-thin text-xs">
                {COMMUNES.map((cName) => {
                  const cFacs = facilitiesList.filter(
                    (f) =>
                      (f.commune || '') === cName &&
                      f.ownerName.toLowerCase().includes(facilitySearchTerm.toLowerCase())
                  );
                  if (cFacs.length === 0) return null;

                  return (
                    <div key={cName} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        <span>📍 {cName}</span>
                        <button
                          onClick={() => selectCommuneFacilities(cName)}
                          className="text-indigo-600 hover:underline"
                        >
                          Chỉ hiện xã này
                        </button>
                      </div>
                      {cFacs.map((fac) => {
                        const isChecked = selectedFacilityIds.includes(fac.id);
                        return (
                          <label
                            key={fac.id}
                            className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleFacilitySelected(fac.id)}
                              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-slate-900 text-xs truncate">
                                {fac.ownerName}
                              </div>
                              <div className="text-[10px] text-slate-500 truncate">
                                {fac.speciesList.map((s) => s.vietnameseName).join(', ')}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Data Table Grouped by Commune (Accordion Show/Hide) */}
      <div className="space-y-6">
        {groupedByCommune.map((communeGroup) => {
          // If commune has no matching facilities after filter, skip
          if (communeGroup.facilities.length === 0) return null;

          const isExpanded = expandedCommunes[communeGroup.communeName] !== false;
          let communeRunningStt = 1;

          return (
            <div
              key={communeGroup.communeName}
              className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden animate-in fade-in duration-200"
            >
              {/* Commune Group Section Header (Interactive Accordion Toggle) */}
              <div
                onClick={() => toggleCommuneExpand(communeGroup.communeName)}
                className="bg-slate-100/90 hover:bg-slate-200/90 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 cursor-pointer transition-colors select-none"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-emerald-600 text-white rounded-xl font-bold shadow-xs">
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <span>{communeGroup.communeName}</span>
                      <span className="text-xs font-normal normal-case text-slate-500">
                        ({isExpanded ? 'Nhấp để thu gọn' : 'Nhấp để xem danh sách'})
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Đang hiển thị: <strong className="text-emerald-700">{communeGroup.facilities.length} cơ sở</strong> | 🦔 Thú/Bò sát: <strong>{communeGroup.mammalFacs} CS</strong> | 🦜 Chim: <strong>{communeGroup.birdFacs} CS</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-xl border border-emerald-300">
                    Tổng đàn Xã = {communeGroup.totalAnimals} cá thể
                  </div>
                  <span className="text-xs font-extrabold text-indigo-700 hover:underline">
                    {isExpanded ? '📁 Thu gọn xã' : '📂 Xem tất cả cơ sở'}
                  </span>
                </div>
              </div>

              {/* Table Body for this Commune (Shown if Expanded) */}
              {isExpanded && (
                <div className="overflow-x-auto scrollbar-thin animate-in fade-in duration-200">
                  <table className="w-full text-xs text-left border-collapse min-w-[880px]">

                    <thead>
                      <tr className="bg-slate-50 text-slate-800 text-center font-bold border-b border-slate-200">
                        <th rowSpan={2} className="px-1 py-2 border-r border-slate-200 w-8 bg-slate-100 whitespace-nowrap">STT</th>
                        <th rowSpan={2} className="px-1.5 py-2 border-r border-slate-200 w-20 bg-slate-100 whitespace-nowrap">Phân nhóm</th>
                        <th rowSpan={2} className="px-1.5 py-2 border-r border-slate-200 min-w-[125px] max-w-[145px] text-left">Họ tên & Địa chỉ chủ nuôi</th>
                        <th rowSpan={2} className="px-1.5 py-2 border-r border-slate-200 min-w-[110px] max-w-[130px] text-left">Tên tiếng Việt & Khoa học</th>
                        <th rowSpan={2} className="px-1 py-2 border-r border-slate-200 w-12 bg-emerald-100/80 text-emerald-950 font-extrabold whitespace-nowrap">
                          Tổng số<br />
                          <span className="font-mono text-[8px] text-emerald-800">(5=6+..+10)</span>
                        </th>
                        <th colSpan={2} className="px-1 py-1 border-r border-slate-200 bg-teal-100/70 text-teal-950 font-extrabold whitespace-nowrap text-[11px]">Đàn bố mẹ</th>
                        <th colSpan={3} className="px-1 py-1 border-r border-slate-200 bg-indigo-100/70 text-indigo-950 font-extrabold whitespace-nowrap text-[11px]">Cá thể khác</th>
                        <th rowSpan={2} className="px-1.5 py-2 border-r border-slate-200 w-20 text-center">Mã số cơ sở</th>
                        <th rowSpan={2} className="px-1 py-2 border-r border-slate-200 w-16 text-center">Ngày cấp mã số</th>
                        <th rowSpan={2} className="px-0.5 py-2 border-r border-slate-200 w-10 text-center">Mục đích</th>
                        <th rowSpan={2} className="px-1 py-2 border-r border-slate-200 w-16 text-center">Ghi chú</th>
                        <th rowSpan={2} className="px-1 py-2 w-20 text-center whitespace-nowrap">Thao tác</th>
                      </tr>
                      <tr className="bg-slate-50/50 text-slate-700 text-center font-bold border-b border-slate-200">
                        <th className="px-0.5 py-1 border-r border-slate-200 w-8 bg-teal-50 text-teal-900 text-[10px]">Đực (6)</th>
                        <th className="px-0.5 py-1 border-r border-slate-200 w-8 bg-teal-50 text-teal-900 text-[10px]">Cái (7)</th>
                        <th className="px-0.5 py-1 border-r border-slate-200 w-8 bg-indigo-50 text-indigo-900 text-[10px]">Đực (8)</th>
                        <th className="px-0.5 py-1 border-r border-slate-200 w-8 bg-indigo-50 text-indigo-900 text-[10px]">Cái (9)</th>
                        <th className="px-0.5 py-1 border-r border-slate-200 w-9 bg-indigo-50 text-indigo-900 text-[9px]">Chưa XĐ (10)</th>
                      </tr>

                      {/* Underlined Column Numbers Row */}
                      <tr className="bg-slate-100/90 text-slate-600 text-center font-mono text-[9px] italic border-b border-slate-300">
                        <td className="py-0.5 border-r border-slate-300 font-normal">STT</td>
                        <td className="py-0.5 border-r border-slate-300"><u>1</u></td>
                        <td className="py-0.5 border-r border-slate-300"><u>2</u></td>
                        <td className="py-0.5 border-r border-slate-300"><u>3 & 4</u></td>
                        <td className="py-0.5 border-r border-slate-300 font-bold"><u>5=6..10</u></td>
                        <td className="py-0.5 border-r border-slate-300 font-bold"><u>6</u></td>
                        <td className="py-0.5 border-r border-slate-300 font-bold"><u>7</u></td>
                        <td className="py-0.5 border-r border-slate-300 font-bold"><u>8</u></td>
                        <td className="py-0.5 border-r border-slate-300 font-bold"><u>9</u></td>
                        <td className="py-0.5 border-r border-slate-300 font-bold"><u>10</u></td>
                        <td className="py-0.5 border-r border-slate-300"><u>11</u></td>
                        <td className="py-0.5 border-r border-slate-300"><u>12</u></td>
                        <td className="py-0.5 border-r border-slate-300"><u>13</u></td>
                        <td className="py-0.5 border-r border-slate-300"><u>14</u></td>
                        <td className="py-0.5">#</td>
                      </tr>
                    </thead>


                  <tbody className="divide-y divide-slate-200">
                    {communeGroup.facilities.map((fac) => {
                      const isCurrentActive = fac.id === activeFacilityId;
                      const facCat = getFacilityCategory(fac);
                      const isBirdFac = facCat === 'BIRD';

                      const sttForThisFac = communeRunningStt++;

                      return fac.speciesList.map((sp, spIdx) => {
                        const b = sp.baseline || {};
                        const father = Number(b.father) || 0;
                        const mother = Number(b.mother) || 0;
                        const otherMale = Number(b.otherMale) || 0;
                        const otherFemale = Number(b.otherFemale) || 0;
                        const otherUnknown = Number(b.otherUnknown) || 0;
                        const total = father + mother + otherMale + otherFemale + otherUnknown;

                        const isFirstSpeciesRow = spIdx === 0;

                        return (
                          <tr
                            key={`${fac.id}_${sp.id}`}
                            className={`transition-colors hover:bg-slate-50/80 ${
                              isCurrentActive ? 'bg-emerald-50/70 border-l-4 border-l-emerald-600' : ''
                            }`}
                          >
                            {/* STT */}
                            {isFirstSpeciesRow && (
                              <td
                                rowSpan={fac.speciesList.length}
                                className="px-1 py-1.5 text-center font-mono font-bold border-r border-slate-200 text-slate-700 bg-slate-50/80 text-xs"
                              >
                                {sttForThisFac}
                              </td>
                            )}

                            {/* Phân nhóm loài Badge */}
                            {isFirstSpeciesRow && (
                              <td
                                rowSpan={fac.speciesList.length}
                                className="px-1 py-1.5 text-center font-bold border-r border-slate-200 bg-slate-50/50"
                              >
                                {isBirdFac ? (
                                  <span className="bg-amber-100 text-amber-900 border border-amber-300 px-1 py-0.5 rounded text-[9px] font-extrabold inline-flex items-center gap-0.5 shadow-2xs whitespace-nowrap">
                                    🦜 Chim
                                  </span>
                                ) : (
                                  <span className="bg-teal-100 text-teal-900 border border-teal-300 px-1 py-0.5 rounded text-[9px] font-extrabold inline-flex items-center gap-0.5 shadow-2xs whitespace-nowrap">
                                    🦔 Thú/Bò sát
                                  </span>
                                )}
                              </td>
                            )}

                            {/* Họ tên & Địa chỉ */}
                            {isFirstSpeciesRow && (
                              <td
                                rowSpan={fac.speciesList.length}
                                className="px-1.5 py-1.5 border-r border-slate-200 bg-slate-50/30 min-w-[125px] max-w-[145px]"
                              >
                                <div className="font-extrabold text-slate-900 text-xs leading-snug">{fac.ownerName}</div>
                                <div className="text-[9px] text-slate-500 mt-0.5 font-medium leading-tight">{fac.address}</div>
                              </td>
                            )}

                            {/* Tên tiếng Việt & Tên khoa học gộp chung */}
                            <td className="px-1.5 py-1.5 border-r border-slate-200 min-w-[110px] max-w-[130px]">
                              <div className="font-bold text-slate-900 text-xs leading-snug">{sp.vietnameseName}</div>
                              <div className="text-[9px] italic text-slate-500 font-mono mt-0.5 leading-tight">{sp.scientificName}</div>
                            </td>

                            {/* Tổng số */}
                            <td className="px-1 py-1.5 text-center font-mono font-extrabold text-xs border-r border-slate-200 text-emerald-800 bg-emerald-50/80">
                              {total}
                            </td>

                            {/* Bố */}
                            <td className="px-0.5 py-1.5 text-center font-mono border-r border-slate-200 font-bold text-slate-900 text-xs">
                              {father}
                            </td>

                            {/* Mẹ */}
                            <td className="px-0.5 py-1.5 text-center font-mono border-r border-slate-200 font-bold text-slate-900 text-xs">
                              {mother}
                            </td>

                            {/* Đực */}
                            <td className="px-0.5 py-1.5 text-center font-mono border-r border-slate-200 text-slate-700 text-xs">
                              {otherMale || ''}
                            </td>

                            {/* Cái */}
                            <td className="px-0.5 py-1.5 text-center font-mono border-r border-slate-200 text-slate-700 text-xs">
                              {otherFemale || ''}
                            </td>

                            {/* Chưa XĐ */}
                            <td className="px-0.5 py-1.5 text-center font-mono border-r border-slate-200 text-slate-700 text-xs">
                              {otherUnknown || ''}
                            </td>

                            {/* Mã số CS */}
                            {isFirstSpeciesRow && (
                              <td
                                rowSpan={fac.speciesList.length}
                                className="px-1.5 py-1.5 font-mono font-bold border-r border-slate-200 text-indigo-700 text-[11px] text-center"
                              >
                                {fac.registrationCode || 'Chưa có'}
                              </td>
                            )}

                            {/* Ngày cấp */}
                            {isFirstSpeciesRow && (
                              <td
                                rowSpan={fac.speciesList.length}
                                className="px-1 py-1.5 font-mono border-r border-slate-200 text-slate-600 whitespace-nowrap text-center font-semibold text-[10px]"
                              >
                                {fac.registrationDate ? fac.registrationDate.split('-').reverse().join('/') : '---'}
                              </td>
                            )}

                            {/* Mục đích nuôi */}
                            <td className="px-1 py-1.5 text-center font-mono font-bold border-r border-slate-200 text-teal-800 text-xs">
                              {sp.purposeCode || fac.purposeCode || 'T'}
                            </td>

                            {/* Ghi chú */}
                            {isFirstSpeciesRow && (
                              <td
                                rowSpan={fac.speciesList.length}
                                className="px-1.5 py-1.5 border-r border-slate-200 text-slate-700 text-[11px]"
                              >
                                {fac.note ? (
                                  <span className="bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                    {fac.note}
                                  </span>
                                ) : (
                                  '---'
                                )}
                              </td>
                            )}

                            {/* Thao tác */}
                            {isFirstSpeciesRow && (
                              <td
                                rowSpan={fac.speciesList.length}
                                className="px-1.5 py-1.5 text-center"
                              >
                                <div className="flex flex-col gap-1 w-full">
                                  <button
                                    onClick={() => onSelectFacility(fac.id)}
                                    className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 w-full shadow-2xs ${
                                      isCurrentActive
                                        ? 'bg-emerald-600 text-white shadow-xs'
                                        : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                                    }`}
                                  >
                                    <span>{isCurrentActive ? 'Đang chọn' : 'Sổ Mẫu II'}</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>

                                  {onOpenMapFacility && (
                                    <button
                                      onClick={() => onOpenMapFacility(fac.id)}
                                      className="px-1.5 py-0.5 rounded-lg text-[10px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all flex items-center justify-center gap-0.5 w-full"
                                      title="Bay tới vị trí cơ sở trên bản đồ Google Hybrid"
                                    >
                                      <MapPin className="w-3 h-3 text-rose-600" />
                                      <span>Định vị GIS</span>
                                    </button>
                                  )}
                                </div>
                              </td>
                            )}

                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>
            )}

            </div>
          );
        })}
      </div>

        </>
      )}
    </div>
  );
}


