import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { computeLogbookTable } from './calculations';

export const COMMUNES = ['xã Hòa Sơn', 'xã Yang Mao', 'xã Cư Pui', 'Xã Krông Bông', 'Xã Dang Kang'];

export async function exportDistrictReport(facilitiesList, selectedCommune = 'ALL') {
  // 1. Create a new workbook
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Phần mềm Quản lý ĐVHD';
  workbook.created = new Date();

  // 2. Filter facilities
  let filteredFacs = facilitiesList;
  if (selectedCommune !== 'ALL') {
    filteredFacs = facilitiesList.filter(f => (f.commune || '') === selectedCommune);
  }
  // Sort facilities by commune, then by name
  filteredFacs.sort((a, b) => {
    const cA = a.commune || '';
    const cB = b.commune || '';
    if (cA !== cB) return cA.localeCompare(cB);
    return (a.ownerName || '').localeCompare(b.ownerName || '');
  });

  // Calculate current state for all species in all filtered facilities
  const reportData = [];
  const speciesTotals = {};

  filteredFacs.forEach((fac) => {
    (fac.speciesList || []).forEach((species) => {
      const baseline = species.baseline || {};
      const fluctuations = species.fluctuations || [];
      const computed = computeLogbookTable(baseline, fluctuations);
      const currentState = computed && computed.length > 0 ? computed[computed.length - 1] : null;

      if (!currentState || currentState.total <= 0) return;

      const village = extractVillage(fac.address || '');

      reportData.push({
        commune: fac.commune || '',
        village,
        ownerName: fac.ownerName || '',
        vnName: species.vietnameseName || '',
        sciName: species.scientificName || '',
        total: currentState.total,
        bFather: currentState.father,
        bMother: currentState.mother,
        oMale: currentState.otherMale,
        oFemale: currentState.otherFemale,
        oUnknown: currentState.otherUnknown,
        regCode: fac.registrationCode || '',
        regDate: fac.registrationDate || '',
        purpose: fac.purposeCode || species.purposeCode || 'T',
        note: fac.note || currentState.reason || '',
        group: species.group || '',
        citesAppendix: species.citesAppendix || '',
      });

      // Aggregate for Sheet 2
      const key = `${species.vietnameseName}_${species.scientificName}`;
      if (!speciesTotals[key]) {
        speciesTotals[key] = {
          vnName: species.vietnameseName || '',
          sciName: species.scientificName || '',
          totalAnimals: 0,
          facIds: new Set(),
          facWithCodeIds: new Set(),
          group: species.group || '',
          citesAppendix: species.citesAppendix || '',
        };
      }
      speciesTotals[key].totalAnimals += currentState.total;
      speciesTotals[key].facIds.add(fac.id);

      const isRegistered =
        fac.registrationCode &&
        fac.registrationCode.trim() !== '' &&
        !fac.registrationCode.toLowerCase().includes('chưa') &&
        !fac.registrationCode.toLowerCase().includes('cập nhật');

      if (isRegistered) {
        speciesTotals[key].facWithCodeIds.add(fac.id);
      }
    });
  });

  // --- SHEET 1: Tổng hợp cơ sở nuôi ---
  const sheet1 = workbook.addWorksheet('Tổng hợp cơ sở nuôi');
  buildSheet1(sheet1, reportData);

  // --- SHEET 2: Tổng hợp các loài ---
  const sheet2 = workbook.addWorksheet('Tổng hợp các loài');
  buildSheet2(sheet2, speciesTotals);

  // 3. Export file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const filename =
    selectedCommune === 'ALL'
      ? 'Bao_Cao_Tong_Hop_Toan_Huyen.xlsx'
      : `Bao_Cao_Tong_Hop_${selectedCommune.replace(/\s+/g, '_')}.xlsx`;
  saveAs(blob, filename);
}

function extractVillage(address) {
  if (!address) return '';
  const parts = address.split(',');
  return parts[0].trim();
}

function setHeaderStyle(cell) {
  cell.font = { name: 'Times New Roman', size: 12, bold: true };
  cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  cell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };
}

