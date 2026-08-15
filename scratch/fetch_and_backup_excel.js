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
    "Tên Cơ Sở Nuôi": fac.facilityName || fac.name,
    "Chủ Cơ Sở": fac.ownerName || fac.name,
    "Số Điện Thoại": fac.phone || fac.ownerPhone || '',
    "Địa Chỉ": fac.address,
    "Xã / Thị Trấn": fac.commune || '',
    "Vĩ Độ (Lat)": fac.lat || '',
    "Kinh Độ (Lng)": fac.lng || '',
    "Mã Số Đăng Ký / CITES": fac.registrationCode || fac.citesCode || '',
    "Loại Hình": fac.facilityType || 'Hộ gia đình',
    "Trạng Thái": fac.status || 'Hoạt động'
  }));

  // Sheet 2: Chi tiết biến động tất cả động vật (Sổ Mẫu II)
  const allLogRows = [];
  facilitiesList.forEach(fac => {
    (fac.speciesList || []).forEach(sp => {
      const logs = sp.fluctuations || [];
      logs.forEach((log, lIdx) => {
        allLogRows.push({
          "Mã Cơ Sở": fac.code || fac.id,
          "Tên Cơ Sở": fac.facilityName || fac.name,
          "Loài Động Vật": sp.vietnameseName,
          "Tên Khoa Học": sp.scientificName || '',
          "Nhóm ĐVHD": sp.group || '',
          "Ngày Ghi Chép": log.date || log.createdDate || '',
          "Đực Bố (Tăng)": log.incFather || 0,
          "Cái Mẹ (Tăng)": log.incMother || 0,
          "Đực Khác (Tăng)": log.incOtherMale || 0,
          "Cái Khác (Tăng)": log.incOtherFemale || 0,
          "Chưa XD (Tăng)": log.incOtherUnknown || 0,
          "Đực Bố (Giảm)": log.decFather || 0,
          "Cái Mẹ (Giảm)": log.decMother || 0,
          "Đực Khác (Giảm)": log.decOtherMale || 0,
          "Cái Khác (Giảm)": log.decOtherFemale || 0,
          "Chưa XD (Giảm)": log.decOtherUnknown || 0,
          "Lý Do / Chứng Từ": log.reason || log.description || '',
          "Người Xác Nhận": log.verifier || '',
          "Trạng Thái Duyệt": log.approvalStatus === 'PENDING' ? 'Chờ duyệt' : 'Đã duyệt'
        });
      });
    });
  });

  const wb = XLSX.utils.book_new();

  const wsFacilities = XLSX.utils.json_to_sheet(facRows);
  XLSX.utils.book_append_sheet(wb, wsFacilities, "Danh Sách Cơ Sở Nuôi");

  if (allLogRows.length > 0) {
    const wsLogs = XLSX.utils.json_to_sheet(allLogRows);
    XLSX.utils.book_append_sheet(wb, wsLogs, "So Ghi Chep Bien Dong");
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
