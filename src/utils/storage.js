/**
 * LocalStorage manager and sample demo data for Wildlife Monitoring Application
 */

const STORAGE_KEY = 'wildlife_manager_data_v6';

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
    "purposeCode": "T",
    "commune": "xã Hòa Sơn",
    "speciesList": [
      {
        "baseline": {
          "otherFemale": 10,
          "mother": 5,
          "otherMale": 8,
          "father": 4,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "date": "2023-03-17",
          "note": "Số lượng vật nuôi theo chứng nhận cơ sở",
          "otherUnknown": 2
        },
        "citesAppendix": "Phụ lục II CITES",
        "fluctuations": [],
        "purposeCode": "T",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "id": "sp_1_1"
      }
    ],
    "id": "fac_1",
    "address": "Thôn 3, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "facilityName": "Cơ sở nuôi Lê Thị Xuân",
    "registrationCode": "IIB-DLC-027",
    "updatedAt": "2026-10-16T13:50:43.757Z",
    "note": "",
    "lng": 108.227912,
    "phone": "",
    "ownerName": "Lê Thị Xuân",
    "registrationDate": "2023-03-17",
    "lat": 12.496848
  },
  {
    "address": "Thôn 3, xã Cư Pui, Tỉnh Đắk Lắk",
    "registrationDate": "2026-05-08",
    "lng": 108.456819,
    "lat": 12.546946,
    "facilityName": "Cơ sở nuôi Trịnh Lục",
    "phone": "",
    "commune": "xã Cư Pui",
    "updatedAt": "2026-10-16T13:50:43.758Z",
    "note": "",
    "ownerName": "Trịnh Lục",
    "id": "fac_10",
    "registrationCode": "52-26/B-DLC",
    "purposeCode": "T",
    "speciesList": [
      {
        "citesAppendix": "Phụ lục II CITES",
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "fluctuations": [
          {
            "isGenderIdentifyMode": false,
            "decOtherUnknown": 0,
            "decOtherMale": 0,
            "date": "2026-05-16",
            "incFather": 2,
            "time": "08:51",
            "incOtherMale": 0,
            "verifier": "",
            "approvalStatus": "APPROVED",
            "createdAt": 1786413132829,
            "reason": "Mua từ cơ sở nuôi sinh sản khác",
            "id": "fluc_1786413132829",
            "decOtherFemale": 0,
            "incOtherFemale": 0,
            "decMother": 0,
            "incMother": 4,
            "decFather": 0,
            "incOtherUnknown": 0,
            "isPurchaseMode": true,
            "purpose": "T"
          },
          {
            "date": "2026-07-10",
            "isGenderIdentifyMode": false,
            "incOtherMale": 0,
            "decFather": 0,
            "decOtherUnknown": 0,
            "reason": "Mua từ cơ sở nuôi sinh sản khác",
            "decMother": 0,
            "incMother": 14,
            "verifier": "",
            "purpose": "T",
            "decOtherMale": 0,
            "createdAt": 1786413220093,
            "time": "08:53",
            "isPurchaseMode": true,
            "id": "fluc_1786413220093",
            "decOtherFemale": 0,
            "incOtherFemale": 0,
            "incOtherUnknown": 0,
            "incFather": 1,
            "approvalStatus": "APPROVED"
          },
          {
            "decMother": 0,
            "incMother": 0,
            "decOtherFemale": 0,
            "incOtherFemale": 0,
            "purpose": "T",
            "decFather": 0,
            "decOtherMale": 0,
            "time": "08:54",
            "createdAt": 1786413284623,
            "isPurchaseMode": false,
            "verifier": "",
            "incOtherMale": 0,
            "date": "2026-07-11",
            "decOtherUnknown": 0,
            "id": "fluc_1786413284623",
            "incOtherUnknown": 12,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "incFather": 0
          },
          {
            "id": "fluc_1786413405967",
            "isPurchaseMode": false,
            "reason": "Xuất bán thương mại cho cơ sở B",
            "createdAt": 1786413405967,
            "decMother": 0,
            "incMother": 0,
            "decOtherFemale": 5,
            "incOtherFemale": 0,
            "incOtherUnknown": 0,
            "decFather": 0,
            "verifier": "",
            "decOtherUnknown": 0,
            "date": "2026-08-11",
            "decOtherMale": 0,
            "incFather": 0,
            "incOtherMale": 0,
            "time": "08:56",
            "purpose": "T"
          },
          {
            "isGenderIdentifyMode": false,
            "incOtherUnknown": 0,
            "verifier": "",
            "incOtherFemale": 8,
            "decOtherFemale": 0,
            "reason": "Mua từ cơ sở nuôi sinh sản khác",
            "approvalStatus": "APPROVED",
            "id": "fluc_1792146475584",
            "isPurchaseMode": true,
            "incFather": 0,
            "decFather": 0,
            "time": "17:26",
            "purpose": "T",
            "incMother": 0,
            "decMother": 0,
            "decOtherMale": 0,
            "incOtherMale": 2,
            "createdAt": 1792146475584,
            "date": "2026-08-03",
            "decOtherUnknown": 0
          },
          {
            "purpose": "T",
            "incMother": 0,
            "decMother": 0,
            "decOtherMale": 0,
            "decFather": 0,
            "incOtherMale": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "verifier": "",
            "createdAt": 1792146698997,
            "incOtherUnknown": 9,
            "decOtherUnknown": 0,
            "id": "fluc_1792146698997",
            "time": "17:28",
            "approvalStatus": "APPROVED",
            "decOtherFemale": 0,
            "incOtherFemale": 0,
            "isGenderIdentifyMode": false,
            "isPurchaseMode": false,
            "incFather": 0,
            "date": "2026-08-28"
          },
          {
            "incOtherUnknown": 6,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "isPurchaseMode": false,
            "decOtherMale": 0,
            "createdAt": 1792146763664,
            "purpose": "T",
            "id": "fluc_1792146763664",
            "incOtherMale": 0,
            "decFather": 0,
            "approvalStatus": "APPROVED",
            "isGenderIdentifyMode": false,
            "incMother": 0,
            "decMother": 0,
            "decOtherFemale": 0,
            "incOtherFemale": 0,
            "verifier": "",
            "incFather": 0,
            "date": "2026-09-01",
            "time": "17:31",
            "decOtherUnknown": 0
          },
          {
            "incFather": 0,
            "reason": "Chết do thời tiết/bệnh lý",
            "incOtherUnknown": 0,
            "id": "fluc_1792146792454",
            "approvalStatus": "APPROVED",
            "isGenderIdentifyMode": false,
            "decOtherUnknown": 3,
            "verifier": "",
            "time": "17:32",
            "createdAt": 1792146792454,
            "decOtherMale": 0,
            "decOtherFemale": 0,
            "incOtherFemale": 0,
            "date": "2026-09-25",
            "incOtherMale": 0,
            "decFather": 0,
            "purpose": "T",
            "isPurchaseMode": false,
            "decMother": 0,
            "incMother": 0
          },
          {
            "decFather": 0,
            "decMother": 0,
            "incMother": 0,
            "verifier": "",
            "createdAt": 1792147368797,
            "decOtherUnknown": 0,
            "isPurchaseMode": false,
            "date": "2026-06-09",
            "incOtherUnknown": 4,
            "purpose": "T",
            "isGenderIdentifyMode": false,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "id": "fluc_1792147368797",
            "incOtherMale": 0,
            "decOtherMale": 0,
            "incFather": 0,
            "incOtherFemale": 0,
            "decOtherFemale": 0,
            "time": "17:42",
            "approvalStatus": "APPROVED"
          }
        ],
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "purposeCode": "T",
        "id": "sp_10_1",
        "baseline": {
          "mother": 3,
          "otherFemale": 0,
          "father": 2,
          "otherMale": 0,
          "date": "2026-05-08",
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "otherUnknown": 0,
          "note": "Hiện trạng nuôi ban đầu"
        }
      }
    ]
  },
  {
    "id": "fac_11",
    "address": "Thôn 3, xã Cư Pui, Tỉnh Đắk Lắk",
    "registrationDate": "2024-09-25",
    "updatedAt": "2026-10-16T13:50:43.759Z",
    "commune": "xã Cư Pui",
    "purposeCode": "T",
    "speciesList": [
      {
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "baseline": {
          "father": 4,
          "date": "2024-09-25",
          "otherUnknown": 19,
          "otherMale": 5,
          "mother": 7,
          "note": "Hiện trạng nuôi đăng ký",
          "otherFemale": 16,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông"
        },
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "purposeCode": "T",
        "id": "sp_11_1",
        "fluctuations": [
          {
            "purpose": "T",
            "incOtherFemale": 0,
            "decOtherFemale": 0,
            "reason": "Xuất bán thương mại cho cơ sở B",
            "incFather": 0,
            "decOtherUnknown": 0,
            "isPurchaseMode": false,
            "createdAt": 1786414971813,
            "time": "09:22",
            "incOtherMale": 0,
            "incOtherUnknown": 0,
            "decMother": 0,
            "incMother": 0,
            "verifier": "",
            "decOtherMale": 1,
            "id": "fluc_1786414971813",
            "decFather": 0,
            "date": "2026-08-11"
          },
          {
            "approvalStatus": "APPROVED",
            "date": "2026-09-22",
            "decOtherUnknown": 0,
            "incOtherFemale": 0,
            "decOtherFemale": 5,
            "isGenderIdentifyMode": false,
            "id": "fluc_1791170669944",
            "verifier": "",
            "incFather": 0,
            "reason": "Xuất bán thương mại cho cơ sở B",
            "isPurchaseMode": false,
            "time": "10:23",
            "decOtherMale": 5,
            "decMother": 0,
            "incMother": 0,
            "decFather": 0,
            "purpose": "T",
            "createdAt": 1791170669944,
            "incOtherUnknown": 0,
            "incOtherMale": 0
          },
          {
            "decOtherMale": 0,
            "approvalStatus": "APPROVED",
            "incFather": 0,
            "decOtherFemale": 0,
            "incOtherFemale": 0,
            "time": "10:27",
            "date": "2026-09-09",
            "incOtherUnknown": 3,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "isPurchaseMode": false,
            "incOtherMale": 0,
            "decOtherUnknown": 0,
            "verifier": "",
            "createdAt": 1791170873185,
            "purpose": "T",
            "isGenderIdentifyMode": false,
            "decFather": 0,
            "id": "fluc_1791170873185",
            "incMother": 0,
            "decMother": 0
          },
          {
            "incOtherMale": 0,
            "decOtherUnknown": 5,
            "decOtherMale": 0,
            "reason": "Chết do thời tiết/bệnh lý",
            "incFather": 0,
            "id": "fluc_1791170912846",
            "approvalStatus": "APPROVED",
            "incMother": 0,
            "decMother": 0,
            "purpose": "T",
            "decFather": 0,
            "incOtherFemale": 0,
            "decOtherFemale": 0,
            "isGenderIdentifyMode": false,
            "incOtherUnknown": 0,
            "date": "2026-09-17",
            "time": "10:28",
            "createdAt": 1791170912846,
            "verifier": "",
            "isPurchaseMode": false
          },
          {
            "decOtherUnknown": 17,
            "incOtherMale": 7,
            "isPurchaseMode": false,
            "approvalStatus": "APPROVED",
            "incFather": 0,
            "isGenderIdentifyMode": true,
            "decOtherFemale": 0,
            "incOtherFemale": 10,
            "decOtherMale": 0,
            "decFather": 0,
            "verifier": "",
            "purpose": "T",
            "id": "fluc_1791170959593",
            "incMother": 0,
            "time": "10:28",
            "decMother": 0,
            "reason": "Xác định giới tính con con",
            "date": "2026-09-18",
            "createdAt": 1791170959593,
            "incOtherUnknown": 0
          }
        ],
        "citesAppendix": "Phụ lục II CITES"
      }
    ],
    "lat": 12.548206,
    "registrationCode": "IIB-C-DLC-063",
    "ownerName": "Nguyễn Hữu Đô",
    "phone": "",
    "note": "",
    "facilityName": "Cơ sở nuôi Nguyễn Hữu Đô",
    "lng": 108.453559
  },
  {
    "speciesList": [
      {
        "citesAppendix": "Phụ lục II CITES",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "purposeCode": "T",
        "fluctuations": [],
        "id": "sp_12_1",
        "vietnameseName": "Cầy vòi Hương",
        "scientificName": "Paradoxurus hermaphroditus",
        "baseline": {
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "otherFemale": 9,
          "father": 2,
          "otherMale": 11,
          "note": "Hiện trạng nuôi đăng ký",
          "date": "2024-09-06",
          "mother": 7,
          "otherUnknown": 6
        }
      }
    ],
    "purposeCode": "T",
    "commune": "Xã Krông Bông",
    "updatedAt": "2026-10-16T13:50:43.760Z",
    "address": "Thôn 5, Xã Krông Bông, Tỉnh Đắk Lắk",
    "registrationDate": "2024-09-06",
    "phone": "",
    "lat": 12.528258,
    "id": "fac_12",
    "facilityName": "Cơ sở nuôi Lê Thanh Đức",
    "lng": 108.332398,
    "note": "",
    "ownerName": "Lê Thanh Đức",
    "registrationCode": "IIB-C-DLC-060"
  },
  {
    "registrationDate": "2025-07-31",
    "lat": 12.53985,
    "lng": 108.414746,
    "updatedAt": "2026-10-16T13:50:43.761Z",
    "registrationCode": "010-25/B-DLC",
    "speciesList": [
      {
        "purposeCode": "T",
        "citesAppendix": "Phụ lục II CITES",
        "vietnameseName": "Cầy vòi Hương",
        "fluctuations": [],
        "scientificName": "Paradoxurus hermaphroditus",
        "id": "sp_13_1",
        "baseline": {
          "otherUnknown": 7,
          "date": "2025-07-31",
          "father": 6,
          "note": "Hiện trạng nuôi đăng ký",
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "mother": 7,
          "otherMale": 7,
          "otherFemale": 10
        },
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)"
      }
    ],
    "ownerName": "Ngô Thị Trang",
    "purposeCode": "T",
    "note": "",
    "commune": "Xã Krông Bông",
    "address": "Thôn 8, Xã Krông Bông, Tỉnh Đắk Lắk",
    "facilityName": "Cơ sở nuôi Ngô Thị Trang",
    "id": "fac_13",
    "phone": ""
  },
  {
    "speciesList": [
      {
        "purposeCode": "T",
        "fluctuations": [],
        "citesAppendix": "Phụ lục II CITES",
        "id": "sp_14_1",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "vietnameseName": "Cầy vòi mốc",
        "scientificName": "Paguma larvata",
        "baseline": {
          "date": "2026-03-17",
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "note": "Hiện trạng nuôi đăng ký",
          "otherFemale": 0,
          "otherMale": 0,
          "mother": 23,
          "father": 5,
          "otherUnknown": 0
        }
      },
      {
        "scientificName": "Rhizomys sumatrensis",
        "vietnameseName": "Dúi má đào",
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường",
        "purposeCode": "T",
        "baseline": {
          "otherUnknown": 0,
          "father": 9,
          "mother": 34,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "otherMale": 0,
          "note": "Hiện trạng nuôi loài Dúi má đào",
          "date": "2026-01-01",
          "otherFemale": 0
        },
        "id": "sp_14_2",
        "fluctuations": []
      }
    ],
    "purposeCode": "T",
    "lat": 12.492108,
    "address": "TDP4, Xã Krông Bông, Tỉnh Đắk Lắk",
    "note": "",
    "ownerName": "Hà Huy Thanh",
    "lng": 108.333327,
    "commune": "Xã Krông Bông",
    "registrationCode": "18-26/B-DLC",
    "phone": "",
    "facilityName": "Cơ sở nuôi Hà Huy Thanh",
    "id": "fac_14",
    "registrationDate": "2026-03-17",
    "updatedAt": "2026-10-16T13:50:43.761Z"
  },
  {
    "commune": "xã Yang Mao",
    "registrationDate": "2023-11-02",
    "ownerName": "Trần Văn Tới",
    "speciesList": [
      {
        "fluctuations": [
          {
            "reason": "Sinh sản lứa F1 mới nở/sinh.",
            "createdAt": 1714501860000,
            "incMother": 0,
            "decMother": 0,
            "decOtherUnknown": 0,
            "decFather": 0,
            "verifier": "",
            "id": "fluc_15_1",
            "incOtherUnknown": 29,
            "decOtherFemale": 0,
            "incOtherFemale": 0,
            "time": "20:31",
            "incOtherMale": 0,
            "incFather": 0,
            "decOtherMale": 0,
            "date": "2024-04-30"
          },
          {
            "decOtherMale": 0,
            "date": "2024-10-21",
            "verifier": "",
            "decOtherFemale": 0,
            "incOtherFemale": 0,
            "time": "18:10",
            "incOtherUnknown": 4,
            "incOtherMale": 0,
            "incFather": 0,
            "incMother": 0,
            "decMother": 0,
            "decOtherUnknown": 0,
            "decFather": 0,
            "createdAt": 1729534200000,
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "id": "fluc_15_2"
          },
          {
            "id": "fluc_15_3",
            "reason": "Xác định giới tính con con",
            "incOtherMale": 14,
            "decOtherUnknown": 33,
            "incFather": 0,
            "decOtherMale": 0,
            "decFather": 0,
            "time": "10:30",
            "verifier": "",
            "decMother": 0,
            "incMother": 0,
            "decOtherFemale": 0,
            "incOtherFemale": 19,
            "incOtherUnknown": 0,
            "createdAt": 1737534600000,
            "date": "2025-01-22"
          },
          {
            "incOtherUnknown": 7,
            "incFather": 0,
            "incOtherMale": 0,
            "date": "2025-01-22",
            "verifier": "",
            "decMother": 0,
            "incMother": 0,
            "decOtherFemale": 0,
            "incOtherFemale": 0,
            "decFather": 0,
            "id": "fluc_15_4",
            "createdAt": 1737545400000,
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "decOtherUnknown": 0,
            "time": "13:30",
            "decOtherMale": 0
          },
          {
            "decOtherUnknown": 0,
            "decFather": 0,
            "decOtherFemale": 0,
            "incOtherFemale": 0,
            "verifier": "",
            "time": "09:00",
            "incMother": 0,
            "decMother": 0,
            "incOtherMale": 0,
            "decOtherMale": 0,
            "id": "fluc_15_5",
            "date": "2025-06-20",
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "createdAt": 1750406400000,
            "incFather": 0,
            "incOtherUnknown": 13
          },
          {
            "verifier": "",
            "decOtherMale": 13,
            "incOtherUnknown": 0,
            "id": "fluc_15_6",
            "incFather": 13,
            "reason": "Chuyển cá thể đực và cái đủ tuổi vào đàn bố mẹ.",
            "incOtherMale": 0,
            "time": "19:20",
            "createdAt": 1759778400000,
            "incMother": 18,
            "decMother": 0,
            "incOtherFemale": 0,
            "decOtherFemale": 18,
            "decOtherUnknown": 0,
            "decFather": 0,
            "date": "2025-10-06"
          },
          {
            "decOtherMale": 0,
            "incOtherFemale": 12,
            "decOtherFemale": 0,
            "verifier": "",
            "incOtherMale": 8,
            "incFather": 0,
            "incOtherUnknown": 0,
            "date": "2025-10-06",
            "decOtherUnknown": 20,
            "incMother": 0,
            "decMother": 0,
            "decFather": 0,
            "reason": "Xác định giới tính con con",
            "createdAt": 1759786080000,
            "time": "21:28",
            "id": "fluc_15_7"
          },
          {
            "incOtherFemale": 0,
            "decOtherFemale": 0,
            "time": "07:00",
            "decOtherMale": 0,
            "id": "fluc_15_8",
            "verifier": "",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "incFather": 0,
            "incOtherMale": 0,
            "incOtherUnknown": 25,
            "date": "2025-11-05",
            "decFather": 0,
            "decOtherUnknown": 0,
            "decMother": 0,
            "incMother": 0,
            "createdAt": 1762326000000
          },
          {
            "decOtherUnknown": 4,
            "incOtherMale": 0,
            "incFather": 0,
            "decOtherFemale": 0,
            "incOtherFemale": 0,
            "decOtherMale": 0,
            "decFather": 0,
            "verifier": "",
            "id": "fluc_15_9",
            "time": "08:00",
            "decMother": 0,
            "incMother": 0,
            "reason": "Chết do thời tiết/bệnh lý",
            "date": "2025-11-10",
            "incOtherUnknown": 0,
            "createdAt": 1762761600000
          },
          {
            "incOtherMale": 0,
            "decOtherUnknown": 0,
            "decOtherMale": 0,
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "incFather": 0,
            "id": "fluc_15_10",
            "decMother": 0,
            "incMother": 0,
            "incOtherFemale": 0,
            "decFather": 0,
            "decOtherFemale": 0,
            "incOtherUnknown": 18,
            "date": "2025-12-30",
            "time": "10:00",
            "createdAt": 1767088800000,
            "verifier": ""
          },
          {
            "decOtherMale": 0,
            "incFather": 0,
            "incOtherFemale": 14,
            "decOtherFemale": 0,
            "time": "19:28",
            "date": "2026-01-07",
            "reason": "Xác định giới tính con con",
            "incOtherUnknown": 0,
            "incOtherMale": 6,
            "decOtherUnknown": 20,
            "verifier": "",
            "createdAt": 1767814080000,
            "decFather": 0,
            "id": "fluc_15_11",
            "incMother": 0,
            "decMother": 0
          },
          {
            "date": "2026-01-08",
            "decOtherUnknown": 0,
            "decOtherFemale": 27,
            "incOtherFemale": 0,
            "id": "fluc_15_12",
            "verifier": "",
            "incFather": 15,
            "reason": "Chuyển cá thể đực và cái đủ tuổi vào đàn bố mẹ.",
            "time": "07:48",
            "decOtherMale": 15,
            "incMother": 27,
            "decMother": 0,
            "decFather": 0,
            "createdAt": 1767858480000,
            "incOtherUnknown": 0,
            "incOtherMale": 0
          },
          {
            "decOtherFemale": 0,
            "incOtherFemale": 0,
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "incFather": 0,
            "decOtherUnknown": 0,
            "createdAt": 1782912600000,
            "time": "13:30",
            "incOtherMale": 0,
            "incOtherUnknown": 28,
            "decMother": 0,
            "incMother": 0,
            "verifier": "",
            "decOtherMale": 0,
            "id": "fluc_15_13",
            "decFather": 0,
            "date": "2026-07-01"
          },
          {
            "decFather": 0,
            "time": "07:30",
            "id": "fluc_15_14",
            "incMother": 0,
            "decMother": 0,
            "reason": "Xác định giới tính con con",
            "decOtherUnknown": 12,
            "date": "2026-07-20",
            "createdAt": 1784532600000,
            "decOtherMale": 0,
            "incOtherUnknown": 0,
            "incFather": 0,
            "verifier": "",
            "incOtherFemale": 6,
            "decOtherFemale": 0,
            "incOtherMale": 6
          },
          {
            "id": "fluc_15_15",
            "createdAt": 1785587400000,
            "incOtherMale": 0,
            "decOtherUnknown": 0,
            "incOtherFemale": 0,
            "decOtherFemale": 0,
            "decOtherMale": 0,
            "decMother": 0,
            "incMother": 0,
            "verifier": "",
            "decFather": 0,
            "incFather": 0,
            "incOtherUnknown": 11,
            "date": "2026-08-01",
            "time": "12:30",
            "reason": "Sinh sản lứa F1 mới nở/sinh"
          },
          {
            "time": "19:00",
            "incMother": 0,
            "decMother": 1,
            "incOtherUnknown": 0,
            "incOtherMale": 0,
            "decFather": 0,
            "decOtherMale": 0,
            "createdAt": 1786906800000,
            "verifier": "",
            "incOtherFemale": 0,
            "decOtherFemale": 0,
            "date": "2026-08-16",
            "id": "fluc_15_16",
            "decOtherUnknown": 2,
            "reason": "Chết do thời tiết/bệnh lý",
            "incFather": 0
          },
          {
            "approvalStatus": "PENDING",
            "decOtherFemale": 0,
            "incOtherFemale": 0,
            "verifier": "",
            "incFather": 0,
            "isPurchaseMode": false,
            "incOtherUnknown": 20,
            "decOtherUnknown": 0,
            "time": "19:45",
            "decFather": 0,
            "id": "fluc_1791031608601",
            "incOtherMale": 0,
            "decMother": 0,
            "incMother": 0,
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "purpose": "T",
            "isGenderIdentifyMode": false,
            "decOtherMale": 0,
            "createdAt": 1791031608601,
            "date": "2026-10-03"
          }
        ],
        "group": "Động vật rừng thông thường",
        "purposeCode": "T",
        "id": "sp_15_1",
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "note": "Số lượng Dúi mốc lớn hiện có",
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "otherMale": 0,
          "date": "2023-11-02",
          "father": 9,
          "otherFemale": 0,
          "otherUnknown": 0,
          "mother": 9
        },
        "vietnameseName": "Dúi mốc lớn",
        "scientificName": "Rhizomys pruinosus"
      }
    ],
    "id": "fac_15",
    "phone": "",
    "address": "Thôn 1, xã Yang Mao, Tỉnh Đắk Lắk",
    "purposeCode": "T",
    "note": "",
    "updatedAt": "2026-10-16T13:50:43.761Z",
    "registrationCode": "52-26/B-DLC",
    "lat": 12.477054,
    "facilityName": "Cơ sở nuôi Trần Văn Tới",
    "lng": 108.58051
  },
  {
    "registrationDate": "",
    "purposeCode": "T",
    "id": "fac_16",
    "speciesList": [
      {
        "baseline": {
          "otherFemale": 6,
          "otherUnknown": 0,
          "otherMale": 4,
          "mother": 2,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "date": "2026-01-01",
          "note": "Số lượng Dúi mốc lớn hiện có",
          "father": 2
        },
        "fluctuations": [],
        "citesAppendix": "Khai báo kiểm lâm",
        "purposeCode": "T",
        "group": "Động vật rừng thông thường",
        "scientificName": "Rhizomys pruinosus",
        "vietnameseName": "Dúi mốc lớn",
        "id": "sp_16_1"
      }
    ],
    "address": "Thôn Cư Drăm, xã Yang Mao, Tỉnh Đắk Lắk",
    "commune": "xã Yang Mao",
    "updatedAt": "2026-10-16T13:50:43.761Z",
    "note": "",
    "lat": 12.487572,
    "ownerName": "Lê Đình Tâm",
    "phone": "",
    "registrationCode": "Đang cập nhật",
    "facilityName": "Cơ sở nuôi Lê Đình Tâm",
    "lng": 108.551582
  },
  {
    "registrationDate": "",
    "facilityName": "Cơ sở nuôi Nguyễn Kim Danh",
    "note": "",
    "updatedAt": "2026-10-16T13:50:43.762Z",
    "speciesList": [
      {
        "purposeCode": "T",
        "group": "Động vật rừng thông thường",
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Rhizomys pruinosus",
        "vietnameseName": "Dúi mốc lớn",
        "id": "sp_17_1",
        "fluctuations": [],
        "baseline": {
          "otherFemale": 0,
          "note": "Số lượng Dúi mốc lớn hiện có",
          "date": "2026-01-01",
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "otherMale": 0,
          "otherUnknown": 0,
          "father": 2,
          "mother": 10
        }
      }
    ],
    "lat": 12.462085,
    "ownerName": "Nguyễn Kim Danh",
    "purposeCode": "T",
    "registrationCode": "Đang cập nhật",
    "id": "fac_17",
    "address": "Buôn Tul, xã Yang Mao, Tỉnh Đắk Lắk",
    "phone": "",
    "commune": "xã Yang Mao",
    "lng": 108.560116
  },
  {
    "registrationDate": "2026-07-24",
    "facilityName": "Nguyễn Lĩnh",
    "note": "",
    "updatedAt": "2026-10-16T13:50:43.762Z",
    "speciesList": [
      {
        "citesAppendix": "Phụ lục II CITES",
        "fluctuations": [
          {
            "verifier": "",
            "incOtherMale": 0,
            "id": "fluc_1786163683953",
            "createdAt": 1786163683953,
            "incOtherUnknown": 5,
            "decOtherFemale": 0,
            "incOtherFemale": 0,
            "decFather": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decMother": 0,
            "incMother": 0,
            "isPurchaseMode": false,
            "decOtherMale": 0,
            "incFather": 0,
            "time": "11:34",
            "purpose": "T",
            "decOtherUnknown": 0,
            "date": "2026-07-20"
          }
        ],
        "id": "sp_1786163645775_1",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "baseline": {
          "father": 1,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "mother": 3,
          "otherFemale": 0,
          "otherMale": 0,
          "otherUnknown": 0,
          "date": "2026-07-24",
          "note": "Hiện trạng đăng ký ban đầu"
        },
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "purposeCode": "T"
      }
    ],
    "lat": 12.547587,
    "ownerName": "Nguyễn Lĩnh",
    "purposeCode": "T",
    "registrationCode": "141-26/B-DLC",
    "id": "fac_1786163645775",
    "phone": "0866100652",
    "address": "thôn 3, xã Cư Pui, tỉnh Đắk Lắk.",
    "commune": "xã Cư Pui",
    "lng": 108.455555
  },
  {
    "ownerName": "Nguyễn Hoàng Dũng",
    "lng": 108.321947,
    "address": "thôn 6, xã Dang Kang, tỉnh Đắk Lắk",
    "registrationCode": "142-26/B-DLC",
    "facilityName": "Nguyễn Hoàng Dũng",
    "phone": "0342017979",
    "commune": "Xã Dang Kang",
    "note": "",
    "lat": 12.558599,
    "registrationDate": "2026-07-24",
    "updatedAt": "2026-10-16T13:50:43.762Z",
    "purposeCode": "T",
    "id": "fac_1786419630740",
    "speciesList": [
      {
        "purposeCode": "T",
        "baseline": {
          "otherMale": 0,
          "mother": 4,
          "otherFemale": 0,
          "note": "Hiện trạng đăng ký ban đầu",
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "otherUnknown": 0,
          "date": "2026-07-24",
          "father": 2
        },
        "id": "sp_1786419630740_1",
        "fluctuations": [
          {
            "verifier": "",
            "purpose": "T",
            "isPurchaseMode": true,
            "decOtherUnknown": 0,
            "incFather": 0,
            "incOtherFemale": 5,
            "decOtherFemale": 0,
            "date": "2026-08-11",
            "decFather": 0,
            "decOtherMale": 0,
            "incMother": 0,
            "decMother": 0,
            "incOtherUnknown": 0,
            "incOtherMale": 0,
            "reason": "Mua từ cơ sở nuôi sinh sản khác",
            "id": "fluc_1786419778624",
            "createdAt": 1786419778624,
            "time": "10:42"
          }
        ],
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "citesAppendix": "Phụ lục II CITES"
      },
      {
        "citesAppendix": "Phụ lục II CITES",
        "baseline": {
          "otherUnknown": 0,
          "date": "2026-07-24",
          "note": "Số lượng vật nuôi hiện có ban đầu",
          "otherFemale": 0,
          "verifier": "",
          "otherMale": 0,
          "mother": "13",
          "father": "4"
        },
        "purposeCode": "T",
        "id": "species_1786419708326",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "fluctuations": [],
        "vietnameseName": "Cầy vòi mốc",
        "scientificName": "Paguma larvata"
      }
    ]
  },
  {
    "facilityName": "Phạm Duy Thắng",
    "ownerName": "Phạm Duy Thắng",
    "registrationDate": "2026-08-11",
    "purposeCode": "T",
    "speciesList": [
      {
        "group": "Động vật rừng thông thường",
        "baseline": {
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "otherUnknown": 0,
          "otherMale": 0,
          "otherFemale": 0,
          "date": "2026-06-17",
          "father": 2,
          "mother": 4,
          "note": "Hiện trạng đăng ký ban đầu"
        },
        "id": "sp_1786432202893_1",
        "citesAppendix": "Khai báo kiểm lâm",
        "purposeCode": "T",
        "vietnameseName": "Dúi mốc lớn",
        "scientificName": "Rhizomys pruinosus",
        "fluctuations": [
          {
            "purpose": "T",
            "createdAt": 1786467765630,
            "time": "00:02",
            "incMother": 0,
            "decMother": 0,
            "incOtherUnknown": 6,
            "date": "2026-07-08",
            "decFather": 0,
            "decOtherMale": 0,
            "isPurchaseMode": false,
            "id": "fluc_1786468153021",
            "incFather": 0,
            "decOtherUnknown": 0,
            "verifier": "",
            "incOtherFemale": 0,
            "decOtherFemale": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "incOtherMale": 0
          },
          {
            "decMother": 0,
            "incMother": 0,
            "incOtherUnknown": 4,
            "reason": "sinh san F2",
            "date": "2026-08-12",
            "decFather": 0,
            "decOtherMale": 0,
            "purpose": "T",
            "createdAt": 1786505722932,
            "incOtherMale": 0,
            "time": "10:34",
            "verifier": "",
            "isPurchaseMode": false,
            "id": "fluc_1786518690491",
            "incFather": 0,
            "decOtherUnknown": 0,
            "decOtherFemale": 0,
            "incOtherFemale": 0
          },
          {
            "verifier": "",
            "decOtherUnknown": 0,
            "incFather": 0,
            "purpose": "T",
            "incOtherMale": 0,
            "incMother": 0,
            "decMother": 0,
            "time": "10:34",
            "incOtherUnknown": 4,
            "id": "fluc_1786518706173",
            "incOtherFemale": 0,
            "decOtherFemale": 0,
            "decFather": 0,
            "createdAt": 1786505722932,
            "date": "2026-08-12",
            "reason": "sinh san F2",
            "isPurchaseMode": false,
            "decOtherMale": 0
          }
        ]
      }
    ],
    "commune": "Xã Krông Bông",
    "updatedAt": "2026-10-16T13:50:43.762Z",
    "lng": 108.394137,
    "id": "fac_1786432202893",
    "note": "",
    "phone": "",
    "lat": 12.520837,
    "registrationCode": "Chưa có mã số",
    "address": "Thôn 23"
  },
  {
    "commune": "Xã Dang Kang",
    "note": "",
    "ownerName": "Nguyễn Kim Tuấn",
    "registrationDate": "2025-11-12",
    "address": "Thôn 6 xã Dang Kang",
    "updatedAt": "2026-10-16T13:50:43.763Z",
    "phone": "",
    "lat": "12.575576",
    "speciesList": [
      {
        "id": "sp_1786504114807_1",
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Rhizomys pruinosus",
        "vietnameseName": "Dúi mốc lớn",
        "fluctuations": [
          {
            "createdAt": 1786504203858,
            "decOtherUnknown": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decMother": 0,
            "incMother": 0,
            "verifier": "",
            "decFather": 0,
            "date": "2026-08-12",
            "incOtherMale": 38,
            "decOtherFemale": 0,
            "incOtherFemale": 53,
            "incFather": 0,
            "incOtherUnknown": 32,
            "id": "fluc_1786504203858",
            "purpose": "T",
            "decOtherMale": 0,
            "time": "10:09",
            "isPurchaseMode": false
          }
        ],
        "group": "Động vật rừng thông thường",
        "purposeCode": "T",
        "baseline": {
          "date": "2025-11-12",
          "otherUnknown": 0,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "otherMale": 0,
          "note": "Hiện trạng đăng ký ban đầu",
          "father": 10,
          "otherFemale": 0,
          "mother": 30
        }
      }
    ],
    "lng": "108.338165",
    "facilityName": "Nguyễn Kim Tuấn",
    "purposeCode": "T",
    "id": "fac_1786504114807",
    "registrationCode": "Chưa có mã số"
  },
  {
    "updatedAt": "2026-10-16T13:50:43.763Z",
    "id": "fac_1787585236556",
    "commune": "xã Cư Pui",
    "address": "",
    "phone": "",
    "registrationDate": "2026-05-25",
    "facilityName": "Nguyễn Hữu Lưu",
    "purposeCode": "T",
    "lng": "108.431876",
    "speciesList": [
      {
        "baseline": {
          "otherUnknown": 0,
          "otherMale": 0,
          "note": "Hiện trạng đăng ký ban đầu",
          "otherFemale": 0,
          "father": 1,
          "mother": 1,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "date": "2026-05-25"
        },
        "id": "sp_1787585236556_1",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "vietnameseName": "Chim Chào mào",
        "scientificName": "Pycnonotus jocosus",
        "citesAppendix": "Khai báo kiểm lâm",
        "fluctuations": [],
        "purposeCode": "T"
      }
    ],
    "ownerName": "Nguyễn Hữu Lưu",
    "note": "",
    "lat": "12.532135",
    "registrationCode": "Chưa có mã số"
  },
  {
    "address": "",
    "purposeCode": "T",
    "registrationCode": "Chưa có mã số",
    "speciesList": [
      {
        "purposeCode": "T",
        "scientificName": "Pycnonotus jocosus",
        "vietnameseName": "Chim Chào mào",
        "id": "sp_1787793901636_1",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "fluctuations": [],
        "baseline": {
          "note": "Hiện trạng đăng ký ban đầu",
          "date": "2026-06-27",
          "otherFemale": 0,
          "otherMale": 0,
          "mother": 0,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "otherUnknown": 2,
          "father": 0
        },
        "citesAppendix": "Khai báo kiểm lâm"
      }
    ],
    "lat": 12.492318,
    "facilityName": "Nguyễn Tâm Châu",
    "ownerName": "Nguyễn Tâm Châu",
    "id": "fac_1787793901636",
    "lng": 108.324298,
    "note": "",
    "commune": "xã Hòa Sơn",
    "updatedAt": "2026-10-16T13:50:43.763Z",
    "registrationDate": "2026-06-27",
    "phone": ""
  },
  {
    "updatedAt": "2026-10-16T13:50:43.763Z",
    "lat": 12.495249,
    "commune": "xã Hòa Sơn",
    "facilityName": "Nguyễn Thanh ",
    "address": "Thôn 2",
    "id": "fac_1787794070148",
    "lng": 108.294381,
    "note": "",
    "registrationDate": "2026-07-27",
    "ownerName": "Nguyễn Thanh ",
    "registrationCode": "Chưa có mã số",
    "speciesList": [
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "fluctuations": [],
        "purposeCode": "T",
        "id": "sp_1787794070148_1",
        "baseline": {
          "otherMale": 1,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "otherFemale": 1,
          "mother": 0,
          "otherUnknown": 2,
          "date": "2026-07-27",
          "note": "Hiện trạng đăng ký ban đầu",
          "father": 0
        },
        "scientificName": "Streptopelia chinensis",
        "vietnameseName": "Chim Cu gáy",
        "group": "Động vật rừng thông thường (Lớp Chim)"
      }
    ],
    "phone": "",
    "purposeCode": "T"
  },
  {
    "facilityName": "Trần Văn Ngọ",
    "ownerName": "Trần Văn Ngọ",
    "id": "fac_1787794146413",
    "phone": "",
    "registrationDate": "2026-07-27",
    "lat": 12.492941,
    "purposeCode": "T",
    "commune": "xã Hòa Sơn",
    "speciesList": [
      {
        "id": "sp_1787794146413_1",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "purposeCode": "T",
        "fluctuations": [],
        "baseline": {
          "otherMale": 0,
          "father": 0,
          "otherUnknown": 4,
          "mother": 0,
          "otherFemale": 0,
          "note": "Hiện trạng đăng ký ban đầu",
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "date": "2026-07-27"
        },
        "scientificName": "Pycnonotus jocosus",
        "vietnameseName": "Chim Chào mào",
        "citesAppendix": "Khai báo kiểm lâm"
      },
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "vietnameseName": "Chim Cu gáy",
        "scientificName": "Streptopelia chinensis",
        "id": "species_1790753399574",
        "purposeCode": "T",
        "fluctuations": [],
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "baseline": {
          "verifier": "",
          "father": 0,
          "note": "Số lượng vật nuôi hiện có ban đầu",
          "date": "2026-06-29",
          "otherMale": "1",
          "mother": 0,
          "otherUnknown": 0,
          "otherFemale": "1"
        }
      }
    ],
    "address": "Thôn 9 Hòa Sơn",
    "updatedAt": "2026-10-16T13:50:43.763Z",
    "registrationCode": "Chưa có mã số",
    "note": "",
    "lng": 108.32352
  },
  {
    "facilityName": "Nguyễn Duy Thông",
    "lng": 108.315073,
    "note": "Đang cập nhập",
    "registrationCode": "Chưa có mã số",
    "commune": "xã Hòa Sơn",
    "address": "thôn 9, xã Hoà Sơn, tỉnh Đắk Lắk0948861157",
    "ownerName": "Nguyễn Duy Thông",
    "lat": 12.490722,
    "registrationDate": "2026-08-27",
    "purposeCode": "T",
    "updatedAt": "2026-10-16T13:50:43.763Z",
    "speciesList": [
      {
        "id": "sp_1787794338130_1",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "vietnameseName": "Chim Chào mào",
        "scientificName": "Pycnonotus jocosus",
        "fluctuations": [],
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "mother": 2,
          "otherMale": 0,
          "otherUnknown": 10,
          "father": 2,
          "otherFemale": "0",
          "date": "2026-08-27",
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "note": "Hiện trạng đăng ký ban đầu"
        },
        "purposeCode": "T"
      },
      {
        "purposeCode": "T",
        "baseline": {
          "otherUnknown": 0,
          "date": "2026-09-07",
          "mother": 0,
          "father": 0,
          "note": "Số lượng vật nuôi hiện có ban đầu",
          "verifier": "",
          "otherMale": "2",
          "otherFemale": "2"
        },
        "scientificName": "Streptopelia chinensis",
        "vietnameseName": "Chim Cu gáy",
        "fluctuations": [],
        "id": "species_1788765271274",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "citesAppendix": "Khai báo kiểm lâm"
      }
    ],
    "id": "fac_1787794338130",
    "phone": "0948861157"
  },
  {
    "registrationDate": "2026-08-27",
    "facilityName": "Vũ Hoàng Tân",
    "ownerName": "Vũ Hoàng Tân",
    "registrationCode": "Chưa có mã số",
    "lng": 108.322735,
    "address": "Thôn 10",
    "id": "fac_1787795701427",
    "updatedAt": "2026-10-16T13:50:43.763Z",
    "speciesList": [
      {
        "vietnameseName": "Chim Chào mào",
        "purposeCode": "T",
        "scientificName": "Pycnonotus jocosus",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "id": "sp_1787795701427_1",
        "fluctuations": [],
        "baseline": {
          "mother": 0,
          "otherMale": 0,
          "otherUnknown": 2,
          "date": "2026-08-27",
          "note": "Hiện trạng đăng ký ban đầu",
          "father": 0,
          "otherFemale": 0,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông"
        },
        "citesAppendix": "Khai báo kiểm lâm"
      }
    ],
    "phone": "0337825861",
    "note": "",
    "lat": 12.500922,
    "commune": "xã Hòa Sơn",
    "purposeCode": "T"
  },
  {
    "lng": 108.322383,
    "registrationDate": "2026-10-05",
    "updatedAt": "2026-10-16T13:50:43.763Z",
    "id": "fac_1791188880545",
    "lat": 12.49798,
    "address": "thôn 10, xã Hoà Sơn, tỉnh Đắk Lắk",
    "facilityName": "Nguyễn Văn Vinh",
    "registrationCode": "Chưa có mã số",
    "ownerName": "Nguyễn Văn Vinh",
    "phone": "0988.257.586",
    "purposeCode": "T",
    "note": "",
    "speciesList": [
      {
        "id": "sp_1791188880545_1",
        "fluctuations": [],
        "purposeCode": "T",
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường",
        "scientificName": "Rhizomys pruinosus",
        "vietnameseName": "Dúi mốc lớn",
        "baseline": {
          "date": "2026-10-05",
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "otherMale": 42,
          "note": "Hiện trạng đăng ký ban đầu",
          "otherUnknown": 40,
          "mother": 6,
          "otherFemale": 66,
          "father": 6
        }
      }
    ],
    "commune": "xã Hòa Sơn"
  },
  {
    "lat": 12.526903,
    "speciesList": [
      {
        "baseline": {
          "mother": 4,
          "father": 3,
          "otherMale": 10,
          "otherFemale": 12,
          "note": "Số lượng Dúi má đào hiện có",
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "date": "2026-01-01",
          "otherUnknown": 0
        },
        "fluctuations": [],
        "group": "Động vật rừng thông thường",
        "vietnameseName": "Dúi má đào",
        "scientificName": "Rhizomys sumatrensis",
        "purposeCode": "T",
        "id": "sp_18_1",
        "citesAppendix": "Khai báo kiểm lâm"
      },
      {
        "baseline": {
          "otherMale": 17,
          "otherUnknown": 58,
          "mother": 61,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "note": "Số lượng Dúi mốc lớn hiện có",
          "otherFemale": 15,
          "date": "2026-01-01",
          "father": 19
        },
        "group": "Động vật rừng thông thường",
        "purposeCode": "T",
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Rhizomys pruinosus",
        "vietnameseName": "Dúi mốc lớn",
        "fluctuations": [],
        "id": "sp_18_2"
      }
    ],
    "updatedAt": "2026-10-16T13:50:43.764Z",
    "registrationCode": "Đang cập nhật",
    "phone": "",
    "purposeCode": "T",
    "lng": 108.423608,
    "id": "fac_18",
    "registrationDate": "",
    "note": "",
    "commune": "Xã Krông Bông",
    "ownerName": "Lê Quang Mạnh",
    "address": "Thôn 29, Xã Krông Bông, Tỉnh Đắk Lắk",
    "facilityName": "Cơ sở nuôi Lê Quang Mạnh"
  },
  {
    "ownerName": "Nguyễn Trương Đắc Nam",
    "lat": 12.528051,
    "note": "",
    "facilityName": "Cơ sở nuôi Nguyễn Trương Đắc Nam",
    "registrationDate": "",
    "lng": 108.328497,
    "commune": "Xã Krông Bông",
    "id": "fac_19",
    "phone": "",
    "purposeCode": "T",
    "updatedAt": "2026-10-16T13:50:43.764Z",
    "speciesList": [
      {
        "fluctuations": [],
        "purposeCode": "T",
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Rhizomys pruinosus",
        "vietnameseName": "Dúi mốc lớn",
        "id": "sp_19_1",
        "baseline": {
          "father": 10,
          "note": "Số lượng Dúi mốc lớn hiện có",
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "otherMale": 0,
          "date": "2026-01-01",
          "mother": 15,
          "otherUnknown": 0,
          "otherFemale": 0
        },
        "group": "Động vật rừng thông thường"
      }
    ],
    "registrationCode": "Đang cập nhật",
    "address": "Thôn 9, Xã Krông Bông, Tỉnh Đắk Lắk"
  },
  {
    "facilityName": "Cơ sở nuôi Nguyễn Văn Thúy",
    "registrationDate": "2023-04-17",
    "note": "",
    "updatedAt": "2026-10-16T13:50:43.764Z",
    "speciesList": [
      {
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "id": "sp_2_1",
        "fluctuations": [],
        "citesAppendix": "Phụ lục II CITES",
        "purposeCode": "T",
        "baseline": {
          "otherUnknown": 3,
          "father": 2,
          "mother": 3,
          "note": "Số lượng vật nuôi đăng ký",
          "otherFemale": 7,
          "otherMale": 6,
          "date": "2023-04-17",
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông"
        },
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)"
      }
    ],
    "ownerName": "Nguyễn Văn Thúy",
    "lat": 12.491634,
    "purposeCode": "T",
    "registrationCode": "IIB-C-DLC-028",
    "id": "fac_2",
    "phone": "",
    "address": "Thôn Quảng Đông, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "commune": "xã Hòa Sơn",
    "lng": 108.297682
  },
  {
    "lat": 12.58438,
    "id": "fac_20",
    "commune": "Xã Dang Kang",
    "registrationCode": "Đang cập nhật",
    "phone": "",
    "updatedAt": "2026-10-16T13:50:43.764Z",
    "speciesList": [
      {
        "scientificName": "Rhizomys sumatrensis",
        "vietnameseName": "Dúi má đào",
        "purposeCode": "T",
        "id": "sp_20_1",
        "fluctuations": [],
        "group": "Động vật rừng thông thường",
        "baseline": {
          "otherFemale": 8,
          "otherMale": 6,
          "father": 4,
          "mother": 26,
          "otherUnknown": 11,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "note": "Số lượng Dúi má đào hiện có",
          "date": "2026-01-01"
        },
        "citesAppendix": "Khai báo kiểm lâm"
      }
    ],
    "address": "Buôn Cư Ênun A, Xã Dang Kang, Tỉnh Đắk Lắk",
    "purposeCode": "T",
    "lng": 108.315384,
    "registrationDate": "",
    "note": "",
    "facilityName": "Cơ sở nuôi Trần Văn Lực",
    "ownerName": "Trần Văn Lực"
  },
  {
    "phone": "",
    "speciesList": [
      {
        "id": "sp_21_1",
        "group": "Động vật rừng thông thường",
        "citesAppendix": "Khai báo kiểm lâm",
        "vietnameseName": "Dúi mốc lớn",
        "scientificName": "Rhizomys pruinosus",
        "baseline": {
          "otherUnknown": 0,
          "father": 10,
          "note": "Số lượng Dúi mốc lớn hiện có",
          "date": "2026-01-01",
          "mother": 10,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "otherMale": 0,
          "otherFemale": 0
        },
        "fluctuations": [],
        "purposeCode": "T"
      }
    ],
    "purposeCode": "T",
    "address": "Thôn 3, Xã Dang Kang, Tỉnh Đắk Lắk",
    "registrationCode": "Đang cập nhật",
    "commune": "Xã Dang Kang",
    "note": "",
    "id": "fac_21",
    "ownerName": "Đinh Tiến Toàn",
    "facilityName": "Cơ sở nuôi Đinh Tiến Toàn",
    "lng": 108.339096,
    "updatedAt": "2026-10-16T13:50:43.764Z",
    "lat": 12.619158,
    "registrationDate": ""
  },
  {
    "commune": "xã Hòa Sơn",
    "id": "fac_22",
    "note": "",
    "facilityName": "Cơ sở nuôi Nguyễn Thanh",
    "ownerName": "Nguyễn Thanh",
    "registrationCode": "Đang cập nhật",
    "purposeCode": "T",
    "speciesList": [
      {
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "fluctuations": [],
        "purposeCode": "T",
        "vietnameseName": "Chim Cu gáy",
        "scientificName": "Streptopelia chinensis",
        "citesAppendix": "Khai báo kiểm lâm",
        "id": "sp_22_1",
        "baseline": {
          "date": "2026-01-01",
          "mother": 1,
          "father": 1,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "note": "Số lượng Chim Cu gáy nuôi",
          "otherMale": 0,
          "otherFemale": 0,
          "otherUnknown": 0
        }
      }
    ],
    "updatedAt": "2026-10-16T13:50:43.764Z",
    "address": "Thôn 2, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "registrationDate": "",
    "phone": ""
  },
  {
    "purposeCode": "O",
    "registrationDate": "",
    "address": "Thôn 2, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "id": "fac_23",
    "note": "Làm cảnh",
    "updatedAt": "2026-10-16T13:50:43.764Z",
    "speciesList": [
      {
        "baseline": {
          "mother": 0,
          "otherUnknown": 0,
          "otherMale": 0,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "father": 3,
          "date": "2026-01-01",
          "otherFemale": 0,
          "note": "Số lượng Chim Chào mào nuôi cảnh"
        },
        "id": "sp_23_1",
        "scientificName": "Pycnonotus Jocosus",
        "vietnameseName": "Chim Chào mào",
        "fluctuations": [],
        "citesAppendix": "Khai báo kiểm lâm",
        "purposeCode": "O",
        "group": "Động vật rừng thông thường (Chim)"
      }
    ],
    "registrationCode": "Đang cập nhật",
    "facilityName": "Cơ sở nuôi Huỳnh Phúc Lợi",
    "ownerName": "Huỳnh Phúc Lợi",
    "commune": "xã Hòa Sơn",
    "phone": ""
  },
  {
    "address": "Thôn 4, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "updatedAt": "2026-10-16T13:50:43.773Z",
    "purposeCode": "T",
    "speciesList": [
      {
        "group": "Động vật rừng thông thường (Chim)",
        "citesAppendix": "Khai báo kiểm lâm",
        "purposeCode": "T",
        "vietnameseName": "Chim Chào mào",
        "scientificName": "Pycnonotus Jocosus",
        "baseline": {
          "otherUnknown": 0,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "otherMale": 0,
          "date": "2026-01-01",
          "mother": 5,
          "otherFemale": 0,
          "note": "Số lượng Chim Chào mào nuôi",
          "father": 5
        },
        "id": "sp_24_1",
        "fluctuations": []
      }
    ],
    "id": "fac_24",
    "registrationDate": "",
    "ownerName": "Phan Thanh Trúc",
    "phone": "",
    "facilityName": "Cơ sở nuôi Phan Thanh Trúc",
    "note": "",
    "registrationCode": "Đang cập nhật",
    "commune": "xã Hòa Sơn"
  },
  {
    "id": "fac_25",
    "updatedAt": "2026-10-16T13:50:43.773Z",
    "address": "Thôn 4, Xã Krông Bông, Tỉnh Đắk Lắk",
    "commune": "Xã Krông Bông",
    "registrationCode": "Đang cập nhật",
    "lat": 12.502961,
    "phone": "",
    "facilityName": "Cơ sở nuôi Thái Hồng Sơn",
    "speciesList": [
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Pycnonotus Jocosus",
        "vietnameseName": "Chim Chào mào",
        "fluctuations": [],
        "baseline": {
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "date": "2026-01-01",
          "otherMale": 0,
          "otherFemale": 0,
          "note": "Số lượng Chim Chào mào nuôi",
          "father": 5,
          "otherUnknown": 0,
          "mother": 5
        },
        "group": "Động vật rừng thông thường (Chim)",
        "id": "sp_25_1",
        "purposeCode": "T"
      }
    ],
    "note": "",
    "purposeCode": "T",
    "lng": 108.333624,
    "registrationDate": "",
    "ownerName": "Thái Hồng Sơn"
  },
  {
    "registrationCode": "Đang cập nhật",
    "id": "fac_26",
    "updatedAt": "2026-10-16T13:50:43.773Z",
    "purposeCode": "T",
    "note": "",
    "speciesList": [
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Streptopelia chinensis",
        "vietnameseName": "Chim Cu gáy",
        "baseline": {
          "otherFemale": 1,
          "note": "Số lượng Chim Cu gáy nuôi",
          "otherMale": 1,
          "father": 11,
          "date": "2026-01-01",
          "mother": 11,
          "otherUnknown": 0,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông"
        },
        "id": "sp_26_1",
        "fluctuations": [],
        "purposeCode": "T",
        "group": "Động vật rừng thông thường (Lớp Chim)"
      }
    ],
    "lat": 12.523945,
    "ownerName": "Nguyễn Trí",
    "commune": "Xã Krông Bông",
    "registrationDate": "",
    "phone": "",
    "address": "Thôn 7, Xã Krông Bông, Tỉnh Đắk Lắk",
    "facilityName": "Cơ sở nuôi Nguyễn Trí",
    "lng": 108.336714
  },
  {
    "phone": "",
    "purposeCode": "T",
    "registrationDate": "",
    "address": "Thôn 2, Xã Krông Bông, Tỉnh Đắk Lắk",
    "ownerName": "Nguyễn Văn Hòa",
    "speciesList": [
      {
        "fluctuations": [],
        "id": "sp_27_1",
        "purposeCode": "T",
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường (Chim)",
        "baseline": {
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "mother": 2,
          "otherFemale": 0,
          "note": "Số lượng Chim Chào mào nuôi",
          "otherUnknown": 0,
          "otherMale": 0,
          "date": "2026-01-01",
          "father": 2
        },
        "vietnameseName": "Chim Chào mào",
        "scientificName": "Pycnonotus Jocosus"
      }
    ],
    "registrationCode": "Đang cập nhật",
    "id": "fac_27",
    "note": "",
    "commune": "Xã Krông Bông",
    "facilityName": "Cơ sở nuôi Nguyễn Văn Hòa",
    "updatedAt": "2026-10-16T13:50:43.773Z"
  },
  {
    "updatedAt": "2026-10-16T13:50:43.773Z",
    "note": "",
    "registrationDate": "",
    "address": "Thôn 26, Xã Krông Bông, Tỉnh Đắk Lắk",
    "purposeCode": "T",
    "commune": "Xã Krông Bông",
    "facilityName": "Cơ sở nuôi Trần Văn Hà",
    "speciesList": [
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Pycnonotus Jocosus",
        "group": "Động vật rừng thông thường (Chim)",
        "vietnameseName": "Chim Chào mào",
        "fluctuations": [],
        "id": "sp_28_1",
        "purposeCode": "T",
        "baseline": {
          "note": "Số lượng Chim Chào mào nuôi",
          "mother": 1,
          "father": 1,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "date": "2026-01-01",
          "otherUnknown": 0,
          "otherFemale": 0,
          "otherMale": 0
        }
      }
    ],
    "registrationCode": "Đang cập nhật",
    "phone": "",
    "lng": 108.401029,
    "id": "fac_28",
    "ownerName": "Trần Văn Hà",
    "lat": 12.547061
  },
  {
    "registrationCode": "Đang cập nhật",
    "ownerName": "Trần Ngọc Long",
    "address": "Thôn 2, Xã Krông Bông, Tỉnh Đắk Lắk",
    "registrationDate": "",
    "id": "fac_29",
    "speciesList": [
      {
        "purposeCode": "T",
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "otherFemale": 0,
          "date": "2026-01-01",
          "otherMale": 0,
          "note": "Số lượng Chim Cu gáy nuôi",
          "otherUnknown": 0,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "mother": 2,
          "father": 2
        },
        "fluctuations": [],
        "scientificName": "Streptopelia chinensis",
        "vietnameseName": "Chim Cu gáy",
        "id": "sp_29_1",
        "group": "Động vật rừng thông thường (Lớp Chim)"
      }
    ],
    "updatedAt": "2026-10-16T13:50:43.773Z",
    "note": "",
    "phone": "",
    "commune": "Xã Krông Bông",
    "facilityName": "Cơ sở nuôi Trần Ngọc Long",
    "purposeCode": "T"
  },
  {
    "phone": "",
    "speciesList": [
      {
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "fluctuations": [],
        "citesAppendix": "Phụ lục II CITES",
        "vietnameseName": "Cầy vòi Hương",
        "scientificName": "Paradoxurus hermaphroditus",
        "baseline": {
          "otherFemale": 0,
          "father": 0,
          "otherUnknown": 0,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "mother": 0,
          "otherMale": 0,
          "date": "2025-10-03",
          "note": "Cơ sở hiện nghỉ nuôi"
        },
        "purposeCode": "T",
        "id": "sp_3_1"
      }
    ],
    "registrationDate": "2025-10-03",
    "purposeCode": "T",
    "address": "Thôn 4, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "id": "fac_3",
    "commune": "xã Hòa Sơn",
    "facilityName": "Cơ sở nuôi Trịnh Viết Long",
    "ownerName": "Trịnh Viết Long",
    "registrationCode": "028-25/B-DLC",
    "lng": 108.1885,
    "updatedAt": "2026-10-16T13:50:43.773Z",
    "note": "Nghỉ nuôi",
    "lat": 12.506699
  },
  {
    "phone": "",
    "registrationDate": "",
    "ownerName": "Hoàng Văn Hải",
    "note": "",
    "id": "fac_30",
    "lng": 108.3365,
    "commune": "Xã Dang Kang",
    "facilityName": "Cơ sở nuôi Hoàng Văn Hải",
    "speciesList": [
      {
        "purposeCode": "T",
        "fluctuations": [],
        "group": "Động vật rừng thông thường (Chim)",
        "vietnameseName": "Chim Chào mào",
        "scientificName": "Pycnonotus Jocosus",
        "id": "sp_30_1",
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "otherMale": 3,
          "otherUnknown": 3,
          "otherFemale": 2,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "date": "2026-01-01",
          "father": 2,
          "mother": 2,
          "note": "Số lượng Chim Chào mào nuôi"
        }
      }
    ],
    "registrationCode": "Đang cập nhật",
    "purposeCode": "T",
    "address": "Thôn 6, Xã Dang Kang, Tỉnh Đắk Lắk",
    "lat": 12.574027,
    "updatedAt": "2026-10-16T13:50:43.773Z"
  },
  {
    "lng": 108.33214,
    "registrationDate": "",
    "ownerName": "Võ Văn Nhơn",
    "phone": "",
    "facilityName": "Cơ sở nuôi Võ Văn Nhơn",
    "id": "fac_31",
    "lat": 12.562678,
    "speciesList": [
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "id": "sp_31_1",
        "fluctuations": [],
        "group": "Động vật rừng thông thường (Chim)",
        "purposeCode": "O",
        "scientificName": "Pycnonotus Jocosus",
        "vietnameseName": "Chim Chào mào",
        "baseline": {
          "father": 1,
          "note": "Số lượng Chim Chào mào nuôi cảnh",
          "mother": 1,
          "date": "2026-01-01",
          "otherFemale": 0,
          "otherUnknown": 0,
          "otherMale": 0,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông"
        }
      }
    ],
    "note": "Làm cảnh",
    "registrationCode": "Đang cập nhật",
    "purposeCode": "O",
    "address": "Thôn 7, Xã Dang Kang, Tỉnh Đắk Lắk",
    "updatedAt": "2026-10-16T13:50:43.773Z",
    "commune": "Xã Dang Kang"
  },
  {
    "facilityName": "Cơ sở nuôi Phạm Bá Quang",
    "registrationDate": "",
    "phone": "",
    "purposeCode": "T",
    "ownerName": "Phạm Bá Quang",
    "speciesList": [
      {
        "fluctuations": [],
        "baseline": {
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "mother": 11,
          "otherMale": 0,
          "note": "Chưa được cấp mã số cơ sở",
          "otherUnknown": 0,
          "otherFemale": 0,
          "date": "2026-01-01",
          "father": 4
        },
        "vietnameseName": "Cầy vòi Hương",
        "scientificName": "Paradoxurus hermaphroditus",
        "citesAppendix": "Phụ lục II CITES",
        "purposeCode": "T",
        "id": "sp_4_1",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)"
      }
    ],
    "note": "Chưa có mã số",
    "updatedAt": "2026-10-16T13:50:43.773Z",
    "registrationCode": "Chưa có mã số",
    "id": "fac_4",
    "address": "Thôn 3, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "lng": 108.29803,
    "lat": 12.492824,
    "commune": "xã Hòa Sơn"
  },
  {
    "registrationDate": "2022-04-22",
    "phone": "",
    "commune": "xã Hòa Sơn",
    "registrationCode": "IIB-DLC-021",
    "updatedAt": "2026-10-16T13:50:43.773Z",
    "purposeCode": "T",
    "id": "fac_5",
    "address": "Thôn 1, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "ownerName": "Phan Thanh Hùng",
    "speciesList": [
      {
        "baseline": {
          "father": 0,
          "mother": 0,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "otherMale": 0,
          "otherUnknown": 0,
          "otherFemale": 0,
          "note": "Cơ sở nghỉ nuôi",
          "date": "2022-04-22"
        },
        "id": "sp_5_1",
        "purposeCode": "T",
        "citesAppendix": "Phụ lục II CITES",
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "fluctuations": [],
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)"
      }
    ],
    "note": "Nghỉ nuôi",
    "facilityName": "Cơ sở nuôi Phan Thanh Hùng"
  },
  {
    "purposeCode": "T",
    "speciesList": [
      {
        "id": "sp_6_1",
        "baseline": {
          "father": 0,
          "note": "Cơ sở nghỉ nuôi",
          "date": "2026-01-01",
          "otherFemale": 0,
          "mother": 0,
          "otherMale": 0,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "otherUnknown": 0
        },
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "citesAppendix": "Phụ lục II CITES",
        "purposeCode": "T",
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "fluctuations": []
      }
    ],
    "address": "Thôn 6, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "note": "Nghỉ nuôi",
    "facilityName": "Cơ sở nuôi Lê Nguyễn Nhật Tân",
    "updatedAt": "2026-10-16T13:50:43.773Z",
    "id": "fac_6",
    "registrationCode": "IIB-DLC-025",
    "commune": "xã Hòa Sơn",
    "ownerName": "Lê Nguyễn Nhật Tân",
    "phone": "",
    "registrationDate": ""
  },
  {
    "purposeCode": "T",
    "facilityName": "Cơ sở nuôi Nguyễn Tấn Danh Nhân",
    "speciesList": [
      {
        "purposeCode": "T",
        "fluctuations": [],
        "citesAppendix": "Phụ lục II CITES",
        "baseline": {
          "father": 3,
          "date": "2024-07-03",
          "note": "Số lượng Cầy vòi Hương hiện có",
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "otherMale": 12,
          "mother": 5,
          "otherUnknown": 19,
          "otherFemale": 14
        },
        "id": "sp_7_1",
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)"
      },
      {
        "vietnameseName": "Cầy vòi mốc",
        "scientificName": "Paguma larvata",
        "id": "sp_7_2",
        "citesAppendix": "Phụ lục II CITES",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "baseline": {
          "otherUnknown": 0,
          "otherFemale": 0,
          "otherMale": 0,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "father": 2,
          "note": "Số lượng Cầy vòi mốc hiện có",
          "date": "2024-07-03",
          "mother": 3
        },
        "purposeCode": "T",
        "fluctuations": []
      },
      {
        "id": "sp_7_3",
        "citesAppendix": "Khai báo kiểm lâm",
        "vietnameseName": "Don",
        "scientificName": "Atherurus macrourus",
        "purposeCode": "T",
        "group": "Động vật rừng thông thường",
        "baseline": {
          "mother": 1,
          "otherUnknown": 0,
          "father": 1,
          "note": "Hiện trạng nuôi loài Don",
          "otherFemale": 0,
          "date": "2026-01-01",
          "otherMale": 0,
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông"
        },
        "fluctuations": []
      },
      {
        "id": "sp_7_4",
        "purposeCode": "T",
        "fluctuations": [],
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường",
        "vietnameseName": "Nhím",
        "scientificName": "Hystrix brachyura",
        "baseline": {
          "otherMale": 21,
          "note": "Hiện trạng nuôi loài Nhím",
          "otherFemale": 31,
          "date": "2026-01-01",
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "father": 6,
          "otherUnknown": 11,
          "mother": 12
        }
      }
    ],
    "registrationCode": "IIB-C-DLC-055",
    "id": "fac_7",
    "ownerName": "Nguyễn Tấn Danh Nhân",
    "phone": "",
    "address": "Buôn Tơ Rang, xã Yang Mao, Tỉnh Đắk Lắk",
    "registrationDate": "2024-07-03",
    "lat": 12.472545,
    "updatedAt": "2026-10-16T13:50:43.774Z",
    "note": "",
    "lng": 108.562016,
    "commune": "xã Yang Mao"
  },
  {
    "updatedAt": "2026-10-16T13:50:43.774Z",
    "speciesList": [
      {
        "baseline": {
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "otherFemale": 0,
          "otherUnknown": 4,
          "mother": 5,
          "note": "Hiện trạng nuôi ban đầu",
          "date": "2026-05-05",
          "otherMale": 0,
          "father": 1
        },
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "vietnameseName": "Cầy vòi Hương",
        "scientificName": "Paradoxurus hermaphroditus",
        "purposeCode": "T",
        "id": "sp_8_1",
        "citesAppendix": "Phụ lục II CITES",
        "fluctuations": []
      }
    ],
    "id": "fac_8",
    "purposeCode": "T",
    "registrationCode": "53-26/B-DLC",
    "note": "",
    "registrationDate": "2026-05-05",
    "phone": "",
    "lng": 108.562716,
    "address": "Buôn chàm A, xã Yang Mao, Tỉnh Đắk Lắk",
    "commune": "xã Yang Mao",
    "lat": 12.483552,
    "ownerName": "Huỳnh Công Nam",
    "facilityName": "Cơ sở nuôi Huỳnh Công Nam"
  },
  {
    "lng": 108.655302,
    "updatedAt": "2026-10-16T13:50:43.774Z",
    "phone": "",
    "registrationDate": "2026-03-03",
    "facilityName": "Cơ sở nuôi Trần Duy Quân",
    "lat": 12.503389,
    "registrationCode": "14-26/B-DLC",
    "note": "",
    "address": "Thôn Ea Luêh, xã Yang Mao, Tỉnh Đắk Lắk",
    "id": "fac_9",
    "commune": "xã Yang Mao",
    "speciesList": [
      {
        "citesAppendix": "Phụ lục II CITES",
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "fluctuations": [],
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "baseline": {
          "mother": 8,
          "otherUnknown": 0,
          "father": 5,
          "otherFemale": 0,
          "otherMale": 0,
          "note": "Hiện trạng nuôi ban đầu",
          "verifier": "Hạt Kiểm lâm khu vực Krông Bông",
          "date": "2026-03-03"
        },
        "id": "sp_9_1",
        "purposeCode": "T"
      }
    ],
    "purposeCode": "T",
    "ownerName": "Trần Duy Quân"
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

    facilitiesList = facilitiesList.map((f) => {
      const fresh = REAL_FACILITIES_DATA.find((rf) => rf.id === f.id);
      if (fresh && fresh.speciesList) {
        const freshCount = fresh.speciesList.reduce((acc, s) => acc + (s.fluctuations?.length || 0), 0);
        const currentCount = f.speciesList?.reduce((acc, s) => acc + (s.fluctuations?.length || 0), 0) || 0;
        if (freshCount > currentCount) {
          f = { ...f, speciesList: fresh.speciesList, baseline: fresh.baseline };
        }
      }
      
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
