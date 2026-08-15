import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const firebaseConfig = {
  apiKey: "AIzaSyDadtc8c1SltdQqa-aPKmm-pLmd1gO2tlA",
  authDomain: "dvhd-52ebb.firebaseapp.com",
  projectId: "dvhd-52ebb",
  storageBucket: "dvhd-52ebb.firebasestorage.app",
  messagingSenderId: "514944557700",
  appId: "1:514944557700:web:4e947d2f0d31f8cfb3d8d1",
  measurementId: "G-6MKGD9KZ0C"
};

async function exportExcelBackup() {
  console.log("Fetching live data for Excel backup...");
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  let facilitiesList = [];
  const snapshot = await getDocs(collection(db, "facilities"));
  snapshot.forEach(docSnap => facilitiesList.push(docSnap.data()));

  if (facilitiesList.length === 0) {
    const docSnap = await getDoc(doc(db, "wildlife_data", "app_state"));
    if (docSnap.exists()) {
      facilitiesList = docSnap.data().facilitiesList || [];
    }
  }

  // Build Excel sheets
  // Sheet 1: Danh sach co so nuôi
  const facRows = facilitiesList.map((fac, idx) => ({
    "STT": idx + 1,
    "Mã Cơ Sở": fac.code || fac.id,
    "Tên Cơ Sở Nuôi": fac.name,
    "Chủ Cơ Sở": fac.ownerName || fac.name,
    "Số Điện Thoại": fac.phone || fac.ownerPhone || '',
    "Địa Chỉ": fac.address,
    "Xã / Thị Trấn": fac.commune || '',
    "Số Mã Định Danh CITES": fac.citesCode || '',
    "Loại Hình": fac.facilityType || 'Hộ gia đình',
    "Tổng Cá Thể Đang Nuôi": fac.animalsCount || 0,
    "Trạng Thái": fac.status || 'Hoạt động'
  }));

  // Sheet 2: Chi tiết biến động tất cả động vật (Sổ Mẫu II)
  const allLogRows = [];
  facilitiesList.forEach(fac => {
    const logs = fac.logs || fac.fluctuations || [];
    logs.forEach((log, lIdx) => {
      allLogRows.push({
        "Mã Cơ Sở": fac.code || fac.id,
        "Tên Cơ Sở": fac.name,
        "Ngày Ghi Chép": log.date || log.createdDate || '',
        "Tên Loài Động Vật": log.speciesName || log.species || '',
        "Tên Khoa Học": log.scientificName || '',
        "Mã Nhóm ĐVHD (CITES / NĐ84)": log.group || log.citesGroup || '',
        "Tồn Đầu Kỳ": log.openingStock || 0,
        "Tăng Trong Kỳ": log.increaseQuantity || log.imported || 0,
        "Lý Do Tăng": log.increaseReason || log.importSource || '',
        "Giảm Trong Kỳ": log.decreaseQuantity || log.exported || 0,
        "Lý Do Giảm": log.decreaseReason || log.exportDestination || '',
        "Tồn Cuối Kỳ": log.closingStock || log.currentStock || 0,
        "Nguồn Gốc Mẫu Vật": log.origin || log.source || '',
        "Trạng Thái Duyệt": log.approvalStatus === 'PENDING' ? 'Chờ duyệt' : 'Đã duyệt'
      });
    });
  });

  const wb = XLSX.utils.book_new();

  const wsFacilities = XLSX.utils.json_to_sheet(facRows);
  XLSX.utils.book_append_sheet(wb, wsFacilities, "Danh Sách Cơ Sở Nuôi");

  if (allLogRows.length > 0) {
    const wsLogs = XLSX.utils.json_to_sheet(allLogRows);
    XLSX.utils.book_append_sheet(wb, wsLogs, "Sổ Ghi Chép Biến Động (Chi Tiết)");
  }

  const backupDir = path.join(process.cwd(), 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const excelFilename = `BANG_TONG_HOP_DU_LIEU_DONG_VAT_${timestamp}.xlsx`;
  const excelPath = path.join(backupDir, excelFilename);

  XLSX.writeFile(wb, excelPath);

  console.log(`======================================================`);
  console.log(`✅ EXCEL BACKUP CREATED SUCCESSFULLY!`);
  console.log(`📁 File path: ${excelPath}`);
  console.log(`📊 Total facilities: ${facRows.length}`);
  console.log(`📜 Total log records: ${allLogRows.length}`);
  console.log(`======================================================`);

  process.exit(0);
}

exportExcelBackup();
