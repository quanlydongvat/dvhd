/**
 * Core calculation logic for Wildlife Monitoring Logbook (Form II - Breeding Facilities)
 * According to Circular 85/2025/TT-BNNMT and official guidelines:
 * - Col 2 (Total) = (3) + (4) + (5) + (6) + (7)
 * - Row A: Initial stock
 * - Row B, C...: Fluctuations calculated relative to previous row state:
 *   (B3) = (A3) + (B8) - (B13)
 *   (B4) = (A4) + (B9) - (B14)
 *   (B5) = (A5) + (B10) - (B15)
 *   (B6) = (A6) + (B11) - (B16)
 *   (B7) = (A7) + (B12) - (B17)
 *   (B2) = (B3) + (B4) + (B5) + (B6) + (B7)
 */

export const PURPOSE_CODES = [
  { code: 'T', name: 'Thương mại' },
  { code: 'Z', name: 'Vườn thú, trưng bày' },
  { code: 'Q', name: 'Biểu diễn xiếc' },
  { code: 'R', name: 'Cứu hộ' },
  { code: 'S', name: 'Nghiên cứu khoa học' },
  { code: 'C', name: 'Bảo tồn' },
  { code: 'E', name: 'Du lịch sinh thái' },
  { code: 'O', name: 'Khác (ví dụ như làm cảnh)' },
];

/**
 * Standard suggested reasons for Circular 85/2025/TT-BNNMT internal transfers
 */
export const INTERNAL_TRANSFER_REASONS = [
  'Chuyển cá thể đực đủ tuổi vào đàn bố mẹ.',
  'Chuyển cá thể cái đủ tuổi vào đàn bố mẹ.',
  'Chuyển cá thể đực và cái đủ tuổi vào đàn bố mẹ.',
];

/**
 * Independent Logic Helper according to Circular 85/2025/TT-BNNMT:
 * Manages internal group transfers from "Other Individuals" to "Breeding Stock (Parents)".
 * - Male transfer: Inc Father B8 = X => Dec Other Male B15 = X
 * - Female transfer: Inc Mother B9 = Y => Dec Other Female B16 = Y
 * 
 * Verifies that total stock remains conserved when purely transferring internally:
 * (B3 + B4 + B5 + B6 + B7) === (A3 + A4 + A5 + A6 + A7)
 */
export function processInternalTransfer({
  incFather = 0,
  incMother = 0,
  incOtherMale = 0,
  incOtherFemale = 0,
  incOtherUnknown = 0,
  decFather = 0,
  decMother = 0,
  decOtherMale = 0,
  decOtherFemale = 0,
  decOtherUnknown = 0,
}) {
  const iF = Math.max(0, parseInt(incFather) || 0);
  const iM = Math.max(0, parseInt(incMother) || 0);
  const dOM = Math.max(0, parseInt(decOtherMale) || 0);
  const dOF = Math.max(0, parseInt(decOtherFemale) || 0);

  const isInternalTransfer = (iF > 0 || iM > 0) && (incOtherMale === 0 && incOtherFemale === 0 && incOtherUnknown === 0 && decFather === 0 && decMother === 0 && decOtherUnknown === 0);

  // Auto-suggest reason if transferring internal breeding stock
  let suggestedReason = '';
  if (iF > 0 && iM > 0) {
    suggestedReason = 'Chuyển cá thể đực và cái đủ tuổi vào đàn bố mẹ.';
  } else if (iF > 0) {
    suggestedReason = 'Chuyển cá thể đực đủ tuổi vào đàn bố mẹ.';
  } else if (iM > 0) {
    suggestedReason = 'Chuyển cá thể cái đủ tuổi vào đàn bố mẹ.';
  }

  // Validate rule B8 = B15 and B9 = B16
  const isMaleMatched = iF === dOM;
  const isFemaleMatched = iM === dOF;
  const isValid = isMaleMatched && isFemaleMatched;

  let warningMessage = '';
  if (!isValid) {
    warningMessage = 'Chuyển cá thể từ đàn khác sang đàn bố mẹ phải ghi đồng thời: B8 = B15 và B9 = B16.';
  }

  return {
    isInternalTransfer,
    suggestedReason,
    isValid,
    warningMessage,
    autoDecOtherMale: iF,
    autoDecOtherFemale: iM,
  };
}

/**
 * Helper to check if fluctuation reason is purchasing / importing from outside facility
 */
