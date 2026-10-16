import React, { useState, useMemo } from 'react';
import { 
  Edit2, Trash2, Info, ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp, 
  AlertTriangle, Eye, Building2, Lock, UserCheck, MapPin, FileText, User, 
  RotateCw, Maximize2, Filter, Search, PlusCircle, Printer, Download, 
  QrCode, Map, Phone, Calendar, CheckCircle2, XCircle, ShieldCheck, 
  ChevronLeft, ChevronRight, Sparkles, Layers, SlidersHorizontal, Copy, Check,
  ExternalLink, Tag, RefreshCw
} from 'lucide-react';
import { formatDateVN, PURPOSE_CODES, computeLogbookTable } from '../utils/calculations';

export default function TableView({
  rows = [],
  species,
  speciesList = [],
  onSelectSpecies,
  facilityInfo,
  facilitiesList = [],
  activeFacilityId,
  onSelectFacility,
  onOpenAddFluctuation,
  onOpenQRCode,
  onOpenPrintView,
  onExportExcel,
  onOpenMapFacility,
  onEditRow,
  onDeleteRow,
  onEditBaseline,
  onOpenAddSpecies,
  onOpenAddFacility,
  onOpenEditFacility,
  onOpenBackupModal,
  onApprovePending,
  onRejectPending,
  currentUser,
  isReadOnly = false,
  onOpenLogin,
}) {
  const [showNotes, setShowNotes] = useState(false);
  const [mobileViewMode, setMobileViewMode] = useState('TABLE'); // 'TABLE' | 'CARDS'
  
  // Commune & Facility Filters
  const [selectedCommune, setSelectedCommune] = useState('ALL');
  const [copiedCode, setCopiedCode] = useState(false);

  // Table Row Filters
  const [yearFilter, setYearFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL' | 'INCREASE' | 'DECREASE' | 'PENDING'
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Fullscreen & Landscape Rotation
  const handleToggleRotateLandscape = () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().then(() => {
            if (window.screen?.orientation?.lock) {
              window.screen.orientation.lock('landscape').catch(() => {});
            }
          }).catch(() => {});
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    } catch (e) {
      console.warn("Rotate landscape error:", e);
    }
  };

  // Find current active facility object
  const currentFac = useMemo(() => {
    if (activeFacilityId && facilitiesList.length > 0) {
      const found = facilitiesList.find(f => f.id === activeFacilityId);
      if (found) return found;
    }
    if (facilityInfo?.id && facilitiesList.length > 0) {
      const found = facilitiesList.find(f => f.id === facilityInfo.id);
      if (found) return found;
    }
    return facilityInfo || facilitiesList[0] || null;
  }, [facilitiesList, activeFacilityId, facilityInfo]);

  // Extract unique sorted commune list from facilities
  const communesList = useMemo(() => {
    const set = new Set();
    facilitiesList.forEach(f => {
      if (f.commune) set.add(f.commune.trim());
    });
    const order = ['xã Hòa Sơn', 'xã Yang Mao', 'xã Cư Pui', 'Xã Dang Kang', 'Xã Krông Bông'];
    const list = Array.from(set);
    return list.sort((a, b) => {
      const ia = order.findIndex(o => o.toLowerCase() === a.toLowerCase());
      const ib = order.findIndex(o => o.toLowerCase() === b.toLowerCase());
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.localeCompare(b, 'vi');
    });
  }, [facilitiesList]);

  // Filter facilities according to selected commune
  const filteredFacilities = useMemo(() => {
    if (selectedCommune === 'ALL') return facilitiesList;
    return facilitiesList.filter(f => (f.commune || '').trim().toLowerCase() === selectedCommune.toLowerCase());
  }, [facilitiesList, selectedCommune]);

  // Handle rapid Prev / Next facility navigation
  const currentIndex = useMemo(() => {
    return filteredFacilities.findIndex(f => f.id === currentFac?.id);
  }, [filteredFacilities, currentFac]);

  const handlePrevFacility = () => {
    if (filteredFacilities.length === 0) return;
    const prevIdx = currentIndex > 0 ? currentIndex - 1 : filteredFacilities.length - 1;
    onSelectFacility?.(filteredFacilities[prevIdx].id);
  };

  const handleNextFacility = () => {
    if (filteredFacilities.length === 0) return;
    const nextIdx = currentIndex < filteredFacilities.length - 1 ? currentIndex + 1 : 0;
    onSelectFacility?.(filteredFacilities[nextIdx].id);
  };

  // Switch commune filter and auto-select appropriate facility if needed
  const handleSelectCommune = (communeName) => {
    setSelectedCommune(communeName);
    if (communeName !== 'ALL') {
      const facsInCommune = facilitiesList.filter(f => (f.commune || '').trim().toLowerCase() === communeName.toLowerCase());
      if (facsInCommune.length > 0 && (!currentFac || (currentFac.commune || '').trim().toLowerCase() !== communeName.toLowerCase())) {
        onSelectFacility?.(facsInCommune[0].id);
      }
    }
  };

  // Copy registration code
  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard?.writeText(code).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  // Calculate facility overall totals (all species combined)
  const facilityOverallTotal = useMemo(() => {
    if (!currentFac?.speciesList) return 0;
    return currentFac.speciesList.reduce((sum, sp) => {
      const spRows = computeLogbookTable(sp.baseline || {}, sp.fluctuations || []);
      const lastRow = spRows[spRows.length - 1];
      return sum + (lastRow?.total || 0);
    }, 0);
  }, [currentFac]);

  // Available Years in logbook rows
  const availableYears = useMemo(() => {
    const years = new Set();
    rows.forEach(r => {
      if (r.date) {
        const y = String(r.date).slice(0, 4);
        if (y && !isNaN(y)) years.add(y);
      }
    });
    return Array.from(years).sort().reverse();
  }, [rows]);

  // Fluctuation counts for filter badges
  const { incCount, decCount, pendingCount } = useMemo(() => {
    let inc = 0;
    let dec = 0;
    let pending = 0;
    rows.forEach(r => {
      if (!r.isBaseline) {
        const incT = (r.incFather || 0) + (r.incMother || 0) + (r.incOtherMale || 0) + (r.incOtherFemale || 0) + (r.incOtherUnknown || 0);
        const decT = (r.decFather || 0) + (r.decMother || 0) + (r.decOtherMale || 0) + (r.decOtherFemale || 0) + (r.decOtherUnknown || 0);
        if (incT > 0) inc++;
        if (decT > 0) dec++;
      }
      if (r.approvalStatus === 'PENDING') pending++;
    });
    return { incCount: inc, decCount: dec, pendingCount: pending };
  }, [rows]);

  // Filtered rows based on year, type, and search query
  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return rows.filter((r) => {
      // Always keep Baseline row (Dòng A) unless a specific search is performed
      if (r.isBaseline && !q && yearFilter === 'ALL' && typeFilter === 'ALL') {
        return true;
      }

      // Year filter
      if (yearFilter !== 'ALL') {
        if (!r.isBaseline && (!r.date || !String(r.date).startsWith(yearFilter))) {
          return false;
        }
      }

      // Type filter
      if (typeFilter === 'INCREASE') {
        if (r.isBaseline) return true;
        const incT = (r.incFather || 0) + (r.incMother || 0) + (r.incOtherMale || 0) + (r.incOtherFemale || 0) + (r.incOtherUnknown || 0);
        if (incT <= 0) return false;
      } else if (typeFilter === 'DECREASE') {
        if (r.isBaseline) return true;
        const decT = (r.decFather || 0) + (r.decMother || 0) + (r.decOtherMale || 0) + (r.decOtherFemale || 0) + (r.decOtherUnknown || 0);
        if (decT <= 0) return false;
      } else if (typeFilter === 'PENDING') {
        if (r.approvalStatus !== 'PENDING') return false;
      }

      // Search query filter
      if (q) {
        const matchReason = r.reason?.toLowerCase().includes(q);
        const matchVerifier = r.verifier?.toLowerCase().includes(q);
        const matchDate = r.date?.includes(q);
        const matchLabel = r.label?.toLowerCase().includes(q);
        if (!matchReason && !matchVerifier && !matchDate && !matchLabel) {
          return false;
        }
      }

      return true;
    });
  }, [rows, yearFilter, typeFilter, searchQuery]);

  // Summary statistics for current active species
  const currentTotal = rows[rows.length - 1]?.total || 0;
  const currentFather = rows[rows.length - 1]?.father || 0;
  const currentMother = rows[rows.length - 1]?.mother || 0;
  const currentOtherMale = rows[rows.length - 1]?.otherMale || 0;
  const currentOtherFemale = rows[rows.length - 1]?.otherFemale || 0;
  const currentOtherUnknown = rows[rows.length - 1]?.otherUnknown || 0;

  // Total increases and decreases in period
  const totalPeriodIncrease = useMemo(() => {
    return rows.reduce((sum, r) => {
      if (r.isBaseline) return sum;
      return sum + (r.incFather || 0) + (r.incMother || 0) + (r.incOtherMale || 0) + (r.incOtherFemale || 0) + (r.incOtherUnknown || 0);
    }, 0);
  }, [rows]);

  const totalPeriodDecrease = useMemo(() => {
    return rows.reduce((sum, r) => {
      if (r.isBaseline) return sum;
      return sum + (r.decFather || 0) + (r.decMother || 0) + (r.decOtherMale || 0) + (r.decOtherFemale || 0) + (r.decOtherUnknown || 0);
    }, 0);
  }, [rows]);

  const baselineInitialTotal = rows[0]?.total || 0;

  return (
    <div className="space-y-4">
      {/* =========================================================================
          MODULE 1: BỘ LỌC CƠ SỞ & XÃ ĐA CẤP (SMART FACILITY & COMMUNE HUB)
      ========================================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-sm space-y-3.5">
        {/* Level 1: Commune Filter Selector Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 text-slate-500 font-bold text-xs mr-1">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>Địa bàn xã:</span>
          </div>

          <button
            onClick={() => handleSelectCommune('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCommune === 'ALL'
                ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-600/30 font-black'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            Tất cả xã ({facilitiesList.length})
          </button>

          {communesList.map((commune) => {
            const count = facilitiesList.filter(f => (f.commune || '').trim().toLowerCase() === commune.toLowerCase()).length;
            const isSelected = selectedCommune.toLowerCase() === commune.toLowerCase();
            return (
              <button
                key={commune}
                onClick={() => handleSelectCommune(commune)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-600/30 font-black'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {commune} ({count})
              </button>
            );
          })}
        </div>

        {/* Level 2: Facility Switcher Dropdown with Rapid Cycler & Action Shortcuts */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
          {/* Facility Selector & Prev/Next Cycler */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            {/* Prev Button */}
            <button
              onClick={handlePrevFacility}
              title="Xem cơ sở trước đó"
              className="px-2.5 py-2 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 rounded-xl border border-slate-200 font-bold text-xs flex items-center gap-1 transition-all flex-shrink-0 cursor-pointer active:scale-95 shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Trước</span>
            </button>

            {/* Smart Facility Select Dropdown */}
            <div className="relative flex-1 min-w-0">
              <select
                value={currentFac?.id || ''}
                onChange={(e) => onSelectFacility?.(e.target.value)}
                className="w-full bg-emerald-50/50 hover:bg-emerald-50 border-2 border-emerald-600/50 focus:border-emerald-600 text-slate-900 font-black text-xs sm:text-sm rounded-xl px-3 py-2 pr-8 shadow-sm cursor-pointer outline-none truncate transition-all"
              >
                {filteredFacilities.map((f, idx) => {
                  const spCount = f.speciesList?.length || 0;
                  const spNames = f.speciesList?.map(s => s.vietnameseName).join(', ') || 'Chưa có loài';
                  return (
                    <option key={f.id} value={f.id}>
                      {idx + 1}. {f.ownerName || f.facilityName} [{f.registrationCode || 'Chưa có mã'}] - {f.commune || 'Krông Bông'} ({spCount} loài: {spNames})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNextFacility}
              title="Xem cơ sở kế tiếp"
              className="px-2.5 py-2 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 rounded-xl border border-slate-200 font-bold text-xs flex items-center gap-1 transition-all flex-shrink-0 cursor-pointer active:scale-95 shadow-2xs"
            >
              <span className="hidden sm:inline">Kế tiếp</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Counter Badge */}
            <span className="hidden md:inline-flex text-[11px] font-black text-emerald-800 bg-emerald-100/80 px-2 py-1 rounded-lg border border-emerald-300 whitespace-nowrap">
              {currentIndex + 1} / {filteredFacilities.length}
            </span>
          </div>

          {/* Quick Action Buttons Group */}
          <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap justify-end flex-shrink-0">
            {/* Add Fluctuation Button */}
            {!isReadOnly ? (
              <button
                onClick={onOpenAddFluctuation}
                className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                title="Ghi chép biến động tăng/giảm đàn động vật hoang dã"
              >
                <PlusCircle className="w-4 h-4 text-emerald-200" />
                <span>+ Ghi biến động mới</span>
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-2 rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer"
                title="Đăng nhập để ghi chép biến động"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Đăng nhập ghi sổ</span>
              </button>
            )}

            {/* Print Logbook A4 */}
            <button
              onClick={onOpenPrintView}
              className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
              title="In Sổ Mẫu II khổ giấy A4 ngang theo quy định BNNMT"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">In Sổ A4</span>
            </button>

            {/* Export Excel Logbook */}
            <button
              onClick={onExportExcel}
              className="flex items-center gap-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
              title="Xuất file Excel Sổ theo dõi Mẫu II"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Xuất Excel</span>
            </button>

            {/* QR Code Identification */}
            <button
              onClick={() => onOpenQRCode?.(currentFac)}
              className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
              title="Xem và in Thẻ định danh Mã QR dán tại cơ sở"
            >
              <QrCode className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Mã QR</span>
            </button>

            {/* Map GPS shortcut */}
            {onOpenMapFacility && (
              <button
                onClick={() => onOpenMapFacility(currentFac?.id)}
                className="flex items-center gap-1 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 px-2.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                title="Xem vị trí cơ sở nuôi trên Bản đồ Vệ tinh GIS"
              >
                <Map className="w-3.5 h-3.5 text-sky-600" />
                <span className="hidden md:inline">Bản đồ</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODULE 2: THẺ THÔNG TIN & TRẠNG THÁI CƠ SỞ (FACILITY PROFILE & STATS HERO)
      ========================================================================= */}
      {currentFac && (
        <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-lg border border-emerald-700/40 relative overflow-hidden">
          {/* Subtle Forestry Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Left: Facility Core Information (7 cols) */}
            <div className="lg:col-span-7 space-y-2.5">
              {/* Badges row */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                {/* Registration Code with Copy Shortcut */}
                <div 
                  onClick={() => handleCopyCode(currentFac.registrationCode)}
                  className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-2.5 py-1 rounded-lg cursor-pointer transition-all shadow-sm group"
                  title="Bấm để sao chép mã số cơ sở"
                >
                  <Tag className="w-3 h-3 text-slate-900" />
                  <span className="font-mono tracking-tight">{currentFac.registrationCode || 'CHƯA CẤP MÃ SỐ'}</span>
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-800" /> : <Copy className="w-3 h-3 text-slate-700 opacity-60 group-hover:opacity-100" />}
                </div>

                {/* Commune Badge */}
                <span className="bg-white/10 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg font-bold">
                  📍 {currentFac.commune || 'Krông Bông'}
                </span>

                {/* Purpose Code Badge */}
                <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2.5 py-1 rounded-lg font-medium">
                  {PURPOSE_CODES[currentFac.purposeCode] || 'Mục đích: Nuôi sinh sản, thương mại (T)'}
                </span>

                {/* Registration Date */}
                {currentFac.registrationDate && (
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Cấp: {formatDateVN(currentFac.registrationDate)}</span>
                  </span>
                )}
              </div>

              {/* Title & Owner */}
              <div>
                <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>{currentFac.facilityName || `Cơ sở nuôi ĐVHD ${currentFac.ownerName}`}</span>
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" title="Cơ sở được Hạt Kiểm lâm quản lý hồ sơ" />
                </h1>
                <p className="text-xs sm:text-sm text-emerald-200/90 font-medium pt-0.5">
                  Chủ cơ sở: <strong className="text-white font-extrabold">{currentFac.ownerName || 'Chưa cập nhật'}</strong>
                  {currentFac.phone && (
                    <span className="ml-2.5 inline-flex items-center gap-1 text-slate-300">
                      <Phone className="w-3 h-3 text-emerald-400" />
                      <a href={`tel:${currentFac.phone}`} className="hover:text-emerald-300 underline font-mono">
                        {currentFac.phone}
                      </a>
                    </span>
                  )}
                </p>
              </div>

              {/* Address details & Notes */}
              <div className="text-xs text-slate-300 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{currentFac.address || 'Địa chỉ đang cập nhật'}</span>
                </span>

                {/* Edit Facility Info Trigger (If allowed) */}
                {!isReadOnly && onOpenEditFacility && (
                  <button
                    onClick={onOpenEditFacility}
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-300 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer"
                  >
                    <Edit2 className="w-2.5 h-2.5" />
                    <span>Sửa thông tin cơ sở</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right: Quick Herd Stat Badges (5 cols) */}
            <div className="lg:col-span-5 bg-black/25 border border-white/10 rounded-2xl p-3 sm:p-3.5 space-y-2.5 backdrop-blur-xs">
              <div className="flex items-center justify-between text-xs font-bold border-b border-white/10 pb-1.5">
                <span className="text-emerald-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hiện trạng đàn tại cơ sở:</span>
                </span>
                <span className="text-slate-300 text-[11px]">
                  {currentFac.speciesList?.length || 0} loài nuôi
                </span>
              </div>

              {/* 4 Key Numbers Grid */}
              <div className="grid grid-cols-4 gap-1.5 text-center">
                <div className="bg-emerald-900/40 border border-emerald-500/30 rounded-xl p-2">
                  <span className="text-[10px] text-emerald-300 block font-sans">Tổng đàn</span>
                  <strong className="text-base sm:text-lg font-black text-amber-300 font-mono">
                    {currentTotal}
                  </strong>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-2">
                  <span className="text-[10px] text-slate-300 block font-sans">Bố (♂)</span>
                  <strong className="text-base sm:text-lg font-black text-white font-mono">
                    {currentFather}
                  </strong>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-2">
                  <span className="text-[10px] text-slate-300 block font-sans">Mẹ (♀)</span>
                  <strong className="text-base sm:text-lg font-black text-white font-mono">
                    {currentMother}
                  </strong>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-2">
                  <span className="text-[10px] text-slate-300 block font-sans">Hậu bị/Con</span>
                  <strong className="text-base sm:text-lg font-black text-slate-200 font-mono">
                    {currentOtherMale + currentOtherFemale + currentOtherUnknown}
                  </strong>
                </div>
              </div>

              {/* Live Herd Health Note */}
              <div className="text-[11px] text-emerald-200/80 flex items-center justify-between pt-0.5">
                <span>Tỷ lệ phối giống: <strong>{currentFather} ♂ : {currentMother} ♀</strong></span>
                <span className="text-slate-400 font-mono text-[10px]">
                  Tổng toàn cơ sở: <strong>{facilityOverallTotal}</strong> con
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 3: TABS CHỌN LOÀI NUÔI (SPECIES SELECTOR TABS)
      ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Species Title & Tabs */}
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <span className="text-[11px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-1 rounded-lg border border-emerald-300 flex-shrink-0">
            SỔ MẪU II CHI TIẾT
          </span>

          {species ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                <span>{species?.vietnameseName}</span>
                <span className="text-xs font-semibold italic text-emerald-700">({species?.scientificName})</span>
              </h2>

              {species?.group && (
                <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-black px-2 py-0.5 rounded-md">
                  {species.group.includes('IIB') ? 'Nhóm IIB' : species.group.includes('IB') ? 'Nhóm IB' : 'ĐV Rừng TT'}
                </span>
              )}
            </div>
          ) : (
            <span className="text-sm text-slate-500 font-bold">Cơ sở này chưa có loài động vật nào</span>
          )}
        </div>

        {/* Right: Species Tabs if multiple species exist + Add Species Button */}
        <div className="flex items-center gap-1.5 overflow-x-auto flex-shrink-0">
          {speciesList && speciesList.length > 1 && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap hidden sm:inline">Loài:</span>
              {speciesList.map((sp) => {
                const spRows = computeLogbookTable(sp.baseline || {}, sp.fluctuations || []);
                const spLastTotal = spRows[spRows.length - 1]?.total || 0;
                const isCurrent = species?.id === sp.id;
                return (
                  <button
                    key={sp.id}
                    onClick={() => onSelectSpecies && onSelectSpecies(sp.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isCurrent
                        ? 'bg-emerald-600 text-white font-black shadow-sm ring-2 ring-emerald-500/30'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span>{sp.vietnameseName}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${isCurrent ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'}`}>
                      {spLastTotal}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Add Species Trigger */}
          {!isReadOnly && onOpenAddSpecies && (
            <button
              onClick={onOpenAddSpecies}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 rounded-xl text-xs font-bold border border-slate-200 transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer"
              title="Thêm loài động vật nuôi mới cho cơ sở này"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>+ Thêm loài</span>
            </button>
          )}
        </div>
      </div>

      {/* When no species at all for this facility */}
      {!species && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-5 max-w-2xl mx-auto my-6 shadow-md">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Info className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-slate-900">Cơ Sở Chưa Khai Báo Loài Động Vật</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Cơ sở nuôi này hiện chưa có danh sách loài nào trong Sổ Mẫu II. Bạn có thể thêm loài nuôi ban đầu hoặc chuyển sang xem cơ sở khác ở danh sách phía trên.
            </p>
          </div>

          {!isReadOnly && (
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <button
                onClick={onOpenAddSpecies}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>➕ Thêm loài mới cho cơ sở</span>
              </button>
              <button
                onClick={onOpenEditFacility}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all"
              >
                <span>🏢 Sửa thông tin cơ sở</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* If species exists: Show Fluctuations Filter Toolbar + 19-Column Table */}
      {species && (
        <>
          {/* =========================================================================
              MODULE 4: BỘ LỌC BIẾN ĐỘNG DÒNG SỔ MẪU II (FLUCTUATIONS TOOLBAR)
          ========================================================================= */}
          <div className="bg-slate-100/90 border border-slate-200/90 rounded-2xl p-3 shadow-2xs space-y-2.5">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
              {/* Left: Quick Type Filters */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1 mr-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Lọc dòng:</span>
                </span>

                {/* All Rows */}
                <button
                  onClick={() => setTypeFilter('ALL')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    typeFilter === 'ALL'
                      ? 'bg-emerald-700 text-white shadow-2xs font-black'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Tất cả ({rows.length})
                </button>

                {/* Increase Only */}
                <button
                  onClick={() => setTypeFilter('INCREASE')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    typeFilter === 'INCREASE'
                      ? 'bg-teal-700 text-white shadow-2xs font-black'
                      : 'bg-white text-teal-800 border border-teal-200 hover:bg-teal-50'
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-teal-600" />
                  <span>Tăng đàn ({incCount})</span>
                </button>

                {/* Decrease Only */}
                <button
                  onClick={() => setTypeFilter('DECREASE')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    typeFilter === 'DECREASE'
                      ? 'bg-rose-700 text-white shadow-2xs font-black'
                      : 'bg-white text-rose-800 border border-rose-200 hover:bg-rose-50'
                  }`}
                >
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />
                  <span>Giảm đàn ({decCount})</span>
                </button>

                {/* Pending Only (if any) */}
                {pendingCount > 0 && (
                  <button
                    onClick={() => setTypeFilter('PENDING')}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 animate-pulse ${
                      typeFilter === 'PENDING'
                        ? 'bg-amber-600 text-white shadow-2xs font-black'
                        : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                    }`}
                  >
                    <span>🕒 Chờ duyệt ({pendingCount})</span>
                  </button>
                )}

                {/* Year Filter Dropdown if multiple years exist */}
                {availableYears.length > 1 && (
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="bg-white border border-slate-300 text-slate-800 font-bold text-xs rounded-xl px-2.5 py-1 outline-none cursor-pointer"
                  >
                    <option value="ALL">Tất cả các năm</option>
                    {availableYears.map(yr => (
                      <option key={yr} value={yr}>Năm {yr}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Right: Search Box inside Table Rows */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm lý do, BKLs, người ký..."
                    className="w-full bg-white border border-slate-300 focus:border-emerald-600 text-slate-800 font-medium text-xs rounded-xl pl-8 pr-3 py-1.5 outline-none transition-all placeholder:text-slate-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Reset Filters Button if any filter active */}
                {(typeFilter !== 'ALL' || yearFilter !== 'ALL' || searchQuery) && (
                  <button
                    onClick={() => {
                      setTypeFilter('ALL');
                      setYearFilter('ALL');
                      setSearchQuery('');
                    }}
                    className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    title="Xóa bộ lọc dòng"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Mobile View Toggle Switch */}
                <div className="flex items-center sm:hidden bg-slate-200 p-0.5 rounded-xl text-[11px] font-bold">
                  <button
                    onClick={() => setMobileViewMode('TABLE')}
                    className={`px-2 py-1 rounded-lg ${mobileViewMode === 'TABLE' ? 'bg-white text-emerald-900 shadow-2xs font-black' : 'text-slate-600'}`}
                  >
                    Bảng
                  </button>
                  <button
                    onClick={() => setMobileViewMode('CARDS')}
                    className={`px-2 py-1 rounded-lg ${mobileViewMode === 'CARDS' ? 'bg-white text-emerald-900 shadow-2xs font-black' : 'text-slate-600'}`}
                  >
                    Thẻ
                  </button>
                </div>
              </div>
            </div>

            {/* Filtered Count indicator */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
              <span>
                Hiển thị <strong>{filteredRows.length}</strong> / <strong>{rows.length}</strong> dòng ghi chép Sổ Mẫu II
              </span>
              <span className="hidden sm:inline text-slate-400">
                (Quy tắc tính tự động 19 cột theo Thông tư 85/2025/TT-BNNMT)
              </span>
            </div>
          </div>

          {/* =========================================================================
              MODULE 5: THẺ DI ĐỘNG (MOBILE CARDS VIEW)
          ========================================================================= */}
          {mobileViewMode === 'CARDS' && (
            <div className="sm:hidden space-y-3">
              {filteredRows.map((row) => {
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

          {/* =========================================================================
              MODULE 6: BẢNG SỔ MẪU II CHUẨN 19 CỘT BNNMT (OFFICIAL 19-COLUMN TABLE)
          ========================================================================= */}
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
                  <tr className="bg-slate-100 text-slate-800 text-center font-bold border-b border-slate-200">
                    <th rowSpan={2} className="px-0.5 py-0.5 border-r border-slate-200 w-9 text-slate-700 font-bold text-[10px]">
                      Đực
                    </th>
                    <th rowSpan={2} className="px-0.5 py-0.5 border-r border-slate-200 w-9 text-slate-700 font-bold text-[10px]">
                      Cái
                    </th>
                    <th rowSpan={2} className="px-0.5 py-0.5 border-r border-slate-200 w-9 text-slate-700 font-bold text-[10px]">
                      Đực
                    </th>
                    <th rowSpan={2} className="px-0.5 py-0.5 border-r border-slate-200 w-9 text-slate-700 font-bold text-[10px]">
                      Cái
                    </th>
                    <th rowSpan={2} className="px-0.5 py-0.5 border-r border-slate-200 w-9 text-slate-700 font-bold text-[10px]">
                      Chưa XĐ
                    </th>

                    <th colSpan={2} className="px-0.5 py-0.5 border-r border-slate-200 bg-teal-50 text-teal-900 text-[10px]">
                      Bố mẹ
                    </th>
                    <th colSpan={3} className="px-0.5 py-0.5 border-r border-slate-200 bg-teal-50 text-teal-900 text-[10px]">
                      Cá thể khác
                    </th>

                    <th colSpan={2} className="px-0.5 py-0.5 border-r border-slate-200 bg-rose-50 text-rose-900 text-[10px]">
                      Bố mẹ
                    </th>
                    <th colSpan={3} className="px-0.5 py-0.5 border-r border-slate-200 bg-rose-50 text-rose-900 text-[10px]">
                      Cá thể khác
                    </th>
                  </tr>

                  {/* Row 4 Header */}
                  <tr className="bg-slate-100 text-slate-700 text-center font-medium border-b border-slate-200 text-[10px]">
                    <th className="px-0.5 py-0.5 border-r border-slate-200 w-8 bg-teal-50">Đực</th>
                    <th className="px-0.5 py-0.5 border-r border-slate-200 w-8 bg-teal-50">Cái</th>
                    <th className="px-0.5 py-0.5 border-r border-slate-200 w-8 bg-teal-50">Đực</th>
                    <th className="px-0.5 py-0.5 border-r border-slate-200 w-8 bg-teal-50">Cái</th>
                    <th className="px-0.5 py-0.5 border-r border-slate-200 w-8 bg-teal-50">CXĐ</th>

                    <th className="px-0.5 py-0.5 border-r border-slate-200 w-8 bg-rose-50">Đực</th>
                    <th className="px-0.5 py-0.5 border-r border-slate-200 w-8 bg-rose-50">Cái</th>
                    <th className="px-0.5 py-0.5 border-r border-slate-200 w-8 bg-rose-50">Đực</th>
                    <th className="px-0.5 py-0.5 border-r border-slate-200 w-8 bg-rose-50">Cái</th>
                    <th className="px-0.5 py-0.5 border-r border-slate-200 w-8 bg-rose-50">CXĐ</th>
                  </tr>

                  {/* Row 5: Column Numbering Header (1 to 19) */}
                  <tr className="bg-slate-200/80 text-slate-600 font-mono text-[9px] text-center border-b border-slate-300">
                    <td className="py-0.5 border-r border-slate-200"></td>
                    <td className="py-0.5 border-r border-slate-200">(1)</td>
                    <td className="py-0.5 border-r border-slate-200 font-bold bg-emerald-200/40 text-emerald-950">(2)</td>
                    <td className="py-0.5 border-r border-slate-200">(3)</td>
                    <td className="py-0.5 border-r border-slate-200">(4)</td>
                    <td className="py-0.5 border-r border-slate-200">(5)</td>
                    <td className="py-0.5 border-r border-slate-200">(6)</td>
                    <td className="py-0.5 border-r border-slate-200">(7)</td>
                    <td className="py-0.5 border-r border-slate-200 bg-teal-100/50">(8)</td>
                    <td className="py-0.5 border-r border-slate-200 bg-teal-100/50">(9)</td>
                    <td className="py-0.5 border-r border-slate-200 bg-teal-100/50">(10)</td>
                    <td className="py-0.5 border-r border-slate-200 bg-teal-100/50">(11)</td>
                    <td className="py-0.5 border-r border-slate-200 bg-teal-100/50">(12)</td>
                    <td className="py-0.5 border-r border-slate-200 bg-rose-100/50">(13)</td>
                    <td className="py-0.5 border-r border-slate-200 bg-rose-100/50">(14)</td>
                    <td className="py-0.5 border-r border-slate-200 bg-rose-100/50">(15)</td>
                    <td className="py-0.5 border-r border-slate-200 bg-rose-100/50">(16)</td>
                    <td className="py-0.5 border-r border-slate-200 bg-rose-100/50">(17)</td>
                    <td className="py-0.5 border-r border-slate-200">(18)</td>
                    <td className="py-0.5 border-r border-slate-200">(19)</td>
                    <td className="py-0.5 no-print"></td>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                  {filteredRows.map((row) => {
                    const isBaseline = row.isBaseline;
                    const isPending = row.approvalStatus === 'PENDING';
                    const incTotal = (row.incFather || 0) + (row.incMother || 0) + (row.incOtherMale || 0) + (row.incOtherFemale || 0) + (row.incOtherUnknown || 0);
                    const decTotal = (row.decFather || 0) + (row.decMother || 0) + (row.decOtherMale || 0) + (row.decOtherFemale || 0) + (row.decOtherUnknown || 0);

                    return (
                      <tr
                        key={row.rowId}
                        className={`transition-colors hover:bg-slate-50 ${
                          isBaseline
                            ? 'bg-indigo-50/50 font-bold'
                            : isPending
                            ? 'bg-amber-50/70'
                            : incTotal > 0 && decTotal > 0
                            ? 'bg-amber-50/30'
                            : incTotal > 0
                            ? 'bg-teal-50/30'
                            : decTotal > 0
                            ? 'bg-rose-50/30'
                            : 'bg-white'
                        }`}
                      >
                        {/* Label: A, B, C... */}
                        <td className="px-1 py-1 border-r border-slate-200 text-center font-bold text-slate-800 bg-slate-50/80">
                          {row.label}
                        </td>

                        {/* Col 1: Date */}
                        <td className="px-1 py-1 border-r border-slate-200 text-center whitespace-nowrap text-slate-700 text-[10px]">
                          {formatDateVN(row.date)}
                        </td>

                        {/* Col 2: Total Animals */}
                        <td className="px-1 py-1 border-r border-slate-200 text-center font-black text-emerald-950 bg-emerald-100/50 text-xs">
                          {row.total}
                        </td>

                        {/* Cols 3-7: Current Breeding Stock */}
                        <td className="px-0.5 py-1 border-r border-slate-200 text-center font-semibold text-slate-800">
                          {row.father || '-'}
                        </td>
                        <td className="px-0.5 py-1 border-r border-slate-200 text-center font-semibold text-slate-800">
                          {row.mother || '-'}
                        </td>
                        <td className="px-0.5 py-1 border-r border-slate-200 text-center text-slate-700">
                          {row.otherMale || '-'}
                        </td>
                        <td className="px-0.5 py-1 border-r border-slate-200 text-center text-slate-700">
                          {row.otherFemale || '-'}
                        </td>
                        <td className="px-0.5 py-1 border-r border-slate-200 text-center text-slate-700">
                          {row.otherUnknown || '-'}
                        </td>

                        {/* Cols 8-12: Increases */}
                        <td className={`px-0.5 py-1 border-r border-slate-200 text-center ${row.incFather > 0 ? 'text-teal-700 font-black bg-teal-100/70' : 'text-slate-400'}`}>
                          {isBaseline ? '-' : row.incFather || '-'}
                        </td>
                        <td className={`px-0.5 py-1 border-r border-slate-200 text-center ${row.incMother > 0 ? 'text-teal-700 font-black bg-teal-100/70' : 'text-slate-400'}`}>
                          {isBaseline ? '-' : row.incMother || '-'}
                        </td>
                        <td className={`px-0.5 py-1 border-r border-slate-200 text-center ${row.incOtherMale > 0 ? 'text-teal-700 font-black bg-teal-100/70' : 'text-slate-400'}`}>
                          {isBaseline ? '-' : row.incOtherMale || '-'}
                        </td>
                        <td className={`px-0.5 py-1 border-r border-slate-200 text-center ${row.incOtherFemale > 0 ? 'text-teal-700 font-black bg-teal-100/70' : 'text-slate-400'}`}>
                          {isBaseline ? '-' : row.incOtherFemale || '-'}
                        </td>
                        <td className={`px-0.5 py-1 border-r border-slate-200 text-center ${row.incOtherUnknown > 0 ? 'text-teal-700 font-black bg-teal-100/70' : 'text-slate-400'}`}>
                          {isBaseline ? '-' : row.incOtherUnknown || '-'}
                        </td>

                        {/* Cols 13-17: Decreases */}
                        <td className={`px-0.5 py-1 border-r border-slate-200 text-center ${row.decFather > 0 ? 'text-rose-700 font-black bg-rose-100/70' : 'text-slate-400'}`}>
                          {isBaseline ? '-' : row.decFather || '-'}
                        </td>
                        <td className={`px-0.5 py-1 border-r border-slate-200 text-center ${row.decMother > 0 ? 'text-rose-700 font-black bg-rose-100/70' : 'text-slate-400'}`}>
                          {isBaseline ? '-' : row.decMother || '-'}
                        </td>
                        <td className={`px-0.5 py-1 border-r border-slate-200 text-center ${row.decOtherMale > 0 ? 'text-rose-700 font-black bg-rose-100/70' : 'text-slate-400'}`}>
                          {isBaseline ? '-' : row.decOtherMale || '-'}
                        </td>
                        <td className={`px-0.5 py-1 border-r border-slate-200 text-center ${row.decOtherFemale > 0 ? 'text-rose-700 font-black bg-rose-100/70' : 'text-slate-400'}`}>
                          {isBaseline ? '-' : row.decOtherFemale || '-'}
                        </td>
                        <td className={`px-0.5 py-1 border-r border-slate-200 text-center ${row.decOtherUnknown > 0 ? 'text-rose-700 font-black bg-rose-100/70' : 'text-slate-400'}`}>
                          {isBaseline ? '-' : row.decOtherUnknown || '-'}
                        </td>

                        {/* Col 18: Reason */}
                        <td className="px-1.5 py-1 border-r border-slate-200 text-left font-sans text-[11px] text-slate-900 font-medium leading-tight whitespace-normal min-w-[120px] max-w-[150px]" title={row.reason}>
                          {row.reason}
                          {isPending && (
                            <span className="block text-[9px] text-amber-700 font-bold mt-0.5">
                              🕒 Chờ kiểm lâm phê duyệt
                            </span>
                          )}
                        </td>

                        {/* Col 19: Verifier */}
                        <td className="px-1.5 py-1 border-r border-slate-200 text-left font-sans text-[11px] text-slate-800 font-semibold leading-tight whitespace-normal min-w-[100px] max-w-[130px]" title={row.verifier}>
                          {row.verifier || '---'}
                        </td>

                        {/* Actions */}
                        {!isReadOnly && (
                          <td className="px-0.5 py-1 no-print text-center">
                            <div className="flex items-center justify-center gap-0.5">
                              {isPending && (currentUser?.role === 'ADMIN' || currentUser?.role === 'STAFF') ? (
                                <>
                                  <button
                                    onClick={() => onApprovePending?.({ id: 'req_' + row.rowId, ...row })}
                                    className="p-1 text-emerald-700 hover:bg-emerald-100 rounded transition-colors"
                                    title="Phê duyệt biến động này"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => onRejectPending?.({ id: 'req_' + row.rowId, ...row })}
                                    className="p-1 text-rose-600 hover:bg-rose-100 rounded transition-colors"
                                    title="Từ chối yêu cầu này"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              ) : isBaseline ? (
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

                {/* Table Footer Summary Totals */}
                <tfoot>
                  <tr className="bg-slate-100 text-slate-900 font-extrabold border-t-2 border-slate-300 text-xs">
                    <td colSpan={2} className="px-2 py-2 text-center border-r border-slate-200">
                      TỔNG KẾT
                    </td>
                    <td className="px-1 py-2 text-center border-r border-slate-200 font-black text-emerald-900 bg-emerald-100 text-sm font-mono">
                      {currentTotal}
                    </td>
                    <td className="px-1 py-2 text-center border-r border-slate-200 font-mono">{currentFather}</td>
                    <td className="px-1 py-2 text-center border-r border-slate-200 font-mono">{currentMother}</td>
                    <td className="px-1 py-2 text-center border-r border-slate-200 font-mono">{currentOtherMale}</td>
                    <td className="px-1 py-2 text-center border-r border-slate-200 font-mono">{currentOtherFemale}</td>
                    <td className="px-1 py-2 text-center border-r border-slate-200 font-mono">{currentOtherUnknown}</td>
                    <td colSpan={5} className="px-2 py-2 text-center border-r border-slate-200 font-mono text-teal-800 bg-teal-50">
                      Tổng tăng: <strong>+{totalPeriodIncrease}</strong>
                    </td>
                    <td colSpan={5} className="px-2 py-2 text-center border-r border-slate-200 font-mono text-rose-800 bg-rose-50">
                      Tổng giảm: <strong>-{totalPeriodDecrease}</strong>
                    </td>
                    <td colSpan={3} className="px-2 py-2 text-slate-700 font-sans text-[11px] leading-tight">
                      Hiện có = Ban đầu ({baselineInitialTotal}) + Tăng ({totalPeriodIncrease}) - Giảm ({totalPeriodDecrease}) = <strong>{currentTotal} cá thể</strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          MODULE 7: GHI CHÚ HƯỚNG DẪN QUY CHUẨN (THÔNG TƯ 85/2025/TT-BNNMT)
      ========================================================================= */}
      {!isReadOnly && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 shadow-sm">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="w-full flex items-center justify-between font-bold text-slate-800 hover:text-emerald-700 transition-colors cursor-pointer"
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
      )}
    </div>
  );
}