function setCellStyle(cell, bold = false, align = 'center') {
  cell.font = { name: 'Times New Roman', size: 12, bold };
  cell.alignment = { horizontal: align, vertical: 'middle', wrapText: true };
  cell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };
}

function buildSheet1(ws, data) {
  // Columns width
  ws.columns = [
    { width: 6 }, // A: STT
    { width: 14 }, // B: Xã
    { width: 14 }, // C: Thôn
    { width: 25 }, // D: Họ tên
    { width: 22 }, // E: Tên TV
    { width: 22 }, // F: Tên KH
    { width: 10 }, // G: Tổng
    { width: 10 }, // H: Bố đực
    { width: 10 }, // I: Mẹ cái
    { width: 10 }, // J: Khác đực
    { width: 10 }, // K: Khác cái
    { width: 10 }, // L: Khác chưa
    { width: 18 }, // M: Mã số
    { width: 14 }, // N: Ngày cấp
    { width: 10 }, // O: Mục đích
    { width: 22 }, // P: Ghi chú
  ];

  // Header rows
  ws.mergeCells('A1:A3');
  ws.getCell('A1').value = 'STT';

  ws.mergeCells('B1:D1');
  ws.getCell('B1').value = 'Họ tên và địa chỉ của chủ nuôi';
  ws.mergeCells('B2:B3');
  ws.getCell('B2').value = 'Xã';
  ws.mergeCells('C2:C3');
  ws.getCell('C2').value = 'Thôn/Buôn';
  ws.mergeCells('D2:D3');
  ws.getCell('D2').value = 'Họ tên';

  ws.mergeCells('E1:F1');
  ws.getCell('E1').value = 'Tên loài nuôi';
  ws.mergeCells('E2:E3');
  ws.getCell('E2').value = 'Tên tiếng Việt';
  ws.mergeCells('F2:F3');
  ws.getCell('F2').value = 'Tên khoa học';

  ws.mergeCells('G1:G3');
  ws.getCell('G1').value = 'Tổng';

  ws.mergeCells('H1:I1');
  ws.getCell('H1').value = 'Bố mẹ';
  ws.mergeCells('H2:H3');
  ws.getCell('H2').value = 'Đực';
  ws.getCell('H2').font = { color: { argb: 'FFFF0000' } };
  ws.mergeCells('I2:I3');
  ws.getCell('I2').value = 'Cái';
  ws.getCell('I2').font = { color: { argb: 'FFFF0000' } };

  ws.mergeCells('J1:L1');
  ws.getCell('J1').value = 'Các cá thể khác';
  ws.mergeCells('J2:J3');
  ws.getCell('J2').value = 'Đực';
  ws.mergeCells('K2:K3');
  ws.getCell('K2').value = 'Cái';
  ws.mergeCells('L2:L3');
  ws.getCell('L2').value = 'Chưa';

  ws.mergeCells('M1:M3');
  ws.getCell('M1').value = 'Mã số cơ sở nuôi/ Giấy';

  ws.mergeCells('N1:N3');
  ws.getCell('N1').value = 'Ngày cấp mã số/ Giấy';

  ws.mergeCells('O1:O3');
  ws.getCell('O1').value = 'Mục đích nuôi';

  ws.mergeCells('P1:P3');
  ws.getCell('P1').value = 'Ghi chú';

  // Apply header styles
  for (let r = 1; r <= 3; r++) {
    for (let c = 1; c <= 16; c++) {
      setHeaderStyle(ws.getCell(r, c));
    }
  }

  // Row 4 (Indices)
  const indices = ['1', '2', '3', '4', '5', '6', '7=8+9+10+11+12', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
  for (let c = 1; c <= 16; c++) {
    const cell = ws.getCell(4, c);
    cell.value = indices[c - 1];
    setCellStyle(cell, false, 'center');
    cell.font = { name: 'Times New Roman', size: 10, italic: true, underline: true };
  }

  // Data rows with grouping
  let currentRow = 5;
  let currentCommune = '';
  let communeStartRow = -1;
  let communeIndex = 1;

  let sumTotal = 0;
  let sumFather = 0;
  let sumMother = 0;
  let sumOMale = 0;
  let sumOFemale = 0;
  let sumOUnknown = 0;

  data.forEach((row) => {
    if (row.commune !== currentCommune) {
      if (communeStartRow !== -1 && currentRow - 1 > communeStartRow) {
        ws.mergeCells(`B${communeStartRow}:B${currentRow - 1}`);
      }
      currentCommune = row.commune;
      communeStartRow = currentRow;
      ws.getCell(`A${currentRow}`).value = communeIndex++;
    } else {
      ws.getCell(`A${currentRow}`).value = '';
    }

    ws.getCell(`B${currentRow}`).value = row.commune;
    ws.getCell(`C${currentRow}`).value = row.village;
    ws.getCell(`D${currentRow}`).value = row.ownerName;
    ws.getCell(`E${currentRow}`).value = row.vnName;
    ws.getCell(`F${currentRow}`).value = row.sciName;
    ws.getCell(`F${currentRow}`).font = { name: 'Times New Roman', size: 12, italic: true };
    ws.getCell(`G${currentRow}`).value = row.total || 0;

    ws.getCell(`H${currentRow}`).value = row.bFather || 0;
    ws.getCell(`H${currentRow}`).font = { name: 'Times New Roman', size: 12, color: { argb: 'FFFF0000' } };

    ws.getCell(`I${currentRow}`).value = row.bMother || 0;
    ws.getCell(`I${currentRow}`).font = { name: 'Times New Roman', size: 12, color: { argb: 'FFFF0000' } };

    ws.getCell(`J${currentRow}`).value = row.oMale || 0;
    ws.getCell(`K${currentRow}`).value = row.oFemale || 0;
    ws.getCell(`L${currentRow}`).value = row.oUnknown || 0;
    ws.getCell(`M${currentRow}`).value = row.regCode;
    ws.getCell(`N${currentRow}`).value = row.regDate;
    ws.getCell(`O${currentRow}`).value = row.purpose;
    ws.getCell(`P${currentRow}`).value = row.note;

    sumTotal += row.total || 0;
    sumFather += row.bFather || 0;
    sumMother += row.bMother || 0;
    sumOMale += row.oMale || 0;
    sumOFemale += row.oFemale || 0;
    sumOUnknown += row.oUnknown || 0;

    // Apply styles
    for (let c = 1; c <= 16; c++) {
      const cell = ws.getCell(currentRow, c);
      if (!cell.font) {
        setCellStyle(cell, false, c === 4 || c === 5 || c === 16 ? 'left' : 'center');
      } else {
        const existingFont = cell.font;
        setCellStyle(cell, false, c === 4 || c === 5 || c === 16 ? 'left' : 'center');
        cell.font = { ...cell.font, ...existingFont };
      }
    }
    currentRow++;
  });

  if (communeStartRow !== -1 && currentRow - 1 > communeStartRow) {
    ws.mergeCells(`B${communeStartRow}:B${currentRow - 1}`);
  }

  // TOTAL ROW FOR SHEET 1
  ws.mergeCells(`A${currentRow}:F${currentRow}`);
  ws.getCell(`A${currentRow}`).value = 'Tổng cộng:';
  ws.getCell(`A${currentRow}`).font = { name: 'Times New Roman', size: 12, bold: true };
  ws.getCell(`A${currentRow}`).alignment = { horizontal: 'right', vertical: 'middle' };

  ws.getCell(`G${currentRow}`).value = sumTotal;
  ws.getCell(`H${currentRow}`).value = sumFather;
  ws.getCell(`I${currentRow}`).value = sumMother;
  ws.getCell(`J${currentRow}`).value = sumOMale;
  ws.getCell(`K${currentRow}`).value = sumOFemale;
  ws.getCell(`L${currentRow}`).value = sumOUnknown;

  for (let c = 1; c <= 16; c++) {
    const cell = ws.getCell(currentRow, c);
    cell.font = { name: 'Times New Roman', size: 12, bold: true };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'double' },
      right: { style: 'thin' },
    };
    if (c >= 7 && c <= 12) {
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    }
  }
}

