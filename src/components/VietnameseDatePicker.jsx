import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Check, Clock } from 'lucide-react';

// Vietnamese Localization constants
const VN_DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const VN_DAYS_FULL = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const VN_MONTHS = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

/**
 * Safely parse date from either 'YYYY-MM-DD' or 'DD/MM/YYYY' or Date instance
 */
function parseDateParts(val) {
  if (!val) return null;
  if (val instanceof Date && !isNaN(val.getTime())) {
    return {
      year: val.getFullYear(),
      month: val.getMonth() + 1,
      day: val.getDate()
    };
  }
  if (typeof val !== 'string') return null;

  const clean = val.split('T')[0].trim();
  if (clean.includes('/')) {
    const parts = clean.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year) && year > 1000) {
        return { year, month, day };
      }
    }
  } else if (clean.includes('-')) {
    const parts = clean.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year) && year > 1000) {
        return { year, month, day };
      }
    }
  }
  return null;
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function toISOString(y, m, d) {
  return `${y}-${pad2(m)}-${pad2(d)}`;
}

function toVNString(y, m, d) {
  return `${pad2(d)}/${pad2(m)}/${y}`;
}

export default function VietnameseDatePicker({
  value = '',
  onChange,
  outputFormat = 'YYYY-MM-DD', // 'YYYY-MM-DD' or 'DD/MM/YYYY'
  placeholder = 'dd/mm/yyyy (ngày/tháng/năm)',
  required = false,
  disabled = false,
  className = '',
  id,
  name,
}) {
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Parsed initial date
  const parsed = parseDateParts(value);
  const today = new Date();
  const todayParts = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate()
  };

  const [viewYear, setViewYear] = useState(parsed ? parsed.year : todayParts.year);
  const [viewMonth, setViewMonth] = useState(parsed ? parsed.month : todayParts.month);
  const [inputText, setInputText] = useState(parsed ? toVNString(parsed.year, parsed.month, parsed.day) : '');

  const [placement, setPlacement] = useState('bottom');

  // Keep internal text synced when value prop changes externally
  useEffect(() => {
    const p = parseDateParts(value);
    if (p) {
      setInputText(toVNString(p.year, p.month, p.day));
      setViewYear(p.year);
      setViewMonth(p.month);
    } else {
      setInputText('');
    }
  }, [value]);

  // Smart placement (top vs bottom)
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 340 && rect.top > 340) {
        setPlacement('top');
      } else {
        setPlacement('bottom');
      }
    }
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Select a specific day
  const handleSelectDay = (year, month, day) => {
    const iso = toISOString(year, month, day);
    const vn = toVNString(year, month, day);
    setInputText(vn);
    setViewYear(year);
    setViewMonth(month);
    setIsOpen(false);

    if (onChange) {
      onChange(outputFormat === 'DD/MM/YYYY' ? vn : iso);
    }
  };

  // Jump to Today
  const handlePickToday = () => {
    handleSelectDay(todayParts.year, todayParts.month, todayParts.day);
  };

  // Clear date
  const handleClear = () => {
    setInputText('');
    setIsOpen(false);
    if (onChange) {
      onChange('');
    }
  };

  // Previous & Next Month
  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Direct typing in the input box
  const handleInputChange = (e) => {
    const raw = e.target.value;
    setInputText(raw);

    // Try parsing if complete date typed
    const p = parseDateParts(raw);
    if (p && p.day >= 1 && p.day <= 31 && p.month >= 1 && p.month <= 12 && p.year >= 1900 && p.year <= 2100) {
      setViewYear(p.year);
      setViewMonth(p.month);
      if (onChange) {
        onChange(outputFormat === 'DD/MM/YYYY' ? toVNString(p.year, p.month, p.day) : toISOString(p.year, p.month, p.day));
      }
    }
  };

  // Build calendar matrix (Monday-first: 0 = Mon, 6 = Sun)
  const firstDay = new Date(viewYear, viewMonth - 1, 1);
  const startDayOfWeek = (firstDay.getDay() + 6) % 7; // 0: Mon, 6: Sun
  const daysInCurrentMonth = new Date(viewYear, viewMonth, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth - 1, 0).getDate();

  const calendarDays = [];

  // Trailing days from prev month
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const m = viewMonth === 1 ? 12 : viewMonth - 1;
    const y = viewMonth === 1 ? viewYear - 1 : viewYear;
    calendarDays.push({ year: y, month: m, day, isCurrentMonth: false });
  }

  // Days of current month
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    calendarDays.push({ year: viewYear, month: viewMonth, day: d, isCurrentMonth: true });
  }

  // Leading days of next month to fill complete grid
  const remainingCells = (7 - (calendarDays.length % 7)) % 7;
  for (let d = 1; d <= remainingCells; d++) {
    const m = viewMonth === 12 ? 1 : viewMonth + 1;
    const y = viewMonth === 12 ? viewYear + 1 : viewYear;
    calendarDays.push({ year: y, month: m, day: d, isCurrentMonth: false });
  }

  // Year options for fast select
  const currentYear = todayParts.year;
  const yearOptions = [];
  for (let y = currentYear - 20; y <= currentYear + 10; y++) {
    yearOptions.push(y);
  }

  // Selected date description in Vietnamese
  let selectedDesc = '';
  if (parsed) {
    const jsDate = new Date(parsed.year, parsed.month - 1, parsed.day);
    const dayOfWeekStr = VN_DAYS_FULL[jsDate.getDay()];
    selectedDesc = `${dayOfWeekStr}, ngày ${pad2(parsed.day)} tháng ${pad2(parsed.month)} năm ${parsed.year}`;
  }

  return (
    <div ref={containerRef} className="relative inline-block w-full">
      {/* Trigger Input */}
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onClick={() => !disabled && setIsOpen(true)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={className || "w-full bg-slate-50 border border-slate-300 rounded-xl pl-3 pr-16 py-2 text-sm text-slate-900 font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white shadow-xs transition-colors"}
        />

        <div className="absolute right-2 flex items-center gap-1">
          {inputText && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              title="Xóa ngày"
              className="p-1 text-slate-400 hover:text-rose-500 rounded-md transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            title="Mở lịch chọn ngày tiếng Việt"
            className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
          >
            <CalendarIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Popover Calendar (100% Vietnamese) */}
      {isOpen && (
        <div className={`absolute left-0 ${placement === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'} z-50 w-72 sm:w-80 bg-white border border-emerald-300 rounded-2xl shadow-2xl p-3 animate-in fade-in zoom-in-95 duration-150 select-none`}>
          {/* Header: Month & Year Selectors with Navigation */}
          <div className="flex items-center justify-between gap-1 pb-2 border-b border-slate-100">
            <button
              type="button"
              onClick={handlePrevMonth}
              title="Tháng trước"
              className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {/* Month Selector */}
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
                className="bg-emerald-50 text-emerald-900 font-bold text-xs py-1 px-2 rounded-lg border border-emerald-200 focus:outline-none cursor-pointer"
              >
                {VN_MONTHS.map((mName, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {mName}
                  </option>
                ))}
              </select>

              {/* Year Selector */}
              <select
                value={viewYear}
                onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
                className="bg-emerald-50 text-emerald-900 font-bold text-xs py-1 px-2 rounded-lg border border-emerald-200 focus:outline-none cursor-pointer"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    Năm {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              title="Tháng sau"
              className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Header: T2, T3, T4, T5, T6, T7, CN */}
          <div className="grid grid-cols-7 gap-1 text-center py-2 text-[11px] font-black tracking-wide border-b border-slate-100">
            {VN_DAYS.map((dayName, idx) => {
              const isSunday = idx === 6;
              const isSaturday = idx === 5;
              return (
                <div
                  key={dayName}
                  title={VN_DAYS_FULL[(idx + 1) % 7]}
                  className={isSunday ? 'text-rose-500' : isSaturday ? 'text-amber-600' : 'text-slate-600'}
                >
                  {dayName}
                </div>
              );
            })}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center py-2">
            {calendarDays.map((item, idx) => {
              const isSelected = parsed && parsed.year === item.year && parsed.month === item.month && parsed.day === item.day;
              const isToday = todayParts.year === item.year && todayParts.month === item.month && todayParts.day === item.day;

              let btnClasses = "h-8 w-8 mx-auto text-xs font-semibold rounded-xl flex items-center justify-center transition-all cursor-pointer ";

              if (isSelected) {
                btnClasses += "bg-emerald-600 text-white font-black shadow-md ring-2 ring-emerald-300 scale-105";
              } else if (isToday) {
                btnClasses += "border border-emerald-500 text-emerald-700 bg-emerald-50 font-black hover:bg-emerald-100";
              } else if (!item.isCurrentMonth) {
                btnClasses += "text-slate-300 hover:text-slate-500 hover:bg-slate-50";
              } else {
                btnClasses += "text-slate-700 hover:bg-emerald-100/70 hover:text-emerald-900";
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectDay(item.year, item.month, item.day)}
                  className={btnClasses}
                >
                  {item.day}
                </button>
              );
            })}
          </div>

          {/* Description of current selection */}
          {selectedDesc && (
            <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-xl px-2.5 py-1.5 text-center text-[11px] text-emerald-800 font-medium">
              <span className="font-bold">{selectedDesc}</span>
            </div>
          )}

          {/* Action Footer: Hôm nay, Xóa, Đóng */}
          <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handlePickToday}
              className="text-xs bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              Hôm nay
            </button>

            <div className="flex items-center gap-1.5">
              {!required && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-rose-600 hover:bg-rose-50 font-medium px-2 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  Xóa
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