export function isPurchaseFromOutside(reasonStr) {
  if (!reasonStr) return false;
  const lower = reasonStr.toLowerCase();
  return (
    lower.includes('mua') ||
    lower.includes('nhập') ||
    lower.includes('khai thác') ||
    lower.includes('bên ngoài') ||
    lower.includes('cơ sở khác') ||
    lower.includes('ngoại tỉnh') ||
    lower.includes('con giống')
  );
}

/**
 * Generates clean alphabetical row labels according to Excel & standard accounting conventions:
 * - Baseline: A
 * - Fluctuations: B, C, D ... Z
 * - Beyond Z: AA, AB, AC ... AZ, BA, BB ... BZ, CA ...
 */
export function getFluctuationRowLabel(index) {
  if (index < 0) return 'A';
  let num = index + 1; // 1 = B, 25 = Z, 26 = AA
  let label = '';
  while (num >= 0) {
    label = String.fromCharCode(65 + (num % 26)) + label;
    num = Math.floor(num / 26) - 1;
  }
  return label;
}

/**
 * Independent validation function for internal group transfers
 */
export function validateInternalTransfer(formData) {
  const iF = Math.max(0, parseInt(formData.incFather) || 0);
  const iM = Math.max(0, parseInt(formData.incMother) || 0);
  const dOM = Math.max(0, parseInt(formData.decOtherMale) || 0);
  const dOF = Math.max(0, parseInt(formData.decOtherFemale) || 0);

  // If explicit purchasing mode is selected OR reason matches outside purchase OR reductions are 0
  if (formData.isPurchaseMode || isPurchaseFromOutside(formData.reason) || (dOM === 0 && dOF === 0)) {
    return { isValid: true, message: '' };
  }

  // Only if reductions in B15 or B16 are explicitly entered for internal transfer
  if ((iF > 0 || iM > 0) && (dOM > 0 || dOF > 0)) {
    if (iF !== dOM || iM !== dOF) {
      return {
        isValid: false,
        message:
          'Chuyển cá thể từ đàn khác sang đàn bố mẹ phải ghi đồng thời: B8 = B15 và B9 = B16. (Nếu mua từ cơ sở khác, vui lòng chọn hình thức "Mua từ cơ sở khác").',
      };
    }
  }

  return { isValid: true, message: '' };
}

/**
 * Calculates complete table rows starting from Row A baseline through chronological fluctuations
 * @param {Object} baseline - Initial stock object { father, mother, otherMale, otherFemale, otherUnknown, date }
 * @param {Array} fluctuations - Array of fluctuation objects
 * @returns {Array} List of processed rows with computed totals and running balances
 */