function buildSheet2(ws, speciesTotals) {
  ws.columns = [
    { width: 10 }, // STT
    { width: 28 }, // Tên VN
    { width: 28 }, // Tên KH
    { width: 16 }, // Tổng cá thể
    { width: 16 }, // Tổng số cơ sở
    { width: 20 }, // Số cs đăng ký
    { width: 25 }, // Ghi chú
  ];

  // Title
  ws.mergeCells('A1:G2');
  ws.getCell('A1').value =
    'Số liệu tổng hợp về các loài động vật nguy cấp, quý, hiếm; động vật thuộc Phụ lục CITES và động vật rừng thông thường nuôi trên địa bàn';
  ws.getCell('A1').font = { name: 'Times New Roman', size: 14, bold: true };
  ws.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

  // Headers
  const hRow1 = ws.getRow(3);
  hRow1.values = ['TT', 'Tên loài nuôi', '', 'Số lượng', '', '', 'Ghi chú'];
  ws.mergeCells('B3:C3');
  ws.mergeCells('D3:F3');
  ws.mergeCells('A3:A4');
  ws.mergeCells('G3:G4');

  const hRow2 = ws.getRow(4);
  hRow2.values = [
    '',
    'Tên tiếng Việt',
    'Tên khoa học',
    'Tổng số cá thể',
    'Tổng số cơ sở nuôi',
    'Số cơ sở đã đăng ký mã số',
    '',
  ];

  for (let r = 3; r <= 4; r++) {
    for (let c = 1; c <= 7; c++) {
      setHeaderStyle(ws.getCell(r, c));
    }
  }

  // Indices
  const indices = ['1', '2', '3', '4', '5=6+7', '6', '7'];
  for (let c = 1; c <= 7; c++) {
    const cell = ws.getCell(5, c);
    cell.value = indices[c - 1];
    setCellStyle(cell, false, 'center');
    cell.font = { name: 'Times New Roman', size: 10, italic: true, underline: true };
  }

  let currentRow = 6;

  // Grouping logic
  const citesGroup = [];
  const commonGroup = [];

  Object.values(speciesTotals).forEach((sp) => {
    const groupStr = (sp.group || '') + ' ' + (sp.citesAppendix || '');
    const isCites =
      groupStr.includes('IB') ||
      groupStr.includes('IIB') ||
      groupStr.toLowerCase().includes('cites') ||
      groupStr.toLowerCase().includes('nguy cấp') ||
      groupStr.toLowerCase().includes('quý');

    if (isCites) {
      citesGroup.push(sp);
    } else {
      commonGroup.push(sp);
    }
  });

  const renderGroup = (groupTitle, romanIndex, dataList, defaultNote) => {
    if (dataList.length === 0) return;

    // Header section row
    ws.mergeCells(`A${currentRow}:G${currentRow}`);
    ws.getCell(`A${currentRow}`).value = `${romanIndex}. ${groupTitle}`;
    ws.getCell(`A${currentRow}`).font = { name: 'Times New Roman', size: 12, bold: true };
    ws.getCell(`A${currentRow}`).alignment = { horizontal: 'left', vertical: 'middle' };
    for (let c = 1; c <= 7; c++) {
      ws.getCell(currentRow, c).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }
    currentRow++;

    let sectionAnimals = 0;
    const sectionFacs = new Set();
    const sectionRegFacs = new Set();

    dataList.forEach((sp, idx) => {
      ws.getCell(`A${currentRow}`).value = idx + 1;
      ws.getCell(`B${currentRow}`).value = sp.vnName;
      ws.getCell(`C${currentRow}`).value = sp.sciName;
      ws.getCell(`C${currentRow}`).font = { name: 'Times New Roman', size: 12, italic: true };
      ws.getCell(`D${currentRow}`).value = sp.totalAnimals;
      ws.getCell(`E${currentRow}`).value = sp.facIds.size;
      ws.getCell(`F${currentRow}`).value = sp.facWithCodeIds.size || '---';
      ws.getCell(`G${currentRow}`).value = defaultNote || sp.group || sp.citesAppendix || '';

      sectionAnimals += sp.totalAnimals;
      sp.facIds.forEach((id) => sectionFacs.add(id));
      sp.facWithCodeIds.forEach((id) => sectionRegFacs.add(id));

      for (let c = 1; c <= 7; c++) {
        const cell = ws.getCell(currentRow, c);
        if (!cell.font) {
          setCellStyle(cell, false, 'center');
        } else {
          const existingFont = cell.font;
          setCellStyle(cell, false, 'center');
          cell.font = { ...cell.font, ...existingFont };
        }
      }
      currentRow++;
    });

    // Subtotal row for section
    ws.mergeCells(`A${currentRow}:C${currentRow}`);
    ws.getCell(`A${currentRow}`).value = `Cộng Nhóm ${romanIndex}:`;
    ws.getCell(`A${currentRow}`).font = { name: 'Times New Roman', size: 12, bold: true };
    ws.getCell(`A${currentRow}`).alignment = { horizontal: 'right', vertical: 'middle' };

    ws.getCell(`D${currentRow}`).value = sectionAnimals;
    ws.getCell(`E${currentRow}`).value = sectionFacs.size;
    ws.getCell(`F${currentRow}`).value = sectionRegFacs.size;

    for (let c = 1; c <= 7; c++) {
      const cell = ws.getCell(currentRow, c);
      cell.font = { name: 'Times New Roman', size: 12, bold: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      if (c >= 4 && c <= 6) cell.alignment = { horizontal: 'center', vertical: 'middle' };
    }
    currentRow++;
  };

  renderGroup(
    'Động vật nguy cấp, quý, hiếm; động vật thuộc Phụ lục CITES',
    'I',
    citesGroup,
    ''
  );
  renderGroup('Động vật rừng thông thường', 'II', commonGroup, 'Khai báo kiểm lâm');

  // Grand Total Row
  ws.mergeCells(`A${currentRow}:C${currentRow}`);
  ws.getCell(`A${currentRow}`).value = 'Tổng cộng toàn bộ:';
  ws.getCell(`A${currentRow}`).font = { name: 'Times New Roman', size: 12, bold: true };
  ws.getCell(`A${currentRow}`).alignment = { horizontal: 'right', vertical: 'middle' };

  const allSpecies = Object.values(speciesTotals);
  const grandTotalAnimals = allSpecies.reduce((sum, sp) => sum + sp.totalAnimals, 0);
  const allFacs = new Set();
  const allRegFacs = new Set();
  allSpecies.forEach((sp) => {
    sp.facIds.forEach((id) => allFacs.add(id));
    sp.facWithCodeIds.forEach((id) => allRegFacs.add(id));
  });

  ws.getCell(`D${currentRow}`).value = grandTotalAnimals;
  ws.getCell(`E${currentRow}`).value = allFacs.size;
  ws.getCell(`F${currentRow}`).value = allRegFacs.size;

  for (let c = 1; c <= 7; c++) {
    const cell = ws.getCell(currentRow, c);
    cell.font = { name: 'Times New Roman', size: 12, bold: true };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'double' },
      right: { style: 'thin' },
    };
    if (c >= 4 && c <= 6) cell.alignment = { horizontal: 'center', vertical: 'middle' };
  }
}

