import React, { useRef } from 'react';
import { X, Download, Upload, Database, Trash2, FileSpreadsheet, RotateCcw, AlertTriangle } from 'lucide-react';
import { downloadExcelTemplate, parseExcelImport } from '../utils/exportExcel';

export default function ExportImportModal({
  isOpen,
  onClose,
  appData,
  onImportData,
  onClearData,
  onResetDemoData,
}) {
  const jsonInputRef = useRef(null);
  const excelInputRef = useRef(null);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const backupObj = appData?.facilitiesList
      ? {
          exportedAt: new Date().toISOString(),
          totalFacilities: appData.facilitiesList.length,
          facilitiesList: appData.facilitiesList,
        }
      : appData;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Sao_Luu_Toan_Bo_Co_So_Dong_Vat_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleJSONFileChange = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.facilitiesList && Array.isArray(parsed.facilitiesList)) {
            onImportData(parsed);
            alert(`Khôi phục dữ liệu sao lưu thành công! Đã nạp ${parsed.facilitiesList.length} cơ sở nuôi.`);
            onClose();
          } else if (parsed.facilityInfo && parsed.speciesList) {
            onImportData(parsed);
            alert('Khôi phục dữ liệu từ tệp JSON thành công!');
            onClose();
          } else {
            alert('Tệp JSON không đúng định dạng sao lưu của ứng dụng!');
          }
        } catch (err) {
          alert('Lỗi đọc tệp JSON: ' + err.message);
        }
      };
    }
  };

  const handleExcelFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const importedData = await parseExcelImport(e.target.files[0]);
        if (importedData.speciesList.length > 0 || importedData.facilityInfo.facilityName) {
          onImportData(importedData);
          alert(`Nhập dữ liệu từ Excel thành công! Đã nạp ${importedData.speciesList.length} loài nuôi.`);
          onClose();
        } else {
          alert('Không tìm thấy dữ liệu loài hợp lệ trong tệp Excel! Vui lòng tải file mẫu để xem cấu trúc chuẩn.');
        }
      } catch (err) {
        alert('Lỗi đọc file Excel: ' + err.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-200">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Quản Lý & Nhập/Xuất Dữ Liệu</h3>
              <p className="text-xs text-slate-500 font-medium">Làm trống dữ liệu, nhập từ Excel hoặc Sao lưu JSON</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Làm trống dữ liệu (Clear Data) */}
          <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-rose-900">
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Làm Trống Toàn Bộ Dữ Liệu (Xóa Trắng)</span>
              </div>
              <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-mono font-bold">Bắt đầu mới</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Xóa sạch danh sách loài, lịch sử biến động và thông tin cơ sở cũ để bạn tự nhập lại từ đầu bằng tay hoặc nạp từ Excel.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (window.confirm('⚠️ Bạn có chắc chắn muốn XÓA TRẮNG TOÀN BỘ dữ liệu cơ sở và loài nuôi không?\nThao tác này không thể hoàn tác trừ khi bạn có bản sao lưu.')) {
                    onClearData();
                    onClose();
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 rounded-xl transition-all shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa Trắng Dữ Liệu Ngay</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Bạn có muốn khôi phục lại dữ liệu mẫu Demo (Hổ Đông Dương & Trăn đất) không?')) {
                    onResetDemoData();
                    onClose();
                  }
                }}
                className="flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs px-3 py-2 rounded-xl transition-all border border-slate-300 shadow-xs"
                title="Khôi phục lại dữ liệu thử nghiệm ban đầu"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nạp lại Demo</span>
              </button>
            </div>
          </div>

          {/* Section 2: Excel Import & Template */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-950">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Nhập Dữ Liệu Từ Excel (.xlsx / .xls)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Tải file mẫu Excel chuẩn để điền danh sách loài nuôi & biến động, sau đó tải file Excel đó lên phần mềm.
            </p>
            
            <input
              type="file"
              ref={excelInputRef}
              onChange={handleExcelFileChange}
              accept=".xlsx, .xls"
              className="hidden"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={downloadExcelTemplate}
                className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-300 font-bold text-xs py-2 rounded-xl transition-all shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải File Excel Mẫu (.xlsx)</span>
              </button>

              <button
                onClick={() => excelInputRef.current?.click()}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-xl transition-all shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Chọn File Excel Đã Điền</span>
              </button>
            </div>
          </div>

          {/* Section 3: Backup & Restore JSON */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Database className="w-4 h-4 text-indigo-600" />
              <span>Sao Lưu / Khôi Phục File JSON hệ thống</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Xuất tệp sao lưu nguyên bản `.json` để lưu trữ an toàn hoặc di chuyển dữ liệu sang máy tính khác.
            </p>
            
            <input
              type="file"
              ref={jsonInputRef}
              onChange={handleJSONFileChange}
              accept=".json"
              className="hidden"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={handleExportJSON}
                className="flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs py-2 rounded-xl transition-all border border-slate-300 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải File Sao Lưu (.JSON)</span>
              </button>

              <button
                onClick={() => jsonInputRef.current?.click()}
                className="flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs py-2 rounded-xl transition-all border border-slate-300 shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Nạp File JSON Sao Lưu</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors shadow-xs"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

