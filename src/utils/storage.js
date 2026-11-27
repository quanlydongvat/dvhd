/**
 * LocalStorage manager and sample demo data for Wildlife Monitoring Application
 */

const STORAGE_KEY = 'wildlife_manager_data_v6';

// Permanent blacklist of deleted/zombie facilities to prevent them from resurrecting from local cache or backups
export const BLACKLISTED_DELETED_FACILITY_IDS = ['fac_1786163777938', 'fac_1788916180780'];

export async function forceClearAllCache() {
  try {
    localStorage.clear();
    sessionStorage.clear();

    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }

    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        await reg.unregister();
      }
    }
  } catch (err) {
    console.warn('Error clearing browser cache:', err);
  }

  window.location.href = window.location.origin + window.location.pathname + '?resetCache=' + Date.now();
}

export const INITIAL_FACILITY_INFO = {
  facilityName: 'Cơ sở Nuôi Sinh sản Động vật Hoang dã Xanh',
  ownerName: 'Nguyễn Văn A',
  registrationCode: 'CSNSS-2026-088/KL',
  address: 'Xã Phú Lý, Huyện Vĩnh Cửu, Tỉnh Đồng Nai',
  phone: '0912 345 678',
  purposeCode: 'T', // Default Thương mại
};

export const INITIAL_SPECIES_LIST = [
  {
    id: 'species_1',
    vietnameseName: 'Hổ Đông Dương',
    scientificName: 'Panthera tigris corbetti',
    group: 'Động vật rừng nguy cấp, quý, hiếm (Nhóm IB)',
    citesAppendix: 'Phụ lục I CITES',
    purposeCode: 'C', // Bảo tồn / Vườn thú
    baseline: {
      date: '2026-01-01',
      father: 2,
      mother: 3,
      otherMale: 1,
      otherFemale: 2,
      otherUnknown: 0,
      note: 'Hiện trạng vật nuôi ghi nhận đầu năm 2026',
      verifier: 'Hạt Kiểm lâm Vĩnh Cửu',
    },
    fluctuations: [
      {
        id: 'fluc_1',
        date: '2026-01-15',
        time: '08:30',
        incFather: 0,
        incMother: 0,
        incOtherMale: 0,
        incOtherFemale: 0,
        incOtherUnknown: 2,
        decFather: 0,
        decMother: 0,
        decOtherMale: 0,
        decOtherFemale: 0,
        decOtherUnknown: 0,
        reason: 'Sinh sản thành công 02 cá thể hổ con thế hệ F1',
        purpose: 'C',
        verifier: 'Đã xác nhận kiểm lâm',
        createdAt: 1768437000000,
      },
      {
        id: 'fluc_2',
        date: '2026-03-10',
        time: '14:00',
        incFather: 0,
        incMother: 1,
        incOtherMale: 0,
        incOtherFemale: 0,
        incOtherUnknown: 0,
        decFather: 0,
        decMother: 0,
        decOtherMale: 0,
        decOtherFemale: 0,
        decOtherUnknown: 0,
        reason: 'Nhập ghép đàn 01 cá thể cái trưởng thành từ Thảo Thảo Vườn Thú B',
        purpose: 'Z',
        verifier: 'Hạt Kiểm lâm Vĩnh Cửu',
        createdAt: 1773136800000,
      },
      {
        id: 'fluc_3',
        date: '2026-05-05',
        time: '09:15',
        incFather: 0,
        incMother: 0,
        incOtherMale: 1,
        incOtherFemale: 1,
        incOtherUnknown: 0,
        decFather: 0,
        decMother: 0,
        decOtherMale: 0,
        decOtherFemale: 0,
        decOtherUnknown: 2,
        reason: 'Xác định giới tính 02 hổ con thế hệ F1 (01 đực, 01 cái)',
        purpose: 'C',
        verifier: 'Kiểm lâm địa phương',
        createdAt: 1777972500000,
      },
      {
        id: 'fluc_4',
        date: '2026-06-20',
        time: '10:00',
        incFather: 0,
        incMother: 0,
        incOtherMale: 0,
        incOtherFemale: 0,
        incOtherUnknown: 0,
        decFather: 0,
        decMother: 0,
        decOtherMale: 0,
        decOtherFemale: 1,
        decOtherUnknown: 0,
        reason: 'Chuyển nhượng/Tặng cho Trung tâm Cứu hộ theo QĐ số 45/QĐ-KL',
        purpose: 'R',
        verifier: 'Chi cục Kiểm lâm Đồng Nai',
        createdAt: 1781949600000,
      },
    ],
  },
  {
    id: 'species_2',
    vietnameseName: 'Trăn đất',
    scientificName: 'Python bivittatus',
    group: 'Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)',
    citesAppendix: 'Phụ lục II CITES',
    purposeCode: 'T', // Thương mại
    baseline: {
      date: '2026-01-01',
      father: 5,
      mother: 10,
      otherMale: 4,
      otherFemale: 6,
      otherUnknown: 15,
      note: 'Số lượng vật nuôi hiện có tại trại',
      verifier: 'Hạt Kiểm lâm địa phương',
    },
    fluctuations: [
      {
        id: 'fluc_201',
        date: '2026-02-20',
        time: '09:00',
        incFather: 0,
        incMother: 0,
        incOtherMale: 0,
        incOtherFemale: 0,
        incOtherUnknown: 30,
        decFather: 0,
        decMother: 0,
        decOtherMale: 0,
        decOtherFemale: 0,
        decOtherUnknown: 0,
        reason: 'Sinh sản 30 trăn con lứa F1 nở ngày 20/02/2026',
        purpose: 'T',
        verifier: 'Đã xác nhận',
        createdAt: 1771578000000,
      },
      {
        id: 'fluc_202',
        date: '2026-04-15',
        time: '15:30',
        incFather: 0,
        incMother: 0,
        incOtherMale: 0,
        incOtherFemale: 0,
        incOtherUnknown: 0,
        decFather: 0,
        decMother: 0,
        decOtherMale: 0,
        decOtherFemale: 0,
        decOtherUnknown: 10,
        reason: 'Xuất bán 10 trăn giống con cho Cơ sở nuôi trồng C (Căn cứ HĐ số 12)',
        purpose: 'T',
        verifier: 'Hạt Kiểm lâm xác nhận',
        createdAt: 1776241800000,
      },
    ],
  },
];

export const EMPTY_FACILITY_INFO = {
  facilityName: '',
  ownerName: '',
  registrationCode: '',
  address: '',
  phone: '',
  purposeCode: 'T',
};