export function computeLogbookTable(baseline = {}, fluctuations = []) {
  const processedRows = [];
  const safeBaseline = baseline || {};

  // Parse baseline numbers
  const bFather = Math.max(0, parseInt(safeBaseline.father) || 0);
  const bMother = Math.max(0, parseInt(safeBaseline.mother) || 0);
  const bOtherMale = Math.max(0, parseInt(safeBaseline.otherMale) || 0);
  const bOtherFemale = Math.max(0, parseInt(safeBaseline.otherFemale) || 0);
  const bOtherUnknown = Math.max(0, parseInt(safeBaseline.otherUnknown) || 0);
  const bTotal = bFather + bMother + bOtherMale + bOtherFemale + bOtherUnknown;

  // Dòng A (Khởi tạo hiện trạng ban đầu)
  const rowA = {
    rowId: 'A',
    label: 'A',
    isBaseline: true,
    date: safeBaseline.date || '',
    // Current status (Cols 2 - 7)
    total: bTotal,
    father: bFather,
    mother: bMother,
    otherMale: bOtherMale,
    otherFemale: bOtherFemale,
    otherUnknown: bOtherUnknown,
    // Increases (Cols 8 - 12)
    incFather: 0,
    incMother: 0,
    incOtherMale: 0,
    incOtherFemale: 0,
    incOtherUnknown: 0,
    // Decreases (Cols 13 - 17)
    decFather: 0,
    decMother: 0,
    decOtherMale: 0,
    decOtherFemale: 0,
    decOtherUnknown: 0,
    reason: safeBaseline.note || 'Số lượng vật nuôi hiện có ban đầu',
    verifier: safeBaseline.verifier || '',
  };

  processedRows.push(rowA);

  // Sort fluctuations chronologically (Date ascending, then created timestamp or order index)
  const safeFluctuations = Array.isArray(fluctuations) ? fluctuations : [];
  const sortedFluctuations = [...safeFluctuations].sort((a, b) => {
    const dateA = new Date(a.date + (a.time ? `T${a.time}` : 'T00:00:00'));
    const dateB = new Date(b.date + (b.time ? `T${b.time}` : 'T00:00:00'));
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }
    return (a.createdAt || 0) - (b.createdAt || 0);
  });

  let prevRow = rowA;

  // Process rows B, C, D...
  sortedFluctuations.forEach((item, index) => {
    // Generate letter or row label B, C, D... Z, AA, AB, AC...
    const rowLabel = getFluctuationRowLabel(index);

    const incF = Math.max(0, parseInt(item.incFather) || 0);
    const incM = Math.max(0, parseInt(item.incMother) || 0);
    const incOM = Math.max(0, parseInt(item.incOtherMale) || 0);
    const incOF = Math.max(0, parseInt(item.incOtherFemale) || 0);
    const incOU = Math.max(0, parseInt(item.incOtherUnknown) || 0);

    const decF = Math.max(0, parseInt(item.decFather) || 0);
    const decM = Math.max(0, parseInt(item.decMother) || 0);
    const decOM = Math.max(0, parseInt(item.decOtherMale) || 0);
    const decOF = Math.max(0, parseInt(item.decOtherFemale) || 0);
    const decOU = Math.max(0, parseInt(item.decOtherUnknown) || 0);

    // Apply formulas according to Circular 85/2025/TT-BNNMT:
    // B3 = A3 + B8 - B13
    // B4 = A4 + B9 - B14
    // B5 = A5 + B10 - B15
    // B6 = A6 + B11 - B16
    // B7 = A7 + B12 - B17
    const currFather = prevRow.father + incF - decF;
    const currMother = prevRow.mother + incM - decM;
    const currOtherMale = prevRow.otherMale + incOM - decOM;
    const currOtherFemale = prevRow.otherFemale + incOF - decOF;
    const currOtherUnknown = prevRow.otherUnknown + incOU - decOU;
    
    // Col 2: Total = Sum of Cols 3-7
    const currTotal = currFather + currMother + currOtherMale + currOtherFemale + currOtherUnknown;

    // Check if this row is a pure internal transfer
    const isInternalTransfer = (incF > 0 || incM > 0) && (incOM === 0 && incOF === 0 && incOU === 0 && decF === 0 && decM === 0 && decOU === 0) && (incF === decOM && incM === decOF);

    const rowObj = {
      ...item,
      rowId: item.id || `row_${index}`,
      label: rowLabel,
      isBaseline: false,
      date: item.date || '',
      time: item.time || '',
      // Current status (Cols 2 - 7)
      total: currTotal,
      father: currFather,
      mother: currMother,
      otherMale: currOtherMale,
      otherFemale: currOtherFemale,
      otherUnknown: currOtherUnknown,
      // Increases (Cols 8 - 12)
      incFather: incF,
      incMother: incM,
      incOtherMale: incOM,
      incOtherFemale: incOF,
      incOtherUnknown: incOU,
      // Decreases (Cols 13 - 17)
      decFather: decF,
      decMother: decM,
      decOtherMale: decOM,
      decOtherFemale: decOF,
      decOtherUnknown: decOU,
      // Metadata
      reason: item.reason || '',
      purpose: item.purpose || '',
      verifier: item.verifier || '',
      isInternalTransfer,
      // Warnings if negative balances occur
      hasWarning: currFather < 0 || currMother < 0 || currOtherMale < 0 || currOtherFemale < 0 || currOtherUnknown < 0,
    };

    processedRows.push(rowObj);
    prevRow = rowObj;
  });

  return processedRows;
}

/**
 * Helper function to determine if a species belongs to the Bird group (Nhóm Chim)
 */
export function isBirdSpecies(sp) {
  if (!sp || !sp.vietnameseName) return false;
  const name = sp.vietnameseName.toLowerCase();
  return (
    name.includes('chim') ||
    name.includes('cu gáy') ||
    name.includes('chào mào') ||
    name.includes('trĩ') ||
    name.includes('vẹt') ||
    name.includes('khướu') ||
    name.includes('họa mi') ||
    name.includes('sáo') ||
    name.includes('công') ||
    name.includes('bồ câu') ||
    name.includes('vịt trời')
  );
}

/**
 * Helper function to determine if a species belongs to Class Mammalia (Lớp Thú)
 */
