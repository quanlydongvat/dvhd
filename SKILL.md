---
name: quanlydongvat
description: Hướng dẫn nghiệp vụ, kiến trúc hệ thống, quy trình đồng bộ dữ liệu Firebase Cloud, chuẩn hóa phân loại động vật rừng (Lớp Thú & Lớp Chim, Nhóm IIB CITES), quản lý biến động tăng giảm đàn theo Thông tư 85/2025/TT-BNNMT & Nghị định 84/2021/NĐ-CP, sao lưu dữ liệu và triển khai hệ thống Quản lý động vật hoang dã Hạt Kiểm lâm khu vực Krông Bông.
---

# Kỹ Năng Vận Hành & Phát Triển Ứng Dụng Quản Lý Động Vật Hoang Dã (quanlydongvat)

Tài liệu này đóng gói toàn bộ quy trình nghiệp vụ, kiến trúc dữ liệu, quy tắc phân loại động vật rừng, cơ chế đồng bộ thời gian thực (Real-time Cloud Sync) và quy trình sao lưu chống mất dữ liệu cho Hệ thống Sổ Theo Dõi Quản Lý Cơ Sở Nuôi Động Vật Rừng Hoang Dã Điện Tử (Mẫu II) của **Hạt Kiểm Lâm Khu Vực Krông Bông** (Chi cục Kiểm lâm Đắk Lắk).

---

## 1. Căn Cứ Pháp Lý & Quy Định Lâm Nghiệp

Hệ thống được thiết kế và vận hành tuân thủ nghiêm ngặt các văn bản quy phạm pháp luật hiện hành:
1. **Thông tư số 85/2025/TT-BNNMT** (trước đây là Thông tư 27/2018/TT-BNNPTNT và 29/2019/TT-BNNPTNT):
   - Quy định về **Sổ theo dõi hoạt động nuôi động vật rừng (Mẫu II)**.
   - Ghi nhận chi tiết: Hiện trạng đàn ban đầu (Cột A), Các biến động tăng/giảm đàn (Cột B), và Tồn cuối kỳ (Cột C).
2. **Nghị định số 84/2021/NĐ-CP** & **Nghị định số 06/2019/NĐ-CP**:
   - Quản lý thực vật rừng, động vật rừng nguy cấp, quý, hiếm và thực thi Công ước CITES.
3. **Công ước CITES**:
   - Quản lý các loài trong Phụ lục I, II, III CITES xuất khẩu, nhập khẩu và gây nuôi sinh sản, sinh trưởng.

---

## 2. Quy Tắc Phân Loại Loài & Mã Số Đăng Ký Cơ Sở

Tuyệt đối tuân thủ quy tắc phân loại sau để tránh sai sót pháp lý và sinh học:

### A. Phân loại theo Lớp Sinh học (Biological Class)
- **Lớp Thú (Mammalia)**:
  - *Nguy cấp, quý, hiếm (Nhóm IIB & Phụ lục II CITES)*: Cầy vòi hương (*Paradoxurus hermaphroditus*), Cầy vòi mốc (*Paguma larvata*).
  - *Động vật rừng thông thường*: Dúi mốc lớn (*Rhizomys pruinosus*), Dúi má đào (*Rhizomys sumatrensis*), Nhím bờm (*Hystrix brachyura*), Don (*Atherurus macrourus*).
- **Lớp Chim (Aves)**:
  - *Động vật rừng thông thường*: Chim Chào mào (*Pycnonotus jocosus*), Chim Cu gáy (*Streptopelia chinensis*), Chim Sáo, Chích chòe, Khướu, Họa mi...

> [!IMPORTANT]
> **Điểm mấu chốt tránh nhầm lẫn**: Dúi, Nhím, Don là **Động vật rừng thông thường** (chỉ thuộc Lớp Thú), **KHÔNG PHẢI** là Nhóm IIB hay CITES. Chỉ có Cầy vòi hương và Cầy vòi mốc mới thuộc Nhóm IIB & CITES.