export const cleanFacilityAddress = (addr) => {
  if (!addr || typeof addr !== 'string') return addr || '';
  return addr
    .replace(/,\s*[Hh]uyện Krông Bông/g, '')
    .replace(/[Hh]uyện Krông Bông,\s*/g, '')
    .replace(/[Hh]uyện Krông Bông/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

export const REAL_FACILITIES_DATA = [
  {
    "id": "fac_1",
    "address": "Thôn 3, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "registrationDate": "2023-03-17",
    "updatedAt": "2026-11-26T00:29:15.343Z",
    "owner": "Lê Thị Xuân",
    "lng": 108.227912,
    "commune": "xã Hòa Sơn",
    "purposeCode": "T",
    "registrationCode": "IIB-DLC-027",
    "ownerName": "Lê Thị Xuân",
    "speciesList": [
      {
        "id": "sp_1_1",
        "scientificName": "Paradoxurus hermaphroditus",
        "fluctuations": [
          {
            "verifier": "",
            "decMother": 0,
            "reason": "Xác định giới tính con con",
            "purpose": "T",
            "incOtherFemale": 0,
            "decFather": 0,
            "decOtherFemale": 0,
            "incMother": 0,
            "createdAt": 1792335164333,
            "decOtherUnknown": 2,
            "date": "2025-10-18",
            "isPurchaseMode": false,
            "id": "fluc_1792335164333",
            "decOtherMale": 0,
            "incOtherUnknown": 0,
            "incOtherMale": 2,
            "time": "21:52",
            "approvalStatus": "APPROVED",
            "incFather": 0,
            "isGenderIdentifyMode": true
          },
          {
            "purpose": "T",
            "decOtherMale": 0,
            "decOtherUnknown": 0,
            "incOtherMale": 0,
            "incFather": 0,
            "isGenderIdentifyMode": false,
            "isPurchaseMode": false,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decOtherFemale": 0,
            "incOtherFemale": 0,
            "time": "21:53",
            "approvalStatus": "APPROVED",
            "date": "2026-06-17",
            "incMother": 0,
            "createdAt": 1792335203123,
            "decFather": 0,
            "verifier": "",
            "id": "fluc_1792335203123",
            "incOtherUnknown": 21,
            "decMother": 0
          },
          {
            "incOtherFemale": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "purpose": "T",
            "decOtherFemale": 0,
            "decOtherMale": 0,
            "decOtherUnknown": 0,
            "incOtherMale": 0,
            "incMother": 0,
            "createdAt": 1792335313527,
            "decFather": 0,
            "isPurchaseMode": false,
            "decMother": 0,
            "time": "21:53",
            "isGenderIdentifyMode": false,
            "date": "2026-08-29",
            "id": "fluc_1792335313527",
            "incFather": 0,
            "verifier": "",
            "incOtherUnknown": 11,
            "approvalStatus": "APPROVED"
          },
          {
            "verifier": "",
            "date": "2026-10-14",
            "createdAt": 1792335381718,
            "incMother": 0,
            "reason": "Xuất bán thương mại cho cơ sở B",
            "approvalStatus": "APPROVED",
            "decOtherUnknown": 0,
            "decFather": 0,
            "decOtherMale": 1,
            "incOtherMale": 0,
            "decMother": 0,
            "purpose": "T",
            "isGenderIdentifyMode": false,
            "isPurchaseMode": false,
            "incOtherUnknown": 0,
            "incFather": 0,
            "incOtherFemale": 0,
            "id": "fluc_1792335381718",
            "decOtherFemale": 3,
            "time": "21:55"
          }
        ],
        "purposeCode": "T",
        "vietnameseName": "Cầy vòi Hương",
        "citesAppendix": "Phụ lục II CITES",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "baseline": {
          "otherUnknown": 2,
          "note": "Số lượng vật nuôi theo chứng nhận cơ sở",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 4,
          "mother": 5,
          "otherFemale": "8",
          "otherMale": "10",
          "date": "2023-03-17"
        }
      }
    ],
    "lat": 12.496848,
    "note": "",
    "facilityName": "Cơ sở nuôi Lê Thị Xuân",
    "phone": "",
    "name": "Cơ sở nuôi Lê Thị Xuân"
  },
  {
    "id": "fac_10",
    "phone": "",
    "facilityName": "Cơ sở nuôi Trịnh Lục",
    "registrationDate": "2026-05-08",
    "speciesList": [
      {
        "baseline": {
          "otherMale": 0,
          "verifier": "Hạt Kiểm lâm Huy���n Krông Bông",
          "note": "Hiện trạng nuôi ban đầu",
          "mother": "4",
          "father": "1",
          "otherUnknown": 0,
          "otherFemale": 0,
          "date": "2026-05-08"
        },
        "fluctuations": [
          {
            "incOtherMale": 0,
            "isGenderIdentifyMode": false,
            "isPurchaseMode": true,
            "decOtherMale": 0,
            "decOtherUnknown": 0,
            "time": "08:51",
            "reason": "Mua từ cơ sở nuôi sinh sản khác",
            "incFather": 2,
            "decOtherFemale": 0,
            "incOtherFemale": 0,
            "decFather": 0,
            "approvalStatus": "APPROVED",
            "decMother": 0,
            "date": "2026-05-16",
            "verifier": "",
            "incOtherUnknown": 0,
            "purpose": "T",
            "id": "fluc_1786413132829",
            "createdAt": 1786413132829,
            "incMother": 4
          },
          {
            "approvalStatus": "APPROVED",
            "time": "08:52",
            "id": "fluc_1786413181544",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decOtherUnknown": 0,
            "incFather": 0,
            "verifier": "",
            "decFather": 0,
            "isPurchaseMode": false,
            "incOtherUnknown": 4,
            "decMother": 0,
            "isGenderIdentifyMode": false,
            "decOtherMale": 0,
            "decOtherFemale": 0,
            "incOtherMale": 0,
            "incOtherFemale": 0,
            "incMother": 0,
            "date": "2026-06-09",
            "createdAt": 1786413181544,
            "purpose": "T"
          },
          {
            "decMother": 0,
            "isGenderIdentifyMode": false,
            "decFather": 0,
            "date": "2026-07-10",
            "incMother": 14,
            "createdAt": 1786413220093,
            "id": "fluc_1786413220093",
            "approvalStatus": "APPROVED",
            "incOtherUnknown": 0,
            "purpose": "T",
            "decOtherFemale": 0,
            "verifier": "",
            "decOtherUnknown": 0,
            "incOtherFemale": 0,
            "incOtherMale": 0,
            "reason": "Mua từ cơ sở nuôi sinh sản khác",
            "decOtherMale": 0,
            "isPurchaseMode": true,
            "incFather": 1,
            "time": "08:53"
          },
          {
            "decMother": 0,
            "date": "2026-07-11",
            "incOtherUnknown": 12,
            "decFather": 0,
            "createdAt": 1786413284623,
            "incMother": 0,
            "id": "fluc_1786413284623",
            "approvalStatus": "APPROVED",
            "decOtherMale": 0,
            "incOtherMale": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "isGenderIdentifyMode": false,
            "verifier": "",
            "purpose": "T",
            "incOtherFemale": 0,
            "decOtherFemale": 0,
            "incFather": 0,
            "decOtherUnknown": 0,
            "time": "08:54",
            "isPurchaseMode": false
          },
          {
            "isPurchaseMode": true,
            "decOtherFemale": 0,
            "incOtherFemale": 8,
            "incOtherUnknown": 0,
            "date": "2026-08-03",
            "incFather": 0,
            "purpose": "T",
            "decFather": 0,
            "time": "17:26",
            "incOtherMale": 2,
            "approvalStatus": "APPROVED",
            "decOtherUnknown": 0,
            "decMother": 0,
            "decOtherMale": 0,
            "reason": "Mua từ cơ sở nuôi sinh sản khác",
            "verifier": "",
            "id": "fluc_1792146475584",
            "incMother": 0,
            "createdAt": 1792146475584,
            "isGenderIdentifyMode": false
          },
          {
            "verifier": "",
            "purpose": "T",
            "incFather": 0,
            "incOtherUnknown": 0,
            "approvalStatus": "APPROVED",
            "isGenderIdentifyMode": false,
            "date": "2026-08-10",
            "time": "08:56",
            "id": "fluc_1786413405967",
            "incMother": 0,
            "createdAt": 1786413405967,
            "incOtherFemale": 0,
            "decOtherUnknown": 0,
            "decOtherFemale": 5,
            "decOtherMale": 0,
            "decFather": 0,
            "decMother": 0,
            "incOtherMale": 0,
            "reason": "Xuất bán thương mại cho cơ sở B",
            "isPurchaseMode": false
          },
          {
            "decFather": 0,
            "date": "2026-08-28",
            "verifier": "",
            "isPurchaseMode": false,
            "decMother": 0,
            "incOtherMale": 0,
            "isGenderIdentifyMode": false,
            "incOtherFemale": 0,
            "incOtherUnknown": 9,
            "decOtherFemale": 0,
            "decOtherMale": 0,
            "createdAt": 1792146698997,
            "incMother": 0,
            "decOtherUnknown": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "approvalStatus": "APPROVED",
            "purpose": "T",
            "id": "fluc_1792146698997",
            "incFather": 0,
            "time": "17:28"
          },
          {
            "time": "17:31",
            "decFather": 0,
            "isPurchaseMode": false,
            "decOtherUnknown": 0,
            "decMother": 0,
            "incOtherFemale": 0,
            "decOtherFemale": 0,
            "verifier": "",
            "decOtherMale": 0,
            "incOtherMale": 0,
            "createdAt": 1792146763664,
            "incMother": 0,
            "isGenderIdentifyMode": false,
            "purpose": "T",
            "approvalStatus": "APPROVED",
            "id": "fluc_1792146763664",
            "incOtherUnknown": 6,
            "incFather": 0,
            "date": "2026-09-01",
            "reason": "Sinh sản lứa F2 mới nở/sinh"
          },
          {
            "decOtherMale": 0,
            "decFather": 0,
            "isPurchaseMode": false,
            "decMother": 0,
            "incOtherMale": 0,
            "decOtherUnknown": 3,
            "isGenderIdentifyMode": false,
            "id": "fluc_1792146792454",
            "decOtherFemale": 0,
            "createdAt": 1792146792454,
            "incMother": 0,
            "verifier": "",
            "purpose": "T",
            "incOtherFemale": 0,
            "time": "17:32",
            "approvalStatus": "APPROVED",
            "date": "2026-09-25",
            "reason": "Chết do thời tiết/bệnh lý",
            "incOtherUnknown": 0,
            "incFather": 0
          }
        ],
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "vietnameseName": "Cầy vòi Hương",
        "citesAppendix": "Phụ lục II CITES",
        "scientificName": "Paradoxurus hermaphroditus",
        "id": "sp_10_1",
        "purposeCode": "T"
      }
    ],
    "note": "",
    "updatedAt": "2026-11-26T00:29:15.348Z",
    "lng": 108.456819,
    "registrationCode": "52-26/B-DLC",
    "name": "Cơ sở nuôi Trịnh Lục",
    "owner": "Trịnh Lục",
    "ownerName": "Trịnh Lục",
    "commune": "xã Cư Pui",
    "lat": 12.546946,
    "purposeCode": "T",
    "address": "Thôn 3, xã Cư Pui, Tỉnh Đắk Lắk"
  },
  {
    "purposeCode": "T",
    "commune": "xã Cư Pui",
    "registrationCode": "IIB-C-DLC-063",
    "lng": 108.458901,
    "address": "Thôn 3, xã Cư Pui, Tỉnh Đắk Lắk",
    "registrationDate": "2024-09-25",
    "owner": "Nguyễn Hữu Đô",
    "updatedAt": "2026-11-08T03:23:43.581Z",
    "id": "fac_11",
    "ownerName": "Nguyễn Hữu Đô",
    "lat": 12.548123,
    "name": "Cơ sở nuôi Nguyễn Hữu Đô",
    "speciesList": [
      {
        "citesAppendix": "Phụ lục II CITES",
        "vietnameseName": "Cầy vòi Hương",
        "scientificName": "Paradoxurus hermaphroditus",
        "id": "sp_11_1",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "purposeCode": "T",
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "note": "Hiện trạng nuôi đăng ký",
          "date": "2024-09-25",
          "father": 4,
          "mother": 7,
          "otherUnknown": 19,
          "otherFemale": 16,
          "otherMale": 5
        },
        "fluctuations": [
          {
            "createdAt": 1786414971813,
            "incOtherUnknown": 0,
            "incMother": 0,
            "id": "fluc_1786414971813",
            "isPurchaseMode": false,
            "purpose": "T",
            "decOtherUnknown": 0,
            "time": "09:22",
            "reason": "Xuất bán thương mại cho cơ sở B",
            "verifier": "",
            "decMother": 0,
            "decFather": 0,
            "isGenderIdentifyMode": false,
            "incFather": 0,
            "date": "2026-08-11",
            "decOtherFemale": 0,
            "incOtherFemale": 0,
            "decOtherMale": 1,
            "incOtherMale": 0,
            "approvalStatus": "APPROVED"
          },
          {
            "incFather": 0,
            "approvalStatus": "APPROVED",
            "time": "10:27",
            "decMother": 0,
            "decFather": 0,
            "purpose": "T",
            "incOtherFemale": 0,
            "decOtherFemale": 0,
            "incOtherMale": 0,
            "decOtherMale": 0,
            "isGenderIdentifyMode": false,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "incMother": 0,
            "decOtherUnknown": 0,
            "isPurchaseMode": false,
            "createdAt": 1791170873185,
            "id": "fluc_1791170873185",
            "incOtherUnknown": 3,
            "date": "2026-09-09",
            "verifier": ""
          },
          {
            "decOtherUnknown": 5,
            "incOtherFemale": 0,
            "approvalStatus": "APPROVED",
            "decOtherMale": 0,
            "incOtherMale": 0,
            "time": "10:28",
            "incOtherUnknown": 0,
            "createdAt": 1791170912846,
            "incMother": 0,
            "reason": "Chết do thời tiết/bệnh lý",
            "decOtherFemale": 0,
            "verifier": "",
            "id": "fluc_1791170912846",
            "isGenderIdentifyMode": false,
            "isPurchaseMode": false,
            "decMother": 0,
            "decFather": 0,
            "purpose": "T",
            "incFather": 0,
            "date": "2026-09-17"
          },
          {
            "incMother": 0,
            "purpose": "T",
            "isPurchaseMode": false,
            "createdAt": 1791170959593,
            "decOtherUnknown": 17,
            "verifier": "",
            "date": "2026-09-18",
            "id": "fluc_1791170959593",
            "incOtherUnknown": 0,
            "incFather": 0,
            "incOtherFemale": 10,
            "reason": "Xác định giới tính con con",
            "decFather": 0,
            "decMother": 0,
            "approvalStatus": "APPROVED",
            "decOtherMale": 0,
            "incOtherMale": 7,
            "isGenderIdentifyMode": true,
            "time": "10:28",
            "decOtherFemale": 0
          },
          {
            "incFather": 0,
            "reason": "Xuất bán thương mại cho cơ sở B",
            "isPurchaseMode": false,
            "decFather": 0,
            "decMother": 0,
            "id": "fluc_1791170669944",
            "time": "10:23",
            "isGenderIdentifyMode": false,
            "verifier": "",
            "date": "2026-09-22",
            "incMother": 0,
            "approvalStatus": "APPROVED",
            "purpose": "T",
            "incOtherMale": 0,
            "decOtherMale": 5,
            "createdAt": 1791170669944,
            "decOtherUnknown": 0,
            "incOtherFemale": 0,
            "decOtherFemale": 5,
            "incOtherUnknown": 0
          },
          {
            "decOtherUnknown": 0,
            "decOtherFemale": 0,
            "decOtherMale": 0,
            "incOtherMale": 0,
            "incMother": 0,
            "incOtherUnknown": 7,
            "approvalStatus": "APPROVED",
            "time": "20:58",
            "incOtherFemale": 0,
            "id": "fluc_1791986440656",
            "createdAt": 1791986440656,
            "purpose": "T",
            "date": "2026-10-14",
            "isGenderIdentifyMode": false,
            "incFather": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decMother": 0,
            "verifier": "",
            "decFather": 0,
            "isPurchaseMode": false
          },
          {
            "incMother": 0,
            "date": "2026-11-13",
            "decMother": 0,
            "decOtherUnknown": 0,
            "isPurchaseMode": false,
            "time": "18:32",
            "incFather": 0,
            "decFather": 0,
            "incOtherFemale": 0,
            "verifier": "",
            "id": "fluc_1794569546350",
            "isGenderIdentifyMode": false,
            "approvalStatus": "APPROVED",
            "createdAt": 1794569546350,
            "reason": "Sinh sản lứa F2 m���i nở/sinh",
            "decOtherFemale": 0,
            "purpose": "T",
            "decOtherMale": 0,
            "incOtherMale": 0,
            "incOtherUnknown": 3
          }
        ]
      }
    ],
    "phone": "",
    "note": "",
    "facilityName": "Cơ sở nuôi Nguyễn Hữu Đô"
  },
  {
    "name": "Cơ sở nuôi Lê Thanh Đức",
    "lng": 108.332398,
    "note": "",
    "purposeCode": "T",
    "ownerName": "Lê Thanh Đức",
    "owner": "Lê Thanh Đức",
    "lat": 12.528258,
    "speciesList": [
      {
        "id": "sp_12_1",
        "purposeCode": "T",
        "fluctuations": [
          {
            "isPurchaseMode": false,
            "incFather": 0,
            "isGenderIdentifyMode": true,
            "verifier": "",
            "decOtherFemale": 0,
            "incOtherUnknown": 0,
            "incOtherFemale": 0,
            "time": "20:44",
            "createdAt": 1792417516454,
            "incMother": 0,
            "date": "2026-01-01",
            "id": "fluc_1792417516454",
            "approvalStatus": "APPROVED",
            "decOtherUnknown": 5,
            "decMother": 0,
            "reason": "Xác định giới tính con con",
            "incOtherMale": 5,
            "decOtherMale": 0,
            "purpose": "T",
            "decFather": 0
          },
          {
            "incMother": 0,
            "createdAt": 1792417560988,
            "incOtherMale": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decOtherMale": 0,
            "id": "fluc_1792417560988",
            "approvalStatus": "APPROVED",
            "decOtherUnknown": 0,
            "date": "2026-02-10",
            "decMother": 0,
            "decFather": 0,
            "isPurchaseMode": false,
            "incFather": 0,
            "purpose": "T",
            "time": "20:45",
            "incOtherUnknown": 5,
            "isGenderIdentifyMode": false,
            "verifier": "",
            "incOtherFemale": 0,
            "decOtherFemale": 0
          },
          {
            "decFather": 0,
            "decMother": 0,
            "purpose": "T",
            "isPurchaseMode": false,
            "time": "20:46",
            "incOtherFemale": 0,
            "createdAt": 1792417589052,
            "incMother": 0,
            "decOtherUnknown": 0,
            "isGenderIdentifyMode": false,
            "decOtherFemale": 0,
            "decOtherMale": 0,
            "approvalStatus": "APPROVED",
            "incOtherUnknown": 1,
            "date": "2026-02-15",
            "incOtherMale": 0,
            "verifier": "",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "id": "fluc_1792417589052",
            "incFather": 0
          },
          {
            "decOtherMale": 5,
            "time": "20:46",
            "incOtherMale": 0,
            "incFather": 0,
            "approvalStatus": "APPROVED",
            "decOtherUnknown": 0,
            "purpose": "T",
            "decMother": 0,
            "incOtherFemale": 0,
            "decFather": 0,
            "incOtherUnknown": 0,
            "id": "fluc_1792417627701",
            "decOtherFemale": 0,
            "verifier": "",
            "date": "2026-04-26",
            "incMother": 0,
            "createdAt": 1792417627701,
            "isGenderIdentifyMode": false,
            "reason": "Xuất bán thương mại cho cơ sở B",
            "isPurchaseMode": false
          },
          {
            "incFather": 10,
            "reason": "Chuyển cá thể đực và cái đủ tuổi vào đàn bố mẹ.",
            "verifier": "",
            "id": "fluc_1792417724636",
            "time": "20:47",
            "isGenderIdentifyMode": false,
            "approvalStatus": "APPROVED",
            "decOtherUnknown": 0,
            "incOtherUnknown": 0,
            "incMother": 2,
            "createdAt": 1792417724636,
            "incOtherMale": 0,
            "date": "2026-05-01",
            "decOtherMale": 10,
            "incOtherFemale": 0,
            "decOtherFemale": 2,
            "purpose": "T",
            "decMother": 0,
            "decFather": 0,
            "isPurchaseMode": false
          },
          {
            "isPurchaseMode": false,
            "decMother": 0,
            "purpose": "T",
            "decFather": 0,
            "isGenderIdentifyMode": true,
            "decOtherUnknown": 6,
            "incOtherFemale": 1,
            "time": "20:48",
            "decOtherFemale": 0,
            "createdAt": 1792417838117,
            "incMother": 0,
            "id": "fluc_1792417838117",
            "incOtherMale": 5,
            "decOtherMale": 0,
            "incOtherUnknown": 0,
            "date": "2026-05-01",
            "approvalStatus": "APPROVED",
            "incFather": 0,
            "verifier": "",
            "reason": "Xác định giới tính con con"
          },
          {
            "time": "20:50",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "isPurchaseMode": false,
            "decOtherUnknown": 0,
            "incOtherFemale": 0,
            "incFather": 0,
            "decOtherFemale": 0,
            "decFather": 0,
            "approvalStatus": "APPROVED",
            "incOtherUnknown": 4,
            "id": "fluc_1792417884074",
            "decMother": 0,
            "purpose": "T",
            "isGenderIdentifyMode": false,
            "incOtherMale": 0,
            "date": "2026-05-01",
            "verifier": "",
            "decOtherMale": 0,
            "createdAt": 1792417884074,
            "incMother": 0
          },
          {
            "incOtherUnknown": 4,
            "date": "2026-05-04",
            "isGenderIdentifyMode": false,
            "isPurchaseMode": false,
            "incFather": 0,
            "decOtherFemale": 0,
            "verifier": "",
            "purpose": "T",
            "incOtherFemale": 0,
            "id": "fluc_1792417900794",
            "approvalStatus": "APPROVED",
            "decFather": 0,
            "decMother": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decOtherMale": 0,
            "incOtherMale": 0,
            "createdAt": 1792417900794,
            "incMother": 0,
            "time": "20:51",
            "decOtherUnknown": 0
          },
          {
            "decOtherFemale": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "incOtherUnknown": 3,
            "incOtherFemale": 0,
            "id": "fluc_1792418004771",
            "purpose": "T",
            "time": "20:53",
            "incFather": 0,
            "decOtherMale": 0,
            "isPurchaseMode": false,
            "incOtherMale": 0,
            "decMother": 0,
            "decFather": 0,
            "date": "2026-05-10",
            "isGenderIdentifyMode": false,
            "approvalStatus": "APPROVED",
            "incMother": 0,
            "createdAt": 1792418004771,
            "decOtherUnknown": 0,
            "verifier": ""
          },
          {
            "incOtherFemale": 0,
            "decOtherFemale": 0,
            "decOtherUnknown": 0,
            "verifier": "",
            "incFather": 0,
            "isPurchaseMode": false,
            "isGenderIdentifyMode": false,
            "time": "20:53",
            "date": "2026-05-25",
            "id": "fluc_1792418025850",
            "decMother": 0,
            "decFather": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "incOtherMale": 0,
            "incOtherUnknown": 4,
            "incMother": 0,
            "createdAt": 1792418025850,
            "purpose": "T",
            "approvalStatus": "APPROVED",
            "decOtherMale": 0
          },
          {
            "decOtherMale": 0,
            "decOtherUnknown": 0,
            "incMother": 0,
            "createdAt": 1792418049385,
            "incOtherMale": 0,
            "decFather": 0,
            "date": "2026-06-07",
            "approvalStatus": "APPROVED",
            "id": "fluc_1792418049385",
            "decMother": 0,
            "purpose": "T",
            "decOtherFemale": 0,
            "incOtherFemale": 0,
            "incFather": 0,
            "verifier": "",
            "time": "20:53",
            "isPurchaseMode": false,
            "isGenderIdentifyMode": false,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "incOtherUnknown": 3
          },
          {
            "verifier": "",
            "purpose": "T",
            "incOtherFemale": 0,
            "incOtherMale": 0,
            "decFather": 0,
            "decOtherFemale": 0,
            "decMother": 0,
            "decOtherMale": 0,
            "time": "20:54",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "isGenderIdentifyMode": false,
            "isPurchaseMode": false,
            "incMother": 0,
            "createdAt": 1792418078546,
            "incOtherUnknown": 3,
            "decOtherUnknown": 0,
            "date": "2026-06-14",
            "incFather": 0,
            "id": "fluc_1792418078546",
            "approvalStatus": "APPROVED"
          },
          {
            "id": "fluc_1792418108153",
            "decMother": 0,
            "decFather": 0,
            "incMother": 0,
            "createdAt": 1792418108153,
            "purpose": "T",
            "approvalStatus": "APPROVED",
            "decOtherUnknown": 0,
            "time": "20:54",
            "date": "2026-06-22",
            "decOtherFemale": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decOtherMale": 0,
            "isGenderIdentifyMode": false,
            "incOtherFemale": 0,
            "incOtherUnknown": 3,
            "incOtherMale": 0,
            "incFather": 0,
            "isPurchaseMode": false,
            "verifier": ""
          },
          {
            "isGenderIdentifyMode": false,
            "decOtherUnknown": 0,
            "isPurchaseMode": false,
            "date": "2026-07-04",
            "incOtherFemale": 0,
            "incFather": 0,
            "decOtherFemale": 0,
            "decFather": 0,
            "incOtherMale": 0,
            "id": "fluc_1792418131817",
            "approvalStatus": "APPROVED",
            "time": "20:55",
            "decOtherMale": 0,
            "decMother": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "incOtherUnknown": 3,
            "purpose": "T",
            "verifier": "",
            "createdAt": 1792418131817,
            "incMother": 0
          },
          {
            "decOtherFemale": 0,
            "createdAt": 1792418154936,
            "incMother": 0,
            "incOtherFemale": 0,
            "verifier": "",
            "decOtherUnknown": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "isPurchaseMode": false,
            "incOtherMale": 0,
            "purpose": "T",
            "decMother": 0,
            "decFather": 0,
            "date": "2026-09-03",
            "decOtherMale": 0,
            "incFather": 0,
            "time": "20:55",
            "id": "fluc_1792418154936",
            "incOtherUnknown": 3,
            "isGenderIdentifyMode": false,
            "approvalStatus": "APPROVED"
          },
          {
            "decFather": 0,
            "isGenderIdentifyMode": false,
            "decOtherUnknown": 0,
            "incOtherFemale": 0,
            "decMother": 0,
            "decOtherFemale": 0,
            "id": "fluc_1792418181435",
            "incOtherMale": 0,
            "purpose": "T",
            "decOtherMale": 0,
            "verifier": "",
            "isPurchaseMode": false,
            "createdAt": 1792418181435,
            "incMother": 0,
            "time": "20:56",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "date": "2026-09-07",
            "approvalStatus": "APPROVED",
            "incOtherUnknown": 3,
            "incFather": 0
          },
          {
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decFather": 0,
            "incOtherUnknown": 2,
            "id": "fluc_1792418225473",
            "decMother": 0,
            "time": "20:56",
            "purpose": "T",
            "verifier": "",
            "incMother": 0,
            "createdAt": 1792418225473,
            "approvalStatus": "APPROVED",
            "incOtherFemale": 0,
            "decOtherFemale": 0,
            "date": "2026-09-13",
            "isGenderIdentifyMode": false,
            "incOtherMale": 0,
            "isPurchaseMode": false,
            "decOtherUnknown": 0,
            "incFather": 0,
            "decOtherMale": 0
          }
        ],
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "citesAppendix": "Phụ lục II CITES",
        "scientificName": "Paradoxurus hermaphroditus",
        "baseline": {
          "note": "Hiện trạng nuôi đăng ký",
          "mother": 7,
          "father": 2,
          "otherFemale": 9,
          "otherMale": 11,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherUnknown": "5",
          "date": "2024-09-06"
        },
        "vietnameseName": "Cầy vòi Hương"
      }
    ],
    "commune": "Xã Krông Bông",
    "updatedAt": "2026-11-26T00:29:15.356Z",
    "registrationCode": "IIB-C-DLC-060",
    "facilityName": "Cơ sở nuôi Lê Thanh Đức",
    "registrationDate": "2024-09-06",
    "address": "Thôn 5, Xã Krông Bông, Tỉnh Đắk Lắk",
    "id": "fac_12",
    "phone": ""
  },
  {
    "owner": "Ngô Thị Trang",
    "updatedAt": "2026-11-26T00:29:15.367Z",
    "lng": 108.414746,
    "commune": "Xã Krông Bông",
    "facilityName": "Cơ sở nuôi Ngô Thị Trang",
    "registrationCode": "010-25/B-DLC",
    "purposeCode": "T",
    "address": "Thôn 8, Xã Krông Bông, Tỉnh Đắk Lắk",
    "registrationDate": "2025-07-31",
    "phone": "",
    "note": "",
    "id": "fac_13",
    "speciesList": [
      {
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 7,
          "father": 6,
          "mother": 7,
          "note": "Hiện trạng nuôi đăng ký",
          "otherFemale": 10,
          "date": "2025-07-31",
          "otherUnknown": "8"
        },
        "fluctuations": [
          {
            "incOtherFemale": 7,
            "incFather": 0,
            "decOtherFemale": 0,
            "incOtherUnknown": 0,
            "date": "2025-12-01",
            "isGenderIdentifyMode": true,
            "isPurchaseMode": false,
            "id": "fluc_1792416053149",
            "createdAt": 1792416053149,
            "incMother": 0,
            "verifier": "",
            "decOtherMale": 0,
            "incOtherMale": 1,
            "purpose": "T",
            "reason": "Xác định giới tính con con",
            "decOtherUnknown": 8,
            "decMother": 0,
            "time": "20:18",
            "approvalStatus": "APPROVED",
            "decFather": 0
          },
          {
            "approvalStatus": "APPROVED",
            "incOtherMale": 1,
            "decOtherMale": 0,
            "time": "20:24",
            "incFather": 0,
            "id": "fluc_1792416321034",
            "decOtherUnknown": 8,
            "verifier": "",
            "decMother": 0,
            "isPurchaseMode": false,
            "incOtherUnknown": 0,
            "decFather": 0,
            "date": "2026-01-01",
            "createdAt": 1792416321034,
            "incMother": 0,
            "isGenderIdentifyMode": true,
            "reason": "Xác định giới tính con con",
            "decOtherFemale": 0,
            "incOtherFemale": 7,
            "purpose": "T"
          },
          {
            "time": "20:25",
            "id": "fluc_1792416354610",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "createdAt": 1792416354610,
            "incMother": 0,
            "decFather": 0,
            "isGenderIdentifyMode": false,
            "approvalStatus": "APPROVED",
            "verifier": "",
            "decOtherUnknown": 0,
            "decMother": 0,
            "incOtherUnknown": 2,
            "decOtherMale": 0,
            "incOtherFemale": 0,
            "incOtherMale": 0,
            "incFather": 0,
            "decOtherFemale": 0,
            "purpose": "T",
            "date": "2026-01-01",
            "isPurchaseMode": false
          },
          {
            "time": "20:29",
            "incMother": 0,
            "createdAt": 1792416591656,
            "incOtherUnknown": 0,
            "decFather": 0,
            "approvalStatus": "APPROVED",
            "decMother": 0,
            "id": "fluc_1792416591656",
            "reason": "Xuất bán thương mại cho cơ sở B",
            "isGenderIdentifyMode": false,
            "decOtherFemale": 4,
            "incOtherFemale": 0,
            "incOtherMale": 0,
            "decOtherMale": 1,
            "incFather": 0,
            "decOtherUnknown": 0,
            "isPurchaseMode": false,
            "purpose": "T",
            "verifier": "",
            "date": "2026-04-10"
          },
          {
            "date": "2026-04-28",
            "incFather": 0,
            "verifier": "",
            "decOtherFemale": 0,
            "incOtherFemale": 0,
            "incOtherMale": 0,
            "decOtherMale": 0,
            "isPurchaseMode": false,
            "decOtherUnknown": 0,
            "isGenderIdentifyMode": false,
            "incOtherUnknown": 3,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "incMother": 0,
            "createdAt": 1792416647248,
            "decFather": 0,
            "purpose": "T",
            "approvalStatus": "APPROVED",
            "id": "fluc_1792416647248",
            "decMother": 0,
            "time": "20:30"
          },
          {
            "verifier": "",
            "incOtherUnknown": 2,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "incOtherMale": 0,
            "incFather": 0,
            "decOtherMale": 0,
            "approvalStatus": "APPROVED",
            "time": "20:30",
            "date": "2026-05-05",
            "decMother": 0,
            "decOtherFemale": 0,
            "id": "fluc_1792416679840",
            "incOtherFemale": 0,
            "purpose": "T",
            "decFather": 0,
            "isPurchaseMode": false,
            "createdAt": 1792416679840,
            "incMother": 0,
            "decOtherUnknown": 0,
            "isGenderIdentifyMode": false
          },
          {
            "purpose": "T",
            "decFather": 0,
            "date": "2026-05-07",
            "isGenderIdentifyMode": false,
            "decMother": 0,
            "approvalStatus": "APPROVED",
            "decOtherUnknown": 0,
            "incMother": 0,
            "createdAt": 1792416741735,
            "isPurchaseMode": false,
            "id": "fluc_1792416741735",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "incOtherUnknown": 2,
            "verifier": "",
            "incOtherFemale": 0,
            "time": "20:31",
            "decOtherMale": 0,
            "decOtherFemale": 0,
            "incFather": 0,
            "incOtherMale": 0
          },
          {
            "incOtherUnknown": 0,
            "incFather": 0,
            "purpose": "T",
            "id": "fluc_1792416788544",
            "time": "20:32",
            "approvalStatus": "APPROVED",
            "incOtherFemale": 0,
            "isGenderIdentifyMode": false,
            "decOtherMale": 0,
            "decFather": 0,
            "decOtherFemale": 0,
            "date": "2026-06-05",
            "decOtherUnknown": 2,
            "incOtherMale": 0,
            "decMother": 0,
            "isPurchaseMode": false,
            "reason": "Chết do thời tiết/bệnh lý",
            "createdAt": 1792416788544,
            "incMother": 0,
            "verifier": ""
          },
          {
            "verifier": "",
            "purpose": "T",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "time": "20:33",
            "id": "fluc_1792416822192",
            "approvalStatus": "APPROVED",
            "incFather": 0,
            "incOtherUnknown": 3,
            "decFather": 0,
            "decOtherUnknown": 0,
            "incOtherFemale": 0,
            "decMother": 0,
            "isGenderIdentifyMode": false,
            "decOtherFemale": 0,
            "date": "2026-09-08",
            "incOtherMale": 0,
            "decOtherMale": 0,
            "incMother": 0,
            "createdAt": 1792416822192,
            "isPurchaseMode": false
          },
          {
            "reason": "Xuất bán thương mại cho cơ sở B",
            "verifier": "",
            "decOtherFemale": 4,
            "incOtherFemale": 0,
            "incFather": 0,
            "isGenderIdentifyMode": false,
            "purpose": "T",
            "isPurchaseMode": false,
            "date": "2026-10-01",
            "decOtherUnknown": 0,
            "decOtherMale": 1,
            "time": "20:28",
            "incOtherUnknown": 0,
            "decMother": 0,
            "decFather": 0,
            "incOtherMale": 0,
            "id": "fluc_1792416545121",
            "approvalStatus": "APPROVED",
            "createdAt": 1792416545121,
            "incMother": 0
          },
          {
            "decOtherUnknown": 0,
            "isPurchaseMode": false,
            "isGenderIdentifyMode": false,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "date": "2026-10-05",
            "decOtherFemale": 0,
            "purpose": "T",
            "decOtherMale": 0,
            "incOtherFemale": 0,
            "incFather": 0,
            "incOtherMale": 0,
            "decFather": 0,
            "approvalStatus": "APPROVED",
            "decMother": 0,
            "id": "fluc_1792416843767",
            "time": "20:33",
            "verifier": "",
            "incMother": 0,
            "createdAt": 1792416843767,
            "incOtherUnknown": 1
          }
        ],
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "purposeCode": "T",
        "id": "sp_13_1",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "citesAppendix": "Phụ lục II CITES"
      }
    ],
    "name": "Cơ sở nuôi Ngô Thị Trang",
    "ownerName": "Ngô Thị Trang",
    "lat": 12.53985
  },
  {
    "updatedAt": "2026-11-26T00:29:15.368Z",
    "address": "TDP4, Xã Krông Bông, Tỉnh Đắk Lắk",
    "registrationCode": "18-26/B-DLC",
    "owner": "Hà Huy Thanh",
    "purposeCode": "T",
    "lng": 108.333327,
    "commune": "Xã Krông Bông",
    "registrationDate": "2026-03-17",
    "phone": "",
    "id": "fac_14",
    "note": "",
    "facilityName": "Cơ sở nuôi Hà Huy Thanh",
    "lat": 12.492108,
    "ownerName": "Hà Huy Thanh",
    "speciesList": [
      {
        "purposeCode": "T",
        "fluctuations": [],
        "citesAppendix": "Phụ lục II CITES",
        "scientificName": "Paguma larvata",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "vietnameseName": "Cầy vòi mốc",
        "baseline": {
          "date": "2026-03-17",
          "otherMale": 0,
          "otherFemale": 0,
          "father": 5,
          "mother": 23,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherUnknown": 0,
          "note": "Hiện trạng nuôi đăng ký"
        },
        "id": "sp_14_1"
      },
      {
        "vietnameseName": "Dúi má đào",
        "id": "sp_14_2",
        "scientificName": "Rhizomys sumatrensis",
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường",
        "baseline": {
          "otherFemale": 0,
          "date": "2026-01-01",
          "otherUnknown": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 34,
          "father": 9,
          "note": "Hiện trạng nuôi loài Dúi má đào",
          "otherMale": 0
        },
        "fluctuations": [],
        "purposeCode": "T"
      }
    ],
    "name": "Cơ sở nuôi Hà Huy Thanh"
  },
  {
    "owner": "Trần Văn Tới",
    "note": "",
    "updatedAt": "2026-11-26T00:29:15.368Z",
    "speciesList": [
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "purposeCode": "T",
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherFemale": 0,
          "note": "Số lượng Dúi mốc lớn hiện có",
          "otherMale": 0,
          "father": 9,
          "mother": 9,
          "date": "2023-11-02",
          "otherUnknown": 0
        },
        "id": "sp_15_1",
        "group": "Động vật rừng thông thường",
        "vietnameseName": "Dúi mốc lớn",
        "scientificName": "Rhizomys pruinosus",
        "fluctuations": [
          {
            "incOtherMale": 0,
            "date": "2024-04-30",
            "decOtherMale": 0,
            "incOtherUnknown": 29,
            "reason": "Sinh sản lứa F1 mới nở/sinh.",
            "incOtherFemale": 0,
            "decOtherFemale": 0,
            "incFather": 0,
            "verifier": "",
            "decMother": 0,
            "decFather": 0,
            "id": "fluc_15_1",
            "time": "20:31",
            "decOtherUnknown": 0,
            "createdAt": 1714501860000,
            "incMother": 0
          },
          {
            "decOtherFemale": 0,
            "incOtherFemale": 0,
            "incMother": 0,
            "createdAt": 1729534200000,
            "decOtherUnknown": 0,
            "decFather": 0,
            "date": "2024-10-21",
            "decMother": 0,
            "verifier": "",
            "time": "18:10",
            "incFather": 0,
            "incOtherMale": 0,
            "incOtherUnknown": 4,
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "id": "fluc_15_2",
            "decOtherMale": 0
          },
          {
            "date": "2025-01-22",
            "createdAt": 1737534600000,
            "incMother": 0,
            "decOtherFemale": 0,
            "incOtherFemale": 19,
            "incOtherMale": 14,
            "decFather": 0,
            "decMother": 0,
            "decOtherMale": 0,
            "verifier": "",
            "decOtherUnknown": 33,
            "incOtherUnknown": 0,
            "id": "fluc_15_3",
            "incFather": 0,
            "reason": "Xác định giới tính con con",
            "time": "10:30"
          },
          {
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "decOtherFemale": 0,
            "incOtherFemale": 0,
            "id": "fluc_15_4",
            "verifier": "",
            "date": "2025-01-22",
            "incFather": 0,
            "incOtherUnknown": 7,
            "incOtherMale": 0,
            "decOtherMale": 0,
            "decMother": 0,
            "decFather": 0,
            "decOtherUnknown": 0,
            "time": "13:30",
            "createdAt": 1737545400000,
            "incMother": 0
          },
          {
            "incOtherFemale": 0,
            "createdAt": 1750406400000,
            "incMother": 0,
            "decOtherFemale": 0,
            "decFather": 0,
            "date": "2025-06-20",
            "decOtherUnknown": 0,
            "decMother": 0,
            "incOtherUnknown": 13,
            "incFather": 0,
            "time": "09:00",
            "incOtherMale": 0,
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "id": "fluc_15_5",
            "decOtherMale": 0,
            "verifier": ""
          },
          {
            "decFather": 0,
            "decMother": 0,
            "date": "2025-10-06",
            "verifier": "",
            "incOtherMale": 0,
            "decOtherUnknown": 0,
            "createdAt": 1759778400000,
            "incMother": 18,
            "id": "fluc_15_6",
            "decOtherMale": 13,
            "reason": "Chuyển cá thể đực và cái đủ tuổi vào đàn bố mẹ.",
            "incOtherUnknown": 0,
            "time": "19:20",
            "incOtherFemale": 0,
            "decOtherFemale": 18,
            "incFather": 13
          },
          {
            "incOtherFemale": 12,
            "date": "2025-10-06",
            "decOtherFemale": 0,
            "reason": "Xác định giới tính con con",
            "id": "fluc_15_7",
            "incOtherUnknown": 0,
            "incFather": 0,
            "decOtherMale": 0,
            "decMother": 0,
            "verifier": "",
            "decOtherUnknown": 20,
            "decFather": 0,
            "incOtherMale": 8,
            "createdAt": 1759786080000,
            "incMother": 0,
            "time": "21:28"
          },
          {
            "date": "2025-11-05",
            "decFather": 0,
            "id": "fluc_15_8",
            "decMother": 0,
            "incOtherFemale": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decOtherFemale": 0,
            "createdAt": 1762326000000,
            "incMother": 0,
            "decOtherUnknown": 0,
            "incOtherUnknown": 25,
            "incOtherMale": 0,
            "decOtherMale": 0,
            "verifier": "",
            "time": "07:00",
            "incFather": 0
          },
          {
            "decOtherUnknown": 4,
            "incFather": 0,
            "decOtherFemale": 0,
            "incOtherMale": 0,
            "incOtherFemale": 0,
            "id": "fluc_15_9",
            "decOtherMale": 0,
            "time": "08:00",
            "date": "2025-11-10",
            "reason": "Chết do thời tiết/bệnh lý",
            "incMother": 0,
            "createdAt": 1762761600000,
            "decFather": 0,
            "verifier": "",
            "decMother": 0,
            "incOtherUnknown": 0
          },
          {
            "decOtherFemale": 0,
            "incOtherFemale": 0,
            "incFather": 0,
            "decOtherMale": 0,
            "incOtherUnknown": 18,
            "date": "2025-12-30",
            "incOtherMale": 0,
            "time": "10:00",
            "createdAt": 1767088800000,
            "incMother": 0,
            "decOtherUnknown": 0,
            "id": "fluc_15_10",
            "decMother": 0,
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "verifier": "",
            "decFather": 0
          },
          {
            "reason": "Xác định giới tính con con",
            "incMother": 0,
            "createdAt": 1767814080000,
            "incOtherFemale": 14,
            "decOtherFemale": 0,
            "decFather": 0,
            "decOtherMale": 0,
            "decOtherUnknown": 20,
            "id": "fluc_15_11",
            "incOtherMale": 6,
            "decMother": 0,
            "time": "19:28",
            "date": "2026-01-07",
            "incOtherUnknown": 0,
            "incFather": 0,
            "verifier": ""
          },
          {
            "date": "2026-01-08",
            "decOtherMale": 15,
            "incMother": 27,
            "createdAt": 1767858480000,
            "incOtherMale": 0,
            "incOtherUnknown": 0,
            "decFather": 0,
            "id": "fluc_15_12",
            "verifier": "",
            "decMother": 0,
            "reason": "Chuyển cá thể đực và cái đủ tuổi vào đàn bố mẹ.",
            "decOtherFemale": 27,
            "incOtherFemale": 0,
            "incFather": 15,
            "decOtherUnknown": 0,
            "time": "07:48"
          },
          {
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "verifier": "",
            "incOtherUnknown": 28,
            "incFather": 0,
            "decOtherFemale": 0,
            "incOtherFemale": 0,
            "date": "2026-07-01",
            "time": "13:30",
            "incOtherMale": 0,
            "decMother": 0,
            "decFather": 0,
            "decOtherMale": 0,
            "decOtherUnknown": 0,
            "incMother": 0,
            "createdAt": 1782912600000,
            "id": "fluc_15_13"
          },
          {
            "createdAt": 1784532600000,
            "incMother": 0,
            "verifier": "",
            "date": "2026-07-20",
            "decMother": 0,
            "id": "fluc_15_14",
            "decFather": 0,
            "decOtherUnknown": 12,
            "incOtherUnknown": 0,
            "incFather": 0,
            "decOtherMale": 0,
            "incOtherFemale": 6,
            "decOtherFemale": 0,
            "incOtherMale": 6,
            "time": "07:30",
            "reason": "Xác định giới tính con con"
          },
          {
            "incFather": 0,
            "verifier": "",
            "date": "2026-08-01",
            "incOtherUnknown": 11,
            "createdAt": 1785587400000,
            "incMother": 0,
            "decOtherMale": 0,
            "id": "fluc_15_15",
            "incOtherMale": 0,
            "decOtherUnknown": 0,
            "decMother": 0,
            "time": "12:30",
            "decOtherFemale": 0,
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "incOtherFemale": 0,
            "decFather": 0
          },
          {
            "incOtherMale": 0,
            "decOtherMale": 0,
            "incOtherUnknown": 0,
            "time": "19:00",
            "decOtherFemale": 0,
            "incFather": 0,
            "incOtherFemale": 0,
            "decFather": 0,
            "decMother": 1,
            "date": "2026-08-16",
            "id": "fluc_15_16",
            "verifier": "",
            "decOtherUnknown": 2,
            "reason": "Chết do thời tiết/bệnh lý",
            "incMother": 0,
            "createdAt": 1786906800000
          },
          {
            "incOtherUnknown": 20,
            "decMother": 0,
            "verifier": "",
            "approvalStatus": "APPROVED",
            "isGenderIdentifyMode": false,
            "id": "fluc_1791031608601",
            "decFather": 0,
            "purpose": "T",
            "createdAt": 1791031608601,
            "incMother": 0,
            "date": "2026-10-03",
            "time": "19:45",
            "incOtherMale": 0,
            "decOtherMale": 0,
            "isPurchaseMode": false,
            "incFather": 0,
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "incOtherFemale": 0,
            "decOtherUnknown": 0,
            "decOtherFemale": 0
          },
          {
            "incOtherMale": 0,
            "reason": "Tặng cho/chuyển nhượng theo quyết định",
            "approvalStatus": "APPROVED",
            "decOtherMale": 0,
            "incFather": 0,
            "isGenderIdentifyMode": false,
            "date": "2026-10-06",
            "incOtherUnknown": 0,
            "isPurchaseMode": false,
            "purpose": "T",
            "decOtherUnknown": 0,
            "createdAt": 1792327999641,
            "incMother": 0,
            "time": "19:51",
            "verifier": "",
            "decOtherFemale": 0,
            "decFather": 20,
            "incOtherFemale": 0,
            "decMother": 20,
            "id": "fluc_1792327999641"
          },
          {
            "incFather": 0,
            "decOtherMale": 0,
            "time": "20:03",
            "approvalStatus": "APPROVED",
            "isGenderIdentifyMode": true,
            "incOtherMale": 24,
            "decOtherUnknown": 41,
            "incMother": 0,
            "createdAt": 1792329025484,
            "incOtherUnknown": 0,
            "verifier": "",
            "id": "fluc_1792329025484",
            "date": "2026-10-18",
            "incOtherFemale": 17,
            "decOtherFemale": 0,
            "purpose": "T",
            "reason": "Xác định giới tính con con",
            "decMother": 0,
            "decFather": 0,
            "isPurchaseMode": false
          }
        ]
      }
    ],
    "name": "Cơ sở nuôi Trần Văn Tới",
    "lat": 12.477054,
    "facilityName": "Cơ sở nuôi Trần Văn Tới",
    "phone": "",
    "commune": "xã Yang Mao",
    "id": "fac_15",
    "lng": 108.58051,
    "registrationCode": "52-26/B-DLC",
    "purposeCode": "T",
    "ownerName": "Trần Văn Tới",
    "address": "Thôn 1, xã Yang Mao, Tỉnh Đắk Lắk",
    "registrationDate": "2023-11-02"
  },
  {
    "phone": "",
    "lng": 108.551582,
    "registrationDate": "",
    "facilityName": "Cơ sở nuôi Lê Đình Tâm",
    "registrationCode": "Đang cập nhật",
    "ownerName": "Lê Đình Tâm",
    "speciesList": [
      {
        "purposeCode": "T",
        "citesAppendix": "Khai báo kiểm lâm",
        "id": "sp_16_1",
        "baseline": {
          "otherUnknown": 0,
          "mother": 2,
          "father": 2,
          "date": "2026-01-01",
          "otherFemale": 6,
          "note": "Số lượng Dúi mốc lớn hiện có",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 4
        },
        "fluctuations": [],
        "group": "Động vật rừng thông thường",
        "scientificName": "Rhizomys pruinosus",
        "vietnameseName": "Dúi mốc lớn"
      }
    ],
    "owner": "Lê Đình Tâm",
    "note": "",
    "purposeCode": "T",
    "updatedAt": "2026-11-26T00:29:15.576Z",
    "id": "fac_16",
    "commune": "xã Yang Mao",
    "name": "Cơ sở nuôi Lê Đình Tâm",
    "address": "Thôn Cư Drăm, xã Yang Mao, Tỉnh Đắk Lắk",
    "lat": 12.487572
  },
  {
    "lng": 108.560116,
    "name": "Cơ sở nuôi Nguyễn Kim Danh",
    "address": "Buôn Tul, xã Yang Mao, Tỉnh Đắk Lắk",
    "purposeCode": "T",
    "registrationCode": "Đang cập nhật",
    "id": "fac_17",
    "commune": "xã Yang Mao",
    "note": "",
    "owner": "Nguyễn Kim Danh",
    "updatedAt": "2026-11-26T00:29:15.576Z",
    "registrationDate": "",
    "facilityName": "Cơ sở nuôi Nguyễn Kim Danh",
    "ownerName": "Nguyễn Kim Danh",
    "speciesList": [
      {
        "purposeCode": "T",
        "baseline": {
          "otherUnknown": 0,
          "note": "Số lượng Dúi mốc lớn hiện có",
          "otherFemale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 10,
          "father": 2,
          "date": "2026-01-01",
          "otherMale": 0
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "fluctuations": [],
        "vietnameseName": "Dúi mốc lớn",
        "group": "Động vật rừng thông thường",
        "scientificName": "Rhizomys pruinosus",
        "id": "sp_17_1"
      }
    ],
    "phone": "",
    "lat": 12.462085
  },
  {
    "ownerName": "Nguyễn Lĩnh",
    "phone": "0866100652",
    "note": "",
    "registrationCode": "141-26/B-DLC",
    "speciesList": [
      {
        "scientificName": "Paradoxurus hermaphroditus",
        "purposeCode": "T",
        "vietnameseName": "Cầy vòi Hương",
        "id": "sp_1786163645775_1",
        "citesAppendix": "Phụ lục II CITES",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "baseline": {
          "otherMale": 0,
          "mother": 3,
          "father": 1,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-07-24",
          "note": "Hiện trạng đăng ký ban đầu",
          "otherUnknown": 0,
          "otherFemale": 0
        },
        "fluctuations": [
          {
            "incOtherMale": 0,
            "verifier": "",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decOtherMale": 0,
            "decOtherUnknown": 0,
            "incFather": 0,
            "time": "11:34",
            "isPurchaseMode": false,
            "purpose": "T",
            "decMother": 0,
            "date": "2026-07-20",
            "decFather": 0,
            "incOtherUnknown": 5,
            "decOtherFemale": 0,
            "incMother": 0,
            "createdAt": 1786163683953,
            "incOtherFemale": 0,
            "id": "fluc_1786163683953"
          }
        ]
      }
    ],
    "lat": 12.547587,
    "name": "Nguyễn Lĩnh",
    "id": "fac_1786163645775",
    "registrationDate": "2026-07-24",
    "owner": "Nguyễn Lĩnh",
    "commune": "xã Cư Pui",
    "facilityName": "Nguyễn Lĩnh",
    "lng": 108.455555,
    "address": "thôn 3, xã Cư Pui, tỉnh Đắk Lắk.",
    "updatedAt": "2026-11-26T00:29:15.577Z",
    "purposeCode": "T"
  },
  {
    "lng": 108.321947,
    "name": "Nguyễn Hoàng Dũng",
    "commune": "Xã Dang Kang",
    "purposeCode": "T",
    "note": "",
    "address": "thôn 6, xã Dang Kang, tỉnh Đắk Lắk",
    "facilityName": "Nguyễn Hoàng Dũng",
    "owner": "Nguyễn Hoàng Dũng",
    "ownerName": "Nguyễn Hoàng Dũng",
    "registrationCode": "142-26/B-DLC",
    "id": "fac_1786419630740",
    "updatedAt": "2026-11-26T00:29:15.577Z",
    "registrationDate": "2026-01-24",
    "speciesList": [
      {
        "fluctuations": [
          {
            "isPurchaseMode": true,
            "id": "fluc_1786419778624",
            "incFather": 0,
            "date": "2026-08-11",
            "decOtherFemale": 0,
            "incOtherUnknown": 0,
            "incOtherFemale": 5,
            "verifier": "",
            "createdAt": 1786419778624,
            "incMother": 0,
            "decOtherUnknown": 0,
            "time": "10:42",
            "decMother": 0,
            "incOtherMale": 0,
            "purpose": "T",
            "decFather": 0,
            "decOtherMale": 0,
            "reason": "Mua từ cơ sở nuôi sinh sản khác"
          }
        ],
        "id": "sp_1786419630740_1",
        "baseline": {
          "otherMale": 0,
          "date": "2026-07-24",
          "otherFemale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "note": "Hiện trạng đăng ký ban đầu",
          "father": 2,
          "mother": 40,
          "otherUnknown": 0
        },
        "purposeCode": "T",
        "scientificName": "Paradoxurus hermaphroditus",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "citesAppendix": "Phụ lục II CITES",
        "vietnameseName": "Cầy vòi Hương"
      },
      {
        "fluctuations": [],
        "purposeCode": "T",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "vietnameseName": "Cầy vòi mốc",
        "scientificName": "Paguma larvata",
        "id": "species_1786419708326",
        "baseline": {
          "note": "Số lượng vật nuôi hiện có ban đầu",
          "otherMale": 0,
          "otherFemale": 0,
          "verifier": "",
          "mother": "13",
          "father": "4",
          "otherUnknown": 0,
          "date": "2026-07-24"
        },
        "citesAppendix": "Phụ lục II CITES"
      }
    ],
    "phone": "0342017979",
    "lat": 12.558599
  },
  {
    "id": "fac_1786432202893",
    "lat": 12.520837,
    "purposeCode": "T",
    "facilityName": "Phạm Duy Thắng",
    "commune": "Xã Krông Bông",
    "phone": "",
    "updatedAt": "2026-11-26T00:29:15.577Z",
    "address": "Thôn 23",
    "registrationCode": "Chưa có mã số",
    "ownerName": "Phạm Duy Thắng",
    "note": "",
    "speciesList": [
      {
        "fluctuations": [
          {
            "isPurchaseMode": false,
            "incOtherUnknown": 6,
            "incFather": 0,
            "incOtherFemale": 0,
            "decOtherFemale": 0,
            "decOtherMale": 0,
            "date": "2026-07-08",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "incOtherMale": 0,
            "id": "fluc_1786468153021",
            "createdAt": 1786467765630,
            "incMother": 0,
            "time": "00:02",
            "purpose": "T",
            "decOtherUnknown": 0,
            "verifier": "",
            "decFather": 0,
            "decMother": 0
          },
          {
            "verifier": "",
            "createdAt": 1786505722932,
            "incMother": 0,
            "decOtherUnknown": 0,
            "time": "10:34",
            "decMother": 0,
            "decFather": 0,
            "decOtherFemale": 0,
            "purpose": "T",
            "incOtherFemale": 0,
            "incFather": 0,
            "reason": "sinh san F2",
            "date": "2026-08-12",
            "id": "fluc_1786518690491",
            "isPurchaseMode": false,
            "incOtherUnknown": 4,
            "decOtherMale": 0,
            "incOtherMale": 0
          },
          {
            "isPurchaseMode": false,
            "incMother": 0,
            "createdAt": 1786505722932,
            "decOtherFemale": 0,
            "decFather": 0,
            "date": "2026-08-12",
            "incOtherFemale": 0,
            "incOtherUnknown": 4,
            "decMother": 0,
            "decOtherUnknown": 0,
            "reason": "sinh san F2",
            "time": "10:34",
            "incFather": 0,
            "id": "fluc_1786518706173",
            "decOtherMale": 0,
            "purpose": "T",
            "incOtherMale": 0,
            "verifier": ""
          }
        ],
        "baseline": {
          "mother": 4,
          "father": 2,
          "note": "Hiện trạng đăng ký ban đầu",
          "otherUnknown": 0,
          "otherFemale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 0,
          "date": "2026-06-17"
        },
        "id": "sp_1786432202893_1",
        "scientificName": "Rhizomys pruinosus",
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường",
        "purposeCode": "T",
        "vietnameseName": "Dúi mốc lớn"
      }
    ],
    "owner": "Phạm Duy Thắng",
    "lng": 108.394137,
    "registrationDate": "2026-08-11",
    "name": "Phạm Duy Thắng"
  },
  {
    "owner": "Nguyễn Kim Tuấn",
    "address": "Thôn 6 xã Dang Kang",
    "speciesList": [
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "purposeCode": "T",
        "id": "sp_1786504114807_1",
        "vietnameseName": "Dúi mốc lớn",
        "baseline": {
          "otherMale": 0,
          "father": 10,
          "mother": 30,
          "otherFemale": 0,
          "note": "Hiện trạng đăng ký ban đầu",
          "otherUnknown": 0,
          "date": "2025-11-12",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông"
        },
        "scientificName": "Rhizomys pruinosus",
        "group": "Động vật rừng thông thường",
        "fluctuations": [
          {
            "verifier": "",
            "decFather": 0,
            "id": "fluc_1786504203858",
            "isPurchaseMode": false,
            "decOtherUnknown": 0,
            "decMother": 0,
            "incOtherFemale": 53,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decOtherFemale": 0,
            "createdAt": 1786504203858,
            "incMother": 0,
            "time": "10:09",
            "date": "2026-08-12",
            "purpose": "T",
            "incOtherUnknown": 32,
            "decOtherMale": 0,
            "incOtherMale": 38,
            "incFather": 0
          }
        ]
      }
    ],
    "registrationDate": "2025-11-12",
    "commune": "Xã Dang Kang",
    "lng": "108.338165",
    "registrationCode": "Chưa có mã số",
    "ownerName": "Nguyễn Kim Tuấn",
    "lat": "12.575576",
    "phone": "",
    "note": "",
    "updatedAt": "2026-11-26T00:29:15.577Z",
    "purposeCode": "T",
    "facilityName": "Nguyễn Kim Tuấn",
    "name": "Nguyễn Kim Tuấn",
    "id": "fac_1786504114807"
  },
  {
    "registrationDate": "2026-05-25",
    "owner": "Nguyễn Hữu Lưu",
    "note": "",
    "address": "",
    "id": "fac_1787585236556",
    "purposeCode": "T",
    "registrationCode": "Chưa có mã số",
    "updatedAt": "2026-11-26T00:29:15.577Z",
    "commune": "xã Cư Pui",
    "name": "Nguyễn Hữu Lưu",
    "lng": "108.431876",
    "lat": "12.532135",
    "phone": "",
    "speciesList": [
      {
        "purposeCode": "T",
        "fluctuations": [],
        "baseline": {
          "otherUnknown": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "note": "Hiện trạng đăng ký ban đầu",
          "date": "2026-05-25",
          "otherFemale": 0,
          "otherMale": 0,
          "father": 1,
          "mother": 1
        },
        "scientificName": "Pycnonotus jocosus",
        "id": "sp_1787585236556_1",
        "vietnameseName": "Chim Chào mào",
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường (Lớp Chim)"
      }
    ],
    "ownerName": "Nguyễn Hữu Lưu",
    "facilityName": "Nguyễn Hữu Lưu"
  },
  {
    "purposeCode": "T",
    "updatedAt": "2026-11-26T00:29:15.584Z",
    "owner": "Nguyễn Tâm Châu",
    "lat": 12.492318,
    "note": "",
    "name": "Nguyễn Tâm Châu",
    "address": "",
    "phone": "",
    "registrationCode": "Chưa có mã số",
    "id": "fac_1787793901636",
    "commune": "xã Hòa Sơn",
    "ownerName": "Nguyễn Tâm Châu",
    "registrationDate": "2026-06-27",
    "lng": 108.324298,
    "facilityName": "Nguyễn Tâm Châu",
    "speciesList": [
      {
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "id": "sp_1787793901636_1",
        "baseline": {
          "date": "2026-06-27",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherFemale": 0,
          "otherUnknown": 2,
          "father": 0,
          "mother": 0,
          "note": "Hiện trạng đăng ký ban đầu",
          "otherMale": 0
        },
        "purposeCode": "T",
        "scientificName": "Pycnonotus jocosus",
        "fluctuations": [],
        "citesAppendix": "Khai báo kiểm lâm",
        "vietnameseName": "Chim Chào mào"
      }
    ]
  },
  {
    "address": "Thôn 2",
    "updatedAt": "2026-11-26T00:29:15.584Z",
    "speciesList": [
      {
        "purposeCode": "T",
        "baseline": {
          "mother": 0,
          "father": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherFemale": 1,
          "otherMale": 1,
          "note": "Hiện trạng đăng ký ban đầu",
          "date": "2026-07-27",
          "otherUnknown": 2
        },
        "id": "sp_1787794070148_1",
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "vietnameseName": "Chim Cu gáy",
        "scientificName": "Streptopelia chinensis",
        "fluctuations": []
      }
    ],
    "owner": "Nguyễn Thanh ",
    "lat": 12.495249,
    "commune": "xã Hòa Sơn",
    "id": "fac_1787794070148",
    "phone": "",
    "facilityName": "Nguyễn Thanh ",
    "name": "Nguyễn Thanh ",
    "registrationDate": "2026-07-27",
    "lng": 108.294381,
    "ownerName": "Nguyễn Thanh ",
    "purposeCode": "T",
    "note": "",
    "registrationCode": "Chưa có mã số"
  },
  {
    "id": "fac_1787794146413",
    "address": "Thôn 9 Hòa Sơn",
    "speciesList": [
      {
        "baseline": {
          "otherUnknown": 4,
          "date": "2026-07-27",
          "father": 0,
          "mother": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "note": "Hiện trạng đăng ký ban đầu",
          "otherFemale": 0,
          "otherMale": 0
        },
        "vietnameseName": "Chim Chào mào",
        "scientificName": "Pycnonotus jocosus",
        "fluctuations": [],
        "citesAppendix": "Khai báo kiểm lâm",
        "purposeCode": "T",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "id": "sp_1787794146413_1"
      },
      {
        "scientificName": "Streptopelia chinensis",
        "id": "species_1790753399574",
        "fluctuations": [],
        "vietnameseName": "Chim Cu gáy",
        "citesAppendix": "Khai báo kiểm lâm",
        "purposeCode": "T",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "baseline": {
          "date": "2026-06-29",
          "otherFemale": "1",
          "mother": 0,
          "father": 0,
          "otherMale": "1",
          "verifier": "",
          "note": "Số lượng vật nuôi hiện có ban đầu",
          "otherUnknown": 0
        }
      }
    ],
    "updatedAt": "2026-11-26T00:29:15.585Z",
    "commune": "xã Hòa Sơn",
    "lng": 108.32352,
    "owner": "Trần Văn Ngọ",
    "ownerName": "Trần Văn Ngọ",
    "facilityName": "Trần Văn Ngọ",
    "lat": 12.492941,
    "registrationCode": "Chưa có mã số",
    "name": "Trần Văn Ngọ",
    "purposeCode": "T",
    "phone": "",
    "registrationDate": "2026-07-27",
    "note": ""
  },
  {
    "registrationDate": "2026-08-27",
    "id": "fac_1787794338130",
    "name": "Nguyễn Duy Thông",
    "lat": 12.490722,
    "purposeCode": "T",
    "facilityName": "Nguyễn Duy Thông",
    "registrationCode": "Chưa có mã số",
    "updatedAt": "2026-11-26T00:29:15.585Z",
    "note": "Đang cập nhập",
    "owner": "Nguyễn Duy Thông",
    "address": "thôn 9, xã Hoà Sơn, tỉnh Đắk Lắk0948861157",
    "ownerName": "Nguyễn Duy Thông",
    "speciesList": [
      {
        "id": "sp_1787794338130_1",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "vietnameseName": "Chim Chào mào",
        "scientificName": "Pycnonotus jocosus",
        "fluctuations": [],
        "baseline": {
          "date": "2026-08-27",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherFemale": "0",
          "otherMale": 0,
          "otherUnknown": 10,
          "note": "Hiện trạng đăng ký ban đầu",
          "father": 2,
          "mother": 2
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "purposeCode": "T"
      },
      {
        "scientificName": "Streptopelia chinensis",
        "vietnameseName": "Chim Cu gáy",
        "purposeCode": "T",
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "fluctuations": [],
        "id": "species_1788765271274",
        "baseline": {
          "date": "2026-09-07",
          "otherMale": "2",
          "otherUnknown": 0,
          "mother": 0,
          "father": 0,
          "note": "Số lượng vật nuôi hiện có ban đầu",
          "verifier": "",
          "otherFemale": "2"
        }
      }
    ],
    "lng": 108.315073,
    "commune": "xã Hòa Sơn",
    "phone": "0948861157"
  },
  {
    "purposeCode": "T",
    "phone": "0337825861",
    "address": "Thôn 10",
    "updatedAt": "2026-11-26T00:29:15.586Z",
    "registrationDate": "2026-08-27",
    "lng": 108.322735,
    "facilityName": "Vũ Hoàng Tân",
    "commune": "xã Hòa Sơn",
    "registrationCode": "Chưa có mã số",
    "owner": "Vũ Hoàng Tân",
    "id": "fac_1787795701427",
    "note": "",
    "lat": 12.500922,
    "ownerName": "Vũ Hoàng Tân",
    "speciesList": [
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "fluctuations": [],
        "id": "sp_1787795701427_1",
        "baseline": {
          "otherUnknown": 2,
          "date": "2026-08-27",
          "otherFemale": 0,
          "note": "Hiện trạng đăng ký ban đầu",
          "otherMale": 0,
          "mother": 0,
          "father": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông"
        },
        "vietnameseName": "Chim Chào mào",
        "scientificName": "Pycnonotus jocosus",
        "purposeCode": "T",
        "group": "Động vật rừng thông thường (Lớp Chim)"
      }
    ],
    "name": "Vũ Hoàng Tân"
  },
  {
    "lng": 108.322383,
    "note": "",
    "commune": "xã Hòa Sơn",
    "owner": "Nguyễn Văn Vinh",
    "speciesList": [
      {
        "purposeCode": "T",
        "citesAppendix": "Khai báo kiểm lâm",
        "fluctuations": [
          {
            "decOtherUnknown": 3,
            "time": "08:40",
            "reason": "chết do thời tiết",
            "incOtherMale": 0,
            "approvalStatus": "APPROVED",
            "decOtherMale": 16,
            "incFather": 0,
            "purpose": "T",
            "isGenderIdentifyMode": false,
            "id": "fluc_1793151784707",
            "isPurchaseMode": false,
            "verifier": "",
            "incMother": 0,
            "createdAt": 1793151784707,
            "decOtherFemale": 12,
            "decFather": 0,
            "incOtherFemale": 0,
            "date": "2026-10-27",
            "decMother": 0,
            "incOtherUnknown": 0
          },
          {
            "incMother": 0,
            "createdAt": 1793152177716,
            "verifier": "",
            "purpose": "T",
            "decMother": 0,
            "decOtherUnknown": 18,
            "date": "2026-10-27",
            "id": "fluc_1793152177716",
            "approvalStatus": "APPROVED",
            "reason": "Xác định giới tính con con",
            "decFather": 0,
            "decOtherFemale": 0,
            "incOtherFemale": 0,
            "incFather": 0,
            "decOtherMale": 0,
            "isGenderIdentifyMode": true,
            "incOtherMale": 18,
            "incOtherUnknown": 0,
            "time": "08:45",
            "isPurchaseMode": false
          }
        ],
        "baseline": {
          "date": "2026-10-05",
          "otherUnknown": 40,
          "otherFemale": 66,
          "otherMale": 42,
          "note": "Hiện trạng đăng ký ban đầu",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 6,
          "father": 6
        },
        "vietnameseName": "Dúi mốc lớn",
        "group": "Động vật rừng thông thường",
        "scientificName": "Rhizomys pruinosus",
        "id": "sp_1791188880545_1"
      }
    ],
    "name": "Nguyễn Văn Vinh",
    "address": "thôn 10, xã Hoà Sơn, tỉnh Đắk Lắk",
    "updatedAt": "2026-11-26T00:29:15.586Z",
    "ownerName": "Nguyễn Văn Vinh",
    "facilityName": "Nguyễn Văn Vinh",
    "id": "fac_1791188880545",
    "purposeCode": "T",
    "registrationDate": "2026-10-05",
    "phone": "0988.257.586",
    "lat": 12.49798,
    "registrationCode": "Chưa có mã số"
  },
  {
    "note": "",
    "registrationCode": "Chưa có mã số",
    "address": "Thôn 1, xã Hòa Sơn",
    "lng": 108.184749,
    "purposeCode": "T",
    "ownerName": "Lương Thị Cẩm Thanh",
    "name": "Lương Thị Cẩm Thanh",
    "phone": "",
    "registrationDate": "2026-10-11",
    "commune": "xã Hòa Sơn",
    "id": "fac_1794366309761",
    "owner": "Lương Thị Cẩm Thanh",
    "speciesList": [
      {
        "purposeCode": "T",
        "vietnameseName": "Nai",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "scientificName": "Rusa unicolor",
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "otherUnknown": 0,
          "otherMale": 0,
          "date": "2026-10-11",
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "note": "Hiện trạng đăng ký ban đầu",
          "otherFemale": 0,
          "mother": 2,
          "father": 1
        },
        "id": "sp_1794366309761_1",
        "fluctuations": []
      }
    ],
    "lat": 12.507605,
    "updatedAt": "2026-11-26T00:29:15.586Z",
    "facilityName": "Lương Thị Cẩm Thanh"
  },
  {
    "owner": "Tăng Ngọc Tịnh",
    "id": "fac_1794367138616",
    "commune": "Xã Dang Kang",
    "speciesList": [
      {
        "purposeCode": "T",
        "baseline": {
          "otherMale": 20,
          "mother": 0,
          "father": 0,
          "note": "Hiện trạng đăng ký ban đầu",
          "otherUnknown": 0,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "date": "2026-11-11",
          "otherFemale": 20
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "fluctuations": [],
        "group": "Động vật rừng thông thường",
        "scientificName": "Rhizomys pruinosus",
        "id": "sp_1794367138616_1",
        "vietnameseName": "Dúi mốc lớn"
      }
    ],
    "registrationCode": "Chưa có mã số",
    "lng": "108.341248",
    "note": "",
    "registrationDate": "2026-11-11",
    "ownerName": "Tăng Ngọc Tịnh",
    "address": "Thôn 9, xã Dang Kang",
    "name": "Tăng Ngọc Tịnh",
    "phone": "",
    "updatedAt": "2026-11-26T00:29:15.586Z",
    "facilityName": "Tăng Ngọc Tịnh",
    "lat": "12.577273",
    "purposeCode": "T"
  },
  {
    "id": "fac_1794368355384",
    "purposeCode": "T",
    "lat": "12.508668",
    "updatedAt": "2026-11-26T00:29:15.589Z",
    "facilityName": "Ngô Ngọc Tuân",
    "owner": "Ngô Ngọc Tuân",
    "address": "Thôn 1",
    "registrationCode": "Chưa có mã số",
    "name": "Ngô Ngọc Tuân",
    "commune": "xã Hòa Sơn",
    "lng": "108.186247",
    "ownerName": "Ngô Ngọc Tuân",
    "registrationDate": "2026-11-11",
    "speciesList": [
      {
        "fluctuations": [],
        "citesAppendix": "Khai báo kiểm lâm",
        "id": "sp_1794368355384_1",
        "scientificName": "Rusa unicolor",
        "baseline": {
          "mother": 2,
          "father": 1,
          "otherUnknown": 0,
          "note": "Hiện trạng đăng ký ban đầu",
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "otherFemale": 0,
          "date": "2026-11-11",
          "otherMale": 0
        },
        "vietnameseName": "Nai",
        "purposeCode": "T",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)"
      }
    ],
    "phone": "0903550988",
    "note": ""
  },
  {
    "facilityName": "Ngô Ngọc Tuân",
    "name": "Ngô Ngọc Tuân",
    "phone": "0903550988",
    "registrationDate": "2026-11-12",
    "purposeCode": "T",
    "note": "Đang thử Nghiệm",
    "registrationCode": "Chưa có mã số",
    "lat": "",
    "updatedAt": "2026-11-26T00:29:15.589Z",
    "id": "fac_1794453722654",
    "lng": "",
    "owner": "Ngô Ngọc Tuân",
    "commune": "xã Hòa Sơn",
    "ownerName": "Ngô Ngọc Tuân",
    "speciesList": [
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "purposeCode": "T",
        "fluctuations": [],
        "scientificName": "Rusa unicolor",
        "vietnameseName": "Nai",
        "id": "sp_1794453722654_1",
        "baseline": {
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "note": "Hiện trạng đăng ký ban đầu",
          "mother": 0,
          "date": "2026-11-12",
          "otherFemale": 2,
          "father": 0,
          "otherMale": 1,
          "otherUnknown": 0
        },
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)"
      }
    ],
    "address": "Thôn 1, xã Hoà Sơn, Tỉnh Đắk Lắk"
  },
  {
    "speciesList": [
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "date": "2026-01-01",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherUnknown": 0,
          "otherFemale": 12,
          "note": "Số lượng Dúi má đào hiện có",
          "father": 3,
          "mother": 4,
          "otherMale": 10
        },
        "id": "sp_18_1",
        "scientificName": "Rhizomys sumatrensis",
        "vietnameseName": "Dúi má đào",
        "fluctuations": [],
        "group": "Động vật rừng thông thường",
        "purposeCode": "T"
      },
      {
        "group": "Động vật rừng thông thường",
        "baseline": {
          "otherFemale": 15,
          "mother": 61,
          "father": 19,
          "date": "2026-01-01",
          "otherMale": 17,
          "note": "Số lượng Dúi mốc lớn hiện có",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherUnknown": 58
        },
        "vietnameseName": "Dúi mốc lớn",
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Rhizomys pruinosus",
        "fluctuations": [],
        "purposeCode": "T",
        "id": "sp_18_2"
      }
    ],
    "registrationDate": "",
    "phone": "",
    "lng": 108.423608,
    "registrationCode": "Đang cập nhật",
    "facilityName": "Cơ sở nuôi Lê Quang Mạnh",
    "updatedAt": "2026-11-26T00:29:15.589Z",
    "address": "Thôn 29, Xã Krông Bông, Tỉnh Đắk Lắk",
    "ownerName": "Lê Quang Mạnh",
    "name": "Cơ sở nuôi Lê Quang Mạnh",
    "lat": 12.526903,
    "owner": "Lê Quang Mạnh",
    "id": "fac_18",
    "commune": "Xã Krông Bông",
    "purposeCode": "T",
    "note": ""
  },
  {
    "purposeCode": "T",
    "registrationCode": "Đang cập nhật",
    "ownerName": "Nguyễn Trương Đắc Nam",
    "owner": "Nguyễn Trương Đắc Nam",
    "facilityName": "Cơ sở nuôi Nguyễn Trương Đắc Nam",
    "registrationDate": "",
    "lng": 108.328497,
    "id": "fac_19",
    "lat": 12.528051,
    "name": "Cơ sở nuôi Nguyễn Trương Đắc Nam",
    "address": "Thôn 9, Xã Krông Bông, Tỉnh Đắk Lắk",
    "phone": "",
    "updatedAt": "2026-11-26T00:29:15.589Z",
    "commune": "Xã Krông Bông",
    "note": "",
    "speciesList": [
      {
        "baseline": {
          "otherFemale": 0,
          "date": "2026-01-01",
          "otherMale": 0,
          "otherUnknown": 0,
          "father": 10,
          "note": "Số lượng Dúi mốc lớn hiện có",
          "mother": 15,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông"
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Rhizomys pruinosus",
        "purposeCode": "T",
        "vietnameseName": "Dúi mốc lớn",
        "id": "sp_19_1",
        "fluctuations": [],
        "group": "Động vật rừng thông thường"
      }
    ]
  },
  {
    "lng": 108.297682,
    "updatedAt": "2026-11-26T00:29:15.589Z",
    "purposeCode": "T",
    "address": "Thôn Quảng Đông, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "name": "Cơ sở nuôi Nguyễn Văn Thúy",
    "note": "",
    "commune": "xã Hòa Sơn",
    "owner": "Nguyễn Văn Thúy",
    "facilityName": "Cơ sở nuôi Nguyễn Văn Thúy",
    "id": "fac_2",
    "registrationCode": "IIB-C-DLC-028",
    "ownerName": "Nguyễn Văn Thúy",
    "phone": "",
    "speciesList": [
      {
        "baseline": {
          "otherFemale": 7,
          "note": "Số lượng vật nuôi đăng ký",
          "father": 2,
          "mother": 3,
          "date": "2025-12-30",
          "otherUnknown": 3,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 6
        },
        "fluctuations": [
          {
            "time": "22:03",
            "incOtherFemale": 1,
            "decOtherFemale": 0,
            "id": "fluc_1792335832088",
            "incFather": 0,
            "incOtherUnknown": 0,
            "verifier": "",
            "isGenderIdentifyMode": true,
            "isPurchaseMode": false,
            "purpose": "T",
            "reason": "Xác định giới tính con con",
            "incMother": 0,
            "createdAt": 1792335832088,
            "incOtherMale": 2,
            "decOtherUnknown": 3,
            "decFather": 0,
            "date": "2026-06-13",
            "approvalStatus": "APPROVED",
            "decOtherMale": 0,
            "decMother": 0
          },
          {
            "incOtherMale": 0,
            "purpose": "T",
            "createdAt": 1792335872475,
            "incMother": 0,
            "isPurchaseMode": false,
            "date": "2026-06-13",
            "id": "fluc_1792335872475",
            "decOtherMale": 0,
            "incOtherUnknown": 17,
            "decFather": 0,
            "decOtherFemale": 0,
            "decMother": 0,
            "incOtherFemale": 0,
            "approvalStatus": "APPROVED",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "isGenderIdentifyMode": false,
            "incFather": 0,
            "decOtherUnknown": 0,
            "verifier": "",
            "time": "22:03"
          },
          {
            "id": "fluc_1792336162817",
            "incFather": 0,
            "purpose": "T",
            "date": "2026-07-06",
            "approvalStatus": "APPROVED",
            "verifier": "",
            "decOtherUnknown": 17,
            "incOtherMale": 5,
            "incMother": 0,
            "createdAt": 1792336162817,
            "incOtherUnknown": 0,
            "decOtherFemale": 0,
            "decOtherMale": 0,
            "incOtherFemale": 12,
            "decMother": 0,
            "time": "22:08",
            "isGenderIdentifyMode": true,
            "reason": "Xác định giới tính con con",
            "isPurchaseMode": false,
            "decFather": 0
          },
          {
            "approvalStatus": "APPROVED",
            "incOtherUnknown": 0,
            "time": "22:10",
            "isGenderIdentifyMode": false,
            "decMother": 0,
            "decFather": 0,
            "reason": "Chết do thời tiết/bệnh lý",
            "incOtherMale": 0,
            "incMother": 0,
            "createdAt": 1792336234681,
            "id": "fluc_1792336234681",
            "decOtherMale": 3,
            "isPurchaseMode": false,
            "purpose": "T",
            "incFather": 0,
            "decOtherFemale": 7,
            "verifier": "",
            "incOtherFemale": 0,
            "date": "2026-10-16",
            "decOtherUnknown": 0
          },
          {
            "isPurchaseMode": false,
            "incMother": 0,
            "createdAt": 1792336180572,
            "incOtherUnknown": 4,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "isGenderIdentifyMode": false,
            "incOtherFemale": 0,
            "decOtherFemale": 0,
            "decMother": 0,
            "date": "2026-10-18",
            "decFather": 0,
            "verifier": "",
            "incOtherMale": 0,
            "incFather": 0,
            "time": "22:09",
            "id": "fluc_1792336180572",
            "approvalStatus": "APPROVED",
            "decOtherMale": 0,
            "decOtherUnknown": 0,
            "purpose": "T"
          }
        ],
        "id": "sp_2_1",
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "citesAppendix": "Phụ lục II CITES",
        "purposeCode": "T"
      }
    ],
    "registrationDate": "2023-04-17",
    "lat": 12.491634
  },
  {
    "name": "Cơ sở nuôi Trần Văn Lực",
    "owner": "Trần Văn Lực",
    "ownerName": "Trần Văn Lực",
    "purposeCode": "T",
    "note": "",
    "lat": 12.58438,
    "id": "fac_20",
    "address": "Buôn Cư Ênun A, Xã Dang Kang, Tỉnh Đắk Lắk",
    "registrationCode": "Đang cập nhật",
    "lng": 108.315384,
    "phone": "",
    "speciesList": [
      {
        "group": "Động vật rừng thông thường",
        "vietnameseName": "Dúi má đào",
        "id": "sp_20_1",
        "scientificName": "Rhizomys sumatrensis",
        "purposeCode": "T",
        "baseline": {
          "father": 4,
          "mother": 26,
          "otherUnknown": 11,
          "otherFemale": 8,
          "date": "2026-01-01",
          "note": "Số lượng Dúi má đào hiện có",
          "otherMale": 6,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông"
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "fluctuations": []
      }
    ],
    "commune": "Xã Dang Kang",
    "facilityName": "Cơ sở nuôi Trần Văn Lực",
    "registrationDate": "",
    "updatedAt": "2026-11-26T00:29:15.590Z"
  },
  {
    "phone": "",
    "id": "fac_21",
    "note": "",
    "lng": 108.339096,
    "registrationDate": "",
    "commune": "Xã Dang Kang",
    "speciesList": [
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường",
        "vietnameseName": "Dúi mốc lớn",
        "scientificName": "Rhizomys pruinosus",
        "purposeCode": "T",
        "baseline": {
          "otherFemale": 0,
          "date": "2026-01-01",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 10,
          "otherMale": 0,
          "mother": 10,
          "otherUnknown": 0,
          "note": "Số lư��ng Dúi mốc lớn hiện có"
        },
        "id": "sp_21_1",
        "fluctuations": []
      }
    ],
    "name": "Cơ sở nuôi Đinh Tiến Toàn",
    "registrationCode": "Đang cập nhật",
    "address": "Thôn 3, Xã Dang Kang, Tỉnh Đắk Lắk",
    "updatedAt": "2026-11-26T00:29:15.590Z",
    "owner": "Đinh Tiến Toàn",
    "ownerName": "Đinh Tiến Toàn",
    "facilityName": "Cơ sở nuôi Đinh Tiến Toàn",
    "purposeCode": "T",
    "lat": 12.619158
  },
  {
    "commune": "xã Hòa Sơn",
    "updatedAt": "2026-11-26T00:29:15.590Z",
    "speciesList": [
      {
        "id": "sp_22_1",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "fluctuations": [],
        "vietnameseName": "Chim Cu gáy",
        "purposeCode": "T",
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Streptopelia chinensis",
        "baseline": {
          "otherUnknown": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 1,
          "father": 1,
          "date": "2026-01-01",
          "otherMale": 0,
          "otherFemale": 0,
          "note": "Số lượng Chim Cu gáy nuôi"
        }
      }
    ],
    "address": "Thôn 2, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "owner": "Nguyễn Thanh",
    "registrationCode": "Đang cập nhật",
    "ownerName": "Nguyễn Thanh",
    "name": "Cơ sở nuôi Nguyễn Thanh",
    "purposeCode": "T",
    "facilityName": "Cơ sở nuôi Nguyễn Thanh",
    "registrationDate": "",
    "id": "fac_22",
    "note": "",
    "phone": ""
  },
  {
    "owner": "Huỳnh Phúc Lợi",
    "id": "fac_23",
    "note": "Làm cảnh",
    "updatedAt": "2026-11-26T00:29:15.590Z",
    "name": "Cơ sở nuôi Huỳnh Phúc Lợi",
    "facilityName": "Cơ sở nuôi Huỳnh Phúc Lợi",
    "speciesList": [
      {
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "purposeCode": "O",
        "citesAppendix": "Khai báo kiểm lâm",
        "id": "sp_23_1",
        "fluctuations": [],
        "baseline": {
          "note": "Số lượng Chim Chào mào nuôi cảnh",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherFemale": 0,
          "otherMale": 0,
          "father": 3,
          "mother": 0,
          "otherUnknown": 0,
          "date": "2026-01-01"
        },
        "vietnameseName": "Chim Chào mào",
        "scientificName": "Pycnonotus jocosus"
      }
    ],
    "ownerName": "Huỳnh Phúc Lợi",
    "phone": "",
    "commune": "xã Hòa Sơn",
    "purposeCode": "O",
    "registrationCode": "Đang cập nhật",
    "address": "Thôn 2, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "registrationDate": ""
  },
  {
    "phone": "",
    "ownerName": "Phan Thanh Trúc",
    "purposeCode": "T",
    "owner": "Phan Thanh Trúc",
    "registrationDate": "",
    "note": "",
    "speciesList": [
      {
        "fluctuations": [],
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "otherUnknown": 0,
          "otherMale": 0,
          "father": 5,
          "mother": 5,
          "date": "2026-01-01",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "note": "Số lượng Chim Chào mào nuôi",
          "otherFemale": 0
        },
        "id": "sp_24_1",
        "scientificName": "Pycnonotus jocosus",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "vietnameseName": "Chim Chào mào",
        "purposeCode": "T"
      }
    ],
    "id": "fac_24",
    "commune": "xã Hòa Sơn",
    "facilityName": "Cơ sở nuôi Phan Thanh Trúc",
    "name": "Cơ sở nuôi Phan Thanh Trúc",
    "registrationCode": "Đang cập nhật",
    "updatedAt": "2026-11-26T00:29:15.590Z",
    "address": "Thôn 4, xã Hòa Sơn, Tỉnh Đắk Lắk"
  },
  {
    "ownerName": "Thái Hồng Sơn",
    "registrationDate": "",
    "commune": "Xã Krông Bông",
    "id": "fac_25",
    "facilityName": "Cơ sở nuôi Thái Hồng Sơn",
    "speciesList": [
      {
        "baseline": {
          "note": "Số lượng Chim Chào mào nuôi",
          "otherUnknown": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherFemale": 0,
          "father": 5,
          "mother": 5,
          "date": "2026-01-01",
          "otherMale": 0
        },
        "fluctuations": [],
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "purposeCode": "T",
        "id": "sp_25_1",
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Pycnonotus jocosus",
        "vietnameseName": "Chim Chào mào"
      }
    ],
    "owner": "Thái Hồng Sơn",
    "address": "Thôn 4, Xã Krông Bông, Tỉnh Đắk Lắk",
    "registrationCode": "Đang cập nhật",
    "lat": 12.502961,
    "lng": 108.333624,
    "note": "",
    "purposeCode": "T",
    "phone": "",
    "name": "Cơ sở nuôi Thái Hồng Sơn",
    "updatedAt": "2026-11-26T00:29:15.590Z"
  },
  {
    "registrationDate": "",
    "facilityName": "Cơ sở nuôi Nguyễn Trí",
    "address": "Thôn 7, Xã Krông Bông, Tỉnh Đắk Lắk",
    "ownerName": "Nguyễn Trí",
    "lat": 12.523945,
    "owner": "Nguyễn Trí",
    "purposeCode": "T",
    "registrationCode": "Đang cập nhật",
    "commune": "Xã Krông Bông",
    "note": "",
    "speciesList": [
      {
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 1,
          "mother": 11,
          "father": 11,
          "note": "Số lượng Chim Cu gáy nuôi",
          "otherFemale": 1,
          "date": "2026-01-01",
          "otherUnknown": 0
        },
        "vietnameseName": "Chim Cu gáy",
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Streptopelia chinensis",
        "purposeCode": "T",
        "fluctuations": [],
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "id": "sp_26_1"
      }
    ],
    "lng": 108.336714,
    "phone": "",
    "name": "Cơ sở nuôi Nguyễn Trí",
    "id": "fac_26",
    "updatedAt": "2026-11-26T00:29:15.590Z"
  },
  {
    "updatedAt": "2026-11-26T00:29:15.658Z",
    "commune": "Xã Krông Bông",
    "registrationDate": "",
    "name": "Cơ sở nuôi Nguyễn Văn Hòa",
    "facilityName": "Cơ sở nuôi Nguyễn Văn Hòa",
    "address": "Thôn 2, Xã Krông Bông, Tỉnh Đắk Lắk",
    "registrationCode": "Đang cập nhật",
    "speciesList": [
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "vietnameseName": "Chim Chào mào",
        "purposeCode": "T",
        "baseline": {
          "date": "2026-01-01",
          "otherFemale": 0,
          "father": 2,
          "mother": 2,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherUnknown": 0,
          "note": "Số lượng Chim Chào mào nuôi",
          "otherMale": 0
        },
        "scientificName": "Pycnonotus jocosus",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "id": "sp_27_1",
        "fluctuations": []
      }
    ],
    "note": "",
    "owner": "Nguyễn Văn Hòa",
    "purposeCode": "T",
    "id": "fac_27",
    "ownerName": "Nguyễn Văn Hòa",
    "phone": ""
  },
  {
    "lng": 108.401029,
    "note": "",
    "commune": "Xã Krông Bông",
    "owner": "Trần Văn Hà",
    "purposeCode": "T",
    "name": "Cơ sở nuôi Trần Văn Hà",
    "facilityName": "Cơ sở nuôi Trần Văn Hà",
    "address": "Thôn 26, Xã Krông Bông, Tỉnh Đắk Lắk",
    "updatedAt": "2026-11-26T00:29:15.658Z",
    "id": "fac_28",
    "speciesList": [
      {
        "id": "sp_28_1",
        "purposeCode": "T",
        "baseline": {
          "date": "2026-01-01",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 1,
          "otherMale": 0,
          "mother": 1,
          "otherFemale": 0,
          "otherUnknown": 0,
          "note": "Số lượng Chim Chào mào nuôi"
        },
        "fluctuations": [],
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Pycnonotus jocosus",
        "vietnameseName": "Chim Chào mào"
      }
    ],
    "registrationCode": "Đang cập nhật",
    "ownerName": "Trần Văn Hà",
    "phone": "",
    "registrationDate": "",
    "lat": 12.547061
  },
  {
    "speciesList": [
      {
        "id": "sp_29_1",
        "fluctuations": [],
        "baseline": {
          "otherFemale": 0,
          "father": 2,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 2,
          "note": "Số lượng Chim Cu gáy nuôi",
          "otherMale": 0,
          "date": "2026-01-01",
          "otherUnknown": 0
        },
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "purposeCode": "T",
        "scientificName": "Streptopelia chinensis",
        "citesAppendix": "Khai báo kiểm lâm",
        "vietnameseName": "Chim Cu gáy"
      }
    ],
    "ownerName": "Trần Ngọc Long",
    "phone": "",
    "facilityName": "Cơ sở nuôi Trần Ngọc Long",
    "registrationDate": "",
    "address": "Thôn 2, Xã Krông Bông, Tỉnh Đắk Lắk",
    "updatedAt": "2026-11-26T00:29:15.659Z",
    "name": "Cơ sở nuôi Trần Ngọc Long",
    "registrationCode": "Đang cập nhật",
    "id": "fac_29",
    "commune": "Xã Krông Bông",
    "note": "",
    "purposeCode": "T",
    "owner": "Trần Ngọc Long"
  },
  {
    "phone": "",
    "purposeCode": "T",
    "ownerName": "Trịnh Viết Long",
    "lat": 12.506699,
    "lng": 108.1885,
    "name": "Cơ sở nuôi Trịnh Viết Long",
    "address": "Thôn 4, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "owner": "Trịnh Viết Long",
    "id": "fac_3",
    "updatedAt": "2026-11-26T00:29:15.659Z",
    "registrationDate": "2025-10-03",
    "speciesList": [
      {
        "id": "sp_3_1",
        "fluctuations": [],
        "purposeCode": "T",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "citesAppendix": "Phụ lục II CITES",
        "scientificName": "Paradoxurus hermaphroditus",
        "baseline": {
          "date": "2025-10-03",
          "mother": 0,
          "father": 0,
          "otherMale": 0,
          "note": "Cơ sở hiện nghỉ nuôi",
          "otherFemale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherUnknown": 0
        },
        "vietnameseName": "Cầy vòi Hương"
      }
    ],
    "note": "Nghỉ nuôi",
    "facilityName": "Cơ sở nuôi Trịnh Viết Long",
    "commune": "xã Hòa Sơn",
    "registrationCode": "028-25/B-DLC"
  },
  {
    "phone": "",
    "facilityName": "Cơ sở nuôi Hoàng Văn Hải",
    "lng": 108.3365,
    "speciesList": [
      {
        "purposeCode": "T",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "fluctuations": [],
        "id": "sp_30_1",
        "baseline": {
          "otherUnknown": 3,
          "date": "2026-01-01",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherFemale": 2,
          "note": "Số lượng Chim Chào mào nuôi",
          "otherMale": 3,
          "father": 2,
          "mother": 2
        },
        "scientificName": "Pycnonotus jocosus",
        "citesAppendix": "Khai báo kiểm lâm",
        "vietnameseName": "Chim Chào mào"
      }
    ],
    "ownerName": "Hoàng Văn Hải",
    "id": "fac_30",
    "note": "",
    "owner": "Hoàng Văn Hải",
    "address": "Thôn 6, Xã Dang Kang, Tỉnh Đắk Lắk",
    "updatedAt": "2026-11-26T00:29:15.660Z",
    "registrationDate": "",
    "purposeCode": "T",
    "name": "Cơ sở nuôi Hoàng Văn Hải",
    "commune": "Xã Dang Kang",
    "lat": 12.574027,
    "registrationCode": "Đang cập nhật"
  },
  {
    "owner": "Võ Văn Nhơn",
    "updatedAt": "2026-11-26T00:29:15.660Z",
    "lng": 108.33214,
    "purposeCode": "O",
    "registrationDate": "",
    "speciesList": [
      {
        "vietnameseName": "Chim Chào mào",
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Pycnonotus jocosus",
        "id": "sp_31_1",
        "fluctuations": [],
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "purposeCode": "O",
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherUnknown": 0,
          "otherMale": 0,
          "date": "2026-01-01",
          "mother": 1,
          "father": 1,
          "note": "Số lượng Chim Chào mào nuôi cảnh",
          "otherFemale": 0
        }
      }
    ],
    "ownerName": "Võ Văn Nhơn",
    "lat": 12.562678,
    "phone": "",
    "note": "Làm cảnh",
    "address": "Thôn 7, Xã Dang Kang, Tỉnh Đắk Lắk",
    "facilityName": "Cơ sở nuôi Võ Văn Nhơn",
    "registrationCode": "Đang cập nhật",
    "name": "Cơ sở nuôi Võ Văn Nhơn",
    "commune": "Xã Dang Kang",
    "id": "fac_31"
  },
  {
    "registrationCode": "104-26/B-DLC",
    "lat": 12.492824,
    "speciesList": [
      {
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-01-01",
          "note": "Chưa được cấp mã số cơ sở",
          "otherMale": 0,
          "otherUnknown": 0,
          "mother": 11,
          "father": "5",
          "otherFemale": 0
        },
        "id": "sp_4_1",
        "purposeCode": "T",
        "citesAppendix": "Phụ lục II CITES",
        "scientificName": "Paradoxurus hermaphroditus",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "vietnameseName": "Cầy vòi Hương",
        "fluctuations": [
          {
            "verifier": "",
            "decMother": 0,
            "isPurchaseMode": false,
            "decFather": 0,
            "time": "15:12",
            "incOtherMale": 0,
            "incMother": 0,
            "createdAt": 1794471159277,
            "decOtherMale": 0,
            "decOtherFemale": 0,
            "incOtherUnknown": 4,
            "incOtherFemale": 0,
            "purpose": "T",
            "approvalStatus": "APPROVED",
            "decOtherUnknown": 0,
            "reason": "sinh sản",
            "date": "2026-11-12",
            "id": "fluc_1794471159277",
            "incFather": 0,
            "isGenderIdentifyMode": false
          }
        ]
      }
    ],
    "registrationDate": "2026-07-06",
    "updatedAt": "2026-11-26T00:29:15.660Z",
    "phone": "",
    "id": "fac_4",
    "purposeCode": "T",
    "address": "Thôn 8, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "name": "Cơ sở nuôi Phạm Bá Quang",
    "ownerName": "Phạm Bá Quang",
    "lng": 108.29803,
    "facilityName": "Cơ sở nuôi Phạm Bá Quang",
    "commune": "xã Hòa Sơn",
    "owner": "Phạm Bá Quang",
    "note": "104-26/B-DLC"
  },
  {
    "ownerName": "Phan Thanh Hùng",
    "phone": "",
    "purposeCode": "T",
    "speciesList": [
      {
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "vietnameseName": "Cầy vòi Hương",
        "baseline": {
          "mother": 0,
          "father": 0,
          "otherUnknown": 0,
          "note": "Cơ sở nghỉ nuôi",
          "otherMale": 0,
          "date": "2022-04-22",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherFemale": 0
        },
        "scientificName": "Paradoxurus hermaphroditus",
        "id": "sp_5_1",
        "citesAppendix": "Phụ lục II CITES",
        "fluctuations": [],
        "purposeCode": "T"
      }
    ],
    "id": "fac_5",
    "registrationCode": "IIB-DLC-021",
    "facilityName": "Cơ sở nuôi Phan Thanh Hùng",
    "note": "Nghỉ nuôi",
    "address": "Thôn 1, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "owner": "Phan Thanh Hùng",
    "updatedAt": "2026-11-26T00:29:15.660Z",
    "registrationDate": "2022-04-22",
    "commune": "xã Hòa Sơn",
    "name": "Cơ sở nuôi Phan Thanh Hùng"
  },
  {
    "phone": "",
    "address": "Thôn 6, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "purposeCode": "T",
    "commune": "xã Hòa Sơn",
    "updatedAt": "2026-11-26T00:29:15.660Z",
    "id": "fac_6",
    "facilityName": "Cơ sở nuôi Lê Nguyễn Nhật Tân",
    "note": "Nghỉ nuôi",
    "owner": "Lê Nguyễn Nhật Tân",
    "ownerName": "Lê Nguy���n Nhật Tân",
    "registrationCode": "IIB-DLC-025",
    "name": "Cơ sở nuôi Lê Nguyễn Nhật Tân",
    "speciesList": [
      {
        "purposeCode": "T",
        "fluctuations": [],
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "citesAppendix": "Phụ lục II CITES",
        "id": "sp_6_1",
        "baseline": {
          "date": "2026-01-01",
          "otherFemale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 0,
          "father": 0,
          "mother": 0,
          "otherUnknown": 0,
          "note": "Cơ sở nghỉ nuôi"
        },
        "vietnameseName": "Cầy vòi Hương",
        "scientificName": "Paradoxurus hermaphroditus"
      }
    ],
    "registrationDate": ""
  },
  {
    "owner": "Nguyễn Tấn Danh Nhân",
    "registrationCode": "IIB-C-DLC-055",
    "speciesList": [
      {
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "purposeCode": "T",
        "id": "sp_7_1",
        "fluctuations": [],
        "baseline": {
          "otherFemale": 14,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 5,
          "father": 3,
          "note": "Số lượng Cầy vòi Hương hiện có",
          "date": "2024-07-03",
          "otherMale": 12,
          "otherUnknown": 19
        },
        "scientificName": "Paradoxurus hermaphroditus",
        "citesAppendix": "Phụ lục II CITES",
        "vietnameseName": "Cầy vòi Hương"
      },
      {
        "citesAppendix": "Phụ lục II CITES",
        "fluctuations": [],
        "vietnameseName": "Cầy vòi mốc",
        "scientificName": "Paguma larvata",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "id": "sp_7_2",
        "baseline": {
          "father": 2,
          "mother": 3,
          "date": "2024-07-03",
          "otherMale": 0,
          "otherUnknown": 0,
          "otherFemale": 0,
          "note": "Số lượng Cầy vòi mốc hiện có",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông"
        },
        "purposeCode": "T"
      },
      {
        "vietnameseName": "Don",
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Atherurus macrourus",
        "id": "sp_7_3",
        "purposeCode": "T",
        "fluctuations": [],
        "baseline": {
          "otherMale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "note": "Hiện trạng nuôi loài Don",
          "mother": 1,
          "father": 1,
          "date": "2026-01-01",
          "otherFemale": 0,
          "otherUnknown": 0
        },
        "group": "Động vật rừng thông thường"
      },
      {
        "id": "sp_7_4",
        "baseline": {
          "date": "2026-01-01",
          "otherUnknown": 11,
          "otherMale": 21,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherFemale": 31,
          "father": 6,
          "mother": 12,
          "note": "Hiện trạng nuôi loài Nhím"
        },
        "scientificName": "Hystrix brachyura",
        "group": "Động vật rừng thông thường",
        "vietnameseName": "Nhím",
        "fluctuations": [],
        "citesAppendix": "Khai báo kiểm lâm",
        "purposeCode": "T"
      }
    ],
    "ownerName": "Nguyễn Tấn Danh Nhân",
    "commune": "xã Yang Mao",
    "lng": 108.562016,
    "facilityName": "Cơ sở nuôi Nguyễn Tấn Danh Nhân",
    "registrationDate": "2024-07-03",
    "address": "Buôn Tơ Rang, xã Yang Mao, Tỉnh Đắk Lắk",
    "note": "",
    "phone": "",
    "name": "Cơ sở nuôi Nguyễn Tấn Danh Nhân",
    "lat": 12.472545,
    "purposeCode": "T",
    "id": "fac_7",
    "updatedAt": "2026-11-26T00:29:15.662Z"
  },
  {
    "registrationDate": "2026-05-05",
    "ownerName": "Huỳnh Công Nam",
    "registrationCode": "53-26/B-DLC",
    "phone": "",
    "lat": 12.483552,
    "purposeCode": "T",
    "id": "fac_8",
    "facilityName": "Cơ sở nuôi Huỳnh Công Nam",
    "speciesList": [
      {
        "purposeCode": "T",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "fluctuations": [],
        "id": "sp_8_1",
        "baseline": {
          "mother": 5,
          "father": 1,
          "otherFemale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-05-05",
          "otherUnknown": 4,
          "note": "Hiện trạng nuôi ban đầu",
          "otherMale": 0
        },
        "citesAppendix": "Phụ lục II CITES",
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương"
      }
    ],
    "lng": 108.562716,
    "name": "Cơ sở nuôi Huỳnh Công Nam",
    "address": "Buôn chàm A, xã Yang Mao, Tỉnh Đắk Lắk",
    "note": "",
    "owner": "Huỳnh Công Nam",
    "commune": "xã Yang Mao",
    "updatedAt": "2026-11-26T00:29:15.662Z"
  },
  {
    "registrationDate": "2026-03-03",
    "speciesList": [
      {
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "id": "sp_9_1",
        "scientificName": "Paradoxurus hermaphroditus",
        "purposeCode": "T",
        "fluctuations": [],
        "vietnameseName": "Cầy vòi Hương",
        "baseline": {
          "date": "2026-03-03",
          "otherFemale": 0,
          "father": 5,
          "mother": 8,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 0,
          "otherUnknown": 0,
          "note": "Hiện trạng nuôi ban đầu"
        },
        "citesAppendix": "Phụ lục II CITES"
      }
    ],
    "owner": "Trần Duy Quân",
    "updatedAt": "2026-11-26T00:29:15.662Z",
    "lng": 108.655302,
    "registrationCode": "14-26/B-DLC",
    "facilityName": "Cơ sở nuôi Trần Duy Quân",
    "commune": "xã Yang Mao",
    "lat": 12.503389,
    "phone": "",
    "name": "Cơ sở nuôi Trần Duy Quân",
    "id": "fac_9",
    "address": "Thôn Ea Luêh, xã Yang Mao, Tỉnh Đắk Lắk",
    "purposeCode": "T",
    "ownerName": "Trần Duy Quân",
    "note": ""
  }
];