export function isMammalSpecies(sp) {
  if (!sp) return false;
  return !isBirdSpecies(sp);
}

/**
 * Determine if a species is CITES / Endangered / Quý hiếm
 */
export function isCitesSpecies(sp) {
  if (!sp) return false;
  
  // Explicitly exclude known common species that might be misclassified
  // due to vague group or citesAppendix strings
  const name = (sp.vietnameseName || '').toLowerCase();
  const commonNames = [
    'chim cu gáy', 'cu gáy', 
    'chim chào mào', 'chào mào', 
    'chim sáo', 'sáo', 
    'chích chòe', 
    'họa mi', 
    'khướu',
    'dúi má đào', 'dúi',
    'don'
  ];
  
  if (commonNames.some(cn => name.includes(cn))) {
    return false;
  }

  const groupStr = (sp.group || '') + ' ' + (sp.citesAppendix || '');
  return (
    groupStr.includes('IB') ||
    groupStr.includes('IIB') ||
    groupStr.toLowerCase().includes('cites') ||
    groupStr.toLowerCase().includes('nguy cấp') ||
    groupStr.toLowerCase().includes('quý')
  );
}

/**
 * Canonical species mapping to merge duplicate names with different casing / accents / spelling
 */
export function getCanonicalSpecies(vietnameseName, scientificName = '') {
  const cleanVn = (vietnameseName || '').trim();
  const lowerVn = cleanVn.toLowerCase().replace(/\s+/g, ' ');
  const cleanSci = (scientificName || '').trim();

  // 1. Chim Cu gáy (merge all variants: "Chim Cu Gáy", "chim cu gáy", "cu gáy", etc.)
  if (lowerVn.includes('cu gáy') || lowerVn.includes('cu gay')) {
    return {
      key: 'CHIM_CU_GAY',
      vietnameseName: 'Chim Cu gáy',
      scientificName: 'Streptopelia chinensis',
      group: 'Động vật rừng thông thường (Lớp Chim)',
      citesAppendix: 'Khai báo kiểm lâm',
      isBird: true,
      isCites: false,
    };
  }

  // 2. Chim Chào mào
  if (lowerVn.includes('chào mào') || lowerVn.includes('chao mao')) {
    return {
      key: 'CHIM_CHAO_MAO',
      vietnameseName: 'Chim Chào mào',
      scientificName: 'Pycnonotus jocosus',
      group: 'Động vật rừng thông thường (Lớp Chim)',
      citesAppendix: 'Khai báo kiểm lâm',
      isBird: true,
      isCites: false,
    };
  }

  // 3. Cầy vòi Hương
  if (lowerVn.includes('cầy vòi hương') || lowerVn.includes('cay voi huong')) {
    return {
      key: 'CAY_VOI_HUONG',
      vietnameseName: 'Cầy vòi Hương',
      scientificName: 'Paradoxurus hermaphroditus',
      group: 'Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)',
      citesAppendix: 'Phụ lục II CITES',
      isBird: false,
      isCites: true,
    };
  }

  // 4. Cầy vòi mốc
  if (lowerVn.includes('cầy vòi mốc') || lowerVn.includes('cay voi moc')) {
    return {
      key: 'CAY_VOI_MOC',
      vietnameseName: 'Cầy vòi mốc',
      scientificName: 'Paguma larvata',
      group: 'Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)',
      citesAppendix: 'Phụ lục II CITES',
      isBird: false,
      isCites: true,
    };
  }

  // 5. Dúi má đào
  if (lowerVn.includes('dúi má đào') || lowerVn.includes('dui ma dao')) {
    return {
      key: 'DUI_MA_DAO',
      vietnameseName: 'Dúi má đào',
      scientificName: 'Rhizomys sumatrensis',
      group: 'Động vật rừng thông thường',
      citesAppendix: 'Khai báo kiểm lâm',
      isBird: false,
      isCites: false,
    };
  }

  // 6. Dúi mốc lớn / Dúi mốc
  if (lowerVn.includes('dúi mốc') || lowerVn.includes('dui moc')) {
    return {
      key: 'DUI_MOC_LON',
      vietnameseName: 'Dúi mốc lớn',
      scientificName: 'Rhizomys pruinosus',
      group: 'Động vật rừng thông thường',
      citesAppendix: 'Khai báo kiểm lâm',
      isBird: false,
      isCites: false,
    };
  }

  // 7. Don
  if (lowerVn === 'don' || lowerVn.startsWith('don ') || lowerVn.endsWith(' don')) {
    return {
      key: 'DON',
      vietnameseName: 'Don',
      scientificName: 'Atherurus macrourus',
      group: 'Động vật rừng thông thường',
      citesAppendix: 'Khai báo kiểm lâm',
      isBird: false,
      isCites: false,
    };
  }

  // 8. Nhím
  if (lowerVn.includes('nhím') || lowerVn.includes('nhim')) {
    return {
      key: 'NHIM',
      vietnameseName: 'Nhím',
      scientificName: 'Hystrix brachyura',
      group: 'Động vật rừng thông thường',
      citesAppendix: 'Khai báo kiểm lâm',
      isBird: false,
      isCites: false,
    };
  }

  return {
    key: lowerVn,
    vietnameseName: cleanVn,
    scientificName: cleanSci,
    group: '',
    citesAppendix: '',
    isBird: false,
    isCites: isCitesSpecies({ vietnameseName: cleanVn, scientificName: cleanSci }),
  };
}