### B. Quy tắc cấp Mã Số Đăng Ký Cơ Sở Nuôi
- **Loài Nguy cấp, quý, hiếm (Nhóm IB, IIB, CITES)**: **BẮT BUỘC** phải được Hạt Kiểm lâm cấp Mã số cơ sở nuôi (ví dụ: `47/ĐVHD/01/2026/...`).
- **Loài Động vật rừng thông thường (Dúi, Nhím, Don, Chim...)**: **KHÔNG CẦN CẤP MÃ SỐ**, chỉ theo dõi qua Sổ Mẫu II và Bảng kê lâm sản khi xuất bán.
- Hàm hỗ trợ chuẩn trong code:
  - `isMammalSpecies(sp)`: Xác định loài Lớp Thú.
  - `isBirdSpecies(sp)`: Xác định loài Lớp Chim.
  - `isCitesSpecies(sp)` / `isCitesOrEndangeredSpecies(sp)`: Xác định loài Nhóm IIB/CITES.
  - `getCanonicalSpecies(name, sciName)`: Chuẩn hóa tên loài, tự động gộp các biến thể chữ hoa/thường, có dấu/không dấu.
  - `getRegistrationCodeStatus(facility, species)`: Xác định trạng thái mã số cơ sở.

---

## 3. Kiến Trúc Dữ Liệu & Đồng Bộ Thời Gian Thực (Firebase Cloud Firestore)

Hệ thống kết nối trực tiếp với Firebase Cloud Firestore (Project: `dvhd-52ebb`).

### A. Cấu trúc các Collection
1. **`facilities`** (46+ documents):
   - Chứa toàn bộ thông tin cơ sở: `facilityName`, `ownerName`, `address`, `commune`, `phone`, `registrationCode`, `registrationDate`, `purposeCode`, `lat`, `lng`.
   - Mảng `speciesList`: Danh sách các loài nuôi tại cơ sở. Mỗi loài gồm `baseline` (hiện trạng ban đầu) và `fluctuations` (mảng các lần tăng/giảm đàn).
2. **`packing_lists`** (38+ documents):
   - Sổ theo dõi xác nhận Bảng kê lâm sản xuất bán: Số bảng kê, ngày xác nhận, tên cơ sở, người mua, loài, số lượng, lâm sản kèm theo, cán bộ kiểm lâm xác nhận.
3. **`fluctuation_requests`** (40+ documents):
   - Nhật ký đề xuất biến động do chủ cơ sở nuôi gửi lên chờ cán bộ Kiểm lâm duyệt (`PENDING` -> `APPROVED`).
4. **`users`** (23+ documents):
   - Danh sách tài khoản: `ADMIN` (Hạt Kiểm lâm), `STAFF` (Cán bộ trạm/địa bàn), `FACILITY` (Chủ cơ sở nuôi).

### B. Cơ chế chống mất dữ liệu khi chuyển đổi thiết bị (Anti-Data-Loss)
- **Vấn đề đã xử lý**: Trước đây mở trên máy tính khác (Acer, PC, Điện thoại) có thể bị lệch dữ liệu do bộ nhớ đệm `localStorage` cục bộ cũ đè lên dữ liệu mới.
- **Giải pháp thời gian thực**:
  - `subscribeToCloudFacilities`: Sử dụng Firestore snapshot listener lắng nghe trực tiếp mọi thay đổi trên đám mây.
  - Hàm merge thông minh (`mergeCloudFacilities`): Luôn ưu tiên gộp các biến động có `createdAt` mới nhất, không bao giờ ghi đè làm mất dòng biến động đã ghi.
  - Danh sách đen loại trừ cơ sở xóa vĩnh viễn (`BLACKLISTED_DELETED_FACILITY_IDS = ['fac_1786163777938', 'fac_1788916180780']`) để tránh cơ sở zombie xuất hiện lại.

---

## 4. Quy Trình Đồng Bộ & Tải Dữ Liệu Về Thư Mục Cục Bộ

Khi có thay đổi dữ liệu trên website hoặc trước/sau khi phát triển tính năng mới, **luôn thực hiện lệnh đồng bộ** để kéo dữ liệu mới nhất về lưu cục bộ an toàn:

### Lệnh thực thi:
```bash
node scripts/syncFromFirebaseAndBackup.cjs
```