export async function exportFacilityLogbook(facility) {
  if (!facility) return;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Phần mềm Quản lý ĐVHD';
  workbook.created = new Date();

  const facName = facility.facilityName || 'Co_So';
  const ownerName = facility.ownerName || '';
  const regCode = facility.registrationCode || 'Chưa cấp';

  (facility.speciesList || []).forEach((species, spIdx) => {
    const rawSheetName = species.vietnameseName || `Loai_${spIdx + 1}`;
    const sheetName = rawSheetName.replace(/[:\\/?*\[\]]/g, '').slice(0, 30);
    const ws = workbook.addWorksheet(sheetName);

    // Title Block
    ws.mergeCells('A1:O1');
    ws.getCell('A1').value = 'SỔ THEO DÕI ĐỘNG VẬT HOANG DÃ NUÔI SINH SẢN, NUÔI SINH TRƯỞNG (MẪU II)';
    ws.getCell('A1').font = { name: 'Times New Roman', size: 14, bold: true };
    ws.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };

    ws.mergeCells('A2:O2');
    ws.getCell('A2').value = `Cơ sở: ${facName} | Chủ cơ sở: ${ownerName} | Mã số đăng ký: ${regCode}`;
    ws.getCell('A2').font = { name: 'Times New Roman', size: 11, italic: true };
    ws.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };

    ws.mergeCells('A3:O3');
    ws.getCell(
      'A3'
    ).value = `Loài nuôi: ${species.vietnameseName || ''} (${species.scientificName || ''}) | Nhóm: ${species.group || 'Thông thường'} | Phụ lục CITES: ${species.citesAppendix || 'Không'}`;
    ws.getCell('A3').font = { name: 'Times New Roman', size: 11, bold: true };
    ws.getCell('A3').alignment = { horizontal: 'center', vertical: 'middle' };

    // Column widths
    ws.columns = [
      { width: 6 }, // A: STT
      { width: 14 }, // B: Ngày tháng
      { width: 9 }, // C: Tăng Bố đực
      { width: 9 }, // D: Tăng Mẹ cái
      { width: 9 }, // E: Tăng Khác đực
      { width: 9 }, // F: Tăng Khác cái
      { width: 9 }, // G: Tăng Khác chưa
      { width: 9 }, // H: Giảm Bố đực
      { width: 9 }, // I: Giảm Mẹ cái
      { width: 9 }, // J: Giảm Khác đực
      { width: 9 }, // K: Giảm Khác cái
      { width: 9 }, // L: Giảm Khác chưa
      { width: 12 }, // M: Tổng cộng
      { width: 28 }, // N: Lý do / Nguồn gốc
      { width: 18 }, // O: Người xác nhận
    ];

    // Header Table
    ws.mergeCells('A4:A5');
    ws.getCell('A4').value = 'STT';

    ws.mergeCells('B4:B5');
    ws.getCell('B4').value = 'Ngày tháng';

    ws.mergeCells('C4:G4');
    ws.getCell('C4').value = 'Số lượng tăng';

    ws.mergeCells('H4:L4');
    ws.getCell('H4').value = 'Số lượng giảm';

    ws.mergeCells('M4:M5');
    ws.getCell('M4').value = 'Tổng cộng';

    ws.mergeCells('N4:N5');
    ws.getCell('N4').value = 'Lý do biến động / Nguồn gốc';

    ws.mergeCells('O4:O5');
    ws.getCell('O4').value = 'Người xác nhận';

    const subHeaders = [
      '',
      '',
      'Bố đực',
      'Mẹ cái',
      'Khác đực',
      'Khác cái',
      'Chưa rõ',
      'Bố đực',
      'Mẹ cái',
      'Khác đực',
      'Khác cái',
      'Chưa rõ',
      '',
      '',
      '',
    ];
    const row5 = ws.getRow(5);
    row5.values = subHeaders;

    for (let r = 4; r <= 5; r++) {
      for (let c = 1; c <= 15; c++) {
        setHeaderStyle(ws.getCell(r, c));
      }
    }

    // Rows calculation
    const baseline = species.baseline || {};
    const fluctuations = species.fluctuations || [];
    const computedRows = computeLogbookTable(baseline, fluctuations);

    let currentRow = 6;
    computedRows.forEach((r, idx) => {
      ws.getCell(`A${currentRow}`).value = idx + 1;
      ws.getCell(`B${currentRow}`).value = r.date || '';
      ws.getCell(`C${currentRow}`).value = r.incFather || '';
      ws.getCell(`D${currentRow}`).value = r.incMother || '';
      ws.getCell(`E${currentRow}`).value = r.incOtherMale || '';
      ws.getCell(`F${currentRow}`).value = r.incOtherFemale || '';
      ws.getCell(`G${currentRow}`).value = r.incOtherUnknown || '';

      ws.getCell(`H${currentRow}`).value = r.decFather || '';
      ws.getCell(`I${currentRow}`).value = r.decMother || '';
      ws.getCell(`J${currentRow}`).value = r.decOtherMale || '';
      ws.getCell(`K${currentRow}`).value = r.decOtherFemale || '';
      ws.getCell(`L${currentRow}`).value = r.decOtherUnknown || '';

      ws.getCell(`M${currentRow}`).value = r.total || 0;
      ws.getCell(`N${currentRow}`).value = r.reason || (r.isBaseline ? 'Số liệu chốt ban đầu' : '');
      ws.getCell(`O${currentRow}`).value = r.verifier || '';

      for (let c = 1; c <= 15; c++) {
        const cell = ws.getCell(currentRow, c);
        setCellStyle(cell, r.isBaseline, c === 14 ? 'left' : 'center');
      }
      currentRow++;
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const filename = `So_Ghi_Chep_Mau2_${facName.replace(/\s+/g, '_')}.xlsx`;
  saveAs(blob, filename);
}

export const exportRegionalSummaryTable = exportDistrictReport;

export function downloadExcelTemplate() {
  const wb = XLSX.utils.book_new();

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

  const speciesRows = [
    [
      'Tên tiếng Việt loài',
      'Tên khoa học',
      'Nhóm ĐVHD (VD: Nhóm IB, Nhóm IIB)',
      'Phụ lục CITES (VD: Phụ lục I CITES)',
      'Mục đích (T/Z/C...)',
      'Ngày chốt ban đầu (YYYY-MM-DD)',
      'Bố đực',
      'Mẹ cái',
      'Khác đực',
      'Khác cái',
      'Khác chưa rõ',
      'Ghi chú nguồn gốc',
      'Người kiểm tra'
    ],
    [
      'Hổ Đông Dương',
      'Panthera tigris',
      'Nhóm IB',
      'Phụ lục I CITES',
      'T',
      '2026-01-01',
      1,
      1,
      0,
      0,
      0,
      'Nhập hợp pháp từ cơ sở X',
      'Nguyễn Văn Kiểm Lâm'
    ]
  ];
  const wsSpecies = XLSX.utils.aoa_to_sheet(speciesRows);
  wsSpecies['!cols'] = [
    { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 18 }, { wch: 10 },
    { wch: 15 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 10 },
    { wch: 25 }, { wch: 20 }
  ];
  XLSX.utils.book_append_sheet(wb, wsSpecies, 'Danh_Sach_Loai');

  const fluctuationRows = [
    [
      'Tên tiếng Việt loài',
      'Ngày biến động (YYYY-MM-DD)',
      'Giờ biến động (HH:MM)',
      'Tăng - Bố đực',
      'Tăng - Mẹ cái',
      'Tăng - Khác đực',
      'Tăng - Khác cái',
      'Tăng - Khác chưa',
      'Giảm - Bố đực',
      'Giảm - Mẹ cái',
      'Giảm - Khác đực',
      'Giảm - Khác cái',
      'Giảm - Khác chưa',
      'Lý do biến động (Sinh sản / Xuất bán / Chết...)',
      'Người xác nhận'
    ]
  ];
  const wsFluctuation = XLSX.utils.aoa_to_sheet(fluctuationRows);
  XLSX.utils.book_append_sheet(wb, wsFluctuation, 'Lich_Su_Bien_Dong');

  XLSX.writeFile(wb, 'Mau_Nhap_Du_Lieu_Dong_Vat_Hoang_Da.xlsx');
}

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

        const speciesSheetName = sheetNames.find(
          (name) => name.toLowerCase().includes('danh_sach_loai') || name.toLowerCase().includes('loai') || name.toLowerCase().includes('species')
        );

        if (speciesSheetName) {
          const ws = workbook.Sheets[speciesSheetName];
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
          const dataRows = rows.filter((r, idx) => idx > 0 && r[0] && String(r[0]).trim() !== '' && !String(r[0]).includes('Tên tiếng Việt'));

          dataRows.forEach((r, index) => {
            const vietnameseName = String(r[0] || '').trim();
            if (!vietnameseName) return;

            const scientificName = String(r[1] || '').trim();
            const group = String(r[2] || '').trim();
            const citesAppendix = String(r[3] || '').trim();
            const purposeCode = String(r[4] || 'T').trim().toUpperCase();

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

        if (speciesList.length === 0 && sheetNames.length > 0) {
          const firstWs = workbook.Sheets[sheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(firstWs, { header: 1 });

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
