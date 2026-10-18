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
    "registrationDate": "2023-03-17",
    "address": "Thôn 3, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "registrationCode": "IIB-DLC-027",
    "owner": "Lê Thị Xuân",
    "facilityName": "Cơ sở nuôi Lê Thị Xuân",
    "note": "",
    "lat": 12.496848,
    "name": "Cơ sở nuôi Lê Thị Xuân",
    "id": "fac_1",
    "lng": 108.227912,
    "updatedAt": "2026-10-18T15:21:37.459Z",
    "phone": "",
    "commune": "xã Hòa Sơn",
    "purposeCode": "T",
    "ownerName": "Lê Thị Xuân",
    "speciesList": [
      {
        "baseline": {
          "mother": 5,
          "father": 4,
          "otherUnknown": 2,
          "otherFemale": "8",
          "otherMale": "10",
          "note": "Số lượng vật nuôi theo chứng nhận cơ sở",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2023-03-17"
        },
        "vietnameseName": "Cầy vòi Hương",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "fluctuations": [
          {
            "decFather": 0,
            "incMother": 0,
            "decMother": 0,
            "isPurchaseMode": false,
            "reason": "Xác định giới tính con con",
            "purpose": "T",
            "decOtherFemale": 0,
            "createdAt": 1792335164333,
            "isGenderIdentifyMode": true,
            "decOtherUnknown": 2,
            "id": "fluc_1792335164333",
            "incOtherUnknown": 0,
            "time": "21:52",
            "incOtherFemale": 0,
            "incFather": 0,
            "verifier": "",
            "decOtherMale": 0,
            "date": "2025-10-18",
            "approvalStatus": "APPROVED",
            "incOtherMale": 2
          },
          {
            "decOtherMale": 0,
            "purpose": "T",
            "id": "fluc_1792335203123",
            "time": "21:53",
            "incOtherMale": 0,
            "incFather": 0,
            "approvalStatus": "APPROVED",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decOtherUnknown": 0,
            "date": "2026-06-17",
            "isPurchaseMode": false,
            "decOtherFemale": 0,
            "incOtherUnknown": 21,
            "isGenderIdentifyMode": false,
            "incMother": 0,
            "decFather": 0,
            "decMother": 0,
            "verifier": "",
            "createdAt": 1792335203123,
            "incOtherFemale": 0
          },
          {
            "approvalStatus": "APPROVED",
            "isGenderIdentifyMode": false,
            "incOtherMale": 0,
            "incMother": 0,
            "decFather": 0,
            "decOtherUnknown": 0,
            "decOtherMale": 0,
            "time": "21:53",
            "decMother": 0,
            "incOtherUnknown": 11,
            "createdAt": 1792335313527,
            "incOtherFemale": 0,
            "purpose": "T",
            "isPurchaseMode": false,
            "incFather": 0,
            "id": "fluc_1792335313527",
            "date": "2026-08-29",
            "decOtherFemale": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "verifier": ""
          },
          {
            "reason": "Xuất bán thương mại cho cơ sở B",
            "incFather": 0,
            "date": "2026-10-14",
            "approvalStatus": "APPROVED",
            "isGenderIdentifyMode": false,
            "verifier": "",
            "createdAt": 1792335381718,
            "time": "21:55",
            "isPurchaseMode": false,
            "incOtherUnknown": 0,
            "decMother": 0,
            "id": "fluc_1792335381718",
            "decOtherFemale": 3,
            "incOtherMale": 0,
            "decOtherUnknown": 0,
            "incMother": 0,
            "decFather": 0,
            "purpose": "T",
            "decOtherMale": 1,
            "incOtherFemale": 0
          }
        ],
        "purposeCode": "T",
        "id": "sp_1_1",
        "citesAppendix": "Phụ lục II CITES",
        "scientificName": "Paradoxurus hermaphroditus"
      }
    ]
  },
  {
    "lat": 12.546946,
    "commune": "xã Cư Pui",
    "phone": "",
    "registrationCode": "52-26/B-DLC",
    "registrationDate": "2026-05-08",
    "id": "fac_10",
    "name": "Cơ sở nuôi Trịnh Lục",
    "ownerName": "Trịnh Lục",
    "note": "",
    "owner": "Trịnh Lục",
    "speciesList": [
      {
        "baseline": {
          "otherFemale": 0,
          "note": "Hiện trạng nuôi ban đầu",
          "mother": 3,
          "date": "2026-05-08",
          "otherUnknown": 0,
          "verifier": "Hạt Kiểm lâm Huy���n Krông Bông",
          "father": 2,
          "otherMale": 0
        },
        "vietnameseName": "Cầy vòi Hương",
        "fluctuations": [
          {
            "decOtherMale": 0,
            "date": "2026-05-16",
            "incFather": 2,
            "verifier": "",
            "decOtherFemale": 0,
            "isPurchaseMode": true,
            "incOtherFemale": 0,
            "incOtherMale": 0,
            "decMother": 0,
            "incOtherUnknown": 0,
            "incMother": 4,
            "decFather": 0,
            "createdAt": 1786413132829,
            "reason": "Mua từ cơ sở nuôi sinh sản khác",
            "time": "08:51",
            "decOtherUnknown": 0,
            "purpose": "T",
            "id": "fluc_1786413132829",
            "approvalStatus": "APPROVED",
            "isGenderIdentifyMode": false
          },
          {
            "isGenderIdentifyMode": false,
            "purpose": "T",
            "isPurchaseMode": false,
            "time": "08:52",
            "decOtherFemale": 0,
            "incOtherMale": 0,
            "incOtherUnknown": 4,
            "decOtherUnknown": 0,
            "id": "fluc_1786413181544",
            "incOtherFemale": 0,
            "decOtherMale": 0,
            "incFather": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "date": "2026-06-09",
            "createdAt": 1786413181544,
            "approvalStatus": "APPROVED",
            "incMother": 0,
            "decFather": 0,
            "verifier": "",
            "decMother": 0
          },
          {
            "id": "fluc_1786413220093",
            "incOtherUnknown": 0,
            "time": "08:53",
            "purpose": "T",
            "decOtherUnknown": 0,
            "isGenderIdentifyMode": false,
            "reason": "Mua từ cơ sở nuôi sinh sản khác",
            "incFather": 1,
            "verifier": "",
            "approvalStatus": "APPROVED",
            "decOtherFemale": 0,
            "date": "2026-07-10",
            "isPurchaseMode": true,
            "incOtherMale": 0,
            "decFather": 0,
            "incMother": 14,
            "incOtherFemale": 0,
            "decMother": 0,
            "decOtherMale": 0,
            "createdAt": 1786413220093
          },
          {
            "decOtherUnknown": 0,
            "decOtherMale": 0,
            "createdAt": 1786413284623,
            "time": "08:54",
            "incMother": 0,
            "decFather": 0,
            "incOtherUnknown": 12,
            "verifier": "",
            "incOtherFemale": 0,
            "decMother": 0,
            "incOtherMale": 0,
            "isPurchaseMode": false,
            "decOtherFemale": 0,
            "id": "fluc_1786413284623",
            "isGenderIdentifyMode": false,
            "approvalStatus": "APPROVED",
            "purpose": "T",
            "date": "2026-07-11",
            "incFather": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh"
          },
          {
            "reason": "Mua từ cơ sở nuôi sinh sản khác",
            "decOtherFemale": 0,
            "createdAt": 1792146475584,
            "incMother": 0,
            "decFather": 0,
            "date": "2026-08-03",
            "isPurchaseMode": true,
            "decMother": 0,
            "incOtherFemale": 8,
            "purpose": "T",
            "incOtherUnknown": 0,
            "time": "17:26",
            "isGenderIdentifyMode": false,
            "decOtherMale": 0,
            "incFather": 0,
            "decOtherUnknown": 0,
            "verifier": "",
            "incOtherMale": 2,
            "approvalStatus": "APPROVED",
            "id": "fluc_1792146475584"
          },
          {
            "incOtherUnknown": 0,
            "purpose": "T",
            "incOtherFemale": 0,
            "decOtherUnknown": 0,
            "isPurchaseMode": false,
            "time": "08:56",
            "id": "fluc_1786413405967",
            "decOtherFemale": 5,
            "incFather": 0,
            "approvalStatus": "APPROVED",
            "incOtherMale": 0,
            "verifier": "",
            "reason": "Xuất bán thương mại cho cơ sở B",
            "decOtherMale": 0,
            "isGenderIdentifyMode": false,
            "createdAt": 1786413405967,
            "decFather": 0,
            "incMother": 0,
            "date": "2026-08-11",
            "decMother": 0
          },
          {
            "decOtherUnknown": 0,
            "incMother": 0,
            "decFather": 0,
            "date": "2026-08-28",
            "decMother": 0,
            "isPurchaseMode": false,
            "decOtherFemale": 0,
            "incOtherUnknown": 9,
            "purpose": "T",
            "createdAt": 1792146698997,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "incOtherFemale": 0,
            "isGenderIdentifyMode": false,
            "incFather": 0,
            "incOtherMale": 0,
            "time": "17:28",
            "approvalStatus": "APPROVED",
            "decOtherMale": 0,
            "id": "fluc_1792146698997",
            "verifier": ""
          },
          {
            "verifier": "",
            "incOtherMale": 0,
            "date": "2026-09-01",
            "incOtherFemale": 0,
            "incFather": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "isPurchaseMode": false,
            "decOtherMale": 0,
            "decOtherFemale": 0,
            "isGenderIdentifyMode": false,
            "approvalStatus": "APPROVED",
            "time": "17:31",
            "decMother": 0,
            "decOtherUnknown": 0,
            "incMother": 0,
            "decFather": 0,
            "createdAt": 1792146763664,
            "purpose": "T",
            "id": "fluc_1792146763664",
            "incOtherUnknown": 6
          },
          {
            "approvalStatus": "APPROVED",
            "decMother": 0,
            "decOtherUnknown": 3,
            "date": "2026-09-25",
            "incMother": 0,
            "decFather": 0,
            "createdAt": 1792146792454,
            "incOtherUnknown": 0,
            "isGenderIdentifyMode": false,
            "id": "fluc_1792146792454",
            "incOtherFemale": 0,
            "reason": "Chết do thời tiết/bệnh lý",
            "incOtherMale": 0,
            "decOtherFemale": 0,
            "verifier": "",
            "purpose": "T",
            "incFather": 0,
            "time": "17:32",
            "decOtherMale": 0,
            "isPurchaseMode": false
          }
        ],
        "purposeCode": "T",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "id": "sp_10_1",
        "scientificName": "Paradoxurus hermaphroditus",
        "citesAppendix": "Phụ lục II CITES"
      }
    ],
    "lng": 108.456819,
    "address": "Thôn 3, xã Cư Pui, Tỉnh Đắk Lắk",
    "facilityName": "Cơ sở nuôi Trịnh Lục",
    "updatedAt": "2026-10-18T16:03:32.338Z",
    "purposeCode": "T"
  },
  {
    "address": "Thôn 3, xã Cư Pui, Tỉnh Đắk Lắk",
    "purposeCode": "T",
    "speciesList": [
      {
        "purposeCode": "T",
        "citesAppendix": "Phụ lục II CITES",
        "scientificName": "Paradoxurus hermaphroditus",
        "baseline": {
          "date": "2024-09-25",
          "mother": 7,
          "note": "Hiện trạng nuôi đăng ký",
          "otherFemale": 16,
          "otherMale": 5,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherUnknown": 19,
          "father": 4
        },
        "vietnameseName": "Cầy vòi Hương",
        "id": "sp_11_1",
        "fluctuations": [
          {
            "decOtherUnknown": 0,
            "decMother": 0,
            "decFather": 0,
            "incMother": 0,
            "time": "09:22",
            "verifier": "",
            "createdAt": 1786414971813,
            "incOtherUnknown": 0,
            "incOtherFemale": 0,
            "isGenderIdentifyMode": false,
            "isPurchaseMode": false,
            "reason": "Xuất bán thương mại cho cơ sở B",
            "decOtherFemale": 0,
            "incFather": 0,
            "approvalStatus": "APPROVED",
            "date": "2026-08-11",
            "decOtherMale": 1,
            "purpose": "T",
            "id": "fluc_1786414971813",
            "incOtherMale": 0
          },
          {
            "incOtherFemale": 0,
            "createdAt": 1791170873185,
            "time": "10:27",
            "incOtherMale": 0,
            "isGenderIdentifyMode": false,
            "incMother": 0,
            "decFather": 0,
            "decMother": 0,
            "decOtherFemale": 0,
            "decOtherUnknown": 0,
            "decOtherMale": 0,
            "id": "fluc_1791170873185",
            "isPurchaseMode": false,
            "incOtherUnknown": 3,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "purpose": "T",
            "approvalStatus": "APPROVED",
            "verifier": "",
            "date": "2026-09-09",
            "incFather": 0
          },
          {
            "incOtherMale": 0,
            "verifier": "",
            "incFather": 0,
            "decOtherMale": 0,
            "decOtherUnknown": 5,
            "approvalStatus": "APPROVED",
            "time": "10:28",
            "incOtherUnknown": 0,
            "purpose": "T",
            "decOtherFemale": 0,
            "isPurchaseMode": false,
            "date": "2026-09-17",
            "isGenderIdentifyMode": false,
            "incOtherFemale": 0,
            "decMother": 0,
            "decFather": 0,
            "incMother": 0,
            "reason": "Chết do thời tiết/bệnh lý",
            "id": "fluc_1791170912846",
            "createdAt": 1791170912846
          },
          {
            "isPurchaseMode": false,
            "reason": "Xác định giới tính con con",
            "decOtherMale": 0,
            "verifier": "",
            "time": "10:28",
            "decOtherFemale": 0,
            "decOtherUnknown": 17,
            "createdAt": 1791170959593,
            "incOtherFemale": 10,
            "incOtherUnknown": 0,
            "incOtherMale": 7,
            "incMother": 0,
            "decFather": 0,
            "decMother": 0,
            "purpose": "T",
            "date": "2026-09-18",
            "id": "fluc_1791170959593",
            "isGenderIdentifyMode": true,
            "approvalStatus": "APPROVED",
            "incFather": 0
          },
          {
            "isGenderIdentifyMode": false,
            "incFather": 0,
            "decOtherMale": 5,
            "date": "2026-09-22",
            "incOtherMale": 0,
            "approvalStatus": "APPROVED",
            "id": "fluc_1791170669944",
            "createdAt": 1791170669944,
            "decOtherFemale": 5,
            "decMother": 0,
            "isPurchaseMode": false,
            "purpose": "T",
            "incMother": 0,
            "decFather": 0,
            "reason": "Xuất bán thương mại cho cơ sở B",
            "incOtherFemale": 0,
            "time": "10:23",
            "incOtherUnknown": 0,
            "verifier": "",
            "decOtherUnknown": 0
          }
        ],
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)"
      }
    ],
    "facilityName": "Cơ sở nuôi Nguyễn Hữu Đô",
    "lat": 12.548123,
    "owner": "Nguyễn Hữu Đô",
    "id": "fac_11",
    "lng": 108.458901,
    "updatedAt": "2026-10-18T16:03:32.338Z",
    "registrationCode": "IIB-C-DLC-063",
    "commune": "xã Cư Pui",
    "ownerName": "Nguyễn Hữu Đô",
    "note": "",
    "registrationDate": "2024-09-25",
    "name": "Cơ sở nuôi Nguyễn Hữu Đô",
    "phone": ""
  },
  {
    "facilityName": "Cơ sở nuôi Lê Thanh Đức",
    "ownerName": "Lê Thanh Đức",
    "address": "Thôn 5, Xã Krông Bông, Tỉnh Đắk Lắk",
    "phone": "",
    "lng": 108.332398,
    "name": "Cơ sở nuôi Lê Thanh Đức",
    "id": "fac_12",
    "updatedAt": "2026-10-18T15:21:37.459Z",
    "note": "",
    "lat": 12.528258,
    "owner": "Lê Thanh Đức",
    "commune": "Xã Krông Bông",
    "registrationCode": "IIB-C-DLC-060",
    "speciesList": [
      {
        "id": "sp_12_1",
        "baseline": {
          "mother": 7,
          "father": 2,
          "otherFemale": 9,
          "otherMale": 11,
          "note": "Hiện trạng nuôi đăng ký",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2024-09-06",
          "otherUnknown": 6
        },
        "purposeCode": "T",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "scientificName": "Paradoxurus hermaphroditus",
        "citesAppendix": "Phụ lục II CITES",
        "vietnameseName": "Cầy vòi Hương",
        "fluctuations": []
      }
    ],
    "purposeCode": "T",
    "registrationDate": "2024-09-06"
  },
  {
    "lng": 108.414746,
    "owner": "Ngô Thị Trang",
    "note": "",
    "id": "fac_13",
    "commune": "Xã Krông Bông",
    "name": "Cơ sở nuôi Ngô Thị Trang",
    "ownerName": "Ngô Thị Trang",
    "facilityName": "Cơ sở nuôi Ngô Thị Trang",
    "address": "Thôn 8, Xã Krông Bông, Tỉnh Đắk Lắk",
    "phone": "",
    "lat": 12.53985,
    "registrationDate": "2025-07-31",
    "purposeCode": "T",
    "updatedAt": "2026-10-18T15:21:37.459Z",
    "speciesList": [
      {
        "id": "sp_13_1",
        "purposeCode": "T",
        "scientificName": "Paradoxurus hermaphroditus",
        "citesAppendix": "Phụ lục II CITES",
        "baseline": {
          "otherFemale": 10,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2025-07-31",
          "father": 6,
          "otherMale": 7,
          "note": "Hiện trạng nuôi đăng ký",
          "mother": 7,
          "otherUnknown": 7
        },
        "vietnameseName": "Cầy vòi Hương",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "fluctuations": []
      }
    ],
    "registrationCode": "010-25/B-DLC"
  },
  {
    "name": "Cơ sở nuôi Hà Huy Thanh",
    "phone": "",
    "commune": "Xã Krông Bông",
    "facilityName": "Cơ sở nuôi Hà Huy Thanh",
    "note": "",
    "updatedAt": "2026-10-18T15:21:37.459Z",
    "id": "fac_14",
    "purposeCode": "T",
    "registrationCode": "18-26/B-DLC",
    "lng": 108.333327,
    "ownerName": "Hà Huy Thanh",
    "registrationDate": "2026-03-17",
    "speciesList": [
      {
        "purposeCode": "T",
        "vietnameseName": "Cầy vòi mốc",
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "note": "Hiện trạng nuôi đăng ký",
          "father": 5,
          "otherMale": 0,
          "otherUnknown": 0,
          "date": "2026-03-17",
          "otherFemale": 0,
          "mother": 23
        },
        "citesAppendix": "Phụ lục II CITES",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "fluctuations": [],
        "id": "sp_14_1",
        "scientificName": "Paguma larvata"
      },
      {
        "purposeCode": "T",
        "scientificName": "Rhizomys sumatrensis",
        "baseline": {
          "otherMale": 0,
          "date": "2026-01-01",
          "otherFemale": 0,
          "note": "Hiện trạng nuôi loài Dúi má đào",
          "mother": 34,
          "otherUnknown": 0,
          "father": 9,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông"
        },
        "group": "Động vật rừng thông thường",
        "citesAppendix": "Khai báo kiểm lâm",
        "vietnameseName": "Dúi má đào",
        "id": "sp_14_2",
        "fluctuations": []
      }
    ],
    "lat": 12.492108,
    "owner": "Hà Huy Thanh",
    "address": "TDP4, Xã Krông Bông, Tỉnh Đắk Lắk"
  },
  {
    "lng": 108.58051,
    "ownerName": "Trần Văn Tới",
    "owner": "Trần Văn Tới",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "purposeCode": "T",
    "note": "",
    "registrationCode": "52-26/B-DLC",
    "id": "fac_15",
    "name": "Cơ sở nuôi Trần Văn Tới",
    "commune": "xã Yang Mao",
    "speciesList": [
      {
        "id": "sp_15_1",
        "purposeCode": "T",
        "vietnameseName": "Dúi mốc lớn",
        "baseline": {
          "mother": 9,
          "father": 9,
          "otherFemale": 0,
          "otherMale": 0,
          "note": "Số lượng Dúi mốc lớn hiện có",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2023-11-02",
          "otherUnknown": 0
        },
        "group": "Động vật rừng thông thường",
        "citesAppendix": "Khai báo kiểm lâm",
        "fluctuations": [
          {
            "incOtherMale": 0,
            "id": "fluc_15_1",
            "incOtherFemale": 0,
            "decOtherMale": 0,
            "decOtherFemale": 0,
            "time": "20:31",
            "incFather": 0,
            "reason": "Sinh sản lứa F1 mới nở/sinh.",
            "decOtherUnknown": 0,
            "incOtherUnknown": 29,
            "date": "2024-04-30",
            "createdAt": 1714501860000,
            "incMother": 0,
            "decFather": 0,
            "verifier": "",
            "decMother": 0
          },
          {
            "decOtherUnknown": 0,
            "time": "18:10",
            "incOtherUnknown": 4,
            "incOtherFemale": 0,
            "incFather": 0,
            "decOtherFemale": 0,
            "verifier": "",
            "decOtherMale": 0,
            "id": "fluc_15_2",
            "date": "2024-10-21",
            "decMother": 0,
            "incMother": 0,
            "decFather": 0,
            "incOtherMale": 0,
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "createdAt": 1729534200000
          },
          {
            "decFather": 0,
            "incMother": 0,
            "decMother": 0,
            "createdAt": 1737534600000,
            "decOtherUnknown": 33,
            "time": "10:30",
            "incOtherUnknown": 0,
            "reason": "Xác định giới tính con con",
            "incOtherMale": 14,
            "incFather": 0,
            "incOtherFemale": 19,
            "id": "fluc_15_3",
            "decOtherMale": 0,
            "verifier": "",
            "date": "2025-01-22",
            "decOtherFemale": 0
          },
          {
            "decFather": 0,
            "incMother": 0,
            "decMother": 0,
            "createdAt": 1737545400000,
            "decOtherUnknown": 0,
            "date": "2025-01-22",
            "incOtherUnknown": 7,
            "verifier": "",
            "incFather": 0,
            "incOtherMale": 0,
            "incOtherFemale": 0,
            "id": "fluc_15_4",
            "time": "13:30",
            "decOtherMale": 0,
            "decOtherFemale": 0,
            "reason": "Sinh sản lứa F1 mới nở/sinh"
          },
          {
            "decFather": 0,
            "time": "09:00",
            "incMother": 0,
            "decMother": 0,
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "createdAt": 1750406400000,
            "decOtherMale": 0,
            "incOtherMale": 0,
            "incFather": 0,
            "id": "fluc_15_5",
            "incOtherFemale": 0,
            "date": "2025-06-20",
            "decOtherUnknown": 0,
            "verifier": "",
            "decOtherFemale": 0,
            "incOtherUnknown": 13
          },
          {
            "incFather": 13,
            "incOtherUnknown": 0,
            "reason": "Chuyển cá thể đực và cái đủ tuổi vào đàn bố mẹ.",
            "decOtherUnknown": 0,
            "date": "2025-10-06",
            "id": "fluc_15_6",
            "verifier": "",
            "decMother": 0,
            "decFather": 0,
            "incMother": 18,
            "createdAt": 1759778400000,
            "decOtherMale": 13,
            "decOtherFemale": 18,
            "incOtherMale": 0,
            "incOtherFemale": 0,
            "time": "19:20"
          },
          {
            "incOtherFemale": 12,
            "decFather": 0,
            "incMother": 0,
            "decMother": 0,
            "verifier": "",
            "createdAt": 1759786080000,
            "decOtherUnknown": 20,
            "decOtherFemale": 0,
            "time": "21:28",
            "id": "fluc_15_7",
            "incOtherUnknown": 0,
            "decOtherMale": 0,
            "incFather": 0,
            "reason": "Xác định giới tính con con",
            "incOtherMale": 8,
            "date": "2025-10-06"
          },
          {
            "verifier": "",
            "incFather": 0,
            "time": "07:00",
            "incOtherMale": 0,
            "createdAt": 1762326000000,
            "incOtherFemale": 0,
            "date": "2025-11-05",
            "decMother": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "id": "fluc_15_8",
            "incMother": 0,
            "decFather": 0,
            "decOtherMale": 0,
            "decOtherFemale": 0,
            "decOtherUnknown": 0,
            "incOtherUnknown": 25
          },
          {
            "incFather": 0,
            "incOtherMale": 0,
            "verifier": "",
            "decOtherFemale": 0,
            "reason": "Chết do thời tiết/bệnh lý",
            "incOtherUnknown": 0,
            "decOtherMale": 0,
            "date": "2025-11-10",
            "decOtherUnknown": 4,
            "incOtherFemale": 0,
            "incMother": 0,
            "decFather": 0,
            "decMother": 0,
            "id": "fluc_15_9",
            "createdAt": 1762761600000,
            "time": "08:00"
          },
          {
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "date": "2025-12-30",
            "incOtherUnknown": 18,
            "createdAt": 1767088800000,
            "incMother": 0,
            "decFather": 0,
            "decMother": 0,
            "decOtherUnknown": 0,
            "decOtherFemale": 0,
            "incOtherMale": 0,
            "incFather": 0,
            "time": "10:00",
            "incOtherFemale": 0,
            "decOtherMale": 0,
            "verifier": "",
            "id": "fluc_15_10"
          },
          {
            "verifier": "",
            "decOtherMale": 0,
            "incFather": 0,
            "incOtherFemale": 14,
            "reason": "Xác định giới tính con con",
            "incOtherUnknown": 0,
            "incOtherMale": 6,
            "time": "19:28",
            "decOtherUnknown": 20,
            "decOtherFemale": 0,
            "createdAt": 1767814080000,
            "decMother": 0,
            "decFather": 0,
            "incMother": 0,
            "date": "2026-01-07",
            "id": "fluc_15_11"
          },
          {
            "date": "2026-01-08",
            "decOtherMale": 15,
            "incFather": 15,
            "id": "fluc_15_12",
            "reason": "Chuyển c�� thể đực và cái đủ tuổi vào đàn bố mẹ.",
            "incOtherMale": 0,
            "verifier": "",
            "decOtherUnknown": 0,
            "createdAt": 1767858480000,
            "incOtherUnknown": 0,
            "decFather": 0,
            "incMother": 27,
            "time": "07:48",
            "decOtherFemale": 27,
            "decMother": 0,
            "incOtherFemale": 0
          },
          {
            "decOtherUnknown": 0,
            "incOtherUnknown": 28,
            "incOtherFemale": 0,
            "incFather": 0,
            "date": "2026-07-01",
            "decOtherFemale": 0,
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "incOtherMale": 0,
            "decMother": 0,
            "id": "fluc_15_13",
            "time": "13:30",
            "decFather": 0,
            "incMother": 0,
            "verifier": "",
            "createdAt": 1782912600000,
            "decOtherMale": 0
          },
          {
            "id": "fluc_15_14",
            "incFather": 0,
            "date": "2026-07-20",
            "decOtherMale": 0,
            "incOtherFemale": 6,
            "incOtherMale": 6,
            "decOtherFemale": 0,
            "reason": "Xác định giới tính con con",
            "verifier": "",
            "decFather": 0,
            "incMother": 0,
            "decMother": 0,
            "time": "07:30",
            "createdAt": 1784532600000,
            "decOtherUnknown": 12,
            "incOtherUnknown": 0
          },
          {
            "decOtherFemale": 0,
            "createdAt": 1785587400000,
            "date": "2026-08-01",
            "incOtherUnknown": 11,
            "incOtherMale": 0,
            "decMother": 0,
            "id": "fluc_15_15",
            "incMother": 0,
            "decFather": 0,
            "decOtherUnknown": 0,
            "incOtherFemale": 0,
            "decOtherMale": 0,
            "incFather": 0,
            "time": "12:30",
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "verifier": ""
          },
          {
            "incOtherUnknown": 0,
            "decOtherMale": 0,
            "decOtherUnknown": 2,
            "incOtherMale": 0,
            "decMother": 1,
            "incMother": 0,
            "decFather": 0,
            "createdAt": 1786906800000,
            "reason": "Chết do thời tiết/bệnh lý",
            "date": "2026-08-16",
            "id": "fluc_15_16",
            "verifier": "",
            "decOtherFemale": 0,
            "incFather": 0,
            "time": "19:00",
            "incOtherFemale": 0
          },
          {
            "time": "19:45",
            "incOtherFemale": 0,
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "decOtherMale": 0,
            "isGenderIdentifyMode": false,
            "incFather": 0,
            "decOtherFemale": 0,
            "incOtherMale": 0,
            "isPurchaseMode": false,
            "incOtherUnknown": 20,
            "verifier": "",
            "approvalStatus": "APPROVED",
            "decOtherUnknown": 0,
            "id": "fluc_1791031608601",
            "date": "2026-10-03",
            "purpose": "T",
            "decMother": 0,
            "incMother": 0,
            "decFather": 0,
            "createdAt": 1791031608601
          },
          {
            "verifier": "",
            "approvalStatus": "APPROVED",
            "time": "19:51",
            "isGenderIdentifyMode": false,
            "id": "fluc_1792327999641",
            "decOtherUnknown": 0,
            "incFather": 0,
            "incOtherUnknown": 0,
            "date": "2026-10-06",
            "incOtherMale": 0,
            "incOtherFemale": 0,
            "decOtherFemale": 0,
            "reason": "Tặng cho/chuyển nhượng theo quyết định",
            "createdAt": 1792327999641,
            "decOtherMale": 0,
            "decMother": 20,
            "incMother": 0,
            "decFather": 20,
            "purpose": "T",
            "isPurchaseMode": false
          },
          {
            "incFather": 0,
            "isPurchaseMode": false,
            "time": "20:03",
            "decOtherFemale": 0,
            "reason": "Xác định giới tính con con",
            "id": "fluc_1792329025484",
            "incOtherFemale": 17,
            "purpose": "T",
            "decMother": 0,
            "decFather": 0,
            "incMother": 0,
            "date": "2026-10-18",
            "createdAt": 1792329025484,
            "decOtherMale": 0,
            "approvalStatus": "PENDING",
            "isGenderIdentifyMode": true,
            "decOtherUnknown": 41,
            "verifier": "",
            "incOtherUnknown": 0,
            "incOtherMale": 24
          }
        ],
        "scientificName": "Rhizomys pruinosus"
      }
    ],
    "registrationDate": "2023-11-02",
    "facilityName": "Cơ sở nuôi Trần Văn Tới",
    "address": "Thôn 1, xã Yang Mao, Tỉnh Đắk Lắk",
    "phone": "",
    "lat": 12.477054
  },
  {
    "id": "fac_16",
    "owner": "Lê Đình Tâm",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "facilityName": "Cơ sở nuôi Lê Đình Tâm",
    "speciesList": [
      {
        "vietnameseName": "Dúi mốc lớn",
        "citesAppendix": "Khai báo kiểm lâm",
        "purposeCode": "T",
        "fluctuations": [],
        "id": "sp_16_1",
        "baseline": {
          "note": "Số lượng Dúi mốc lớn hiện có",
          "mother": 2,
          "date": "2026-01-01",
          "otherFemale": 6,
          "otherUnknown": 0,
          "otherMale": 4,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 2
        },
        "group": "Động vật rừng thông thường",
        "scientificName": "Rhizomys pruinosus"
      }
    ],
    "address": "Thôn Cư Drăm, xã Yang Mao, Tỉnh Đắk Lắk",
    "ownerName": "Lê Đình Tâm",
    "note": "",
    "lat": 12.487572,
    "name": "Cơ sở nuôi Lê Đình Tâm",
    "purposeCode": "T",
    "commune": "xã Yang Mao",
    "registrationCode": "Đang cập nhật",
    "lng": 108.551582,
    "phone": "",
    "registrationDate": ""
  },
  {
    "facilityName": "Cơ sở nuôi Nguyễn Kim Danh",
    "ownerName": "Nguyễn Kim Danh",
    "lat": 12.462085,
    "phone": "",
    "commune": "xã Yang Mao",
    "speciesList": [
      {
        "vietnameseName": "Dúi mốc lớn",
        "fluctuations": [],
        "group": "Động vật rừng thông thường",
        "baseline": {
          "mother": 10,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 2,
          "date": "2026-01-01",
          "otherMale": 0,
          "otherUnknown": 0,
          "note": "Số lượng Dúi mốc lớn hiện có",
          "otherFemale": 0
        },
        "id": "sp_17_1",
        "purposeCode": "T",
        "scientificName": "Rhizomys pruinosus",
        "citesAppendix": "Khai báo kiểm lâm"
      }
    ],
    "purposeCode": "T",
    "id": "fac_17",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "address": "Buôn Tul, xã Yang Mao, Tỉnh Đ��k Lắk",
    "owner": "Nguyễn Kim Danh",
    "registrationCode": "Đang cập nhật",
    "name": "Cơ sở nuôi Nguyễn Kim Danh",
    "lng": 108.560116,
    "registrationDate": "",
    "note": ""
  },
  {
    "lng": 108.455555,
    "note": "",
    "facilityName": "Nguyễn Lĩnh",
    "owner": "Nguyễn Lĩnh",
    "name": "Nguyễn Lĩnh",
    "commune": "xã Cư Pui",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "ownerName": "Nguyễn Lĩnh",
    "registrationCode": "141-26/B-DLC",
    "registrationDate": "2026-07-24",
    "phone": "0866100652",
    "lat": 12.547587,
    "purposeCode": "T",
    "id": "fac_1786163645775",
    "address": "thôn 3, xã Cư Pui, tỉnh Đắk Lắk.",
    "speciesList": [
      {
        "id": "sp_1786163645775_1",
        "scientificName": "Paradoxurus hermaphroditus",
        "baseline": {
          "mother": 3,
          "otherMale": 0,
          "date": "2026-07-24",
          "note": "Hiện trạng đăng ký ban đầu",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherFemale": 0,
          "otherUnknown": 0,
          "father": 1
        },
        "purposeCode": "T",
        "fluctuations": [
          {
            "decOtherMale": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "isPurchaseMode": false,
            "decOtherFemale": 0,
            "decMother": 0,
            "verifier": "",
            "id": "fluc_1786163683953",
            "time": "11:34",
            "decFather": 0,
            "incMother": 0,
            "incOtherMale": 0,
            "createdAt": 1786163683953,
            "incOtherFemale": 0,
            "decOtherUnknown": 0,
            "incOtherUnknown": 5,
            "incFather": 0,
            "purpose": "T",
            "date": "2026-07-20"
          }
        ],
        "vietnameseName": "Cầy vòi Hương",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "citesAppendix": "Phụ lục II CITES"
      }
    ]
  },
  {
    "commune": "Xã Dang Kang",
    "lng": 108.321947,
    "facilityName": "Nguyễn Hoàng Dũng",
    "owner": "Nguyễn Hoàng Dũng",
    "lat": 12.558599,
    "speciesList": [
      {
        "fluctuations": [
          {
            "incOtherFemale": 5,
            "date": "2026-08-11",
            "id": "fluc_1786419778624",
            "incOtherUnknown": 0,
            "decOtherFemale": 0,
            "isPurchaseMode": true,
            "incFather": 0,
            "decOtherUnknown": 0,
            "verifier": "",
            "reason": "Mua từ cơ sở nuôi sinh sản khác",
            "incOtherMale": 0,
            "time": "10:42",
            "createdAt": 1786419778624,
            "purpose": "T",
            "decMother": 0,
            "decOtherMale": 0,
            "decFather": 0,
            "incMother": 0
          }
        ],
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "scientificName": "Paradoxurus hermaphroditus",
        "baseline": {
          "otherMale": 0,
          "father": 2,
          "note": "Hiện trạng đăng ký ban đầu",
          "otherFemale": 0,
          "date": "2026-07-24",
          "otherUnknown": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 40
        },
        "vietnameseName": "Cầy vòi Hương",
        "id": "sp_1786419630740_1",
        "purposeCode": "T",
        "citesAppendix": "Phụ lục II CITES"
      },
      {
        "baseline": {
          "date": "2026-07-24",
          "note": "Số lượng vật nuôi hiện có ban đầu",
          "verifier": "",
          "otherUnknown": 0,
          "father": "4",
          "mother": "13",
          "otherFemale": 0,
          "otherMale": 0
        },
        "vietnameseName": "Cầy vòi mốc",
        "purposeCode": "T",
        "id": "species_1786419708326",
        "citesAppendix": "Phụ lục II CITES",
        "scientificName": "Paguma larvata",
        "fluctuations": [],
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)"
      }
    ],
    "purposeCode": "T",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "name": "Nguyễn Hoàng Dũng",
    "id": "fac_1786419630740",
    "ownerName": "Nguyễn Hoàng Dũng",
    "registrationDate": "2026-01-24",
    "address": "thôn 6, xã Dang Kang, tỉnh Đắk Lắk",
    "phone": "0342017979",
    "note": "",
    "registrationCode": "142-26/B-DLC"
  },
  {
    "owner": "Phạm Duy Thắng",
    "commune": "Xã Krông Bông",
    "purposeCode": "T",
    "speciesList": [
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "id": "sp_1786432202893_1",
        "vietnameseName": "Dúi mốc lớn",
        "fluctuations": [
          {
            "verifier": "",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "time": "00:02",
            "id": "fluc_1786468153021",
            "incFather": 0,
            "isPurchaseMode": false,
            "incOtherMale": 0,
            "decOtherFemale": 0,
            "date": "2026-07-08",
            "decOtherUnknown": 0,
            "createdAt": 1786467765630,
            "purpose": "T",
            "decOtherMale": 0,
            "decMother": 0,
            "incOtherUnknown": 6,
            "incMother": 0,
            "decFather": 0,
            "incOtherFemale": 0
          },
          {
            "decOtherUnknown": 0,
            "reason": "sinh san F2",
            "incOtherUnknown": 4,
            "decOtherMale": 0,
            "incOtherFemale": 0,
            "date": "2026-08-12",
            "createdAt": 1786505722932,
            "isPurchaseMode": false,
            "decMother": 0,
            "incOtherMale": 0,
            "decOtherFemale": 0,
            "decFather": 0,
            "incMother": 0,
            "time": "10:34",
            "verifier": "",
            "id": "fluc_1786518690491",
            "purpose": "T",
            "incFather": 0
          },
          {
            "time": "10:34",
            "verifier": "",
            "incFather": 0,
            "id": "fluc_1786518706173",
            "decOtherMale": 0,
            "decOtherFemale": 0,
            "isPurchaseMode": false,
            "date": "2026-08-12",
            "purpose": "T",
            "decMother": 0,
            "incOtherFemale": 0,
            "reason": "sinh san F2",
            "decFather": 0,
            "incMother": 0,
            "incOtherUnknown": 4,
            "incOtherMale": 0,
            "createdAt": 1786505722932,
            "decOtherUnknown": 0
          }
        ],
        "scientificName": "Rhizomys pruinosus",
        "baseline": {
          "mother": 4,
          "note": "Hi��n trạng đăng ký ban đầu",
          "otherFemale": 0,
          "date": "2026-06-17",
          "otherUnknown": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 2,
          "otherMale": 0
        },
        "purposeCode": "T",
        "group": "Động vật rừng thông thường"
      }
    ],
    "ownerName": "Phạm Duy Thắng",
    "lat": 12.520837,
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "facilityName": "Phạm Duy Thắng",
    "phone": "",
    "registrationDate": "2026-08-11",
    "name": "Phạm Duy Thắng",
    "id": "fac_1786432202893",
    "registrationCode": "Chưa có mã số",
    "note": "",
    "address": "Thôn 23",
    "lng": 108.394137
  },
  {
    "speciesList": [
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "vietnameseName": "Dúi mốc lớn",
        "fluctuations": [
          {
            "incOtherUnknown": 32,
            "incFather": 0,
            "id": "fluc_1786504203858",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decOtherUnknown": 0,
            "time": "10:09",
            "incOtherMale": 38,
            "isPurchaseMode": false,
            "incMother": 0,
            "decFather": 0,
            "decMother": 0,
            "decOtherFemale": 0,
            "createdAt": 1786504203858,
            "decOtherMale": 0,
            "purpose": "T",
            "verifier": "",
            "incOtherFemale": 53,
            "date": "2026-08-12"
          }
        ],
        "group": "Động vật rừng thông thường",
        "purposeCode": "T",
        "scientificName": "Rhizomys pruinosus",
        "baseline": {
          "otherUnknown": 0,
          "otherFemale": 0,
          "note": "Hiện trạng đăng ký ban đầu",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2025-11-12",
          "father": 10,
          "mother": 30,
          "otherMale": 0
        },
        "id": "sp_1786504114807_1"
      }
    ],
    "lat": "12.575576",
    "purposeCode": "T",
    "owner": "Nguyễn Kim Tuấn",
    "id": "fac_1786504114807",
    "facilityName": "Nguyễn Kim Tuấn",
    "commune": "Xã Dang Kang",
    "name": "Nguyễn Kim Tuấn",
    "registrationCode": "Chưa có mã số",
    "registrationDate": "2025-11-12",
    "address": "Thôn 6 xã Dang Kang",
    "note": "",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "lng": "108.338165",
    "phone": "",
    "ownerName": "Nguyễn Kim Tuấn"
  },
  {
    "speciesList": [
      {
        "purposeCode": "T",
        "id": "sp_1787585236556_1",
        "fluctuations": [],
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Pycnonotus jocosus",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "baseline": {
          "otherUnknown": 0,
          "date": "2026-05-25",
          "mother": 1,
          "note": "Hiện trạng đăng ký ban đầu",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 1,
          "otherMale": 0,
          "otherFemale": 0
        },
        "vietnameseName": "Chim Chào mào"
      }
    ],
    "id": "fac_1787585236556",
    "address": "",
    "lat": "12.532135",
    "purposeCode": "T",
    "phone": "",
    "facilityName": "Nguyễn Hữu Lưu",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "name": "Nguyễn Hữu Lưu",
    "note": "",
    "owner": "Nguyễn Hữu Lưu",
    "registrationDate": "2026-05-25",
    "registrationCode": "Chưa có mã số",
    "lng": "108.431876",
    "ownerName": "Nguyễn Hữu Lưu",
    "commune": "xã Cư Pui"
  },
  {
    "phone": "",
    "address": "",
    "lat": 12.492318,
    "ownerName": "Nguyễn Tâm Châu",
    "facilityName": "Nguyễn Tâm Châu",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "registrationCode": "Chưa có mã số",
    "registrationDate": "2026-06-27",
    "id": "fac_1787793901636",
    "owner": "Nguyễn Tâm Châu",
    "name": "Nguyễn Tâm Châu",
    "note": "",
    "commune": "xã Hòa Sơn",
    "speciesList": [
      {
        "vietnameseName": "Chim Chào mào",
        "purposeCode": "T",
        "citesAppendix": "Khai báo kiểm lâm",
        "id": "sp_1787793901636_1",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "fluctuations": [],
        "scientificName": "Pycnonotus jocosus",
        "baseline": {
          "date": "2026-06-27",
          "note": "Hiện trạng đăng ký ban đầu",
          "otherMale": 0,
          "otherFemale": 0,
          "father": 0,
          "mother": 0,
          "otherUnknown": 2,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông"
        }
      }
    ],
    "lng": 108.324298,
    "purposeCode": "T"
  },
  {
    "name": "Nguyễn Thanh ",
    "lat": 12.495249,
    "owner": "Nguyễn Thanh ",
    "note": "",
    "purposeCode": "T",
    "speciesList": [
      {
        "vietnameseName": "Chim Cu gáy",
        "baseline": {
          "mother": 0,
          "note": "Hiện trạng đăng ký ban đầu",
          "otherUnknown": 2,
          "date": "2026-07-27",
          "father": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 1,
          "otherFemale": 1
        },
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "fluctuations": [],
        "purposeCode": "T",
        "id": "sp_1787794070148_1",
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Streptopelia chinensis"
      }
    ],
    "commune": "xã Hòa Sơn",
    "registrationCode": "Chưa có mã số",
    "phone": "",
    "facilityName": "Nguyễn Thanh ",
    "registrationDate": "2026-07-27",
    "ownerName": "Nguyễn Thanh ",
    "address": "Thôn 2",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "lng": 108.294381,
    "id": "fac_1787794070148"
  },
  {
    "registrationCode": "Chưa có mã số",
    "id": "fac_1787794146413",
    "commune": "xã Hòa Sơn",
    "registrationDate": "2026-07-27",
    "owner": "Trần Văn Ngọ",
    "lat": 12.492941,
    "purposeCode": "T",
    "note": "",
    "speciesList": [
      {
        "id": "sp_1787794146413_1",
        "scientificName": "Pycnonotus jocosus",
        "fluctuations": [],
        "purposeCode": "T",
        "baseline": {
          "otherFemale": 0,
          "mother": 0,
          "otherUnknown": 4,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 0,
          "date": "2026-07-27",
          "father": 0,
          "note": "Hiện trạng đăng ký ban đầu"
        },
        "vietnameseName": "Chim Chào mào",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "citesAppendix": "Khai báo kiểm lâm"
      },
      {
        "purposeCode": "T",
        "vietnameseName": "Chim Cu gáy",
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "scientificName": "Streptopelia chinensis",
        "baseline": {
          "otherMale": "1",
          "otherFemale": "1",
          "mother": 0,
          "father": 0,
          "date": "2026-06-29",
          "verifier": "",
          "otherUnknown": 0,
          "note": "Số lượng vật nuôi hiện có ban đầu"
        },
        "fluctuations": [],
        "id": "species_1790753399574"
      }
    ],
    "lng": 108.32352,
    "facilityName": "Trần Văn Ngọ",
    "name": "Trần Văn Ngọ",
    "ownerName": "Trần Văn Ngọ",
    "address": "Thôn 9 Hòa Sơn",
    "phone": "",
    "updatedAt": "2026-10-18T15:21:37.460Z"
  },
  {
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "registrationDate": "2026-08-27",
    "commune": "xã Hòa Sơn",
    "phone": "0948861157",
    "registrationCode": "Chưa có mã số",
    "note": "Đang cập nhập",
    "lat": 12.490722,
    "name": "Nguyễn Duy Thông",
    "ownerName": "Nguyễn Duy Thông",
    "id": "fac_1787794338130",
    "speciesList": [
      {
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "citesAppendix": "Khai báo kiểm lâm",
        "purposeCode": "T",
        "vietnameseName": "Chim Chào mào",
        "id": "sp_1787794338130_1",
        "scientificName": "Pycnonotus jocosus",
        "baseline": {
          "date": "2026-08-27",
          "note": "Hiện trạng đăng ký ban đầu",
          "otherFemale": "0",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 2,
          "mother": 2,
          "otherUnknown": 10,
          "otherMale": 0
        },
        "fluctuations": []
      },
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "otherFemale": "2",
          "verifier": "",
          "father": 0,
          "date": "2026-09-07",
          "otherUnknown": 0,
          "note": "Số lượng vật nuôi hiện có ban đầu",
          "otherMale": "2",
          "mother": 0
        },
        "id": "species_1788765271274",
        "vietnameseName": "Chim Cu gáy",
        "fluctuations": [],
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "scientificName": "Streptopelia chinensis",
        "purposeCode": "T"
      }
    ],
    "purposeCode": "T",
    "lng": 108.315073,
    "owner": "Nguyễn Duy Thông",
    "facilityName": "Nguyễn Duy Thông",
    "address": "thôn 9, xã Hoà Sơn, tỉnh Đắk Lắk0948861157"
  },
  {
    "name": "Vũ Hoàng Tân",
    "phone": "0337825861",
    "lat": 12.500922,
    "note": "",
    "ownerName": "Vũ Hoàng Tân",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "commune": "xã Hòa Sơn",
    "facilityName": "Vũ Hoàng Tân",
    "registrationDate": "2026-08-27",
    "owner": "Vũ Hoàng Tân",
    "address": "Thôn 10",
    "registrationCode": "Chưa có mã số",
    "purposeCode": "T",
    "lng": 108.322735,
    "id": "fac_1787795701427",
    "speciesList": [
      {
        "scientificName": "Pycnonotus jocosus",
        "purposeCode": "T",
        "baseline": {
          "father": 0,
          "otherFemale": 0,
          "otherUnknown": 2,
          "date": "2026-08-27",
          "note": "Hiện trạng đăng ký ban đầu",
          "otherMale": 0,
          "mother": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông"
        },
        "fluctuations": [],
        "vietnameseName": "Chim Chào mào",
        "id": "sp_1787795701427_1",
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường (Lớp Chim)"
      }
    ]
  },
  {
    "owner": "Nguyễn Văn Vinh",
    "name": "Nguyễn Văn Vinh",
    "registrationDate": "2026-10-05",
    "facilityName": "Nguyễn Văn Vinh",
    "registrationCode": "Chưa có mã số",
    "note": "",
    "commune": "xã Hòa Sơn",
    "lng": 108.322383,
    "id": "fac_1791188880545",
    "phone": "0988.257.586",
    "address": "thôn 10, xã Hoà Sơn, tỉnh Đắk Lắk",
    "lat": 12.49798,
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "speciesList": [
      {
        "scientificName": "Rhizomys pruinosus",
        "purposeCode": "T",
        "citesAppendix": "Khai báo kiểm lâm",
        "fluctuations": [],
        "group": "Động vật rừng thông thường",
        "baseline": {
          "mother": 6,
          "otherFemale": 66,
          "date": "2026-10-05",
          "otherMale": 42,
          "note": "Hiện trạng đăng ký ban đầu",
          "otherUnknown": 40,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 6
        },
        "vietnameseName": "Dúi mốc lớn",
        "id": "sp_1791188880545_1"
      }
    ],
    "ownerName": "Nguyễn Văn Vinh",
    "purposeCode": "T"
  },
  {
    "ownerName": "Lê Quang Mạnh",
    "speciesList": [
      {
        "vietnameseName": "Dúi má đào",
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường",
        "id": "sp_18_1",
        "fluctuations": [],
        "scientificName": "Rhizomys sumatrensis",
        "purposeCode": "T",
        "baseline": {
          "mother": 4,
          "otherFemale": 12,
          "otherUnknown": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "note": "Số lượng Dúi má đào hiện có",
          "father": 3,
          "date": "2026-01-01",
          "otherMale": 10
        }
      },
      {
        "id": "sp_18_2",
        "baseline": {
          "father": 19,
          "otherFemale": 15,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherUnknown": 58,
          "otherMale": 17,
          "date": "2026-01-01",
          "note": "Số lượng Dúi mốc lớn hiện có",
          "mother": 61
        },
        "scientificName": "Rhizomys pruinosus",
        "group": "Động vật rừng thông thường",
        "citesAppendix": "Khai báo kiểm lâm",
        "purposeCode": "T",
        "vietnameseName": "Dúi mốc lớn",
        "fluctuations": []
      }
    ],
    "lng": 108.423608,
    "purposeCode": "T",
    "phone": "",
    "facilityName": "Cơ sở nuôi Lê Quang Mạnh",
    "registrationDate": "",
    "address": "Thôn 29, Xã Krông Bông, Tỉnh Đắk Lắk",
    "registrationCode": "Đang cập nhật",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "id": "fac_18",
    "commune": "Xã Krông Bông",
    "owner": "Lê Quang Mạnh",
    "note": "",
    "lat": 12.526903,
    "name": "Cơ sở nuôi Lê Quang Mạnh"
  },
  {
    "lat": 12.528051,
    "speciesList": [
      {
        "purposeCode": "T",
        "scientificName": "Rhizomys pruinosus",
        "fluctuations": [],
        "group": "Động vật rừng thông thường",
        "vietnameseName": "Dúi mốc lớn",
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "otherFemale": 0,
          "otherUnknown": 0,
          "mother": 15,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 10,
          "note": "Số lượng Dúi mốc lớn hiện có",
          "otherMale": 0,
          "date": "2026-01-01"
        },
        "id": "sp_19_1"
      }
    ],
    "purposeCode": "T",
    "owner": "Nguyễn Trương Đắc Nam",
    "address": "Thôn 9, Xã Krông Bông, Tỉnh Đắk Lắk",
    "id": "fac_19",
    "facilityName": "Cơ sở nuôi Nguy���n Trương Đắc Nam",
    "ownerName": "Nguyễn Trương Đắc Nam",
    "phone": "",
    "name": "Cơ sở nuôi Nguyễn Trương Đắc Nam",
    "registrationDate": "",
    "lng": 108.328497,
    "note": "",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "registrationCode": "Đang cập nhật",
    "commune": "Xã Krông Bông"
  },
  {
    "commune": "xã Hòa Sơn",
    "lat": 12.491634,
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "phone": "",
    "ownerName": "Nguyễn Văn Thúy",
    "registrationCode": "IIB-C-DLC-028",
    "owner": "Nguyễn Văn Thúy",
    "registrationDate": "2023-04-17",
    "speciesList": [
      {
        "purposeCode": "T",
        "id": "sp_2_1",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "fluctuations": [
          {
            "incOtherMale": 2,
            "isPurchaseMode": false,
            "date": "2026-06-13",
            "decOtherFemale": 0,
            "isGenderIdentifyMode": true,
            "id": "fluc_1792335832088",
            "decOtherMale": 0,
            "createdAt": 1792335832088,
            "decFather": 0,
            "incMother": 0,
            "incOtherFemale": 1,
            "decMother": 0,
            "incOtherUnknown": 0,
            "time": "22:03",
            "purpose": "T",
            "decOtherUnknown": 3,
            "verifier": "",
            "approvalStatus": "APPROVED",
            "reason": "Xác định giới tính con con",
            "incFather": 0
          },
          {
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decOtherMale": 0,
            "decMother": 0,
            "incMother": 0,
            "decFather": 0,
            "createdAt": 1792335872475,
            "date": "2026-06-13",
            "incOtherUnknown": 17,
            "incOtherMale": 0,
            "approvalStatus": "APPROVED",
            "decOtherUnknown": 0,
            "verifier": "",
            "incFather": 0,
            "isGenderIdentifyMode": false,
            "isPurchaseMode": false,
            "time": "22:03",
            "decOtherFemale": 0,
            "purpose": "T",
            "id": "fluc_1792335872475",
            "incOtherFemale": 0
          },
          {
            "decFather": 0,
            "incMother": 0,
            "decMother": 0,
            "createdAt": 1792336162817,
            "approvalStatus": "APPROVED",
            "date": "2026-07-06",
            "isGenderIdentifyMode": true,
            "isPurchaseMode": false,
            "reason": "Xác định giới tính con con",
            "incFather": 0,
            "purpose": "T",
            "incOtherMale": 5,
            "decOtherFemale": 0,
            "id": "fluc_1792336162817",
            "time": "22:08",
            "incOtherUnknown": 0,
            "verifier": "",
            "decOtherMale": 0,
            "decOtherUnknown": 17,
            "incOtherFemale": 12
          },
          {
            "createdAt": 1792336180572,
            "decMother": 0,
            "isGenderIdentifyMode": false,
            "decOtherMale": 0,
            "incMother": 0,
            "decFather": 0,
            "purpose": "T",
            "time": "22:09",
            "approvalStatus": "APPROVED",
            "incOtherMale": 0,
            "verifier": "",
            "id": "fluc_1792336180572",
            "decOtherFemale": 0,
            "decOtherUnknown": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "incFather": 0,
            "isPurchaseMode": false,
            "incOtherUnknown": 4,
            "incOtherFemale": 0,
            "date": "2026-10-18"
          },
          {
            "time": "22:10",
            "incFather": 0,
            "decOtherUnknown": 0,
            "incOtherUnknown": 0,
            "purpose": "T",
            "approvalStatus": "APPROVED",
            "id": "fluc_1792336234681",
            "decFather": 0,
            "incMother": 0,
            "decOtherFemale": 7,
            "decMother": 0,
            "isPurchaseMode": false,
            "date": "2026-10-16",
            "incOtherMale": 0,
            "createdAt": 1792336234681,
            "incOtherFemale": 0,
            "reason": "Chết do thời tiết/bệnh lý",
            "isGenderIdentifyMode": false,
            "decOtherMale": 3,
            "verifier": ""
          }
        ],
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "citesAppendix": "Phụ lục II CITES",
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 2,
          "otherFemale": 7,
          "note": "Số lượng vật nuôi đăng ký",
          "otherUnknown": 3,
          "date": "2025-12-30",
          "mother": 3,
          "otherMale": 6
        }
      }
    ],
    "name": "Cơ sở nuôi Nguyễn Văn Thúy",
    "address": "Thôn Quảng Đông, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "lng": 108.297682,
    "facilityName": "Cơ sở nuôi Nguyễn Văn Thúy",
    "id": "fac_2",
    "note": "",
    "purposeCode": "T"
  },
  {
    "speciesList": [
      {
        "purposeCode": "T",
        "id": "sp_20_1",
        "baseline": {
          "otherMale": 6,
          "mother": 26,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 4,
          "otherFemale": 8,
          "note": "Số lượng Dúi má đào hiện có",
          "otherUnknown": 11,
          "date": "2026-01-01"
        },
        "scientificName": "Rhizomys sumatrensis",
        "group": "Động vật rừng thông thường",
        "fluctuations": [],
        "vietnameseName": "Dúi má đào",
        "citesAppendix": "Khai báo kiểm lâm"
      }
    ],
    "registrationDate": "",
    "lat": 12.58438,
    "purposeCode": "T",
    "commune": "Xã Dang Kang",
    "registrationCode": "Đang cập nhật",
    "facilityName": "Cơ sở nuôi Trần Văn Lực",
    "phone": "",
    "id": "fac_20",
    "ownerName": "Trần Văn Lực",
    "name": "Cơ sở nuôi Trần Văn Lực",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "address": "Buôn Cư Ênun A, Xã Dang Kang, Tỉnh Đắk Lắk",
    "owner": "Trần Văn Lực",
    "lng": 108.315384,
    "note": ""
  },
  {
    "id": "fac_21",
    "lat": 12.619158,
    "ownerName": "Đinh Tiến Toàn",
    "address": "Thôn 3, Xã Dang Kang, Tỉnh Đắk Lắk",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "name": "Cơ sở nuôi Đinh Tiến Toàn",
    "owner": "Đinh Tiến Toàn",
    "note": "",
    "purposeCode": "T",
    "commune": "Xã Dang Kang",
    "speciesList": [
      {
        "fluctuations": [],
        "scientificName": "Rhizomys pruinosus",
        "group": "Động vật rừng thông thường",
        "id": "sp_21_1",
        "vietnameseName": "Dúi mốc lớn",
        "purposeCode": "T",
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "otherMale": 0,
          "father": 10,
          "otherFemale": 0,
          "otherUnknown": 0,
          "date": "2026-01-01",
          "mother": 10,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "note": "Số lượng Dúi mốc lớn hiện có"
        }
      }
    ],
    "registrationDate": "",
    "phone": "",
    "facilityName": "Cơ sở nuôi Đinh Tiến Toàn",
    "registrationCode": "Đang cập nhật",
    "lng": 108.339096
  },
  {
    "speciesList": [
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "id": "sp_22_1",
        "vietnameseName": "Chim Cu gáy",
        "baseline": {
          "date": "2026-01-01",
          "otherUnknown": 0,
          "note": "Số lượng Chim Cu gáy nuôi",
          "mother": 1,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 0,
          "father": 1,
          "otherFemale": 0
        },
        "scientificName": "Streptopelia chinensis",
        "fluctuations": [],
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "purposeCode": "T"
      }
    ],
    "owner": "Nguyễn Thanh",
    "commune": "xã Hòa Sơn",
    "purposeCode": "T",
    "id": "fac_22",
    "note": "",
    "phone": "",
    "facilityName": "Cơ sở nuôi Nguyễn Thanh",
    "name": "Cơ sở nuôi Nguyễn Thanh",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "registrationCode": "Đang cập nhật",
    "ownerName": "Nguyễn Thanh",
    "registrationDate": "",
    "address": "Thôn 2, xã Hòa Sơn, Tỉnh Đắk Lắk"
  },
  {
    "facilityName": "Cơ sở nuôi Huỳnh Phúc Lợi",
    "commune": "xã Hòa Sơn",
    "note": "Làm cảnh",
    "name": "Cơ sở nuôi Huỳnh Phúc Lợi",
    "owner": "Huỳnh Phúc Lợi",
    "ownerName": "Huỳnh Phúc Lợi",
    "purposeCode": "O",
    "registrationCode": "Đang cập nhật",
    "address": "Thôn 2, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "id": "fac_23",
    "speciesList": [
      {
        "fluctuations": [],
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "id": "sp_23_1",
        "vietnameseName": "Chim Chào mào",
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 3,
          "note": "Số lượng Chim Chào mào nuôi cảnh",
          "date": "2026-01-01",
          "otherMale": 0,
          "otherUnknown": 0,
          "mother": 0,
          "otherFemale": 0
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Pycnonotus jocosus",
        "purposeCode": "O"
      }
    ],
    "registrationDate": "",
    "phone": ""
  },
  {
    "registrationDate": "",
    "note": "",
    "phone": "",
    "registrationCode": "Đang cập nhật",
    "name": "Cơ sở nuôi Phan Thanh Trúc",
    "address": "Thôn 4, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "facilityName": "Cơ sở nuôi Phan Thanh Trúc",
    "commune": "xã Hòa Sơn",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "owner": "Phan Thanh Trúc",
    "speciesList": [
      {
        "scientificName": "Pycnonotus jocosus",
        "baseline": {
          "otherMale": 0,
          "father": 5,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-01-01",
          "mother": 5,
          "note": "Số lượng Chim Chào mào nuôi",
          "otherFemale": 0,
          "otherUnknown": 0
        },
        "purposeCode": "T",
        "fluctuations": [],
        "id": "sp_24_1",
        "vietnameseName": "Chim Chào mào",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "citesAppendix": "Khai báo kiểm lâm"
      }
    ],
    "id": "fac_24",
    "purposeCode": "T",
    "ownerName": "Phan Thanh Trúc"
  },
  {
    "registrationDate": "",
    "note": "",
    "facilityName": "Cơ sở nuôi Thái Hồng Sơn",
    "id": "fac_25",
    "address": "Thôn 4, Xã Krông Bông, Tỉnh Đắk Lắk",
    "registrationCode": "Đang cập nhật",
    "lng": 108.333624,
    "name": "Cơ sở nuôi Thái Hồng Sơn",
    "phone": "",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "ownerName": "Thái Hồng Sơn",
    "purposeCode": "T",
    "owner": "Thái Hồng Sơn",
    "lat": 12.502961,
    "commune": "Xã Krông Bông",
    "speciesList": [
      {
        "baseline": {
          "father": 5,
          "otherMale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherUnknown": 0,
          "otherFemale": 0,
          "note": "Số lượng Chim Chào mào nuôi",
          "mother": 5,
          "date": "2026-01-01"
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "id": "sp_25_1",
        "purposeCode": "T",
        "vietnameseName": "Chim Chào mào",
        "scientificName": "Pycnonotus jocosus",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "fluctuations": []
      }
    ]
  },
  {
    "owner": "Nguyễn Trí",
    "note": "",
    "lng": 108.336714,
    "name": "Cơ sở nuôi Nguyễn Trí",
    "speciesList": [
      {
        "fluctuations": [],
        "vietnameseName": "Chim Cu gáy",
        "purposeCode": "T",
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "baseline": {
          "otherUnknown": 0,
          "mother": 11,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherFemale": 1,
          "father": 11,
          "date": "2026-01-01",
          "otherMale": 1,
          "note": "Số lượng Chim Cu gáy nuôi"
        },
        "scientificName": "Streptopelia chinensis",
        "id": "sp_26_1"
      }
    ],
    "commune": "Xã Krông Bông",
    "purposeCode": "T",
    "facilityName": "Cơ sở nuôi Nguyễn Trí",
    "id": "fac_26",
    "phone": "",
    "address": "Thôn 7, Xã Krông Bông, Tỉnh Đắk Lắk",
    "ownerName": "Nguyễn Trí",
    "registrationCode": "Đang cập nhật",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "lat": 12.523945,
    "registrationDate": ""
  },
  {
    "registrationCode": "Đang cập nhật",
    "owner": "Nguyễn Văn Hòa",
    "id": "fac_27",
    "registrationDate": "",
    "address": "Thôn 2, Xã Krông Bông, Tỉnh Đắk Lắk",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "commune": "Xã Krông Bông",
    "purposeCode": "T",
    "speciesList": [
      {
        "baseline": {
          "date": "2026-01-01",
          "otherFemale": 0,
          "otherUnknown": 0,
          "father": 2,
          "note": "Số lượng Chim Chào mào nuôi",
          "otherMale": 0,
          "mother": 2,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông"
        },
        "fluctuations": [],
        "scientificName": "Pycnonotus jocosus",
        "id": "sp_27_1",
        "vietnameseName": "Chim Chào mào",
        "citesAppendix": "Khai báo kiểm lâm",
        "purposeCode": "T",
        "group": "Động vật rừng thông thường (Lớp Chim)"
      }
    ],
    "phone": "",
    "facilityName": "Cơ sở nuôi Nguyễn Văn Hòa",
    "name": "Cơ sở nuôi Nguyễn Văn Hòa",
    "ownerName": "Nguyễn Văn Hòa",
    "note": ""
  },
  {
    "ownerName": "Trần Văn Hà",
    "registrationCode": "Đang cập nhật",
    "id": "fac_28",
    "registrationDate": "",
    "facilityName": "Cơ sở nuôi Trần Văn Hà",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "phone": "",
    "lng": 108.401029,
    "commune": "Xã Krông Bông",
    "address": "Thôn 26, Xã Krông Bông, Tỉnh Đắk Lắk",
    "lat": 12.547061,
    "purposeCode": "T",
    "name": "Cơ sở nuôi Trần Văn Hà",
    "owner": "Trần Văn Hà",
    "speciesList": [
      {
        "purposeCode": "T",
        "vietnameseName": "Chim Chào mào",
        "baseline": {
          "date": "2026-01-01",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "note": "Số lượng Chim Chào mào nuôi",
          "mother": 1,
          "father": 1,
          "otherFemale": 0,
          "otherMale": 0,
          "otherUnknown": 0
        },
        "fluctuations": [],
        "scientificName": "Pycnonotus jocosus",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "id": "sp_28_1",
        "citesAppendix": "Khai báo kiểm lâm"
      }
    ],
    "note": ""
  },
  {
    "address": "Thôn 2, Xã Krông Bông, Tỉnh Đắk Lắk",
    "phone": "",
    "purposeCode": "T",
    "ownerName": "Trần Ngọc Long",
    "registrationDate": "",
    "id": "fac_29",
    "registrationCode": "Đang cập nhật",
    "speciesList": [
      {
        "purposeCode": "T",
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Streptopelia chinensis",
        "id": "sp_29_1",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "fluctuations": [],
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherUnknown": 0,
          "mother": 2,
          "father": 2,
          "note": "Số lượng Chim Cu gáy nuôi",
          "otherFemale": 0,
          "date": "2026-01-01",
          "otherMale": 0
        },
        "vietnameseName": "Chim Cu gáy"
      }
    ],
    "name": "Cơ sở nuôi Trần Ngọc Long",
    "owner": "Trần Ngọc Long",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "commune": "Xã Krông Bông",
    "facilityName": "Cơ sở nuôi Trần Ngọc Long",
    "note": ""
  },
  {
    "updatedAt": "2026-10-18T15:21:37.461Z",
    "commune": "xã Hòa Sơn",
    "lng": 108.1885,
    "owner": "Trịnh Viết Long",
    "ownerName": "Trịnh Viết Long",
    "lat": 12.506699,
    "registrationCode": "028-25/B-DLC",
    "registrationDate": "2025-10-03",
    "name": "Cơ sở nuôi Trịnh Viết Long",
    "id": "fac_3",
    "speciesList": [
      {
        "purposeCode": "T",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "citesAppendix": "Phụ lục II CITES",
        "vietnameseName": "Cầy vòi Hương",
        "baseline": {
          "date": "2025-10-03",
          "mother": 0,
          "note": "Cơ sở hiện nghỉ nuôi",
          "otherFemale": 0,
          "otherUnknown": 0,
          "otherMale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 0
        },
        "id": "sp_3_1",
        "scientificName": "Paradoxurus hermaphroditus",
        "fluctuations": []
      }
    ],
    "address": "Thôn 4, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "phone": "",
    "facilityName": "Cơ sở nuôi Trịnh Viết Long",
    "purposeCode": "T",
    "note": "Nghỉ nuôi"
  },
  {
    "lat": 12.574027,
    "purposeCode": "T",
    "speciesList": [
      {
        "fluctuations": [],
        "vietnameseName": "Chim Chào mào",
        "citesAppendix": "Khai báo kiểm lâm",
        "purposeCode": "T",
        "scientificName": "Pycnonotus jocosus",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "baseline": {
          "father": 2,
          "otherMale": 3,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherFemale": 2,
          "date": "2026-01-01",
          "note": "Số lượng Chim Chào mào nuôi",
          "mother": 2,
          "otherUnknown": 3
        },
        "id": "sp_30_1"
      }
    ],
    "owner": "Hoàng Văn Hải",
    "address": "Thôn 6, Xã Dang Kang, Tỉnh Đắk Lắk",
    "name": "Cơ sở nuôi Hoàng Văn Hải",
    "facilityName": "Cơ sở nuôi Hoàng Văn Hải",
    "note": "",
    "ownerName": "Hoàng Văn Hải",
    "phone": "",
    "id": "fac_30",
    "registrationDate": "",
    "lng": 108.3365,
    "commune": "Xã Dang Kang",
    "registrationCode": "Đang cập nhật",
    "updatedAt": "2026-10-18T15:21:37.461Z"
  },
  {
    "ownerName": "Võ Văn Nhơn",
    "commune": "Xã Dang Kang",
    "note": "Làm cảnh",
    "phone": "",
    "updatedAt": "2026-10-18T15:21:37.461Z",
    "lat": 12.562678,
    "name": "Cơ sở nuôi Võ Văn Nhơn",
    "registrationDate": "",
    "speciesList": [
      {
        "scientificName": "Pycnonotus jocosus",
        "purposeCode": "O",
        "baseline": {
          "father": 1,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherFemale": 0,
          "otherUnknown": 0,
          "mother": 1,
          "date": "2026-01-01",
          "otherMale": 0,
          "note": "Số lượng Chim Chào mào nuôi cảnh"
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "fluctuations": [],
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "id": "sp_31_1",
        "vietnameseName": "Chim Chào mào"
      }
    ],
    "facilityName": "Cơ sở nuôi Võ Văn Nhơn",
    "id": "fac_31",
    "registrationCode": "Đang cập nhật",
    "lng": 108.33214,
    "purposeCode": "O",
    "address": "Thôn 7, Xã Dang Kang, Tỉnh Đắk Lắk",
    "owner": "Võ Văn Nhơn"
  },
  {
    "id": "fac_4",
    "address": "Thôn 8, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "updatedAt": "2026-10-18T15:21:37.461Z",
    "phone": "",
    "registrationDate": "2026-07-06",
    "ownerName": "Phạm Bá Quang",
    "purposeCode": "T",
    "speciesList": [
      {
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 11,
          "note": "Chưa được cấp mã số cơ sở",
          "date": "2026-01-01",
          "otherMale": 0,
          "otherFemale": 0,
          "otherUnknown": 0,
          "father": 4
        },
        "scientificName": "Paradoxurus hermaphroditus",
        "citesAppendix": "Phụ lục II CITES",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "fluctuations": [],
        "purposeCode": "T",
        "vietnameseName": "Cầy vòi Hương",
        "id": "sp_4_1"
      }
    ],
    "registrationCode": "104-26/B-DLC",
    "lng": 108.29803,
    "name": "Cơ sở nuôi Phạm Bá Quang",
    "facilityName": "Cơ sở nuôi Phạm Bá Quang",
    "lat": 12.492824,
    "note": "104-26/B-DLC",
    "owner": "Phạm Bá Quang",
    "commune": "xã Hòa Sơn"
  },
  {
    "id": "fac_5",
    "owner": "Phan Thanh Hùng",
    "address": "Thôn 1, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "note": "Nghỉ nuôi",
    "updatedAt": "2026-10-18T15:21:37.461Z",
    "name": "Cơ sở nuôi Phan Thanh Hùng",
    "ownerName": "Phan Thanh Hùng",
    "speciesList": [
      {
        "fluctuations": [],
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "id": "sp_5_1",
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "citesAppendix": "Phụ lục II CITES",
        "baseline": {
          "mother": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherFemale": 0,
          "otherUnknown": 0,
          "note": "Cơ sở nghỉ nuôi",
          "father": 0,
          "otherMale": 0,
          "date": "2022-04-22"
        },
        "purposeCode": "T"
      }
    ],
    "facilityName": "Cơ sở nuôi Phan Thanh Hùng",
    "purposeCode": "T",
    "phone": "",
    "registrationDate": "2022-04-22",
    "commune": "xã Hòa Sơn",
    "registrationCode": "IIB-DLC-021"
  },
  {
    "id": "fac_6",
    "updatedAt": "2026-10-18T15:21:37.461Z",
    "address": "Thôn 6, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "facilityName": "Cơ sở nuôi Lê Nguyễn Nhật Tân",
    "owner": "Lê Nguyễn Nhật Tân",
    "ownerName": "Lê Nguyễn Nhật Tân",
    "registrationDate": "",
    "commune": "xã Hòa Sơn",
    "registrationCode": "IIB-DLC-025",
    "purposeCode": "T",
    "note": "Nghỉ nuôi",
    "speciesList": [
      {
        "fluctuations": [],
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "vietnameseName": "Cầy vòi Hương",
        "citesAppendix": "Phụ lục II CITES",
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 0,
          "otherFemale": 0,
          "otherMale": 0,
          "otherUnknown": 0,
          "mother": 0,
          "note": "Cơ sở nghỉ nuôi",
          "date": "2026-01-01"
        },
        "scientificName": "Paradoxurus hermaphroditus",
        "id": "sp_6_1",
        "purposeCode": "T"
      }
    ],
    "name": "Cơ sở nuôi Lê Nguyễn Nhật Tân",
    "phone": ""
  },
  {
    "speciesList": [
      {
        "citesAppendix": "Phụ lục II CITES",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "baseline": {
          "otherMale": 12,
          "mother": 5,
          "otherFemale": 14,
          "note": "Số lượng Cầy vòi Hương hiện có",
          "date": "2024-07-03",
          "otherUnknown": 19,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 3
        },
        "purposeCode": "T",
        "fluctuations": [],
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "id": "sp_7_1"
      },
      {
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "vietnameseName": "Cầy vòi mốc",
        "citesAppendix": "Phụ lục II CITES",
        "baseline": {
          "mother": 3,
          "date": "2024-07-03",
          "otherMale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "note": "Số lượng Cầy vòi mốc hiện có",
          "otherFemale": 0,
          "otherUnknown": 0,
          "father": 2
        },
        "fluctuations": [],
        "purposeCode": "T",
        "id": "sp_7_2",
        "scientificName": "Paguma larvata"
      },
      {
        "scientificName": "Atherurus macrourus",
        "baseline": {
          "otherMale": 0,
          "mother": 1,
          "otherFemale": 0,
          "father": 1,
          "note": "Hiện trạng nuôi loài Don",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherUnknown": 0,
          "date": "2026-01-01"
        },
        "group": "Động vật rừng thông thường",
        "fluctuations": [],
        "citesAppendix": "Khai báo kiểm lâm",
        "purposeCode": "T",
        "id": "sp_7_3",
        "vietnameseName": "Don"
      },
      {
        "id": "sp_7_4",
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Hystrix brachyura",
        "purposeCode": "T",
        "fluctuations": [],
        "vietnameseName": "Nhím",
        "group": "Động vật rừng thông thường",
        "baseline": {
          "otherFemale": 31,
          "mother": 12,
          "note": "Hiện trạng nuôi loài Nhím",
          "date": "2026-01-01",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 21,
          "father": 6,
          "otherUnknown": 11
        }
      }
    ],
    "name": "Cơ sở nuôi Nguyễn Tấn Danh Nhân",
    "purposeCode": "T",
    "ownerName": "Nguyễn Tấn Danh Nhân",
    "note": "",
    "owner": "Nguyễn Tấn Danh Nhân",
    "registrationDate": "2024-07-03",
    "updatedAt": "2026-10-18T15:21:37.461Z",
    "commune": "xã Yang Mao",
    "registrationCode": "IIB-C-DLC-055",
    "facilityName": "Cơ sở nuôi Nguyễn Tấn Danh Nhân",
    "lng": 108.562016,
    "address": "Buôn Tơ Rang, xã Yang Mao, Tỉnh Đắk Lắk",
    "id": "fac_7",
    "lat": 12.472545,
    "phone": ""
  },
  {
    "note": "",
    "purposeCode": "T",
    "speciesList": [
      {
        "fluctuations": [],
        "scientificName": "Paradoxurus hermaphroditus",
        "baseline": {
          "otherFemale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 5,
          "note": "Hiện trạng nuôi ban đầu",
          "date": "2026-05-05",
          "father": 1,
          "otherUnknown": 4,
          "otherMale": 0
        },
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "citesAppendix": "Phụ lục II CITES",
        "purposeCode": "T",
        "id": "sp_8_1",
        "vietnameseName": "Cầy vòi Hương"
      }
    ],
    "name": "Cơ sở nuôi Huỳnh Công Nam",
    "address": "Buôn chàm A, xã Yang Mao, Tỉnh Đắk Lắk",
    "lat": 12.483552,
    "owner": "Huỳnh Công Nam",
    "id": "fac_8",
    "registrationCode": "53-26/B-DLC",
    "lng": 108.562716,
    "ownerName": "Huỳnh Công Nam",
    "registrationDate": "2026-05-05",
    "updatedAt": "2026-10-18T15:21:37.461Z",
    "phone": "",
    "facilityName": "Cơ sở nuôi Huỳnh Công Nam",
    "commune": "xã Yang Mao"
  },
  {
    "address": "Thôn Ea Luêh, xã Yang Mao, Tỉnh Đắk Lắk",
    "owner": "Trần Duy Quân",
    "facilityName": "Cơ sở nuôi Trần Duy Quân",
    "lat": 12.503389,
    "ownerName": "Trần Duy Quân",
    "registrationCode": "14-26/B-DLC",
    "lng": 108.655302,
    "registrationDate": "2026-03-03",
    "phone": "",
    "note": "",
    "speciesList": [
      {
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "purposeCode": "T",
        "baseline": {
          "date": "2026-03-03",
          "father": 5,
          "note": "Hiện trạng nuôi ban đầu",
          "otherMale": 0,
          "otherUnknown": 0,
          "otherFemale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 8
        },
        "id": "sp_9_1",
        "scientificName": "Paradoxurus hermaphroditus",
        "fluctuations": [],
        "vietnameseName": "Cầy vòi Hương",
        "citesAppendix": "Phụ lục II CITES"
      }
    ],
    "purposeCode": "T",
    "commune": "xã Yang Mao",
    "name": "Cơ sở nuôi Trần Duy Quân",
    "id": "fac_9",
    "updatedAt": "2026-10-18T15:21:37.461Z"
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