### Các tác vụ script tự động thực hiện:
1. Tải toàn bộ `facilities` (46 cơ sở), `packing_lists` (38 bảng kê), `fluctuation_requests`, và `users` từ Firebase Firestore qua REST API.
2. Lưu bản sao lưu đầy đủ dạng JSON vào:
   - `public/backup_cloud_firebase.json` (dành cho nút "Tải Sao Lưu" trên website).
   - `docs/backup_cloud_firebase.json`.
   - `docs/backup_all_collections_latest.json`.
   - `docs/backup_all_collections_YYYYMMDD_latest.json` (được lưu theo ngày).
3. Tự động ghi đè hằng số `REAL_FACILITIES_DATA` trong `src/utils/storage.js` để mã nguồn khi build offline luôn có sẵn dữ liệu thực tế mới nhất.
4. Cập nhật file `src/utils/packingListInitialData.json` với toàn bộ bảng kê lâm sản mới.
5. Xuất báo cáo tổng hợp `docs/Bao_Cao_Tong_Hop_Firebase_GoogleDrive.csv` (chuẩn mã hóa UTF-8 BOM, mở trực tiếp bằng Excel hoặc Google Sheets không bị lỗi font tiếng Việt).

---

## 5. Quy Trình Biên Dịch & Triển Khai (Build & Deploy)

1. **Kiểm tra biên dịch**:
   ```bash
   npm run build
   ```
   *Quá trình build sẽ biên dịch Vite client và chạy script `scripts/post_build.cjs` để cấu hình fallback CNAME `quanlydongvat.xyz`, `.nojekyll` và thư mục legacy `/dvhd/`.*

2. **Triển khai tự động lên GitHub Pages**:
   ```bash
   npm run deploy
   ```
   *Tự động chạy `predeploy` (build) và dùng `gh-pages -d dist` đẩy mã nguồn web lên branch `gh-pages` của repository `quanlydongvat/dvhd`.*

3. **Lưu trữ mã nguồn lên GitHub Main**:
   ```bash
   git add .
   git commit -m "feat/fix: <mô tả nội dung thay đổi>"
   git push origin main
   ```

---

## 6. Hướng Dẫn Thao Tác Nghiệp Vụ Trong Code

### A. Tính toán bảng Sổ Mẫu II (`computeLogbookTable`)
File `src/utils/calculations.js`:
```javascript
import { computeLogbookTable } from '../utils/calculations';

// Đầu vào: baseline (hiện trạng ban đầu) và fluctuations (mảng biến động)
const rows = computeLogbookTable(species.baseline || {}, species.fluctuations || []);
// rows[0]: Hiện trạng ban đầu (Cột A)
// rows[1...n]: Các dòng biến động tăng/giảm đàn (Cột B)
// Cột C (Tồn cuối kỳ) được tính lũy kế tự động chính xác cho từng giới tính:
// Đực bố, Cái mẹ, Hậu bị đực, Hậu bị cái, Chưa rõ giới tính, Tổng cộng.
```

### B. Slide Bảng Xếp Hạng Top 5 Cơ Sở Nuôi (`SidebarTopRankingSlide.jsx`)
- Tọa lạc ở góc dưới bên trái của thanh điều hướng (`LeftSidebar.jsx`).
- Trượt mượt mà 60fps qua lại giữa 2 nhóm:
  1. **Top 5 Nguy cấp, quý, hiếm** (Chỉ gồm Cầy vòi hương, Cầy vòi mốc).
  2. **Top 5 Thông thường** (Dúi, Nhím, Don, Chim chào mào, Cu gáy...).
- Tự động chuyển mỗi 5 giây với thanh tiến trình mượt mà; tạm dừng khi rê chuột vào (`pause on hover`).
- Nhấp vào cơ sở để mở ngay Sổ Mẫu II của cơ sở đó.

### C. Phân loại theo Lớp Động vật (`AnalyticsView.jsx`)
- Hiển thị tỷ lệ số lượng cá thể giữa:
  - 🐾 **Động vật Lớp Thú (Mammalia)**: Dúi, Cầy, Nhím, Don...
  - 🪶 **Động vật Lớp Chim (Aves)**: Chim chào mào, Chim cu gáy...
