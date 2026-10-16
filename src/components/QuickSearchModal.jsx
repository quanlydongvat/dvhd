import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  X,
  Building2,
  Feather,
  PawPrint,
  FileCheck2,
  MapPin,
  ArrowRight,
  Sparkles,
  Command,
  CornerDownLeft,
  Plus,
  Compass,
  BarChart3,
  Download,
  SlidersHorizontal,
  Table,
} from 'lucide-react';

// Helper: Bỏ dấu tiếng Việt để tìm kiếm không dấu chuẩn xác
function removeVietnameseTones(str) {
  if (!str) return '';
  str = String(str).toLowerCase().trim();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ỉ|ĩ|ị/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  // Combine multiple spaces
  return str.replace(/\s+/g, ' ');
}

export default function QuickSearchModal({
  isOpen,
  onClose,
  facilitiesList = [],
  packingListData = [],
  onSelectFacility,
  onSelectSpecies,
  onChangeView,
  onOpenAddPackingList,
  onOpenAddFacility,
  onOpenAddFluctuation,
  onOpenExportExcel,
  onOpenUISettings,
}) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL'); // 'ALL' | 'FACILITY' | 'SPECIES' | 'PACKING_LIST' | 'ACTION'
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Focus input on open & reset state
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setActiveCategory('ALL');
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    }
  }, [isOpen]);

  // Index all searchable items
  const allSearchItems = useMemo(() => {
    const items = [];

    // 1. Thao tác nhanh (Quick Actions)
    items.push(
      {
        id: 'action-add-packing',
        type: 'ACTION',
        badge: '⚡ Thao tác',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
        title: '+ Lập Bảng Kê Lâm Sản Mới',
        subtitle: 'Cấp mã số vào sổ, xác nhận lâm sản xuất bán theo mẫu',
        keywords: 'lap bang ke xuat ban lam san moi',
        icon: FileCheck2,
        onExecute: () => {
          onClose();
          if (onOpenAddPackingList) onOpenAddPackingList();
        },
      },
      {
        id: 'action-add-fluctuation',
        type: 'ACTION',
        badge: '⚡ Thao tác',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
        title: '+ Khai Báo Biến Động Đàn Mới',
        subtitle: 'Ghi nhận tăng (sinh sản, nhập) hoặc giảm (xuất bán, chết)',
        keywords: 'them khai bao bien dong tang giam dan sinh san xuat ban',
        icon: Plus,
        onExecute: () => {
          onClose();
          if (onOpenAddFluctuation) onOpenAddFluctuation();
        },
      },
      {
        id: 'action-add-facility',
        type: 'ACTION',
        badge: '⚡ Thao tác',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
        title: '+ Đăng Ký Cơ Sở Nuôi Mới',
        subtitle: 'Thêm hồ sơ cơ sở nuôi, cấp mã số đăng ký nuôi động vật',
        keywords: 'them dang ky co so nuoi moi cap ma so',
        icon: Building2,
        onExecute: () => {
          onClose();
          if (onOpenAddFacility) onOpenAddFacility();
        },
      },
      {
        id: 'action-nav-map',
        type: 'ACTION',
        badge: '🗺️ Điều hướng',
        badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
        title: 'Xem Bản Đồ Vệ Tinh GIS',
        subtitle: 'Định vị GPS tọa độ 43 cơ sở trên nền ảnh vệ tinh Google Hybrid',
        keywords: 'ban do ve tinh gis toa do vi tri google hybrid',
        icon: Compass,
        onExecute: () => {
          onClose();
          if (onChangeView) onChangeView('MAP');
        },
      },
      {
        id: 'action-nav-summary',
        type: 'ACTION',
        badge: '📑 Điều hướng',
        badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
        title: 'Bảng Tổng Hợp 43 Cơ Sở Nuôi',
        subtitle: 'Danh mục cơ sở, mã số, nhóm loài, phân loại theo 5 xã',
        keywords: 'bang tong hop danh sach co so xa',
        icon: Table,
        onExecute: () => {
          onClose();
          if (onChangeView) onChangeView('SUMMARY');
        },
      },
      {
        id: 'action-nav-analytics',
        type: 'ACTION',
        badge: '📊 Điều hướng',
        badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
        title: 'Biểu Đồ Thống Kê & Tăng Trưởng',
        subtitle: 'Phân tích biến động tăng giảm đàn, cơ cấu đàn theo năm/tháng',
        keywords: 'bieu do thong ke tang truong bao cao',
        icon: BarChart3,
        onExecute: () => {
          onClose();
          if (onChangeView) onChangeView('HOME');
        },
      },
      {
        id: 'action-nav-packing',
        type: 'ACTION',
        badge: '📋 Điều hướng',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
        title: 'Sổ Theo Dõi Xác Nhận Bảng Kê',
        subtitle: 'Nhật ký 33 đợt xuất bán lâm sản và Top cơ sở kinh doanh',
        keywords: 'so theo doi bang ke lam san xuat ban top kinh doanh',
        icon: FileCheck2,
        onExecute: () => {
          onClose();
          if (onChangeView) onChangeView('PACKING_LIST');
        },
      },
      {
        id: 'action-export-excel',
        type: 'ACTION',
        badge: '📥 Xuất dữ liệu',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        title: 'Xuất Báo Cáo Excel (Toàn Huyện / Xã)',
        subtitle: 'Tải file biểu mẫu Excel chuẩn Thông tư 85/2025/TT-BNNMT',
        keywords: 'xuat bao cao excel toan huyen bieu mau tt85',
        icon: Download,
        onExecute: () => {
          onClose();
          if (onOpenExportExcel) onOpenExportExcel();
        },
      },
      {
        id: 'action-ui-settings',
        type: 'ACTION',
        badge: '⚙️ Cài đặt',
        badgeColor: 'bg-slate-100 text-slate-900 border-slate-300',
        title: 'Cài Đặt Giao Diện Hệ Thống',
        subtitle: 'Tùy chỉnh màu sắc chủ đạo, cỡ chữ, độ thu giãn',
        keywords: 'cai dat giao dien mau sac co chu',
        icon: SlidersHorizontal,
        onExecute: () => {
          onClose();
          if (onOpenUISettings) onOpenUISettings();
        },
      }
    );

    // 2. Cơ sở nuôi (Facilities)
    facilitiesList.forEach((fac) => {
      const speciesNames = (fac.speciesList || []).map((s) => s.speciesName).join(', ');
      const totalAnimals = (fac.speciesList || []).reduce((acc, sp) => {
        const b = sp.baseline || {};
        return (
          acc +
          (Number(b.father) || 0) +
          (Number(b.mother) || 0) +
          (Number(b.otherMale) || 0) +
          (Number(b.otherFemale) || 0) +
          (Number(b.otherUnknown) || 0)
        );
      }, 0);

      items.push({
        id: `fac-${fac.id}`,
        type: 'FACILITY',
        badge: '🏠 Cơ sở nuôi',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        title: fac.ownerName || fac.facilityName,
        subtitle: `${fac.address || ''} • ${fac.commune || ''} • Nuôi: ${speciesNames || 'Chưa có loài'} (${totalAnimals} cá thể)`,
        code: fac.registrationCode,
        keywords: `${fac.ownerName} ${fac.facilityName} ${fac.address} ${fac.commune} ${fac.registrationCode} ${speciesNames}`,
        icon: Building2,
        onExecute: () => {
          onClose();
          if (onSelectFacility) onSelectFacility(fac.id);
          if (onChangeView) onChangeView('LOGBOOK');
        },
      });

      // 3. Loài nuôi (Species)
      (fac.speciesList || []).forEach((sp) => {
        const isBird =
          sp.speciesName?.toLowerCase().includes('chim') ||
          sp.speciesName?.toLowerCase().includes('chào mào') ||
          sp.speciesName?.toLowerCase().includes('cu gáy') ||
          sp.speciesName?.toLowerCase().includes('trĩ');

        const b = sp.baseline || {};
        const count =
          (Number(b.father) || 0) +
          (Number(b.mother) || 0) +
          (Number(b.otherMale) || 0) +
          (Number(b.otherFemale) || 0) +
          (Number(b.otherUnknown) || 0);

        items.push({
          id: `species-${fac.id}-${sp.id}`,
          type: 'SPECIES',
          badge: isBird ? '🦅 Lớp Chim' : '🐾 Lớp Thú',
          badgeColor: isBird
            ? 'bg-sky-100 text-sky-900 border-sky-300'
            : 'bg-amber-100 text-amber-900 border-amber-300',
          title: sp.speciesName,
          subtitle: `Cơ sở: ${fac.ownerName} (${fac.commune || ''}) • Đàn: ${count} con • Nhóm: ${sp.citesGroup || 'Thông thường'}`,
          keywords: `${sp.speciesName} ${sp.scientificName || ''} ${sp.code || ''} ${fac.ownerName} ${fac.commune}`,
          icon: isBird ? Feather : PawPrint,
          onExecute: () => {
            onClose();
            if (onSelectFacility) onSelectFacility(fac.id);
            if (onSelectSpecies) onSelectSpecies(sp.id);
            if (onChangeView) onChangeView('LOGBOOK');
          },
        });
      });
    });

    // 4. Sổ theo dõi bảng kê lâm sản (Packing list)
    packingListData.forEach((pk, idx) => {
      items.push({
        id: `pk-${pk.id || idx}`,
        type: 'PACKING_LIST',
        badge: '📋 Bảng kê',
        badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
        title: `Số BK: ${pk.soVaoSo || 'Chưa số'} - ${pk.tenChuLamSan || ''}`,
        subtitle: `Ngày: ${pk.ngayXacNhan || '---'} • ${pk.diaChi || ''} • Xuất: ${pk.tongLamSan || ''}`,
        keywords: `${pk.soVaoSo} ${pk.tenChuLamSan} ${pk.diaChi} ${pk.tongLamSan} bang ke xuat`,
        icon: FileCheck2,
        onExecute: () => {
          onClose();
          if (onChangeView) onChangeView('PACKING_LIST');
        },
      });
    });

    return items;
  }, [
    facilitiesList,
    packingListData,
    onClose,
    onSelectFacility,
    onSelectSpecies,
    onChangeView,
    onOpenAddPackingList,
    onOpenAddFacility,
    onOpenAddFluctuation,
    onOpenExportExcel,
    onOpenUISettings,
  ]);

  // Filter items based on query & activeCategory
  const filteredResults = useMemo(() => {
    const rawQ = query.trim();
    const cleanQ = removeVietnameseTones(rawQ);

    let list = allSearchItems;

    // Filter category
    if (activeCategory !== 'ALL') {
      list = list.filter((i) => i.type === activeCategory);
    }

    if (!cleanQ) {
      // If query is empty, show Top Actions + 5 sample facilities
      return list.slice(0, 12);
    }

    const tokens = cleanQ.split(' ').filter(Boolean);

    const scored = list
      .map((item) => {
        const cleanTitle = removeVietnameseTones(item.title);
        const cleanSubtitle = removeVietnameseTones(item.subtitle);
        const cleanKeywords = removeVietnameseTones(item.keywords || '');
        const cleanCode = removeVietnameseTones(item.code || '');

        let score = 0;

        // Exact match on title gets huge boost
        if (cleanTitle.includes(cleanQ)) score += 50;
        if (cleanTitle.startsWith(cleanQ)) score += 40;
        if (cleanCode && cleanCode.includes(cleanQ)) score += 45;

        // All tokens match check
        const allTokensMatch = tokens.every(
          (t) =>
            cleanTitle.includes(t) ||
            cleanSubtitle.includes(t) ||
            cleanKeywords.includes(t) ||
            cleanCode.includes(t)
        );

        if (allTokensMatch) {
          score += 20;
          tokens.forEach((t) => {
            if (cleanTitle.includes(t)) score += 10;
            if (cleanKeywords.includes(t)) score += 5;
          });
        }

        return { item, score };
      })
      .filter((entry) => entry.score > 0);

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 25).map((entry) => entry.item);
  }, [allSearchItems, query, activeCategory]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults.length, activeCategory]);

  // Keyboard navigation inside modal
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredResults.length || 1));
      // Scroll into view
      scrollSelectedIntoView((selectedIndex + 1) % (filteredResults.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % (filteredResults.length || 1));
      scrollSelectedIntoView((selectedIndex - 1 + filteredResults.length) % (filteredResults.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filteredResults[selectedIndex];
      if (target && target.onExecute) {
        target.onExecute();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const scrollSelectedIntoView = (index) => {
    if (listRef.current) {
      const items = listRef.current.querySelectorAll('[data-search-item]');
      if (items[index]) {
        items[index].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl border-2 border-emerald-400/80 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Search Input Bar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 bg-gradient-to-r from-emerald-50/50 via-white to-amber-50/40 relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-700/20">
            <Search className="w-5 h-5 stroke-[2.5]" />
          </div>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tìm nhanh: Tên chủ 'Đô', xã 'Dang Kang', loài 'Cầy vòi', 'BK 01'..."
              className="w-full bg-transparent text-slate-900 text-sm sm:text-base font-extrabold placeholder:text-slate-400 placeholder:font-medium focus:outline-none pr-8"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                title="Xóa tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-black font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-lg border border-slate-300 shadow-2xs">
              ESC
            </kbd>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Filter Category Pills */}
        <div className="px-3 sm:px-4 py-2 bg-slate-50 border-b border-slate-200/90 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => setActiveCategory('ALL')}
            className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Tất cả ({allSearchItems.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('FACILITY')}
            className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'FACILITY'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            🏠 Cơ sở ({facilitiesList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('SPECIES')}
            className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'SPECIES'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            🐾 Loài nuôi
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('PACKING_LIST')}
            className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'PACKING_LIST'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            📋 Bảng kê ({packingListData.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('ACTION')}
            className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'ACTION'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            ⚡ Thao tác nhanh
          </button>
        </div>

        {/* 3. Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1.5 max-h-[55vh]">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-300 stroke-[1.5]" />
              <p className="font-extrabold text-slate-600 text-sm">
                Không tìm thấy kết quả phù hợp cho "{query}"
              </p>
              <p className="text-xs text-slate-400">
                Thử gõ không dấu, tìm theo tên chủ, tên xã (Dang Kang, Cư Pui, Yang Mao...) hoặc tên loài.
              </p>
            </div>
          ) : (
            filteredResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon || Search;

              return (
                <div
                  key={item.id}
                  data-search-item
                  onClick={() => item.onExecute && item.onExecute()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-400/20 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'bg-emerald-700 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 stroke-[2.2]" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                        {item.code && (
                          <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                            {item.code}
                          </span>
                        )}
                        <h4
                          className={`text-xs sm:text-sm font-black truncate ${
                            isSelected ? 'text-emerald-950' : 'text-slate-900'
                          }`}
                        >
                          {item.title}
                        </h4>
                      </div>

                      <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isSelected && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-lg shadow-2xs">
                        <span>Chọn</span>
                        <CornerDownLeft className="w-2.5 h-2.5" />
                      </span>
                    )}
                    <div
                      className={`p-1.5 rounded-xl ${
                        isSelected ? 'bg-emerald-600 text-white' : 'text-slate-400'
                      }`}
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 4. Footer with keyboard hints */}
        <div className="p-2.5 sm:p-3 bg-slate-50 border-t border-slate-200/90 flex items-center justify-between text-[11px] text-slate-500 font-bold px-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-white border border-slate-300 px-1.5 py-0.5 rounded shadow-2xs text-[10px]">
                ↑
              </kbd>
              <kbd className="font-mono bg-white border border-slate-300 px-1.5 py-0.5 rounded shadow-2xs text-[10px]">
                ↓
              </kbd>
              <span className="ml-0.5">di chuyển</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-white border border-slate-300 px-1.5 py-0.5 rounded shadow-2xs text-[10px]">
                ↵
              </kbd>
              <span className="ml-0.5">để chọn</span>
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="font-mono bg-white border border-slate-300 px-1.5 py-0.5 rounded shadow-2xs text-[10px]">
                esc
              </kbd>
              <span className="ml-0.5">đóng</span>
            </span>
          </div>

          <div className="text-[10px] text-emerald-700 font-black flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Hạt Kiểm lâm khu vực Krông Bông</span>
          </div>
        </div>
      </div>
    </div>
  );
}
