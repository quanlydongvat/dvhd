/**
 * LocalStorage manager and sample demo data for Wildlife Monitoring Application
 */

const STORAGE_KEY = 'wildlife_manager_data_v6';

// Permanent blacklist of deleted/zombie facilities to prevent them from resurrecting from local cache or backups
export const BLACKLISTED_DELETED_FACILITY_IDS = ['fac_1786163777938'];

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
    "lat": 12.496848,
    "updatedAt": "2026-10-18T15:21:37.459Z",
    "ownerName": "Lê Thị Xuân",
    "lng": 108.227912,
    "registrationCode": "IIB-DLC-027",
    "commune": "xã Hòa Sơn",
    "address": "Thôn 3, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "facilityName": "Cơ sở nuôi Lê Thị Xuân",
    "id": "fac_1",
    "phone": "",
    "speciesList": [
      {
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "baseline": {
          "otherFemale": "8",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2023-03-17",
          "note": "Số lượng vật nuôi theo chứng nhận cơ sở",
          "father": 4,
          "otherUnknown": 2,
          "mother": 5,
          "otherMale": "10"
        },
        "fluctuations": [
          {
            "incFather": 0,
            "decFather": 0,
            "id": "fluc_1792335164333",
            "purpose": "T",
            "incOtherUnknown": 0,
            "incOtherMale": 2,
            "isPurchaseMode": false,
            "decOtherFemale": 0,
            "verifier": "",
            "reason": "Xác định giới tính con con",
            "decOtherUnknown": 2,
            "createdAt": 1792335164333,
            "incOtherFemale": 0,
            "isGenderIdentifyMode": true,
            "date": "2025-10-18",
            "approvalStatus": "APPROVED",
            "decOtherMale": 0,
            "time": "21:52",
            "decMother": 0,
            "incMother": 0
          },
          {
            "incFather": 0,
            "decFather": 0,
            "incOtherFemale": 0,
            "id": "fluc_1792335203123",
            "isGenderIdentifyMode": false,
            "approvalStatus": "APPROVED",
            "incOtherMale": 0,
            "isPurchaseMode": false,
            "incOtherUnknown": 21,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decOtherMale": 0,
            "createdAt": 1792335203123,
            "date": "2026-06-17",
            "purpose": "T",
            "time": "21:53",
            "decMother": 0,
            "decOtherUnknown": 0,
            "verifier": "",
            "incMother": 0,
            "decOtherFemale": 0
          },
          {
            "purpose": "T",
            "id": "fluc_1792335313527",
            "decOtherUnknown": 0,
            "createdAt": 1792335313527,
            "incOtherFemale": 0,
            "date": "2026-08-29",
            "incOtherUnknown": 11,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "verifier": "",
            "incMother": 0,
            "time": "21:53",
            "decMother": 0,
            "incOtherMale": 0,
            "approvalStatus": "APPROVED",
            "isGenderIdentifyMode": false,
            "decOtherMale": 0,
            "isPurchaseMode": false,
            "decFather": 0,
            "incFather": 0,
            "decOtherFemale": 0
          },
          {
            "incMother": 0,
            "isGenderIdentifyMode": false,
            "date": "2026-10-14",
            "time": "21:55",
            "decMother": 0,
            "incOtherFemale": 0,
            "incOtherMale": 0,
            "verifier": "",
            "approvalStatus": "APPROVED",
            "createdAt": 1792335381718,
            "decOtherMale": 1,
            "incOtherUnknown": 0,
            "isPurchaseMode": false,
            "id": "fluc_1792335381718",
            "decOtherUnknown": 0,
            "purpose": "T",
            "decOtherFemale": 3,
            "incFather": 0,
            "decFather": 0,
            "reason": "Xuất bán thương mại cho cơ sở B"
          }
        ],
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "purposeCode": "T",
        "id": "sp_1_1",
        "citesAppendix": "Phụ lục II CITES"
      }
    ],
    "purposeCode": "T",
    "registrationDate": "2023-03-17",
    "note": "",
    "name": "Cơ sở nuôi Lê Thị Xuân",
    "owner": "Lê Thị Xuân"
  },
  {
    "updatedAt": "2026-10-18T16:03:32.338Z",
    "id": "fac_10",
    "ownerName": "Trịnh Lục",
    "phone": "",
    "registrationCode": "52-26/B-DLC",
    "note": "",
    "lng": 108.456819,
    "lat": 12.546946,
    "purposeCode": "T",
    "registrationDate": "2026-05-08",
    "commune": "xã Cư Pui",
    "address": "Thôn 3, xã Cư Pui, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "speciesList": [
      {
        "vietnameseName": "Cầy vòi Hương",
        "scientificName": "Paradoxurus hermaphroditus",
        "citesAppendix": "Phụ lục II CITES",
        "fluctuations": [
          {
            "approvalStatus": "APPROVED",
            "id": "fluc_1786413132829",
            "decFather": 0,
            "verifier": "",
            "incFather": 2,
            "date": "2026-05-16",
            "purpose": "T",
            "decOtherUnknown": 0,
            "decOtherMale": 0,
            "isGenderIdentifyMode": false,
            "time": "08:51",
            "incOtherFemale": 0,
            "incOtherUnknown": 0,
            "createdAt": 1786413132829,
            "reason": "Mua từ cơ sở nuôi sinh sản khác",
            "decOtherFemale": 0,
            "decMother": 0,
            "incOtherMale": 0,
            "isPurchaseMode": true,
            "incMother": 4
          },
          {
            "decMother": 0,
            "decOtherUnknown": 0,
            "time": "08:52",
            "incOtherFemale": 0,
            "date": "2026-06-09",
            "incMother": 0,
            "createdAt": 1786413181544,
            "id": "fluc_1786413181544",
            "decOtherMale": 0,
            "incOtherUnknown": 4,
            "approvalStatus": "APPROVED",
            "isPurchaseMode": false,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "purpose": "T",
            "isGenderIdentifyMode": false,
            "incOtherMale": 0,
            "decFather": 0,
            "verifier": "",
            "incFather": 0,
            "decOtherFemale": 0
          },
          {
            "decOtherMale": 0,
            "createdAt": 1786413220093,
            "incOtherUnknown": 0,
            "verifier": "",
            "incOtherFemale": 0,
            "reason": "Mua từ cơ sở nuôi sinh sản khác",
            "decOtherUnknown": 0,
            "decMother": 0,
            "approvalStatus": "APPROVED",
            "incMother": 14,
            "time": "08:53",
            "date": "2026-07-10",
            "isGenderIdentifyMode": false,
            "incFather": 1,
            "isPurchaseMode": true,
            "decFather": 0,
            "purpose": "T",
            "id": "fluc_1786413220093",
            "decOtherFemale": 0,
            "incOtherMale": 0
          },
          {
            "decMother": 0,
            "incOtherFemale": 0,
            "decOtherUnknown": 0,
            "purpose": "T",
            "incMother": 0,
            "approvalStatus": "APPROVED",
            "createdAt": 1786413284623,
            "incOtherUnknown": 12,
            "isGenderIdentifyMode": false,
            "incOtherMale": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decOtherMale": 0,
            "isPurchaseMode": false,
            "decFather": 0,
            "decOtherFemale": 0,
            "verifier": "",
            "incFather": 0,
            "time": "08:54",
            "id": "fluc_1786413284623",
            "date": "2026-07-11"
          },
          {
            "incMother": 0,
            "approvalStatus": "APPROVED",
            "verifier": "",
            "decMother": 0,
            "incOtherFemale": 8,
            "reason": "Mua từ cơ sở nuôi sinh sản khác",
            "decOtherMale": 0,
            "date": "2026-08-03",
            "time": "17:26",
            "createdAt": 1792146475584,
            "isGenderIdentifyMode": false,
            "incOtherUnknown": 0,
            "incOtherMale": 2,
            "decOtherFemale": 0,
            "id": "fluc_1792146475584",
            "purpose": "T",
            "decOtherUnknown": 0,
            "incFather": 0,
            "isPurchaseMode": true,
            "decFather": 0
          },
          {
            "incFather": 0,
            "decFather": 0,
            "approvalStatus": "APPROVED",
            "decOtherMale": 0,
            "incOtherFemale": 0,
            "isGenderIdentifyMode": false,
            "verifier": "",
            "decOtherUnknown": 0,
            "date": "2026-08-11",
            "time": "08:56",
            "reason": "Xuất bán thương mại cho cơ sở B",
            "createdAt": 1786413405967,
            "incOtherMale": 0,
            "id": "fluc_1786413405967",
            "decOtherFemale": 5,
            "isPurchaseMode": false,
            "decMother": 0,
            "incOtherUnknown": 0,
            "incMother": 0,
            "purpose": "T"
          },
          {
            "incOtherUnknown": 9,
            "decMother": 0,
            "decOtherMale": 0,
            "incMother": 0,
            "isGenderIdentifyMode": false,
            "isPurchaseMode": false,
            "id": "fluc_1792146698997",
            "time": "17:28",
            "date": "2026-08-28",
            "createdAt": 1792146698997,
            "decOtherFemale": 0,
            "decOtherUnknown": 0,
            "incOtherFemale": 0,
            "verifier": "",
            "approvalStatus": "APPROVED",
            "incFather": 0,
            "purpose": "T",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decFather": 0,
            "incOtherMale": 0
          },
          {
            "isGenderIdentifyMode": false,
            "decOtherMale": 0,
            "isPurchaseMode": false,
            "createdAt": 1792146763664,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "id": "fluc_1792146763664",
            "purpose": "T",
            "date": "2026-09-01",
            "time": "17:31",
            "decOtherFemale": 0,
            "incMother": 0,
            "decMother": 0,
            "incOtherFemale": 0,
            "decOtherUnknown": 0,
            "decFather": 0,
            "incFather": 0,
            "incOtherMale": 0,
            "approvalStatus": "APPROVED",
            "incOtherUnknown": 6,
            "verifier": ""
          },
          {
            "incOtherUnknown": 0,
            "verifier": "",
            "incOtherFemale": 0,
            "incMother": 0,
            "decMother": 0,
            "isGenderIdentifyMode": false,
            "decOtherUnknown": 3,
            "incOtherMale": 0,
            "approvalStatus": "APPROVED",
            "time": "17:32",
            "createdAt": 1792146792454,
            "date": "2026-09-25",
            "reason": "Chết do thời tiết/bệnh lý",
            "purpose": "T",
            "decOtherMale": 0,
            "isPurchaseMode": false,
            "decOtherFemale": 0,
            "id": "fluc_1792146792454",
            "decFather": 0,
            "incFather": 0
          }
        ],
        "id": "sp_10_1",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "baseline": {
          "otherFemale": 0,
          "father": 2,
          "otherUnknown": 0,
          "mother": 3,
          "date": "2026-05-08",
          "note": "Hiện trạng nuôi ban đầu",
          "otherMale": 0,
          "verifier": "Hạt Kiểm lâm Huy���n Krông Bông"
        },
        "purposeCode": "T"
      }
    ],
    "facilityName": "Cơ sở nuôi Trịnh Lục",
    "name": "Cơ sở nuôi Trịnh Lục",
    "owner": "Trịnh Lục"
  },
  {
    "note": "",
    "address": "Thôn 3, xã Cư Pui, Tỉnh Đắk Lắk",
    "commune": "xã Cư Pui",
    "facilityName": "Cơ sở nuôi Nguyễn Hữu Đô",
    "ownerName": "Nguyễn Hữu Đô",
    "updatedAt": "2026-10-18T16:03:32.338Z",
    "id": "fac_11",
    "registrationDate": "2024-09-25",
    "purposeCode": "T",
    "speciesList": [
      {
        "citesAppendix": "Phụ lục II CITES",
        "id": "sp_11_1",
        "vietnameseName": "Cầy vòi Hương",
        "scientificName": "Paradoxurus hermaphroditus",
        "baseline": {
          "date": "2024-09-25",
          "note": "Hiện trạng nuôi đăng ký",
          "otherFemale": 16,
          "otherMale": 5,
          "otherUnknown": 19,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 4,
          "mother": 7
        },
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "fluctuations": [
          {
            "decOtherFemale": 0,
            "decMother": 0,
            "incMother": 0,
            "decOtherMale": 1,
            "id": "fluc_1786414971813",
            "createdAt": 1786414971813,
            "purpose": "T",
            "verifier": "",
            "reason": "Xuất bán thương mại cho cơ sở B",
            "isGenderIdentifyMode": false,
            "isPurchaseMode": false,
            "approvalStatus": "APPROVED",
            "incOtherUnknown": 0,
            "incFather": 0,
            "incOtherFemale": 0,
            "decFather": 0,
            "incOtherMale": 0,
            "time": "09:22",
            "decOtherUnknown": 0,
            "date": "2026-08-11"
          },
          {
            "decOtherUnknown": 0,
            "createdAt": 1791170873185,
            "isGenderIdentifyMode": false,
            "incOtherFemale": 0,
            "verifier": "",
            "incOtherUnknown": 3,
            "decMother": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decOtherMale": 0,
            "incMother": 0,
            "approvalStatus": "APPROVED",
            "incFather": 0,
            "date": "2026-09-09",
            "purpose": "T",
            "time": "10:27",
            "decFather": 0,
            "isPurchaseMode": false,
            "id": "fluc_1791170873185",
            "incOtherMale": 0,
            "decOtherFemale": 0
          },
          {
            "incOtherFemale": 0,
            "incOtherMale": 0,
            "verifier": "",
            "decFather": 0,
            "isGenderIdentifyMode": false,
            "id": "fluc_1791170912846",
            "incFather": 0,
            "approvalStatus": "APPROVED",
            "reason": "Chết do thời tiết/bệnh lý",
            "decMother": 0,
            "time": "10:28",
            "date": "2026-09-17",
            "purpose": "T",
            "isPurchaseMode": false,
            "incMother": 0,
            "decOtherUnknown": 5,
            "createdAt": 1791170912846,
            "decOtherFemale": 0,
            "decOtherMale": 0,
            "incOtherUnknown": 0
          },
          {
            "decFather": 0,
            "date": "2026-09-18",
            "time": "10:28",
            "incFather": 0,
            "incOtherMale": 7,
            "decOtherUnknown": 17,
            "decOtherFemale": 0,
            "reason": "Xác định giới tính con con",
            "isPurchaseMode": false,
            "incOtherUnknown": 0,
            "createdAt": 1791170959593,
            "approvalStatus": "APPROVED",
            "id": "fluc_1791170959593",
            "purpose": "T",
            "decOtherMale": 0,
            "decMother": 0,
            "isGenderIdentifyMode": true,
            "verifier": "",
            "incOtherFemale": 10,
            "incMother": 0
          },
          {
            "incMother": 0,
            "approvalStatus": "APPROVED",
            "reason": "Xuất bán thương mại cho cơ sở B",
            "decMother": 0,
            "verifier": "",
            "incOtherMale": 0,
            "incOtherFemale": 0,
            "createdAt": 1791170669944,
            "purpose": "T",
            "decOtherFemale": 5,
            "isGenderIdentifyMode": false,
            "incOtherUnknown": 0,
            "decOtherMale": 5,
            "time": "10:23",
            "date": "2026-09-22",
            "id": "fluc_1791170669944",
            "incFather": 0,
            "decOtherUnknown": 0,
            "isPurchaseMode": false,
            "decFather": 0
          }
        ],
        "purposeCode": "T"
      }
    ],
    "lng": 108.458901,
    "phone": "",
    "lat": 12.548123,
    "registrationCode": "IIB-C-DLC-063",
    "name": "Cơ sở nuôi Nguyễn Hữu Đô",
    "owner": "Nguyễn Hữu Đô"
  },
  {
    "purposeCode": "T",
    "commune": "Xã Krông Bông",
    "address": "Thôn 5, Xã Krông Bông, Tỉnh Đắk Lắk",
    "speciesList": [
      {
        "id": "sp_12_1",
        "fluctuations": [],
        "vietnameseName": "Cầy vòi Hương",
        "scientificName": "Paradoxurus hermaphroditus",
        "citesAppendix": "Phụ lục II CITES",
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherFemale": 9,
          "otherMale": 11,
          "otherUnknown": 6,
          "mother": 7,
          "father": 2,
          "note": "Hiện trạng nuôi đăng ký",
          "date": "2024-09-06"
        },
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "purposeCode": "T"
      }
    ],
    "lng": 108.332398,
    "facilityName": "Cơ sở nuôi Lê Thanh Đức",
    "lat": 12.528258,
    "registrationCode": "IIB-C-DLC-060",
    "phone": "",
    "note": "",
    "registrationDate": "2024-09-06",
    "id": "fac_12",
    "updatedAt": "2026-10-18T15:21:37.459Z",
    "ownerName": "Lê Thanh Đức",
    "name": "Cơ sở nuôi Lê Thanh Đức",
    "owner": "Lê Thanh Đức"
  },
  {
    "phone": "",
    "address": "Thôn 8, Xã Krông Bông, Tỉnh Đắk Lắk",
    "registrationDate": "2025-07-31",
    "commune": "Xã Krông Bông",
    "id": "fac_13",
    "speciesList": [
      {
        "scientificName": "Paradoxurus hermaphroditus",
        "baseline": {
          "mother": 7,
          "otherFemale": 10,
          "father": 6,
          "otherUnknown": 7,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 7,
          "date": "2025-07-31",
          "note": "Hiện trạng nuôi đăng ký"
        },
        "vietnameseName": "Cầy vòi Hương",
        "purposeCode": "T",
        "id": "sp_13_1",
        "fluctuations": [],
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "citesAppendix": "Phụ lục II CITES"
      }
    ],
    "note": "",
    "lat": 12.53985,
    "purposeCode": "T",
    "registrationCode": "010-25/B-DLC",
    "lng": 108.414746,
    "facilityName": "Cơ sở nuôi Ngô Thị Trang",
    "ownerName": "Ngô Thị Trang",
    "updatedAt": "2026-10-18T15:21:37.459Z",
    "name": "Cơ sở nuôi Ngô Thị Trang",
    "owner": "Ngô Thị Trang"
  },
  {
    "lat": 12.492108,
    "facilityName": "Cơ sở nuôi Hà Huy Thanh",
    "registrationDate": "2026-03-17",
    "commune": "Xã Krông Bông",
    "ownerName": "Hà Huy Thanh",
    "note": "",
    "lng": 108.333327,
    "updatedAt": "2026-10-18T15:21:37.459Z",
    "address": "TDP4, Xã Krông Bông, Tỉnh Đắk Lắk",
    "purposeCode": "T",
    "speciesList": [
      {
        "scientificName": "Paguma larvata",
        "vietnameseName": "Cầy vòi mốc",
        "baseline": {
          "otherFemale": 0,
          "mother": 23,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherUnknown": 0,
          "father": 5,
          "date": "2026-03-17",
          "note": "Hiện trạng nuôi đăng ký",
          "otherMale": 0
        },
        "fluctuations": [],
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "id": "sp_14_1",
        "citesAppendix": "Phụ lục II CITES",
        "purposeCode": "T"
      },
      {
        "vietnameseName": "Dúi má đào",
        "scientificName": "Rhizomys sumatrensis",
        "group": "Động vật rừng thông thường",
        "baseline": {
          "otherMale": 0,
          "date": "2026-01-01",
          "note": "Hiện trạng nuôi loài Dúi má đào",
          "mother": 34,
          "otherUnknown": 0,
          "father": 9,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherFemale": 0
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "purposeCode": "T",
        "fluctuations": [],
        "id": "sp_14_2"
      }
    ],
    "phone": "",
    "id": "fac_14",
    "registrationCode": "18-26/B-DLC",
    "name": "Cơ sở nuôi Hà Huy Thanh",
    "owner": "Hà Huy Thanh"
  },
  {
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "registrationCode": "52-26/B-DLC",
    "ownerName": "Trần Văn Tới",
    "speciesList": [
      {
        "baseline": {
          "otherUnknown": 0,
          "otherMale": 0,
          "mother": 9,
          "otherFemale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 9,
          "date": "2023-11-02",
          "note": "Số lượng Dúi mốc lớn hiện có"
        },
        "fluctuations": [
          {
            "reason": "Sinh sản lứa F1 mới nở/sinh.",
            "incOtherMale": 0,
            "decFather": 0,
            "incFather": 0,
            "incOtherFemale": 0,
            "verifier": "",
            "decOtherFemale": 0,
            "createdAt": 1714501860000,
            "id": "fluc_15_1",
            "decOtherUnknown": 0,
            "incMother": 0,
            "incOtherUnknown": 29,
            "decMother": 0,
            "decOtherMale": 0,
            "date": "2024-04-30",
            "time": "20:31"
          },
          {
            "decOtherMale": 0,
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "decOtherUnknown": 0,
            "verifier": "",
            "decOtherFemale": 0,
            "decFather": 0,
            "incFather": 0,
            "incOtherUnknown": 4,
            "incMother": 0,
            "incOtherFemale": 0,
            "decMother": 0,
            "date": "2024-10-21",
            "id": "fluc_15_2",
            "time": "18:10",
            "incOtherMale": 0,
            "createdAt": 1729534200000
          },
          {
            "verifier": "",
            "decMother": 0,
            "incMother": 0,
            "createdAt": 1737534600000,
            "incOtherFemale": 19,
            "id": "fluc_15_3",
            "decOtherMale": 0,
            "incOtherMale": 14,
            "decOtherFemale": 0,
            "incOtherUnknown": 0,
            "decFather": 0,
            "incFather": 0,
            "reason": "Xác định giới tính con con",
            "time": "10:30",
            "date": "2025-01-22",
            "decOtherUnknown": 33
          },
          {
            "incOtherFemale": 0,
            "decFather": 0,
            "incFather": 0,
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "id": "fluc_15_4",
            "incOtherMale": 0,
            "decOtherMale": 0,
            "createdAt": 1737545400000,
            "verifier": "",
            "decOtherUnknown": 0,
            "decOtherFemale": 0,
            "incMother": 0,
            "time": "13:30",
            "decMother": 0,
            "incOtherUnknown": 7,
            "date": "2025-01-22"
          },
          {
            "time": "09:00",
            "incFather": 0,
            "decOtherFemale": 0,
            "date": "2025-06-20",
            "decOtherMale": 0,
            "decFather": 0,
            "createdAt": 1750406400000,
            "incOtherUnknown": 13,
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "incOtherFemale": 0,
            "decMother": 0,
            "incMother": 0,
            "verifier": "",
            "id": "fluc_15_5",
            "decOtherUnknown": 0,
            "incOtherMale": 0
          },
          {
            "time": "19:20",
            "verifier": "",
            "date": "2025-10-06",
            "incOtherFemale": 0,
            "incOtherMale": 0,
            "decFather": 0,
            "incFather": 13,
            "reason": "Chuyển cá thể đực và cái đủ tuổi vào đàn bố mẹ.",
            "incMother": 18,
            "decOtherFemale": 18,
            "decMother": 0,
            "incOtherUnknown": 0,
            "decOtherMale": 13,
            "createdAt": 1759778400000,
            "id": "fluc_15_6",
            "decOtherUnknown": 0
          },
          {
            "verifier": "",
            "time": "21:28",
            "incFather": 0,
            "date": "2025-10-06",
            "decFather": 0,
            "decOtherFemale": 0,
            "incOtherMale": 8,
            "id": "fluc_15_7",
            "decOtherMale": 0,
            "incOtherFemale": 12,
            "decOtherUnknown": 20,
            "reason": "Xác định giới tính con con",
            "createdAt": 1759786080000,
            "incMother": 0,
            "decMother": 0,
            "incOtherUnknown": 0
          },
          {
            "createdAt": 1762326000000,
            "verifier": "",
            "incOtherMale": 0,
            "id": "fluc_15_8",
            "decOtherUnknown": 0,
            "decMother": 0,
            "incOtherFemale": 0,
            "incOtherUnknown": 25,
            "incMother": 0,
            "decOtherFemale": 0,
            "decFather": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "incFather": 0,
            "date": "2025-11-05",
            "time": "07:00",
            "decOtherMale": 0
          },
          {
            "decOtherMale": 0,
            "decFather": 0,
            "incFather": 0,
            "id": "fluc_15_9",
            "date": "2025-11-10",
            "time": "08:00",
            "incOtherFemale": 0,
            "createdAt": 1762761600000,
            "decOtherFemale": 0,
            "reason": "Chết do thời tiết/bệnh lý",
            "decOtherUnknown": 4,
            "decMother": 0,
            "verifier": "",
            "incOtherMale": 0,
            "incOtherUnknown": 0,
            "incMother": 0
          },
          {
            "incOtherMale": 0,
            "incMother": 0,
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "decMother": 0,
            "id": "fluc_15_10",
            "decOtherFemale": 0,
            "createdAt": 1767088800000,
            "date": "2025-12-30",
            "time": "10:00",
            "verifier": "",
            "incOtherUnknown": 18,
            "incOtherFemale": 0,
            "decOtherMale": 0,
            "decFather": 0,
            "incFather": 0,
            "decOtherUnknown": 0
          },
          {
            "date": "2026-01-07",
            "id": "fluc_15_11",
            "incOtherMale": 6,
            "time": "19:28",
            "decOtherFemale": 0,
            "decOtherUnknown": 20,
            "incFather": 0,
            "decFather": 0,
            "incOtherUnknown": 0,
            "verifier": "",
            "reason": "Xác định giới tính con con",
            "createdAt": 1767814080000,
            "incOtherFemale": 14,
            "incMother": 0,
            "decMother": 0,
            "decOtherMale": 0
          },
          {
            "date": "2026-01-08",
            "decOtherMale": 15,
            "time": "07:48",
            "decMother": 0,
            "incMother": 27,
            "verifier": "",
            "decOtherFemale": 27,
            "createdAt": 1767858480000,
            "incOtherFemale": 0,
            "id": "fluc_15_12",
            "decOtherUnknown": 0,
            "incFather": 15,
            "decFather": 0,
            "incOtherMale": 0,
            "incOtherUnknown": 0,
            "reason": "Chuyển cá thể đực và cái đủ tuổi vào đàn bố mẹ."
          },
          {
            "decOtherUnknown": 0,
            "verifier": "",
            "decFather": 0,
            "incOtherFemale": 0,
            "incOtherUnknown": 28,
            "incFather": 0,
            "incOtherMale": 0,
            "id": "fluc_15_13",
            "decOtherMale": 0,
            "incMother": 0,
            "decMother": 0,
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "decOtherFemale": 0,
            "date": "2026-07-01",
            "createdAt": 1782912600000,
            "time": "13:30"
          },
          {
            "decFather": 0,
            "incOtherFemale": 6,
            "incFather": 0,
            "verifier": "",
            "reason": "Xác định giới tính con con",
            "decOtherMale": 0,
            "time": "07:30",
            "date": "2026-07-20",
            "createdAt": 1784532600000,
            "decOtherUnknown": 12,
            "incOtherMale": 6,
            "decMother": 0,
            "incOtherUnknown": 0,
            "decOtherFemale": 0,
            "id": "fluc_15_14",
            "incMother": 0
          },
          {
            "id": "fluc_15_15",
            "incOtherMale": 0,
            "decOtherFemale": 0,
            "incOtherUnknown": 11,
            "verifier": "",
            "decFather": 0,
            "incFather": 0,
            "decOtherUnknown": 0,
            "decMother": 0,
            "incMother": 0,
            "createdAt": 1785587400000,
            "incOtherFemale": 0,
            "date": "2026-08-01",
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "decOtherMale": 0,
            "time": "12:30"
          },
          {
            "createdAt": 1786906800000,
            "decOtherFemale": 0,
            "incOtherMale": 0,
            "time": "19:00",
            "decMother": 1,
            "date": "2026-08-16",
            "id": "fluc_15_16",
            "reason": "Chết do thời tiết/bệnh lý",
            "incMother": 0,
            "verifier": "",
            "decFather": 0,
            "incFather": 0,
            "incOtherUnknown": 0,
            "decOtherMale": 0,
            "incOtherFemale": 0,
            "decOtherUnknown": 2
          },
          {
            "id": "fluc_1791031608601",
            "decMother": 0,
            "date": "2026-10-03",
            "time": "19:45",
            "incOtherUnknown": 20,
            "approvalStatus": "APPROVED",
            "incMother": 0,
            "decOtherMale": 0,
            "verifier": "",
            "createdAt": 1791031608601,
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "isGenderIdentifyMode": false,
            "decOtherUnknown": 0,
            "incOtherFemale": 0,
            "purpose": "T",
            "incOtherMale": 0,
            "decOtherFemale": 0,
            "decFather": 0,
            "incFather": 0,
            "isPurchaseMode": false
          },
          {
            "incFather": 0,
            "approvalStatus": "APPROVED",
            "decFather": 20,
            "incOtherMale": 0,
            "verifier": "",
            "id": "fluc_1792327999641",
            "decOtherUnknown": 0,
            "reason": "Tặng cho/chuyển nhượng theo quyết định",
            "incOtherFemale": 0,
            "incOtherUnknown": 0,
            "isGenderIdentifyMode": false,
            "decOtherFemale": 0,
            "createdAt": 1792327999641,
            "purpose": "T",
            "decOtherMale": 0,
            "decMother": 20,
            "incMother": 0,
            "date": "2026-10-06",
            "isPurchaseMode": false,
            "time": "19:51"
          },
          {
            "incMother": 0,
            "reason": "Xác định giới tính con con",
            "decMother": 0,
            "decOtherMale": 0,
            "decOtherFemale": 0,
            "isPurchaseMode": false,
            "createdAt": 1792329025484,
            "decOtherUnknown": 41,
            "approvalStatus": "PENDING",
            "verifier": "",
            "id": "fluc_1792329025484",
            "incOtherMale": 24,
            "incOtherFemale": 17,
            "isGenderIdentifyMode": true,
            "decFather": 0,
            "time": "20:03",
            "purpose": "T",
            "date": "2026-10-18",
            "incFather": 0,
            "incOtherUnknown": 0
          }
        ],
        "purposeCode": "T",
        "vietnameseName": "Dúi mốc lớn",
        "scientificName": "Rhizomys pruinosus",
        "id": "sp_15_1",
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường"
      }
    ],
    "note": "",
    "purposeCode": "T",
    "id": "fac_15",
    "phone": "",
    "lat": 12.477054,
    "registrationDate": "2023-11-02",
    "facilityName": "Cơ sở nuôi Trần Văn Tới",
    "commune": "xã Yang Mao",
    "address": "Thôn 1, xã Yang Mao, Tỉnh Đắk Lắk",
    "lng": 108.58051,
    "name": "Cơ sở nuôi Trần Văn Tới",
    "owner": "Trần Văn Tới"
  },
  {
    "registrationDate": "",
    "phone": "",
    "id": "fac_16",
    "address": "Thôn Cư Drăm, xã Yang Mao, Tỉnh Đắk Lắk",
    "commune": "xã Yang Mao",
    "lat": 12.487572,
    "lng": 108.551582,
    "ownerName": "Lê Đình Tâm",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "registrationCode": "Đang cập nhật",
    "purposeCode": "T",
    "speciesList": [
      {
        "fluctuations": [],
        "purposeCode": "T",
        "group": "Động vật rừng thông thường",
        "scientificName": "Rhizomys pruinosus",
        "vietnameseName": "Dúi mốc lớn",
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherFemale": 6,
          "father": 2,
          "date": "2026-01-01",
          "note": "Số lượng Dúi mốc lớn hiện có",
          "otherMale": 4,
          "mother": 2,
          "otherUnknown": 0
        },
        "id": "sp_16_1",
        "citesAppendix": "Khai báo kiểm lâm"
      }
    ],
    "note": "",
    "facilityName": "Cơ sở nuôi Lê Đình Tâm",
    "name": "Cơ sở nuôi Lê Đình Tâm",
    "owner": "Lê Đình Tâm"
  },
  {
    "lat": 12.462085,
    "note": "",
    "registrationCode": "Đang cập nhật",
    "phone": "",
    "lng": 108.560116,
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "ownerName": "Nguyễn Kim Danh",
    "id": "fac_17",
    "facilityName": "Cơ sở nuôi Nguyễn Kim Danh",
    "commune": "xã Yang Mao",
    "purposeCode": "T",
    "address": "Buôn Tul, xã Yang Mao, Tỉnh Đắk Lắk",
    "speciesList": [
      {
        "id": "sp_17_1",
        "fluctuations": [],
        "group": "Động vật rừng thông thường",
        "scientificName": "Rhizomys pruinosus",
        "vietnameseName": "Dúi mốc lớn",
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "otherFemale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 0,
          "otherUnknown": 0,
          "father": 2,
          "note": "Số lượng Dúi mốc lớn hiện có",
          "date": "2026-01-01",
          "mother": 10
        },
        "purposeCode": "T"
      }
    ],
    "registrationDate": "",
    "name": "Cơ sở nuôi Nguyễn Kim Danh",
    "owner": "Nguyễn Kim Danh"
  },
  {
    "note": "",
    "id": "fac_1786163645775",
    "lng": 108.455555,
    "commune": "xã Cư Pui",
    "speciesList": [
      {
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "fluctuations": [
          {
            "incMother": 0,
            "decOtherMale": 0,
            "incOtherFemale": 0,
            "id": "fluc_1786163683953",
            "date": "2026-07-20",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decMother": 0,
            "time": "11:34",
            "verifier": "",
            "createdAt": 1786163683953,
            "decOtherUnknown": 0,
            "isPurchaseMode": false,
            "decOtherFemale": 0,
            "incOtherUnknown": 5,
            "incFather": 0,
            "incOtherMale": 0,
            "purpose": "T",
            "decFather": 0
          }
        ],
        "id": "sp_1786163645775_1",
        "baseline": {
          "otherUnknown": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 1,
          "otherMale": 0,
          "mother": 3,
          "date": "2026-07-24",
          "note": "Hiện trạng đăng ký ban đầu",
          "otherFemale": 0
        },
        "purposeCode": "T",
        "vietnameseName": "Cầy vòi Hương",
        "scientificName": "Paradoxurus hermaphroditus",
        "citesAppendix": "Phụ lục II CITES"
      }
    ],
    "purposeCode": "T",
    "address": "thôn 3, xã Cư Pui, tỉnh Đắk Lắk.",
    "ownerName": "Nguyễn Lĩnh",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "registrationDate": "2026-07-24",
    "phone": "0866100652",
    "lat": 12.547587,
    "facilityName": "Nguyễn Lĩnh",
    "registrationCode": "141-26/B-DLC",
    "name": "Nguyễn Lĩnh",
    "owner": "Nguyễn Lĩnh"
  },
  {
    "registrationDate": "2026-01-24",
    "phone": "0342017979",
    "lng": 108.321947,
    "purposeCode": "T",
    "address": "thôn 6, xã Dang Kang, tỉnh Đắk Lắk",
    "commune": "Xã Dang Kang",
    "lat": 12.558599,
    "id": "fac_1786419630740",
    "speciesList": [
      {
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "id": "sp_1786419630740_1",
        "purposeCode": "T",
        "citesAppendix": "Phụ lục II CITES",
        "baseline": {
          "otherFemale": 0,
          "otherUnknown": 0,
          "father": 2,
          "date": "2026-07-24",
          "note": "Hiện trạng đăng ký ban đầu",
          "otherMale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 40
        },
        "fluctuations": [
          {
            "incMother": 0,
            "decOtherFemale": 0,
            "decMother": 0,
            "time": "10:42",
            "date": "2026-08-11",
            "decOtherMale": 0,
            "verifier": "",
            "isPurchaseMode": true,
            "purpose": "T",
            "createdAt": 1786419778624,
            "incOtherMale": 0,
            "incOtherUnknown": 0,
            "reason": "Mua từ cơ sở nuôi sinh sản khác",
            "incOtherFemale": 5,
            "incFather": 0,
            "id": "fluc_1786419778624",
            "decOtherUnknown": 0,
            "decFather": 0
          }
        ],
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương"
      },
      {
        "baseline": {
          "otherFemale": 0,
          "otherUnknown": 0,
          "verifier": "",
          "otherMale": 0,
          "father": "4",
          "date": "2026-07-24",
          "note": "Số lượng vật nuôi hiện có ban đầu",
          "mother": "13"
        },
        "id": "species_1786419708326",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "citesAppendix": "Phụ lục II CITES",
        "purposeCode": "T",
        "scientificName": "Paguma larvata",
        "vietnameseName": "Cầy vòi mốc",
        "fluctuations": []
      }
    ],
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "ownerName": "Nguyễn Hoàng Dũng",
    "facilityName": "Nguyễn Hoàng Dũng",
    "registrationCode": "142-26/B-DLC",
    "note": "",
    "name": "Nguyễn Hoàng Dũng",
    "owner": "Nguyễn Hoàng Dũng"
  },
  {
    "note": "",
    "commune": "Xã Krông Bông",
    "address": "Thôn 23",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "speciesList": [
      {
        "fluctuations": [
          {
            "isPurchaseMode": false,
            "decOtherUnknown": 0,
            "id": "fluc_1786468153021",
            "createdAt": 1786467765630,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "date": "2026-07-08",
            "time": "00:02",
            "incMother": 0,
            "decMother": 0,
            "decOtherFemale": 0,
            "incOtherMale": 0,
            "incOtherUnknown": 6,
            "decOtherMale": 0,
            "verifier": "",
            "decFather": 0,
            "purpose": "T",
            "incOtherFemale": 0,
            "incFather": 0
          },
          {
            "incFather": 0,
            "decOtherFemale": 0,
            "decOtherMale": 0,
            "decFather": 0,
            "isPurchaseMode": false,
            "createdAt": 1786505722932,
            "reason": "sinh san F2",
            "verifier": "",
            "decOtherUnknown": 0,
            "incOtherFemale": 0,
            "time": "10:34",
            "id": "fluc_1786518690491",
            "date": "2026-08-12",
            "decMother": 0,
            "incOtherUnknown": 4,
            "incMother": 0,
            "incOtherMale": 0,
            "purpose": "T"
          },
          {
            "decOtherFemale": 0,
            "incFather": 0,
            "decFather": 0,
            "decOtherMale": 0,
            "purpose": "T",
            "isPurchaseMode": false,
            "time": "10:34",
            "date": "2026-08-12",
            "verifier": "",
            "incOtherUnknown": 4,
            "createdAt": 1786505722932,
            "incOtherFemale": 0,
            "incMother": 0,
            "id": "fluc_1786518706173",
            "incOtherMale": 0,
            "reason": "sinh san F2",
            "decOtherUnknown": 0,
            "decMother": 0
          }
        ],
        "baseline": {
          "otherUnknown": 0,
          "mother": 4,
          "father": 2,
          "otherFemale": 0,
          "otherMale": 0,
          "note": "Hiện trạng đăng ký ban đầu",
          "date": "2026-06-17",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông"
        },
        "purposeCode": "T",
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường",
        "id": "sp_1786432202893_1",
        "vietnameseName": "Dúi mốc lớn",
        "scientificName": "Rhizomys pruinosus"
      }
    ],
    "ownerName": "Phạm Duy Thắng",
    "purposeCode": "T",
    "registrationCode": "Chưa có mã số",
    "facilityName": "Phạm Duy Thắng",
    "lng": 108.394137,
    "id": "fac_1786432202893",
    "lat": 12.520837,
    "registrationDate": "2026-08-11",
    "phone": "",
    "name": "Phạm Duy Thắng",
    "owner": "Phạm Duy Thắng"
  },
  {
    "address": "Thôn 6 xã Dang Kang",
    "commune": "Xã Dang Kang",
    "phone": "",
    "registrationDate": "2025-11-12",
    "id": "fac_1786504114807",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "ownerName": "Nguyễn Kim Tuấn",
    "facilityName": "Nguyễn Kim Tuấn",
    "registrationCode": "Chưa có mã số",
    "lng": "108.338165",
    "speciesList": [
      {
        "purposeCode": "T",
        "baseline": {
          "otherFemale": 0,
          "father": 10,
          "note": "Hiện trạng đăng ký ban đầu",
          "date": "2025-11-12",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 30,
          "otherUnknown": 0,
          "otherMale": 0
        },
        "fluctuations": [
          {
            "incOtherFemale": 53,
            "decOtherMale": 0,
            "incFather": 0,
            "purpose": "T",
            "verifier": "",
            "decFather": 0,
            "incOtherUnknown": 32,
            "incMother": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decMother": 0,
            "incOtherMale": 38,
            "isPurchaseMode": false,
            "decOtherFemale": 0,
            "time": "10:09",
            "date": "2026-08-12",
            "decOtherUnknown": 0,
            "id": "fluc_1786504203858",
            "createdAt": 1786504203858
          }
        ],
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Rhizomys pruinosus",
        "vietnameseName": "Dúi mốc lớn",
        "id": "sp_1786504114807_1",
        "group": "Động vật rừng thông thường"
      }
    ],
    "note": "",
    "lat": "12.575576",
    "purposeCode": "T",
    "name": "Nguyễn Kim Tuấn",
    "owner": "Nguyễn Kim Tuấn"
  },
  {
    "registrationCode": "Chưa có mã số",
    "phone": "",
    "ownerName": "Nguyễn Hữu Lưu",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "commune": "xã Cư Pui",
    "note": "",
    "address": "",
    "registrationDate": "2026-05-25",
    "id": "fac_1787585236556",
    "lat": "12.532135",
    "facilityName": "Nguyễn Hữu Lưu",
    "lng": "108.431876",
    "speciesList": [
      {
        "baseline": {
          "father": 1,
          "date": "2026-05-25",
          "note": "Hiện trạng đăng ký ban đầu",
          "otherMale": 0,
          "mother": 1,
          "otherFemale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherUnknown": 0
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "id": "sp_1787585236556_1",
        "scientificName": "Pycnonotus jocosus",
        "vietnameseName": "Chim Chào mào",
        "purposeCode": "T",
        "fluctuations": []
      }
    ],
    "purposeCode": "T",
    "name": "Nguyễn Hữu Lưu",
    "owner": "Nguyễn Hữu Lưu"
  },
  {
    "lat": 12.492318,
    "registrationDate": "2026-06-27",
    "lng": 108.324298,
    "note": "",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "ownerName": "Nguyễn Tâm Châu",
    "phone": "",
    "id": "fac_1787793901636",
    "purposeCode": "T",
    "address": "",
    "facilityName": "Nguyễn Tâm Châu",
    "commune": "xã Hòa Sơn",
    "speciesList": [
      {
        "fluctuations": [],
        "purposeCode": "T",
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "scientificName": "Pycnonotus jocosus",
        "vietnameseName": "Chim Chào mào",
        "id": "sp_1787793901636_1",
        "baseline": {
          "otherMale": 0,
          "otherFemale": 0,
          "otherUnknown": 2,
          "father": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-06-27",
          "note": "Hiện trạng đăng ký ban đầu",
          "mother": 0
        }
      }
    ],
    "registrationCode": "Chưa có mã số",
    "name": "Nguyễn Tâm Châu",
    "owner": "Nguyễn Tâm Châu"
  },
  {
    "note": "",
    "commune": "xã Hòa Sơn",
    "address": "Thôn 2",
    "registrationCode": "Chưa có mã số",
    "purposeCode": "T",
    "speciesList": [
      {
        "id": "sp_1787794070148_1",
        "purposeCode": "T",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "scientificName": "Streptopelia chinensis",
        "vietnameseName": "Chim Cu gáy",
        "fluctuations": [],
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "mother": 0,
          "otherMale": 1,
          "father": 0,
          "otherFemale": 1,
          "note": "Hiện trạng đăng ký ban đầu",
          "date": "2026-07-27",
          "otherUnknown": 2,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông"
        }
      }
    ],
    "lng": 108.294381,
    "id": "fac_1787794070148",
    "facilityName": "Nguyễn Thanh ",
    "registrationDate": "2026-07-27",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "ownerName": "Nguyễn Thanh ",
    "lat": 12.495249,
    "phone": "",
    "name": "Nguyễn Thanh ",
    "owner": "Nguyễn Thanh "
  },
  {
    "speciesList": [
      {
        "fluctuations": [],
        "id": "sp_1787794146413_1",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "purposeCode": "T",
        "scientificName": "Pycnonotus jocosus",
        "vietnameseName": "Chim Chào mào",
        "baseline": {
          "otherUnknown": 4,
          "date": "2026-07-27",
          "otherFemale": 0,
          "note": "Hiện trạng đăng ký ban đầu",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 0,
          "otherMale": 0,
          "mother": 0
        },
        "citesAppendix": "Khai báo kiểm lâm"
      },
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Streptopelia chinensis",
        "vietnameseName": "Chim Cu gáy",
        "purposeCode": "T",
        "id": "species_1790753399574",
        "baseline": {
          "otherUnknown": 0,
          "date": "2026-06-29",
          "note": "Số lượng vật nuôi hiện có ban đầu",
          "mother": 0,
          "otherMale": "1",
          "father": 0,
          "verifier": "",
          "otherFemale": "1"
        },
        "fluctuations": [],
        "group": "Động vật rừng thông thường (Lớp Chim)"
      }
    ],
    "purposeCode": "T",
    "lng": 108.32352,
    "registrationCode": "Chưa có mã số",
    "lat": 12.492941,
    "facilityName": "Trần Văn Ngọ",
    "registrationDate": "2026-07-27",
    "note": "",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "commune": "xã Hòa Sơn",
    "ownerName": "Trần Văn Ngọ",
    "id": "fac_1787794146413",
    "address": "Thôn 9 Hòa Sơn",
    "phone": "",
    "name": "Trần Văn Ngọ",
    "owner": "Trần Văn Ngọ"
  },
  {
    "phone": "0948861157",
    "lng": 108.315073,
    "purposeCode": "T",
    "address": "thôn 9, xã Hoà Sơn, tỉnh Đắk Lắk0948861157",
    "commune": "xã Hòa Sơn",
    "lat": 12.490722,
    "facilityName": "Nguyễn Duy Thông",
    "speciesList": [
      {
        "fluctuations": [],
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "otherFemale": "0",
          "note": "Hiện trạng đăng ký ban đầu",
          "father": 2,
          "date": "2026-08-27",
          "mother": 2,
          "otherUnknown": 10,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 0
        },
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "purposeCode": "T",
        "id": "sp_1787794338130_1",
        "vietnameseName": "Chim Chào mào",
        "scientificName": "Pycnonotus jocosus"
      },
      {
        "id": "species_1788765271274",
        "purposeCode": "T",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "fluctuations": [],
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Streptopelia chinensis",
        "vietnameseName": "Chim Cu gáy",
        "baseline": {
          "otherMale": "2",
          "date": "2026-09-07",
          "note": "Số lượng vật nuôi hiện có ban đầu",
          "otherFemale": "2",
          "verifier": "",
          "mother": 0,
          "otherUnknown": 0,
          "father": 0
        }
      }
    ],
    "registrationDate": "2026-08-27",
    "ownerName": "Nguyễn Duy Thông",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "id": "fac_1787794338130",
    "note": "Đang cập nhập",
    "registrationCode": "Chưa có mã số",
    "name": "Nguyễn Duy Thông",
    "owner": "Nguyễn Duy Thông"
  },
  {
    "lng": 108.322735,
    "ownerName": "Vũ Hoàng Tân",
    "lat": 12.500922,
    "commune": "xã Hòa Sơn",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "address": "Thôn 10",
    "registrationDate": "2026-08-27",
    "phone": "0337825861",
    "note": "",
    "facilityName": "Vũ Hoàng Tân",
    "speciesList": [
      {
        "purposeCode": "T",
        "fluctuations": [],
        "scientificName": "Pycnonotus jocosus",
        "vietnameseName": "Chim Chào mào",
        "id": "sp_1787795701427_1",
        "baseline": {
          "father": 0,
          "otherFemale": 0,
          "mother": 0,
          "otherMale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-08-27",
          "note": "Hiện trạng đăng ký ban đầu",
          "otherUnknown": 2
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường (Lớp Chim)"
      }
    ],
    "registrationCode": "Chưa có mã số",
    "purposeCode": "T",
    "id": "fac_1787795701427",
    "name": "Vũ Hoàng Tân",
    "owner": "Vũ Hoàng Tân"
  },
  {
    "lng": "",
    "facilityName": "Nguyễn Duy Thông",
    "speciesList": [
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "fluctuations": [],
        "id": "sp_1788916180780_1",
        "purposeCode": "T",
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherFemale": 0,
          "otherUnknown": 0,
          "father": 2,
          "note": "Hiện trạng đăng ký ban đầu",
          "date": "2026-09-09",
          "mother": 2,
          "otherMale": 0
        },
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "scientificName": "Streptopelia chinensis",
        "vietnameseName": "Chim Cu gáy"
      }
    ],
    "purposeCode": "T",
    "updatedAt": "2026-10-16T10:33:14.218Z",
    "ownerName": "Nguyễn Duy Thông",
    "address": "thôn 9, xã Hoà Sơn, tỉnh Đắk Lắk",
    "note": "",
    "commune": "xã Hòa Sơn",
    "lat": "",
    "registrationDate": "2026-09-09",
    "phone": "0948861157",
    "id": "fac_1788916180780",
    "registrationCode": "Chưa có mã số",
    "name": "Nguyễn Duy Thông",
    "owner": "Nguyễn Duy Thông"
  },
  {
    "note": "",
    "lng": 108.322383,
    "id": "fac_1791188880545",
    "phone": "0988.257.586",
    "registrationCode": "Chưa có mã số",
    "lat": 12.49798,
    "facilityName": "Nguyễn Văn Vinh",
    "ownerName": "Nguyễn Văn Vinh",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "address": "thôn 10, xã Hoà Sơn, tỉnh Đắk Lắk",
    "commune": "xã Hòa Sơn",
    "purposeCode": "T",
    "speciesList": [
      {
        "id": "sp_1791188880545_1",
        "citesAppendix": "Khai báo kiểm lâm",
        "fluctuations": [],
        "group": "Động vật rừng thông thường",
        "baseline": {
          "mother": 6,
          "father": 6,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherUnknown": 40,
          "otherMale": 42,
          "otherFemale": 66,
          "note": "Hiện trạng đăng ký ban đầu",
          "date": "2026-10-05"
        },
        "purposeCode": "T",
        "scientificName": "Rhizomys pruinosus",
        "vietnameseName": "Dúi mốc lớn"
      }
    ],
    "registrationDate": "2026-10-05",
    "name": "Nguyễn Văn Vinh",
    "owner": "Nguyễn Văn Vinh"
  },
  {
    "registrationDate": "",
    "lng": 108.423608,
    "speciesList": [
      {
        "purposeCode": "T",
        "baseline": {
          "otherFemale": 12,
          "father": 3,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 4,
          "otherMale": 10,
          "date": "2026-01-01",
          "note": "Số lượng Dúi má đào hiện có",
          "otherUnknown": 0
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường",
        "vietnameseName": "Dúi má đào",
        "scientificName": "Rhizomys sumatrensis",
        "id": "sp_18_1",
        "fluctuations": []
      },
      {
        "purposeCode": "T",
        "group": "Động vật rừng thông thường",
        "id": "sp_18_2",
        "baseline": {
          "otherMale": 17,
          "mother": 61,
          "otherUnknown": 58,
          "father": 19,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "note": "Số lượng Dúi mốc lớn hiện có",
          "otherFemale": 15,
          "date": "2026-01-01"
        },
        "fluctuations": [],
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Rhizomys pruinosus",
        "vietnameseName": "Dúi mốc lớn"
      }
    ],
    "purposeCode": "T",
    "lat": 12.526903,
    "note": "",
    "registrationCode": "Đang cập nhật",
    "facilityName": "Cơ sở nuôi Lê Quang Mạnh",
    "phone": "",
    "ownerName": "Lê Quang Mạnh",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "id": "fac_18",
    "address": "Thôn 29, Xã Krông Bông, Tỉnh Đắk Lắk",
    "commune": "Xã Krông Bông",
    "name": "Cơ sở nuôi Lê Quang Mạnh",
    "owner": "Lê Quang Mạnh"
  },
  {
    "commune": "Xã Krông Bông",
    "address": "Thôn 9, Xã Krông Bông, Tỉnh Đắk Lắk",
    "speciesList": [
      {
        "group": "Động vật rừng thông thường",
        "fluctuations": [],
        "purposeCode": "T",
        "id": "sp_19_1",
        "baseline": {
          "otherFemale": 0,
          "otherUnknown": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 0,
          "father": 10,
          "date": "2026-01-01",
          "note": "Số lượng Dúi mốc lớn hiện có",
          "mother": 15
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "vietnameseName": "Dúi mốc lớn",
        "scientificName": "Rhizomys pruinosus"
      }
    ],
    "purposeCode": "T",
    "registrationDate": "",
    "registrationCode": "Đang cập nhật",
    "facilityName": "Cơ sở nuôi Nguyễn Trương Đắc Nam",
    "id": "fac_19",
    "lat": 12.528051,
    "phone": "",
    "lng": 108.328497,
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "ownerName": "Nguyễn Trương Đắc Nam",
    "note": "",
    "name": "Cơ sở nuôi Nguyễn Trương Đắc Nam",
    "owner": "Nguyễn Trương Đắc Nam"
  },
  {
    "lat": 12.491634,
    "speciesList": [
      {
        "id": "sp_2_1",
        "vietnameseName": "Cầy vòi Hương",
        "scientificName": "Paradoxurus hermaphroditus",
        "baseline": {
          "note": "Số lượng vật nuôi đăng ký",
          "date": "2025-12-30",
          "otherUnknown": 3,
          "otherFemale": 7,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 2,
          "mother": 3,
          "otherMale": 6
        },
        "citesAppendix": "Phụ lục II CITES",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "fluctuations": [
          {
            "date": "2026-06-13",
            "incOtherMale": 2,
            "incMother": 0,
            "time": "22:03",
            "reason": "Xác định giới tính con con",
            "decMother": 0,
            "purpose": "T",
            "decOtherUnknown": 3,
            "isGenderIdentifyMode": true,
            "decOtherFemale": 0,
            "isPurchaseMode": false,
            "createdAt": 1792335832088,
            "incOtherUnknown": 0,
            "verifier": "",
            "id": "fluc_1792335832088",
            "approvalStatus": "APPROVED",
            "incOtherFemale": 1,
            "decFather": 0,
            "decOtherMale": 0,
            "incFather": 0
          },
          {
            "decMother": 0,
            "incOtherFemale": 0,
            "incOtherMale": 0,
            "incMother": 0,
            "createdAt": 1792335872475,
            "approvalStatus": "APPROVED",
            "isGenderIdentifyMode": false,
            "incOtherUnknown": 17,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "isPurchaseMode": false,
            "id": "fluc_1792335872475",
            "purpose": "T",
            "date": "2026-06-13",
            "time": "22:03",
            "decFather": 0,
            "verifier": "",
            "decOtherFemale": 0,
            "incFather": 0,
            "decOtherUnknown": 0,
            "decOtherMale": 0
          },
          {
            "incMother": 0,
            "incOtherUnknown": 0,
            "verifier": "",
            "isPurchaseMode": false,
            "decMother": 0,
            "decOtherFemale": 0,
            "time": "22:08",
            "date": "2026-07-06",
            "incOtherMale": 5,
            "createdAt": 1792336162817,
            "decOtherUnknown": 17,
            "decOtherMale": 0,
            "isGenderIdentifyMode": true,
            "incOtherFemale": 12,
            "purpose": "T",
            "approvalStatus": "APPROVED",
            "incFather": 0,
            "reason": "Xác định giới tính con con",
            "decFather": 0,
            "id": "fluc_1792336162817"
          },
          {
            "isPurchaseMode": false,
            "date": "2026-10-18",
            "isGenderIdentifyMode": false,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "time": "22:09",
            "createdAt": 1792336180572,
            "incMother": 0,
            "decMother": 0,
            "decOtherFemale": 0,
            "decOtherMale": 0,
            "purpose": "T",
            "incOtherMale": 0,
            "incFather": 0,
            "incOtherFemale": 0,
            "decOtherUnknown": 0,
            "verifier": "",
            "id": "fluc_1792336180572",
            "decFather": 0,
            "approvalStatus": "APPROVED",
            "incOtherUnknown": 4
          },
          {
            "decFather": 0,
            "incOtherFemale": 0,
            "incFather": 0,
            "isGenderIdentifyMode": false,
            "decOtherUnknown": 0,
            "approvalStatus": "APPROVED",
            "incOtherMale": 0,
            "incOtherUnknown": 0,
            "date": "2026-10-16",
            "time": "22:10",
            "verifier": "",
            "createdAt": 1792336234681,
            "purpose": "T",
            "isPurchaseMode": false,
            "decOtherMale": 3,
            "id": "fluc_1792336234681",
            "decMother": 0,
            "decOtherFemale": 7,
            "reason": "Chết do thời tiết/bệnh lý",
            "incMother": 0
          }
        ],
        "purposeCode": "T"
      }
    ],
    "purposeCode": "T",
    "facilityName": "Cơ sở nuôi Nguyễn Văn Thúy",
    "registrationDate": "2023-04-17",
    "ownerName": "Nguyễn Văn Thúy",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "note": "",
    "lng": 108.297682,
    "commune": "xã Hòa Sơn",
    "address": "Thôn Quảng Đông, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "phone": "",
    "id": "fac_2",
    "registrationCode": "IIB-C-DLC-028",
    "name": "Cơ sở nuôi Nguyễn Văn Thúy",
    "owner": "Nguyễn Văn Thúy"
  },
  {
    "address": "Buôn Cư Ênun A, Xã Dang Kang, Tỉnh Đắk Lắk",
    "commune": "Xã Dang Kang",
    "facilityName": "Cơ sở nuôi Trần Văn Lực",
    "note": "",
    "ownerName": "Trần Văn Lực",
    "id": "fac_20",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "registrationCode": "Đang cập nhật",
    "phone": "",
    "purposeCode": "T",
    "lng": 108.315384,
    "speciesList": [
      {
        "group": "Động vật rừng thông thường",
        "purposeCode": "T",
        "id": "sp_20_1",
        "citesAppendix": "Khai báo kiểm lâm",
        "fluctuations": [],
        "vietnameseName": "Dúi má đào",
        "scientificName": "Rhizomys sumatrensis",
        "baseline": {
          "otherFemale": 8,
          "date": "2026-01-01",
          "note": "Số lượng Dúi má đào hiện có",
          "otherUnknown": 11,
          "otherMale": 6,
          "father": 4,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 26
        }
      }
    ],
    "lat": 12.58438,
    "registrationDate": "",
    "name": "Cơ sở nuôi Trần Văn Lực",
    "owner": "Trần Văn Lực"
  },
  {
    "phone": "",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "ownerName": "Đinh Tiến Toàn",
    "registrationDate": "",
    "facilityName": "Cơ sở nuôi Đinh Tiến Toàn",
    "lat": 12.619158,
    "purposeCode": "T",
    "speciesList": [
      {
        "fluctuations": [],
        "id": "sp_21_1",
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 0,
          "otherFemale": 0,
          "otherUnknown": 0,
          "note": "Số lượng Dúi mốc lớn hiện có",
          "date": "2026-01-01",
          "father": 10,
          "mother": 10
        },
        "group": "Động vật rừng thông thường",
        "scientificName": "Rhizomys pruinosus",
        "vietnameseName": "Dúi mốc lớn",
        "purposeCode": "T"
      }
    ],
    "commune": "Xã Dang Kang",
    "registrationCode": "Đang cập nhật",
    "address": "Thôn 3, Xã Dang Kang, Tỉnh Đắk Lắk",
    "id": "fac_21",
    "lng": 108.339096,
    "note": "",
    "name": "Cơ sở nuôi Đinh Tiến Toàn",
    "owner": "Đinh Tiến Toàn"
  },
  {
    "registrationCode": "Đang cập nhật",
    "note": "",
    "phone": "",
    "facilityName": "Cơ sở nuôi Nguyễn Thanh",
    "registrationDate": "",
    "id": "fac_22",
    "purposeCode": "T",
    "speciesList": [
      {
        "vietnameseName": "Chim Cu gáy",
        "scientificName": "Streptopelia chinensis",
        "baseline": {
          "mother": 1,
          "date": "2026-01-01",
          "note": "Số lượng Chim Cu gáy nuôi",
          "father": 1,
          "otherFemale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherUnknown": 0,
          "otherMale": 0
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "purposeCode": "T",
        "fluctuations": [],
        "id": "sp_22_1"
      }
    ],
    "address": "Thôn 2, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "ownerName": "Nguyễn Thanh",
    "commune": "xã Hòa Sơn",
    "name": "Cơ sở nuôi Nguyễn Thanh",
    "owner": "Nguyễn Thanh"
  },
  {
    "facilityName": "Cơ sở nuôi Huỳnh Phúc Lợi",
    "phone": "",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "purposeCode": "O",
    "ownerName": "Huỳnh Phúc Lợi",
    "speciesList": [
      {
        "baseline": {
          "otherMale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "note": "Số lượng Chim Chào mào nuôi cảnh",
          "date": "2026-01-01",
          "otherFemale": 0,
          "mother": 0,
          "otherUnknown": 0,
          "father": 3
        },
        "fluctuations": [],
        "purposeCode": "O",
        "id": "sp_23_1",
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "scientificName": "Pycnonotus jocosus",
        "vietnameseName": "Chim Chào mào"
      }
    ],
    "id": "fac_23",
    "registrationDate": "",
    "note": "Làm cảnh",
    "address": "Thôn 2, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "registrationCode": "Đang cập nhật",
    "commune": "xã Hòa Sơn",
    "name": "Cơ sở nuôi Huỳnh Phúc Lợi",
    "owner": "Huỳnh Phúc Lợi"
  },
  {
    "commune": "xã Hòa Sơn",
    "registrationCode": "Đang cập nhật",
    "address": "Thôn 4, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "registrationDate": "",
    "facilityName": "Cơ sở nuôi Phan Thanh Trúc",
    "phone": "",
    "ownerName": "Phan Thanh Trúc",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "speciesList": [
      {
        "scientificName": "Pycnonotus jocosus",
        "vietnameseName": "Chim Chào mào",
        "citesAppendix": "Khai báo kiểm lâm",
        "id": "sp_24_1",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "fluctuations": [],
        "purposeCode": "T",
        "baseline": {
          "note": "Số lượng Chim Chào mào nuôi",
          "date": "2026-01-01",
          "otherMale": 0,
          "otherFemale": 0,
          "otherUnknown": 0,
          "father": 5,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 5
        }
      }
    ],
    "purposeCode": "T",
    "id": "fac_24",
    "note": "",
    "name": "Cơ sở nuôi Phan Thanh Trúc",
    "owner": "Phan Thanh Trúc"
  },
  {
    "lat": 12.502961,
    "phone": "",
    "address": "Thôn 4, Xã Krông Bông, Tỉnh Đắk Lắk",
    "commune": "Xã Krông Bông",
    "registrationDate": "",
    "facilityName": "Cơ sở nuôi Thái Hồng Sơn",
    "speciesList": [
      {
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "vietnameseName": "Chim Chào mào",
        "scientificName": "Pycnonotus jocosus",
        "citesAppendix": "Khai báo kiểm lâm",
        "id": "sp_25_1",
        "baseline": {
          "otherFemale": 0,
          "father": 5,
          "note": "Số lượng Chim Chào mào nuôi",
          "date": "2026-01-01",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 5,
          "otherUnknown": 0,
          "otherMale": 0
        },
        "purposeCode": "T",
        "fluctuations": []
      }
    ],
    "lng": 108.333624,
    "purposeCode": "T",
    "note": "",
    "registrationCode": "Đang cập nhật",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "ownerName": "Thái Hồng Sơn",
    "id": "fac_25",
    "name": "Cơ sở nuôi Thái Hồng Sơn",
    "owner": "Thái Hồng Sơn"
  },
  {
    "purposeCode": "T",
    "speciesList": [
      {
        "purposeCode": "T",
        "vietnameseName": "Chim Cu gáy",
        "scientificName": "Streptopelia chinensis",
        "id": "sp_26_1",
        "fluctuations": [],
        "baseline": {
          "otherFemale": 1,
          "mother": 11,
          "father": 11,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 1,
          "date": "2026-01-01",
          "note": "Số lượng Chim Cu gáy nuôi",
          "otherUnknown": 0
        },
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "citesAppendix": "Khai báo kiểm lâm"
      }
    ],
    "lng": 108.336714,
    "lat": 12.523945,
    "facilityName": "Cơ sở nuôi Nguyễn Trí",
    "registrationDate": "",
    "note": "",
    "commune": "Xã Krông Bông",
    "address": "Thôn 7, Xã Krông Bông, Tỉnh Đắk Lắk",
    "registrationCode": "Đang cập nhật",
    "ownerName": "Nguyễn Trí",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "id": "fac_26",
    "phone": "",
    "name": "Cơ sở nuôi Nguyễn Trí",
    "owner": "Nguyễn Trí"
  },
  {
    "address": "Thôn 2, Xã Krông Bông, Tỉnh Đắk Lắk",
    "note": "",
    "id": "fac_27",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "commune": "Xã Krông Bông",
    "ownerName": "Nguyễn Văn Hòa",
    "phone": "",
    "registrationDate": "",
    "facilityName": "Cơ sở nuôi Nguyễn Văn Hòa",
    "purposeCode": "T",
    "speciesList": [
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "fluctuations": [],
        "vietnameseName": "Chim Chào mào",
        "scientificName": "Pycnonotus jocosus",
        "id": "sp_27_1",
        "purposeCode": "T",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "baseline": {
          "otherMale": 0,
          "mother": 2,
          "father": 2,
          "otherFemale": 0,
          "date": "2026-01-01",
          "note": "Số lượng Chim Chào mào nuôi",
          "otherUnknown": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông"
        }
      }
    ],
    "registrationCode": "Đang cập nhật",
    "name": "Cơ sở nuôi Nguyễn Văn Hòa",
    "owner": "Nguyễn Văn Hòa"
  },
  {
    "lat": 12.547061,
    "ownerName": "Trần Văn Hà",
    "registrationCode": "Đang cập nhật",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "speciesList": [
      {
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "fluctuations": [],
        "id": "sp_28_1",
        "purposeCode": "T",
        "baseline": {
          "father": 1,
          "otherFemale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherUnknown": 0,
          "note": "Số lượng Chim Chào mào nuôi",
          "date": "2026-01-01",
          "mother": 1,
          "otherMale": 0
        },
        "vietnameseName": "Chim Chào mào",
        "scientificName": "Pycnonotus jocosus",
        "citesAppendix": "Khai báo kiểm lâm"
      }
    ],
    "commune": "Xã Krông Bông",
    "lng": 108.401029,
    "address": "Thôn 26, Xã Krông Bông, Tỉnh Đắk Lắk",
    "purposeCode": "T",
    "id": "fac_28",
    "facilityName": "Cơ sở nuôi Trần Văn Hà",
    "registrationDate": "",
    "phone": "",
    "note": "",
    "name": "Cơ sở nuôi Trần Văn Hà",
    "owner": "Trần Văn Hà"
  },
  {
    "id": "fac_29",
    "ownerName": "Trần Ngọc Long",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "facilityName": "Cơ sở nuôi Trần Ngọc Long",
    "phone": "",
    "registrationCode": "Đang cập nhật",
    "commune": "Xã Krông Bông",
    "note": "",
    "speciesList": [
      {
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "baseline": {
          "otherMale": 0,
          "note": "Số lượng Chim Cu gáy nuôi",
          "date": "2026-01-01",
          "otherUnknown": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 2,
          "mother": 2,
          "otherFemale": 0
        },
        "vietnameseName": "Chim Cu gáy",
        "scientificName": "Streptopelia chinensis",
        "fluctuations": [],
        "purposeCode": "T",
        "citesAppendix": "Khai báo kiểm lâm",
        "id": "sp_29_1"
      }
    ],
    "registrationDate": "",
    "address": "Thôn 2, Xã Krông Bông, Tỉnh Đắk Lắk",
    "purposeCode": "T",
    "name": "Cơ sở nuôi Trần Ngọc Long",
    "owner": "Trần Ngọc Long"
  },
  {
    "speciesList": [
      {
        "vietnameseName": "Cầy vòi Hương",
        "id": "sp_3_1",
        "scientificName": "Paradoxurus hermaphroditus",
        "baseline": {
          "otherUnknown": 0,
          "otherMale": 0,
          "note": "Cơ sở hiện nghỉ nuôi",
          "date": "2025-10-03",
          "otherFemale": 0,
          "mother": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 0
        },
        "citesAppendix": "Phụ lục II CITES",
        "purposeCode": "T",
        "fluctuations": [],
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)"
      }
    ],
    "commune": "xã Hòa Sơn",
    "lat": 12.506699,
    "address": "Thôn 4, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "purposeCode": "T",
    "lng": 108.1885,
    "id": "fac_3",
    "phone": "",
    "registrationDate": "2025-10-03",
    "updatedAt": "2026-10-18T15:21:37.461Z",
    "ownerName": "Trịnh Viết Long",
    "note": "Nghỉ nuôi",
    "registrationCode": "028-25/B-DLC",
    "facilityName": "Cơ sở nuôi Trịnh Viết Long",
    "name": "Cơ sở nuôi Trịnh Viết Long",
    "owner": "Trịnh Viết Long"
  },
  {
    "updatedAt": "2026-10-18T15:21:37.461Z",
    "registrationDate": "",
    "ownerName": "Hoàng Văn Hải",
    "phone": "",
    "note": "",
    "facilityName": "Cơ sở nuôi Hoàng Văn Hải",
    "id": "fac_30",
    "lat": 12.574027,
    "registrationCode": "Đang cập nhật",
    "address": "Thôn 6, Xã Dang Kang, Tỉnh Đắk Lắk",
    "purposeCode": "T",
    "speciesList": [
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "vietnameseName": "Chim Chào mào",
        "scientificName": "Pycnonotus jocosus",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "baseline": {
          "mother": 2,
          "note": "Số lượng Chim Chào mào nuôi",
          "otherFemale": 2,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-01-01",
          "father": 2,
          "otherUnknown": 3,
          "otherMale": 3
        },
        "purposeCode": "T",
        "id": "sp_30_1",
        "fluctuations": []
      }
    ],
    "commune": "Xã Dang Kang",
    "lng": 108.3365,
    "name": "Cơ sở nuôi Hoàng Văn Hải",
    "owner": "Hoàng Văn Hải"
  },
  {
    "phone": "",
    "lng": 108.33214,
    "facilityName": "Cơ sở nuôi Võ Văn Nhơn",
    "speciesList": [
      {
        "fluctuations": [],
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherFemale": 0,
          "otherUnknown": 0,
          "note": "Số lượng Chim Chào mào nuôi cảnh",
          "date": "2026-01-01",
          "otherMale": 0,
          "mother": 1,
          "father": 1
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "purposeCode": "O",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "id": "sp_31_1",
        "vietnameseName": "Chim Chào mào",
        "scientificName": "Pycnonotus jocosus"
      }
    ],
    "lat": 12.562678,
    "id": "fac_31",
    "purposeCode": "O",
    "updatedAt": "2026-10-18T15:21:37.461Z",
    "ownerName": "Võ Văn Nhơn",
    "registrationCode": "Đang cập nhật",
    "address": "Thôn 7, Xã Dang Kang, Tỉnh Đắk Lắk",
    "commune": "Xã Dang Kang",
    "registrationDate": "",
    "note": "Làm cảnh",
    "name": "Cơ sở nuôi Võ Văn Nhơn",
    "owner": "Võ Văn Nhơn"
  },
  {
    "speciesList": [
      {
        "id": "sp_4_1",
        "baseline": {
          "date": "2026-01-01",
          "note": "Chưa được cấp mã số cơ sở",
          "otherFemale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherUnknown": 0,
          "mother": 11,
          "father": 4,
          "otherMale": 0
        },
        "scientificName": "Paradoxurus hermaphroditus",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "vietnameseName": "Cầy vòi Hương",
        "fluctuations": [],
        "purposeCode": "T",
        "citesAppendix": "Phụ lục II CITES"
      }
    ],
    "purposeCode": "T",
    "id": "fac_4",
    "registrationCode": "104-26/B-DLC",
    "facilityName": "Cơ sở nuôi Phạm Bá Quang",
    "lat": 12.492824,
    "phone": "",
    "note": "104-26/B-DLC",
    "registrationDate": "2026-07-06",
    "ownerName": "Phạm Bá Quang",
    "updatedAt": "2026-10-18T15:21:37.461Z",
    "address": "Thôn 8, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "lng": 108.29803,
    "commune": "xã Hòa Sơn",
    "name": "Cơ sở nuôi Phạm Bá Quang",
    "owner": "Phạm Bá Quang"
  },
  {
    "registrationDate": "2022-04-22",
    "registrationCode": "IIB-DLC-021",
    "note": "Nghỉ nuôi",
    "speciesList": [
      {
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "id": "sp_5_1",
        "purposeCode": "T",
        "baseline": {
          "otherUnknown": 0,
          "otherMale": 0,
          "date": "2022-04-22",
          "otherFemale": 0,
          "note": "Cơ sở nghỉ nuôi",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 0,
          "mother": 0
        },
        "citesAppendix": "Phụ lục II CITES",
        "fluctuations": []
      }
    ],
    "commune": "xã Hòa Sơn",
    "updatedAt": "2026-10-18T15:21:37.461Z",
    "address": "Thôn 1, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "ownerName": "Phan Thanh Hùng",
    "purposeCode": "T",
    "phone": "",
    "id": "fac_5",
    "facilityName": "Cơ sở nuôi Phan Thanh Hùng",
    "name": "Cơ sở nuôi Phan Thanh Hùng",
    "owner": "Phan Thanh Hùng"
  },
  {
    "speciesList": [
      {
        "fluctuations": [],
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "purposeCode": "T",
        "id": "sp_6_1",
        "citesAppendix": "Phụ lục II CITES",
        "baseline": {
          "otherMale": 0,
          "otherUnknown": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 0,
          "date": "2026-01-01",
          "note": "Cơ sở nghỉ nuôi",
          "mother": 0,
          "otherFemale": 0
        },
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương"
      }
    ],
    "facilityName": "Cơ sở nuôi Lê Nguyễn Nhật Tân",
    "registrationDate": "",
    "purposeCode": "T",
    "registrationCode": "IIB-DLC-025",
    "id": "fac_6",
    "updatedAt": "2026-10-18T15:21:37.461Z",
    "ownerName": "Lê Nguyễn Nhật Tân",
    "note": "Nghỉ nuôi",
    "phone": "",
    "commune": "xã Hòa Sơn",
    "address": "Thôn 6, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "name": "Cơ sở nuôi Lê Nguyễn Nhật Tân",
    "owner": "Lê Nguyễn Nhật Tân"
  },
  {
    "registrationCode": "IIB-C-DLC-055",
    "speciesList": [
      {
        "id": "sp_7_1",
        "baseline": {
          "otherUnknown": 19,
          "father": 3,
          "otherFemale": 14,
          "mother": 5,
          "date": "2024-07-03",
          "note": "Số lượng Cầy vòi Hương hiện có",
          "otherMale": 12,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông"
        },
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "citesAppendix": "Phụ lục II CITES",
        "fluctuations": [],
        "purposeCode": "T"
      },
      {
        "fluctuations": [],
        "purposeCode": "T",
        "vietnameseName": "Cầy vòi mốc",
        "scientificName": "Paguma larvata",
        "citesAppendix": "Phụ lục II CITES",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "id": "sp_7_2",
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherFemale": 0,
          "otherUnknown": 0,
          "note": "Số lượng Cầy vòi mốc hiện có",
          "date": "2024-07-03",
          "mother": 3,
          "otherMale": 0,
          "father": 2
        }
      },
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường",
        "id": "sp_7_3",
        "fluctuations": [],
        "baseline": {
          "mother": 1,
          "otherMale": 0,
          "father": 1,
          "note": "Hiện trạng nuôi loài Don",
          "date": "2026-01-01",
          "otherFemale": 0,
          "otherUnknown": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông"
        },
        "scientificName": "Atherurus macrourus",
        "vietnameseName": "Don",
        "purposeCode": "T"
      },
      {
        "purposeCode": "T",
        "citesAppendix": "Khai báo kiểm lâm",
        "id": "sp_7_4",
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 21,
          "otherUnknown": 11,
          "father": 6,
          "date": "2026-01-01",
          "note": "Hiện trạng nuôi loài Nhím",
          "otherFemale": 31,
          "mother": 12
        },
        "fluctuations": [],
        "group": "Động vật rừng thông thường",
        "vietnameseName": "Nhím",
        "scientificName": "Hystrix brachyura"
      }
    ],
    "id": "fac_7",
    "purposeCode": "T",
    "note": "",
    "registrationDate": "2024-07-03",
    "phone": "",
    "lat": 12.472545,
    "ownerName": "Nguyễn Tấn Danh Nhân",
    "facilityName": "Cơ sở nuôi Nguyễn Tấn Danh Nhân",
    "updatedAt": "2026-10-18T15:21:37.461Z",
    "address": "Buôn Tơ Rang, xã Yang Mao, Tỉnh Đắk Lắk",
    "lng": 108.562016,
    "commune": "xã Yang Mao",
    "name": "Cơ sở nuôi Nguyễn Tấn Danh Nhân",
    "owner": "Nguyễn Tấn Danh Nhân"
  },
  {
    "facilityName": "Cơ sở nuôi Huỳnh Công Nam",
    "registrationCode": "53-26/B-DLC",
    "id": "fac_8",
    "updatedAt": "2026-10-18T15:21:37.461Z",
    "ownerName": "Huỳnh Công Nam",
    "address": "Buôn chàm A, xã Yang Mao, Tỉnh Đắk Lắk",
    "commune": "xã Yang Mao",
    "note": "",
    "purposeCode": "T",
    "phone": "",
    "registrationDate": "2026-05-05",
    "lat": 12.483552,
    "speciesList": [
      {
        "id": "sp_8_1",
        "baseline": {
          "date": "2026-05-05",
          "note": "Hiện trạng nuôi ban đầu",
          "otherMale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 5,
          "otherFemale": 0,
          "father": 1,
          "otherUnknown": 4
        },
        "citesAppendix": "Phụ lục II CITES",
        "purposeCode": "T",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "vietnameseName": "Cầy vòi Hương",
        "fluctuations": [],
        "scientificName": "Paradoxurus hermaphroditus"
      }
    ],
    "lng": 108.562716,
    "name": "Cơ sở nuôi Huỳnh Công Nam",
    "owner": "Huỳnh Công Nam"
  },
  {
    "phone": "",
    "address": "Thôn Ea Luêh, xã Yang Mao, Tỉnh Đắk Lắk",
    "commune": "xã Yang Mao",
    "registrationDate": "2026-03-03",
    "speciesList": [
      {
        "id": "sp_9_1",
        "fluctuations": [],
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "baseline": {
          "note": "Hiện trạng nuôi ban đầu",
          "date": "2026-03-03",
          "father": 5,
          "otherMale": 0,
          "mother": 8,
          "otherFemale": 0,
          "otherUnknown": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông"
        },
        "citesAppendix": "Phụ lục II CITES",
        "purposeCode": "T",
        "vietnameseName": "Cầy vòi Hương",
        "scientificName": "Paradoxurus hermaphroditus"
      }
    ],
    "ownerName": "Trần Duy Quân",
    "id": "fac_9",
    "updatedAt": "2026-10-18T15:21:37.461Z",
    "purposeCode": "T",
    "lat": 12.503389,
    "facilityName": "Cơ sở nuôi Trần Duy Quân",
    "lng": 108.655302,
    "note": "",
    "registrationCode": "14-26/B-DLC",
    "name": "Cơ sở nuôi Trần Duy Quân",
    "owner": "Trần Duy Quân"
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