/**
 * Helper function to categorize a facility: 'BIRD', 'MAMMAL_REPTILE', or 'MIXED'
 */
export function getFacilityCategory(facility) {
  if (!facility || !facility.speciesList || facility.speciesList.length === 0) return 'MAMMAL_REPTILE';
  const hasBirds = facility.speciesList.some((sp) => isBirdSpecies(sp));
  const hasOthers = facility.speciesList.some((sp) => !isBirdSpecies(sp));
  if (hasBirds && hasOthers) return 'MIXED';
  if (hasBirds) return 'BIRD';
  return 'MAMMAL_REPTILE';
}

/**
 * Format Date DD/MM/YYYY
 */
export function formatDateVN(dateStr) {
  if (!dateStr) return '';
  if (typeof dateStr !== 'string') return dateStr;
  
  // If already in DD/MM/YYYY format
  if (dateStr.includes('/')) return dateStr;

  try {
    const clean = dateStr.split('T')[0].trim();
    const parts = clean.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      if (year.length === 4) {
        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
      }
    }
  } catch (e) {}
  
  return dateStr;
}

/**
/**
 * Helper to determine if a species is Endangered/Precious/Rare (CITES / Group IB / Group IIB)
 */
export function isCitesOrEndangeredSpecies(sp) {
  if (!sp) return false;
  const canonical = getCanonicalSpecies(sp.vietnameseName, sp.scientificName);
  if (canonical && typeof canonical.isCites === 'boolean') {
    return canonical.isCites;
  }
  return isCitesSpecies(sp);
}

/**
 * Check if a facility or specific species requires a Registration Code under Forestry Regulations (Decree 84/2021 & Circular 85/2025).
 * - Common Wildlife (Động vật rừng thông thường, e.g. Chim Chào mào, Chim Cu gáy): DOES NOT require a Registration Code ("Không cần mã số").
 * - Endangered / CITES / Group IB, IIB (Động vật nguy cấp, quý, hiếm): REQUIRES a Registration Code ("Chưa cấp" or assigned code).
 */
export function getRegistrationCodeStatus(facility, species = null) {
  if (!facility) return { text: 'Không cần mã số', shortText: 'Không cần mã số', isRequired: false, isAssigned: false };

  const code = (facility.registrationCode || '').trim();
  const hasValidCode = code && 
    code !== 'Đang cập nhật' && 
    code !== 'Chưa có' && 
    code !== '---' && 
    code !== 'Chưa cấp mã số' &&
    !code.toLowerCase().includes('chưa');

  if (hasValidCode) {
    return {
      text: code,
      shortText: code,
      isRequired: true,
      isAssigned: true,
    };
  }

  // If specific species is passed, evaluate if that species requires a registration code
  let requiresCode = false;
  if (species) {
    requiresCode = isCitesOrEndangeredSpecies(species);
  } else {
    // Check if facility breeds any CITES / Group IB / Group IIB species
    requiresCode = (facility.speciesList || []).some((sp) => isCitesOrEndangeredSpecies(sp));
  }

  if (!requiresCode) {
    return {
      text: 'Không cần mã số',
      shortText: 'Không cần mã số',
      isRequired: false,
      isAssigned: false,
    };
  }

  return {
    text: 'Chưa cấp mã số',
    shortText: 'Chưa cấp',
    isRequired: true,
    isAssigned: false,
  };
}