export function clearAppData() {
  const emptyData = {
    facilitiesList: [],
    activeFacilityId: null,
    facilityInfo: { ...EMPTY_FACILITY_INFO },
    speciesList: [],
    activeSpeciesId: null,
  };
  saveAppData(emptyData);
  return emptyData;
}

export function resetToDemoData() {
  const demoData = {
    facilitiesList: REAL_FACILITIES_DATA,
    activeFacilityId: REAL_FACILITIES_DATA[0].id,
    facilityInfo: REAL_FACILITIES_DATA[0],
    speciesList: REAL_FACILITIES_DATA[0].speciesList,
    activeSpeciesId: REAL_FACILITIES_DATA[0].speciesList[0].id,
  };
  saveAppData(demoData);
  return demoData;
}

export function loadAppData() {
  try {
    let urlFacId = null;
    if (typeof window !== "undefined") {
      try {
        const params = new URLSearchParams(window.location.search);
        urlFacId = params.get("facId") || params.get("facilityId");
      } catch (e) {}
    }

    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const oldRaw = localStorage.getItem("wildlife_manager_data_v5");
      if (oldRaw) {
        try {
          const oldData = JSON.parse(oldRaw);
          if (oldData && Array.isArray(oldData.facilitiesList)) {
            const merged = oldData.facilitiesList.map((f) => {
              const fresh = REAL_FACILITIES_DATA.find((rf) => rf.id === f.id);
              if (fresh && fresh.speciesList) {
                const freshCount = fresh.speciesList.reduce((acc, s) => acc + (s.fluctuations?.length || 0), 0);
                const oldCount = f.speciesList?.reduce((acc, s) => acc + (s.fluctuations?.length || 0), 0) || 0;
                if (freshCount > oldCount) {
                  return { ...f, speciesList: fresh.speciesList, baseline: fresh.baseline };
                }
              }
              return f;
            });
            const migrated = { ...oldData, facilitiesList: merged };
            saveAppData(migrated);
            raw = JSON.stringify(migrated);
          }
        } catch (e) {}
      }
    }

    if (!raw) {
      return resetToDemoData();
    }

    const parsed = JSON.parse(raw);

    let facilitiesList =
      parsed.facilitiesList && Array.isArray(parsed.facilitiesList) && parsed.facilitiesList.length > 0
        ? parsed.facilitiesList
        : REAL_FACILITIES_DATA;

    // PERMANENT PURGE: Remove any zombie or blacklisted facilities from local storage
    const initialCount = facilitiesList.length;
    facilitiesList = facilitiesList.filter(f => !BLACKLISTED_DELETED_FACILITY_IDS.includes(f.id));
    if (facilitiesList.length !== initialCount) {
      console.log(`[Storage Purge] Removed ${initialCount - facilitiesList.length} blacklisted deleted facilities.`);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...parsed, facilitiesList }));
    }

    facilitiesList = facilitiesList.map((f) => {
      if (f.address) {
        f.address = cleanFacilityAddress(f.address);
      }
      
      // Auto-normalize species names and groups
      if (f.speciesList) {
        f.speciesList = f.speciesList.map((s) => {
          const lower = (s.vietnameseName || '').trim().toLowerCase();
          if (lower.includes('cu gáy') || lower.includes('cu gay')) {
            return {
              ...s,
              vietnameseName: 'Chim Cu gáy',
              scientificName: 'Streptopelia chinensis',
              group: 'Động vật rừng thông thường (Lớp Chim)',
              citesAppendix: 'Khai báo kiểm lâm',
            };
          }
          if (lower.includes('chào mào') || lower.includes('chao mao')) {
            return {
              ...s,
              vietnameseName: 'Chim Chào mào',
              scientificName: 'Pycnonotus jocosus',
              group: 'Động vật rừng thông thường (Lớp Chim)',
              citesAppendix: 'Khai báo kiểm lâm',
            };
          }
          if (lower === 'don' || lower.startsWith('don ') || lower.endsWith(' don')) {
            return {
              ...s,
              vietnameseName: 'Don',
              scientificName: 'Atherurus macrourus',
              group: 'Động vật rừng thông thường',
              citesAppendix: 'Khai báo kiểm lâm',
            };
          }
          if (lower.includes('dúi má đào') || lower.includes('dui ma dao')) {
            return {
              ...s,
              vietnameseName: 'Dúi má đào',
              scientificName: 'Rhizomys sumatrensis',
              group: 'Động vật rừng thông thường',
              citesAppendix: 'Khai báo kiểm lâm',
            };
          }
          return s;
        });
      }
      return f;
    });

    const activeFacilityId = urlFacId || parsed.activeFacilityId || facilitiesList[0]?.id || null;
    const activeFacility = facilitiesList.find((f) => f.id === activeFacilityId) || facilitiesList[0] || null;

    const facilityInfo = activeFacility
      ? {
          id: activeFacility.id,
          facilityName: activeFacility.facilityName,
          ownerName: activeFacility.ownerName,
          registrationCode: activeFacility.registrationCode,
          registrationDate: activeFacility.registrationDate,
          commune: activeFacility.commune || 'xã Hòa Sơn',
          address: activeFacility.address,
          phone: activeFacility.phone,
          purposeCode: activeFacility.purposeCode,
          note: activeFacility.note,
          lat: activeFacility.lat || '',
          lng: activeFacility.lng || '',
        }
      : parsed.facilityInfo || { ...EMPTY_FACILITY_INFO };

    const speciesList = activeFacility ? activeFacility.speciesList : parsed.speciesList || [];
    const activeSpeciesId = parsed.activeSpeciesId || speciesList[0]?.id || null;

    return {
      facilitiesList,
      activeFacilityId,
      facilityInfo,
      speciesList,
      activeSpeciesId,
    };
  } catch (err) {
    console.error('Failed to load local storage:', err);
    return resetToDemoData();
  }
}

export function saveAppData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to local storage:', err);
  }
}


import INITIAL_PACKING_LIST_DATA from './packingListInitialData.json';

const PACKING_LIST_STORAGE_KEY = 'wildlife_packing_list_v1';

export { INITIAL_PACKING_LIST_DATA };

export function loadPackingListData() {
  try {
    const raw = localStorage.getItem(PACKING_LIST_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PACKING_LIST_STORAGE_KEY, JSON.stringify(INITIAL_PACKING_LIST_DATA));
      return INITIAL_PACKING_LIST_DATA;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PACKING_LIST_DATA;
  } catch (err) {
    console.error('Failed to load packing list data:', err);
    return INITIAL_PACKING_LIST_DATA;
  }
}

export function savePackingListData(list) {
  try {
    localStorage.setItem(PACKING_LIST_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save packing list data:', err);
  }
}
