import * as XLSX from 'xlsx';
import { formatDateVN, PURPOSE_CODES } from './calculations';

/**
 * Export 19-Column Wildlife Logbook to Excel (.xlsx) file
 * formatted according to Official Forest Ranger guidelines
 */
export function exportToExcel(species, rows, facilityInfo) {
  const purposeObj = PURPOSE_CODES.find((p) => p.code === (species.purposeCode || facilityInfo.purposeCode));
  const purposeStr = purposeObj ? `${purposeObj.code} - ${purposeObj.name}` : (species.purposeCode || facilityInfo.purposeCode || '');

  // Build workbook data matrix
  const sheetData = [];

  // Title
  sheetData.push(['SỔ THEO DÕI BIẾN ĐỘNG ĐỘNG VẬT HOANG DÃ (MẪU II - CƠ SỞ NUÔI SINH SẢN)']);
  sheetData.push([]);
  sheetData.push([`Tên cơ sở nuôi: ${facilityInfo.facilityName || ''}`, '', '', '', '', `Mã số cơ sở: ${facilityInfo.registrationCode || ''}`]);
  sheetData.push([`Chủ cơ sở: ${facilityInfo.ownerName || ''}`, '', '', '', '', `Địa chỉ: ${facilityInfo.address || ''}`]);
  sheetData.push([`Loài nuôi: ${species.vietnameseName} (${species.scientificName})`, '', '', '', '', `Mục đích nuôi: ${purposeStr}`]);
  sheetData.push([]);

  // Table Headers (Row 7 - 9)
  sheetData.push([
    'STT / Dòng',
    'Ngày/tháng/năm',
    'Hiện trạng nuôi', '', '', '', '', '',
    'Biến động', '', '', '', '', '', '', '', '', '',
    'Nguyên nhân biến động (sinh sản, khai thác, mua, bán, tặng cho, chết...)',
    'Xác nhận của cơ quan kiểm lâm sở tại/Thủy sản',
  ]);

  sheetData.push([
    '', '',
    'Tổng số cá thể',
    'Bố mẹ', '',
    'Các cá thể khác', '', '',
    'Tăng đàn', '', '', '', '',
    'Giảm đàn', '', '', '', '',
    '', '',
  ]);

  sheetData.push([
    '', '',
    '',
    'Bố', 'Mẹ',
    'Đực', 'Cái', 'Chưa XĐ',
    'Bố mẹ', '', 'Cá thể khác', '', '',
    'Bố mẹ', '', 'Cá thể khác', '', '',
    '', '',
  ]);

  sheetData.push([
    '', '',
    '',
    '', '',
    '', '', '',
    'Bố', 'Mẹ', 'Đực', 'Cái', 'Chưa XĐ',
    'Bố', 'Mẹ', 'Đực', 'Cái', 'Chưa XĐ',
    '', '',
  ]);

  // Column Numbers (1 to 19)
  sheetData.push([
    'Label',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'
  ]);

  // Data rows
  rows.forEach((row) => {
    sheetData.push([
      row.label,
      formatDateVN(row.date),
      row.total,
      row.father,
      row.mother,
      row.otherMale,
      row.otherFemale,
      row.otherUnknown,
      row.isBaseline ? '-' : (row.incFather || 0),
      row.isBaseline ? '-' : (row.incMother || 0),
      row.isBaseline ? '-' : (row.incOtherMale || 0),
      row.isBaseline ? '-' : (row.incOtherFemale || 0),
      row.isBaseline ? '-' : (row.incOtherUnknown || 0),
      row.isBaseline ? '-' : (row.decFather || 0),
      row.isBaseline ? '-' : (row.decMother || 0),
      row.isBaseline ? '-' : (row.decOtherMale || 0),
      row.isBaseline ? '-' : (row.decOtherFemale || 0),
      row.isBaseline ? '-' : (row.decOtherUnknown || 0),
      row.reason || '',
      row.verifier || '',
    ]);
  });

  // Footer notes
  sheetData.push([]);
  sheetData.push(['Ghi chú:']);
  sheetData.push(['1. Mục đích nuôi: (T) Thương mại; (Z) Vườn thú; (Q) Biểu diễn xiếc; (R) Cứu hộ; (S) Nghiên cứu KH; (C) Bảo tồn; (E) Du lịch sinh thái; (O) Khác.']);
  sheetData.push(['2. Cột 1 ghi ngày/tháng/năm biến động. Không ghi gộp thông tin nhập xuất trong cùng 1 ngày.']);
  sheetData.push(['3. Tổng số cá thể (cột 2) = (3) + (4) + (5) + (6) + (7).']);
  sheetData.push(['4. Dòng A: Ghi chép số lượng vật nuôi hiện có ban đầu.']);
  sheetData.push(['5. Dòng B, C...: Ghi chép thông tin khi có biến động tăng/giảm đàn.']);
  sheetData.push(['6. Mỗi loài được lập 01 sổ theo dõi riêng.']);

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  // Set column widths
  ws['!cols'] = [
    { wch: 8 },  // STT
    { wch: 14 }, // Date
    { wch: 10 }, // Col 2 Total
    { wch: 7 },  // Col 3
    { wch: 7 },  // Col 4
    { wch: 7 },  // Col 5
    { wch: 7 },  // Col 6
    { wch: 10 }, // Col 7
    { wch: 7 },  // Col 8
    { wch: 7 },  // Col 9
    { wch: 7 },  // Col 10
    { wch: 7 },  // Col 11
    { wch: 10 }, // Col 12
    { wch: 7 },  // Col 13
    { wch: 7 },  // Col 14
    { wch: 7 },  // Col 15
    { wch: 7 },  // Col 16
    { wch: 10 }, // Col 17
    { wch: 35 }, // Col 18 Reason
    { wch: 25 }, // Col 19 Verifier
  ];

  const wb = XLSX.utils.book_new();
  const safeSpeciesName = species.vietnameseName.replace(/[/\\?%*:|"<>]/g, '-').slice(0, 25);
  XLSX.utils.book_append_sheet(wb, ws, `So_Theo_Doi_${safeSpeciesName}`);

  const fileName = `So_Theo_Doi_${safeSpeciesName}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

/**
 * Generate & Download Excel Template (.xlsx) for easy manual data entry
 */
export function downloadExcelTemplate() {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Thông tin cơ sở
  const facilityRows = [
    ['THÔNG TIN CƠ SỞ NUÔI ĐỘNG VẬT HOANG DÃ'],
    [],
    ['Mục thông tin', 'Giá trị mẫu (Hãy sửa theo thông tin thực tế của cơ sở)'],
    ['Tên cơ sở nuôi', 'Cơ sở Nuôi Động vật Hoang dã ABC'],
    ['Chủ cơ sở', 'Nguyễn Văn B'],
    ['Mã số cơ sở', 'CSNSS-2026-001/KL'],
    ['Địa chỉ cơ sở', 'Xã Hưng Lộc, Huyện Thống Nhất, Tỉnh Đồng Nai'],
    ['Số điện thoại', '0987654321'],
    ['Mã mục đích nuôi', 'T'],
    [],
    ['Ghi chú mã mục đích:'],
    ['(T) Thương mại; (Z) Vườn thú; (Q) Biểu diễn xiếc; (R) Cứu hộ; (S) Nghiên cứu khoa học; (C) Bảo tồn; (E) Du lịch sinh thái; (O) Khác.']
  ];
  const wsFacility = XLSX.utils.aoa_to_sheet(facilityRows);
  wsFacility['!cols'] = [{ wch: 25 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, wsFacility, 'Thong_Tin_Co_So');

  // Sheet 2: Danh sách loài & Hiện trạng ban đầu (Dòng A)
  const speciesRows = [
    [
      'Tên tiếng Việt loài',
      'Tên khoa học',
      'Nhóm ĐVHD (VD: Nhóm IB, Nhóm IIB)',
      'Phụ lục CITES (VD: Phụ lục I CITES)',
      'Mục đích (T/Z/C...)',
      'Ngày chốt ban đầu (YYYY-MM-DD)',
      'Bố (cột 3)',
      'Mẹ (cột 4)',
      'Đực (cột 5)',
      'Cái (cột 6)',
      'Chưa XĐ (cột 7)',
      'Ghi chú hiện trạng',
      'Đơn vị xác nhận'
    ],
    [
      'Trăn đất',
      'Python bivittatus',
      'Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)',
      'Phụ lục II CITES',
      'T',
      '2026-01-01',
      5,
      10,
      4,
      6,
      15,
      'Số lượng vật nuôi hiện có tại trại đầu năm',
      'Hạt Kiểm lâm sở tại'
    ],
    [
      'Hổ Đông Dương',
      'Panthera tigris corbetti',
      'Động vật rừng nguy cấp, quý, hiếm (Nhóm IB)',
      'Phụ lục I CITES',
      'C',
      '2026-01-01',
      2,
      3,
      1,
      2,
      0,
      'Hiện trạng vật nuôi ghi nhận đầu năm',
      'Chi cục Kiểm lâm'
    ]
  ];
  const wsSpecies = XLSX.utils.aoa_to_sheet(speciesRows);
  wsSpecies['!cols'] = [
    { wch: 22 }, { wch: 25 }, { wch: 35 }, { wch: 20 },
    { wch: 12 }, { wch: 18 }, { wch: 10 }, { wch: 10 },
    { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 35 }, { wch: 25 }
  ];
  XLSX.utils.book_append_sheet(wb, wsSpecies, 'Danh_Sach_Loai');

  // Sheet 3: Lịch sử biến động
  const fluctuationRows = [
    [
      'Tên tiếng Việt loài',
      'Ngày biến động (YYYY-MM-DD)',
      'Giờ (HH:MM)',
      'Tăng Bố', 'Tăng Mẹ', 'Tăng Đực', 'Tăng Cái', 'Tăng Chưa XĐ',
      'Giảm Bố', 'Giảm Mẹ', 'Giảm Đực', 'Giảm Cái', 'Giảm Chưa XĐ',
      'Nguyên nhân biến động',
      'Xác nhận kiểm lâm / Thủy sản'
    ],
    [
      'Trăn đất',
      '2026-02-20',
      '09:00',
      0, 0, 0, 0, 30,
      0, 0, 0, 0, 0,
      'Sinh sản 30 trăn con lứa F1',
      'Hạt Kiểm lâm xác nhận'
    ],
    [
      'Trăn đất',
      '2026-04-15',
      '15:30',
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 10,
      'Xuất bán 10 trăn con theo hợp đồng số 12',
      'Đã xác nhận'
    ]
  ];
  const wsFluctuation = XLSX.utils.aoa_to_sheet(fluctuationRows);
  wsFluctuation['!cols'] = [
    { wch: 22 }, { wch: 18 }, { wch: 10 },
    { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 12 },
    { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 12 },
    { wch: 40 }, { wch: 25 }
  ];
  XLSX.utils.book_append_sheet(wb, wsFluctuation, 'Lich_Su_Bien_Dong');

  XLSX.writeFile(wb, 'Mau_Nhap_Du_Lieu_Dong_Vat_Hoang_Da.xlsx');
}

/**
 * Export Bảng 1.2 (Số liệu tổng hợp loài Nguy cấp/Quý hiếm/CITES & Thông thường) to Excel (.xlsx)
 * Formatted exactly according to official Government report layout
 */
export function exportCitesTableToExcel(facilitiesList, communeFilter = 'ALL') {
  const speciesMap = {};

  facilitiesList.forEach((fac) => {
    if (communeFilter !== 'ALL' && fac.commune !== communeFilter) return;

    fac.speciesList.forEach((sp) => {
      const name = sp.vietnameseName;
      const b = sp.baseline || {};
      const totalAnimals =
        (Number(b.father) || 0) +
        (Number(b.mother) || 0) +
        (Number(b.otherMale) || 0) +
        (Number(b.otherFemale) || 0) +
        (Number(b.otherUnknown) || 0);

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

  const citesSpecies = Object.values(speciesMap).filter((s) => s.isCites);
  const commonSpecies = Object.values(speciesMap).filter((s) => !s.isCites);

  const sheetData = [];
  sheetData.push([
    '1.2. Số liệu tổng hợp về các loài động vật nguy cấp, quý, hiếm; động vật thuộc Phụ lục CITES và động vật rừng thông thường nuôi trên địa bàn'
  ]);
  sheetData.push([]);

  // Headers (Row 3-4)
  sheetData.push([
    'TT',
    'Tên loài nuôi', '',
    'Số lượng', '', '',
    'Ghi chú'
  ]);

  sheetData.push([
    '',
    'Tên tiếng Việt',
    'Tên khoa học',
    'Tổng số cá thể',
    'Tổng số cơ sở nuôi',
    'Số cơ sở đã đăng ký mã số',
    ''
  ]);

  sheetData.push([
    '1', '2', '3', '4', '5=6+7', '6', '7'
  ]);

  // Section I: Động vật nguy cấp, quý, hiếm; động vật thuộc Phụ lục CITES
  sheetData.push(['I', 'Động vật nguy cấp, quý, hiếm; động vật thuộc Phụ lục CITES', '', '', '', '', '']);

  let grandTotalAnimals = 0;
  let sttI = 1;
  citesSpecies.forEach((s) => {
    grandTotalAnimals += s.totalAnimals;
    sheetData.push([
      sttI++,
      s.vietnameseName,
      s.scientificName,
      s.totalAnimals,
      s.facilitiesSet.size,
      s.registeredFacilitiesSet.size || '',
      ''
    ]);
  });

  // Section II: Động vật rừng thông thường
  sheetData.push(['II', 'Động vật rừng thông thường', '', '', '', '', '']);

  let sttII = 1;
  commonSpecies.forEach((s) => {
    grandTotalAnimals += s.totalAnimals;
    sheetData.push([
      sttII++,
      s.vietnameseName,
      s.scientificName,
      s.totalAnimals,
      s.facilitiesSet.size,
      s.registeredFacilitiesSet.size || '',
      ''
    ]);
  });

  // Grand Total
  sheetData.push(['', 'Tổng', '', grandTotalAnimals, '', '', '']);

  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  ws['!cols'] = [
    { wch: 8 },  // TT
    { wch: 25 }, // Tên tiếng Việt
    { wch: 30 }, // Tên khoa học
    { wch: 18 }, // Tổng số cá thể
    { wch: 20 }, // Tổng số cơ sở nuôi
    { wch: 25 }, // Số cơ sở đã đăng ký mã số
    { wch: 15 }, // Ghi chú
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Tong_Hop_CITES_Thong_Thuong');
  XLSX.writeFile(wb, `Bang_1.2_Tong_Hop_CITES_Thong_Thuong_${new Date().toISOString().slice(0, 10)}.xlsx`);
}


/**
 * Parse uploaded Excel file (.xlsx / .xls) into app data format
 */
export async function parseExcelImport(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });

        let facilityInfo = {
          facilityName: '',
          ownerName: '',
          registrationCode: '',
          address: '',
          phone: '',
          purposeCode: 'T',
        };

        const speciesList = [];
        const sheetNames = workbook.SheetNames;

        // Check if there is a 'Thong_Tin_Co_So' or facility sheet
        const facilitySheetName = sheetNames.find(
          (name) => name.toLowerCase().includes('co_so') || name.toLowerCase().includes('facility')
        );

        if (facilitySheetName) {
          const ws = workbook.Sheets[facilitySheetName];
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
          rows.forEach((r) => {
            if (!r || r.length < 2) return;
            const label = String(r[0] || '').toLowerCase();
            const val = String(r[1] || '').trim();
            if (label.includes('tên cơ sở')) facilityInfo.facilityName = val;
            else if (label.includes('chủ cơ sở')) facilityInfo.ownerName = val;
            else if (label.includes('mã số')) facilityInfo.registrationCode = val;
            else if (label.includes('địa chỉ')) facilityInfo.address = val;
            else if (label.includes('điện thoại') || label.includes('sđt')) facilityInfo.phone = val;
            else if (label.includes('mục đích')) facilityInfo.purposeCode = val.toUpperCase().charAt(0) || 'T';
          });
        }

        // Check if there is a 'Danh_Sach_Loai' sheet
        const speciesSheetName = sheetNames.find(
          (name) => name.toLowerCase().includes('danh_sach_loai') || name.toLowerCase().includes('loai') || name.toLowerCase().includes('species')
        );

        if (speciesSheetName) {
          const ws = workbook.Sheets[speciesSheetName];
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
          // Skip header row if contains 'Tên tiếng Việt' or similar
          const dataRows = rows.filter((r, idx) => idx > 0 && r[0] && String(r[0]).trim() !== '' && !String(r[0]).includes('Tên tiếng Việt'));

          dataRows.forEach((r, index) => {
            const vietnameseName = String(r[0] || '').trim();
            if (!vietnameseName) return;

            const scientificName = String(r[1] || '').trim();
            const group = String(r[2] || '').trim();
            const citesAppendix = String(r[3] || '').trim();
            const purposeCode = String(r[4] || 'T').trim().toUpperCase();

            // Date parsing safely
            let baselineDate = r[5];
            if (baselineDate instanceof Date) {
              baselineDate = baselineDate.toISOString().slice(0, 10);
            } else {
              baselineDate = String(baselineDate || new Date().toISOString().slice(0, 10)).trim();
            }

            const father = Number(r[6]) || 0;
            const mother = Number(r[7]) || 0;
            const otherMale = Number(r[8]) || 0;
            const otherFemale = Number(r[9]) || 0;
            const otherUnknown = Number(r[10]) || 0;
            const note = String(r[11] || '').trim();
            const verifier = String(r[12] || '').trim();

            speciesList.push({
              id: `species_${Date.now()}_${index}`,
              vietnameseName,
              scientificName,
              group,
              citesAppendix,
              purposeCode,
              baseline: {
                date: baselineDate,
                father,
                mother,
                otherMale,
                otherFemale,
                otherUnknown,
                note,
                verifier,
              },
              fluctuations: [],
            });
          });
        }

        // Check if there is a 'Lich_Su_Bien_Dong' sheet
        const fluctuationSheetName = sheetNames.find(
          (name) => name.toLowerCase().includes('bien_dong') || name.toLowerCase().includes('fluctuation')
        );

        if (fluctuationSheetName) {
          const ws = workbook.Sheets[fluctuationSheetName];
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
          const dataRows = rows.filter((r, idx) => idx > 0 && r[0] && String(r[0]).trim() !== '' && !String(r[0]).includes('Tên tiếng Việt'));

          dataRows.forEach((r, idx) => {
            const speciesName = String(r[0] || '').trim().toLowerCase();
            const matchingSpecies = speciesList.find(
              (sp) => sp.vietnameseName.toLowerCase() === speciesName || sp.scientificName.toLowerCase() === speciesName
            );

            if (matchingSpecies) {
              let dateStr = r[1];
              if (dateStr instanceof Date) {
                dateStr = dateStr.toISOString().slice(0, 10);
              } else {
                dateStr = String(dateStr || new Date().toISOString().slice(0, 10)).trim();
              }

              const timeStr = String(r[2] || '08:00').trim();

              const incFather = Number(r[3]) || 0;
              const incMother = Number(r[4]) || 0;
              const incOtherMale = Number(r[5]) || 0;
              const incOtherFemale = Number(r[6]) || 0;
              const incOtherUnknown = Number(r[7]) || 0;

              const decFather = Number(r[8]) || 0;
              const decMother = Number(r[9]) || 0;
              const decOtherMale = Number(r[10]) || 0;
              const decOtherFemale = Number(r[11]) || 0;
              const decOtherUnknown = Number(r[12]) || 0;

              const reason = String(r[13] || '').trim();
              const verifier = String(r[14] || '').trim();

              matchingSpecies.fluctuations.push({
                id: `fluc_${Date.now()}_${idx}`,
                date: dateStr,
                time: timeStr,
                incFather,
                incMother,
                incOtherMale,
                incOtherFemale,
                incOtherUnknown,
                decFather,
                decMother,
                decOtherMale,
                decOtherFemale,
                decOtherUnknown,
                reason,
                verifier,
                createdAt: Date.now() + idx,
              });
            }
          });
        }

        // Fallback: If uploaded file is a single 19-column exported official Excel sheet
        if (speciesList.length === 0 && sheetNames.length > 0) {
          const firstWs = workbook.Sheets[sheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(firstWs, { header: 1 });

          // Try to extract facility info from rows 2-5
          rows.forEach((r) => {
            if (!r) return;
            const lineText = r.join(' ');
            if (lineText.includes('Tên cơ sở nuôi:')) {
              const match = lineText.match(/Tên cơ sở nuôi:\s*([^M]+)/i);
              if (match) facilityInfo.facilityName = match[1].trim();
            }
            if (lineText.includes('Chủ cơ sở:')) {
              const match = lineText.match(/Chủ cơ sở:\s*([^Địa]+)/i);
              if (match) facilityInfo.ownerName = match[1].trim();
            }
            if (lineText.includes('Mã số cơ sở:')) {
              const match = lineText.match(/Mã số cơ sở:\s*(.+)/i);
              if (match) facilityInfo.registrationCode = match[1].trim();
            }
            if (lineText.includes('Địa chỉ:')) {
              const match = lineText.match(/Địa chỉ:\s*(.+)/i);
              if (match) facilityInfo.address = match[1].trim();
            }
          });

          // Look for Baseline row A
          let vietnameseName = 'Loài mới nhập từ Excel';
          let scientificName = 'Species name';

          rows.forEach((r) => {
            const text = (r || []).join(' ');
            if (text.includes('Loài nuôi:')) {
              const match = text.match(/Loài nuôi:\s*([^(]+)\s*\(([^)]+)\)/i);
              if (match) {
                vietnameseName = match[1].trim();
                scientificName = match[2].trim();
              }
            }
          });

          // Find baseline row A
          const rowA = rows.find((r) => r && String(r[0] || '').trim().toUpperCase() === 'A');

          if (rowA) {
            let dateStr = rowA[1];
            if (dateStr instanceof Date) dateStr = dateStr.toISOString().slice(0, 10);
            else dateStr = String(dateStr || new Date().toISOString().slice(0, 10)).trim();

            const baseline = {
              date: dateStr,
              father: Number(rowA[3]) || 0,
              mother: Number(rowA[4]) || 0,
              otherMale: Number(rowA[5]) || 0,
              otherFemale: Number(rowA[6]) || 0,
              otherUnknown: Number(rowA[7]) || 0,
              note: String(rowA[18] || '').trim(),
              verifier: String(rowA[19] || '').trim(),
            };

            const fluctuations = [];
            // Fluctuations are rows B, C, D...
            const fluctuationRows = rows.filter(
              (r) => r && /^[B-Z]$/i.test(String(r[0] || '').trim())
            );

            fluctuationRows.forEach((r, idx) => {
              let flucDate = r[1];
              if (flucDate instanceof Date) flucDate = flucDate.toISOString().slice(0, 10);
              else flucDate = String(flucDate || new Date().toISOString().slice(0, 10)).trim();

              fluctuations.push({
                id: `fluc_${Date.now()}_${idx}`,
                date: flucDate,
                time: '08:00',
                incFather: Number(r[8]) || 0,
                incMother: Number(r[9]) || 0,
                incOtherMale: Number(r[10]) || 0,
                incOtherFemale: Number(r[11]) || 0,
                incOtherUnknown: Number(r[12]) || 0,
                decFather: Number(r[13]) || 0,
                decMother: Number(r[14]) || 0,
                decOtherMale: Number(r[15]) || 0,
                decOtherFemale: Number(r[16]) || 0,
                decOtherUnknown: Number(r[17]) || 0,
                reason: String(r[18] || '').trim(),
                verifier: String(r[19] || '').trim(),
                createdAt: Date.now() + idx,
              });
            });

            speciesList.push({
              id: `species_${Date.now()}`,
              vietnameseName,
              scientificName,
              group: 'Động vật hoang dã',
              citesAppendix: 'Phụ lục II CITES',
              purposeCode: 'T',
              baseline,
              fluctuations,
            });
          }
        }

        resolve({ facilityInfo, speciesList });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

