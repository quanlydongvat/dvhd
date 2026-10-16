import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

/**
 * Xuất file Excel "Sổ theo dõi xác nhận bảng kê lâm sản"
 * Đúng mẫu chuẩn theo file So_theo_doi_bang_ke_xuất.xlsx
 */
export async function exportPackingListToExcel(packingListData = []) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Hạt Kiểm Lâm Krông Bông';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Sổ theo dõi', {
    pageSetup: {
      orientation: 'landscape',
      paperSize: 9, // A4
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      margins: {
        left: 0.5,
        right: 0.5,
        top: 0.5,
        bottom: 0.5,
        header: 0.3,
        footer: 0.3,
      },
    },
  });

  // 1. Title Row (Row 1)
  worksheet.mergeCells('A1:F1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'SỔ THEO DÕI XÁC NHẬN BẢNG KÊ LÂM SẢN';
  titleCell.font = { name: 'Times New Roman', size: 14, bold: true, color: { argb: 'FF000000' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(1).height = 35;

  // 2. Header Row (Row 2)
  const headers = [
    'Số TT',
    'Số vào sổ',
    'Ngày, tháng, năm xác nhận',
    'Tên chủ lâm sản',
    'Địa chỉ của chủ lâm sản',
    'Tổng lâm sản xác nhận',
  ];

  const headerRow = worksheet.getRow(2);
  headerRow.height = 30;

  headers.forEach((h, idx) => {
    const colNumber = idx + 1;
    const cell = headerRow.getCell(colNumber);
    cell.value = h;
    cell.font = { name: 'Times New Roman', size: 11, bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE2EFDA' }, // Soft green
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  // 3. Set Column Widths
  worksheet.columns = [
    { key: 'stt', width: 8 },
    { key: 'soVaoSo', width: 16 },
    { key: 'ngayXacNhan', width: 20 },
    { key: 'tenChuLamSan', width: 25 },
    { key: 'diaChi', width: 38 },
    { key: 'tongLamSan', width: 45 },
  ];

  // 4. Data Rows
  packingListData.forEach((item, index) => {
    const rowIdx = index + 3;
    const row = worksheet.getRow(rowIdx);
    row.height = 25;

    row.getCell(1).value = item.stt || (index + 1);
    row.getCell(2).value = item.soVaoSo || '';
    row.getCell(3).value = item.ngayXacNhan || '';
    row.getCell(4).value = item.tenChuLamSan || '';
    row.getCell(5).value = item.diaChi || '';
    row.getCell(6).value = item.tongLamSan || '';

    // Alignments & Fonts
    row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(4).alignment = { horizontal: 'left', vertical: 'middle' };
    row.getCell(5).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
    row.getCell(6).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

    for (let c = 1; c <= 6; c++) {
      const cell = row.getCell(c);
      cell.font = { name: 'Times New Roman', size: 11 };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }
  });

  // 5. Generate and Download File
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const todayStr = new Date().toISOString().slice(0, 10);
  saveAs(blob, `So_theo_doi_bang_ke_lam_san_${todayStr}.xlsx`);
}
