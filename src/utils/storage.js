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
    "note": "",
    "registrationDate": "2023-03-17",
    "lng": 108.227912,
    "updatedAt": "2026-10-18T15:21:37.459Z",
    "ownerName": "Lê Thị Xuân",
    "phone": "",
    "address": "Thôn 3, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "lat": 12.496848,
    "commune": "xã Hòa Sơn",
    "id": "fac_1",
    "facilityName": "Cơ sở nuôi Lê Thị Xuân",
    "registrationCode": "IIB-DLC-027",
    "purposeCode": "T",
    "owner": "Lê Thị Xuân",
    "speciesList": [
      {
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "fluctuations": [
          {
            "incOtherFemale": 0,
            "id": "fluc_1792335164333",
            "decOtherMale": 0,
            "isGenderIdentifyMode": true,
            "approvalStatus": "APPROVED",
            "incFather": 0,
            "purpose": "T",
            "decFather": 0,
            "date": "2025-10-18",
            "incMother": 0,
            "incOtherUnknown": 0,
            "time": "21:52",
            "reason": "Xác định giới tính con con",
            "isPurchaseMode": false,
            "decMother": 0,
            "verifier": "",
            "incOtherMale": 2,
            "decOtherFemale": 0,
            "decOtherUnknown": 2,
            "createdAt": 1792335164333
          },
          {
            "verifier": "",
            "incMother": 0,
            "isPurchaseMode": false,
            "decMother": 0,
            "id": "fluc_1792335203123",
            "decOtherMale": 0,
            "createdAt": 1792335203123,
            "decOtherFemale": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "incOtherUnknown": 21,
            "purpose": "T",
            "incOtherMale": 0,
            "incOtherFemale": 0,
            "decOtherUnknown": 0,
            "time": "21:53",
            "date": "2026-06-17",
            "decFather": 0,
            "isGenderIdentifyMode": false,
            "approvalStatus": "APPROVED",
            "incFather": 0
          },
          {
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "incFather": 0,
            "decFather": 0,
            "approvalStatus": "APPROVED",
            "incOtherMale": 0,
            "decOtherUnknown": 0,
            "purpose": "T",
            "incOtherFemale": 0,
            "time": "21:53",
            "date": "2026-08-29",
            "verifier": "",
            "incOtherUnknown": 11,
            "isGenderIdentifyMode": false,
            "createdAt": 1792335313527,
            "decOtherFemale": 0,
            "isPurchaseMode": false,
            "decOtherMale": 0,
            "id": "fluc_1792335313527",
            "decMother": 0,
            "incMother": 0
          },
          {
            "decMother": 0,
            "decOtherUnknown": 0,
            "approvalStatus": "APPROVED",
            "purpose": "T",
            "incMother": 0,
            "createdAt": 1792335381718,
            "verifier": "",
            "incOtherMale": 0,
            "incOtherUnknown": 0,
            "incOtherFemale": 0,
            "time": "21:55",
            "date": "2026-10-14",
            "isGenderIdentifyMode": false,
            "reason": "Xuất bán thương mại cho cơ sở B",
            "decOtherMale": 1,
            "decOtherFemale": 3,
            "isPurchaseMode": false,
            "decFather": 0,
            "incFather": 0,
            "id": "fluc_1792335381718"
          }
        ],
        "purposeCode": "T",
        "citesAppendix": "Phụ lục II CITES",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "baseline": {
          "father": 4,
          "otherMale": "10",
          "otherFemale": "8",
          "mother": 5,
          "otherUnknown": 2,
          "date": "2023-03-17",
          "note": "Số lượng vật nuôi theo chứng nhận cơ sở",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông"
        },
        "id": "sp_1_1"
      }
    ],
    "name": "Cơ sở nuôi Lê Thị Xuân"
  },
  {
    "owner": "Trịnh Lục",
    "lat": 12.546946,
    "registrationCode": "52-26/B-DLC",
    "commune": "xã Cư Pui",
    "lng": 108.456819,
    "purposeCode": "T",
    "speciesList": [
      {
        "id": "sp_10_1",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "citesAppendix": "Phụ lục II CITES",
        "purposeCode": "T",
        "baseline": {
          "mother": "4",
          "otherMale": 0,
          "date": "2026-05-08",
          "note": "Hiện trạng nuôi ban đầu",
          "father": "1",
          "otherUnknown": 0,
          "otherFemale": 0,
          "verifier": "Hạt Kiểm lâm Huy���n Krông Bông"
        },
        "vietnameseName": "Cầy vòi Hương",
        "scientificName": "Paradoxurus hermaphroditus",
        "fluctuations": [
          {
            "isPurchaseMode": true,
            "decOtherUnknown": 0,
            "decFather": 0,
            "incFather": 2,
            "incOtherMale": 0,
            "incOtherUnknown": 0,
            "isGenderIdentifyMode": false,
            "time": "08:51",
            "decOtherFemale": 0,
            "date": "2026-05-16",
            "verifier": "",
            "reason": "Mua từ cơ sở nuôi sinh sản khác",
            "decOtherMale": 0,
            "incOtherFemale": 0,
            "createdAt": 1786413132829,
            "purpose": "T",
            "incMother": 4,
            "decMother": 0,
            "id": "fluc_1786413132829",
            "approvalStatus": "APPROVED"
          },
          {
            "decMother": 0,
            "incMother": 0,
            "id": "fluc_1786413181544",
            "isPurchaseMode": false,
            "verifier": "",
            "decOtherMale": 0,
            "date": "2026-06-09",
            "createdAt": 1786413181544,
            "time": "08:52",
            "decOtherFemale": 0,
            "incOtherFemale": 0,
            "decOtherUnknown": 0,
            "incOtherMale": 0,
            "incFather": 0,
            "approvalStatus": "APPROVED",
            "incOtherUnknown": 4,
            "purpose": "T",
            "decFather": 0,
            "isGenderIdentifyMode": false,
            "reason": "Sinh sản lứa F2 mới nở/sinh"
          },
          {
            "id": "fluc_1786413220093",
            "createdAt": 1786413220093,
            "decOtherFemale": 0,
            "isGenderIdentifyMode": false,
            "isPurchaseMode": true,
            "decOtherMale": 0,
            "incMother": 14,
            "decMother": 0,
            "purpose": "T",
            "approvalStatus": "APPROVED",
            "date": "2026-07-10",
            "decFather": 0,
            "incOtherMale": 0,
            "decOtherUnknown": 0,
            "incFather": 1,
            "time": "08:53",
            "verifier": "",
            "incOtherFemale": 0,
            "reason": "Mua từ cơ sở nuôi sinh sản khác",
            "incOtherUnknown": 0
          },
          {
            "createdAt": 1786413284623,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "isPurchaseMode": false,
            "decMother": 0,
            "time": "08:54",
            "decOtherFemale": 0,
            "date": "2026-07-11",
            "incOtherMale": 0,
            "incMother": 0,
            "decFather": 0,
            "decOtherUnknown": 0,
            "verifier": "",
            "decOtherMale": 0,
            "incOtherFemale": 0,
            "incFather": 0,
            "purpose": "T",
            "incOtherUnknown": 12,
            "approvalStatus": "APPROVED",
            "isGenderIdentifyMode": false,
            "id": "fluc_1786413284623"
          },
          {
            "reason": "Mua từ cơ sở nuôi sinh sản khác",
            "decOtherUnknown": 0,
            "createdAt": 1792146475584,
            "decOtherMale": 0,
            "incOtherFemale": 8,
            "decMother": 0,
            "incOtherUnknown": 0,
            "approvalStatus": "APPROVED",
            "time": "17:26",
            "date": "2026-08-03",
            "incMother": 0,
            "isPurchaseMode": true,
            "decFather": 0,
            "incFather": 0,
            "verifier": "",
            "id": "fluc_1792146475584",
            "isGenderIdentifyMode": false,
            "purpose": "T",
            "incOtherMale": 2,
            "decOtherFemale": 0
          },
          {
            "date": "2026-08-10",
            "id": "fluc_1786413405967",
            "approvalStatus": "APPROVED",
            "verifier": "",
            "time": "08:56",
            "reason": "Xuất bán thương mại cho cơ sở B",
            "decFather": 0,
            "purpose": "T",
            "incOtherMale": 0,
            "incFather": 0,
            "incOtherFemale": 0,
            "decOtherFemale": 5,
            "decOtherUnknown": 0,
            "createdAt": 1786413405967,
            "isGenderIdentifyMode": false,
            "decOtherMale": 0,
            "incMother": 0,
            "decMother": 0,
            "incOtherUnknown": 0,
            "isPurchaseMode": false
          },
          {
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "incMother": 0,
            "approvalStatus": "APPROVED",
            "decMother": 0,
            "incOtherMale": 0,
            "purpose": "T",
            "time": "17:28",
            "incOtherFemale": 0,
            "date": "2026-08-28",
            "createdAt": 1792146698997,
            "incOtherUnknown": 9,
            "decOtherFemale": 0,
            "isGenderIdentifyMode": false,
            "decOtherUnknown": 0,
            "isPurchaseMode": false,
            "id": "fluc_1792146698997",
            "decOtherMale": 0,
            "incFather": 0,
            "decFather": 0,
            "verifier": ""
          },
          {
            "decMother": 0,
            "incOtherMale": 0,
            "id": "fluc_1792146763664",
            "isPurchaseMode": false,
            "incMother": 0,
            "decOtherFemale": 0,
            "createdAt": 1792146763664,
            "decOtherUnknown": 0,
            "incOtherFemale": 0,
            "isGenderIdentifyMode": false,
            "verifier": "",
            "incOtherUnknown": 6,
            "purpose": "T",
            "date": "2026-09-01",
            "decFather": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "time": "17:31",
            "incFather": 0,
            "approvalStatus": "APPROVED",
            "decOtherMale": 0
          },
          {
            "isPurchaseMode": false,
            "date": "2026-09-25",
            "incMother": 0,
            "time": "17:32",
            "decMother": 0,
            "incOtherMale": 0,
            "purpose": "T",
            "createdAt": 1792146792454,
            "decOtherFemale": 0,
            "verifier": "",
            "decOtherMale": 0,
            "incOtherFemale": 0,
            "incOtherUnknown": 0,
            "id": "fluc_1792146792454",
            "decOtherUnknown": 3,
            "decFather": 0,
            "approvalStatus": "APPROVED",
            "isGenderIdentifyMode": false,
            "incFather": 0,
            "reason": "Chết do thời tiết/bệnh lý"
          }
        ]
      }
    ],
    "address": "Thôn 3, xã Cư Pui, Tỉnh Đắk Lắk",
    "name": "Cơ sở nuôi Trịnh Lục",
    "facilityName": "Cơ sở nuôi Trịnh Lục",
    "registrationDate": "2026-05-08",
    "id": "fac_10",
    "note": "",
    "updatedAt": "2026-10-19T03:57:43.906Z",
    "ownerName": "Trịnh Lục",
    "phone": ""
  },
  {
    "lat": 12.548123,
    "phone": "",
    "speciesList": [
      {
        "purposeCode": "T",
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "citesAppendix": "Phụ lục II CITES",
        "id": "sp_11_1",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "fluctuations": [
          {
            "incOtherMale": 0,
            "time": "09:22",
            "approvalStatus": "APPROVED",
            "date": "2026-08-11",
            "verifier": "",
            "incOtherFemale": 0,
            "decFather": 0,
            "incFather": 0,
            "incMother": 0,
            "purpose": "T",
            "decOtherUnknown": 0,
            "decMother": 0,
            "decOtherFemale": 0,
            "isPurchaseMode": false,
            "isGenderIdentifyMode": false,
            "createdAt": 1786414971813,
            "id": "fluc_1786414971813",
            "reason": "Xuất bán thương mại cho cơ sở B",
            "incOtherUnknown": 0,
            "decOtherMale": 1
          },
          {
            "decFather": 0,
            "date": "2026-09-09",
            "incOtherFemale": 0,
            "time": "10:27",
            "incFather": 0,
            "purpose": "T",
            "isGenderIdentifyMode": false,
            "approvalStatus": "APPROVED",
            "incOtherMale": 0,
            "isPurchaseMode": false,
            "verifier": "",
            "decOtherMale": 0,
            "incOtherUnknown": 3,
            "createdAt": 1791170873185,
            "id": "fluc_1791170873185",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decOtherUnknown": 0,
            "incMother": 0,
            "decMother": 0,
            "decOtherFemale": 0
          },
          {
            "isGenderIdentifyMode": false,
            "reason": "Chết do thời tiết/bệnh lý",
            "decOtherMale": 0,
            "createdAt": 1791170912846,
            "decOtherFemale": 0,
            "verifier": "",
            "decMother": 0,
            "isPurchaseMode": false,
            "purpose": "T",
            "incMother": 0,
            "incFather": 0,
            "decFather": 0,
            "id": "fluc_1791170912846",
            "incOtherUnknown": 0,
            "date": "2026-09-17",
            "time": "10:28",
            "approvalStatus": "APPROVED",
            "decOtherUnknown": 5,
            "incOtherMale": 0,
            "incOtherFemale": 0
          },
          {
            "isGenderIdentifyMode": true,
            "decOtherMale": 0,
            "date": "2026-09-18",
            "id": "fluc_1791170959593",
            "time": "10:28",
            "approvalStatus": "APPROVED",
            "decFather": 0,
            "verifier": "",
            "incFather": 0,
            "incOtherFemale": 10,
            "decOtherUnknown": 17,
            "decMother": 0,
            "purpose": "T",
            "decOtherFemale": 0,
            "incMother": 0,
            "incOtherMale": 7,
            "createdAt": 1791170959593,
            "isPurchaseMode": false,
            "incOtherUnknown": 0,
            "reason": "Xác định giới tính con con"
          },
          {
            "decMother": 0,
            "incMother": 0,
            "id": "fluc_1791170669944",
            "decOtherFemale": 5,
            "decOtherUnknown": 0,
            "isPurchaseMode": false,
            "decOtherMale": 5,
            "createdAt": 1791170669944,
            "incOtherUnknown": 0,
            "date": "2026-09-22",
            "time": "10:23",
            "reason": "Xuất bán thương mại cho cơ sở B",
            "approvalStatus": "APPROVED",
            "incOtherMale": 0,
            "incFather": 0,
            "decFather": 0,
            "isGenderIdentifyMode": false,
            "purpose": "T",
            "incOtherFemale": 0,
            "verifier": ""
          }
        ],
        "baseline": {
          "otherUnknown": 19,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 4,
          "otherFemale": 16,
          "mother": 7,
          "date": "2024-09-25",
          "note": "Hiện trạng nuôi đăng ký",
          "otherMale": 5
        }
      }
    ],
    "purposeCode": "T",
    "registrationDate": "2024-09-25",
    "lng": 108.458901,
    "updatedAt": "2026-10-18T16:03:32.338Z",
    "id": "fac_11",
    "ownerName": "Nguyễn Hữu Đô",
    "note": "",
    "registrationCode": "IIB-C-DLC-063",
    "name": "Cơ sở nuôi Nguyễn Hữu Đô",
    "address": "Thôn 3, xã Cư Pui, Tỉnh Đắk Lắk",
    "commune": "xã Cư Pui",
    "facilityName": "Cơ sở nuôi Nguyễn Hữu Đô",
    "owner": "Nguyễn Hữu Đô"
  },
  {
    "registrationDate": "2024-09-06",
    "phone": "",
    "name": "Cơ sở nuôi Lê Thanh Đức",
    "address": "Thôn 5, Xã Krông Bông, Tỉnh Đắk Lắk",
    "commune": "Xã Krông Bông",
    "purposeCode": "T",
    "speciesList": [
      {
        "vietnameseName": "Cầy vòi Hương",
        "scientificName": "Paradoxurus hermaphroditus",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "baseline": {
          "otherFemale": 9,
          "father": 2,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2024-09-06",
          "note": "Hiện trạng nuôi đăng ký",
          "mother": 7,
          "otherUnknown": "5",
          "otherMale": 11
        },
        "id": "sp_12_1",
        "fluctuations": [
          {
            "incOtherFemale": 0,
            "decFather": 0,
            "decOtherUnknown": 5,
            "purpose": "T",
            "incFather": 0,
            "reason": "Xác định giới tính con con",
            "id": "fluc_1792417516454",
            "approvalStatus": "APPROVED",
            "isGenderIdentifyMode": true,
            "decOtherMale": 0,
            "incOtherUnknown": 0,
            "incOtherMale": 5,
            "time": "20:44",
            "date": "2026-01-01",
            "verifier": "",
            "isPurchaseMode": false,
            "createdAt": 1792417516454,
            "incMother": 0,
            "decOtherFemale": 0,
            "decMother": 0
          },
          {
            "date": "2026-02-10",
            "time": "20:45",
            "approvalStatus": "APPROVED",
            "incFather": 0,
            "isGenderIdentifyMode": false,
            "purpose": "T",
            "decFather": 0,
            "incOtherMale": 0,
            "incOtherFemale": 0,
            "id": "fluc_1792417560988",
            "decMother": 0,
            "decOtherUnknown": 0,
            "incMother": 0,
            "verifier": "",
            "decOtherFemale": 0,
            "decOtherMale": 0,
            "isPurchaseMode": false,
            "createdAt": 1792417560988,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "incOtherUnknown": 5
          },
          {
            "time": "20:46",
            "incOtherFemale": 0,
            "date": "2026-02-15",
            "verifier": "",
            "isGenderIdentifyMode": false,
            "incOtherMale": 0,
            "approvalStatus": "APPROVED",
            "incFather": 0,
            "id": "fluc_1792417589052",
            "purpose": "T",
            "decFather": 0,
            "incOtherUnknown": 1,
            "incMother": 0,
            "decOtherMale": 0,
            "isPurchaseMode": false,
            "decMother": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decOtherFemale": 0,
            "decOtherUnknown": 0,
            "createdAt": 1792417589052
          },
          {
            "decOtherMale": 5,
            "incMother": 0,
            "decMother": 0,
            "isPurchaseMode": false,
            "decOtherFemale": 0,
            "createdAt": 1792417627701,
            "reason": "Xuất bán thương mại cho cơ sở B",
            "incOtherFemale": 0,
            "incOtherUnknown": 0,
            "id": "fluc_1792417627701",
            "verifier": "",
            "approvalStatus": "APPROVED",
            "isGenderIdentifyMode": false,
            "purpose": "T",
            "decOtherUnknown": 0,
            "decFather": 0,
            "incOtherMale": 0,
            "date": "2026-04-26",
            "incFather": 0,
            "time": "20:46"
          },
          {
            "decOtherFemale": 2,
            "reason": "Chuyển cá thể đực và cái đủ tuổi vào đàn bố mẹ.",
            "createdAt": 1792417724636,
            "id": "fluc_1792417724636",
            "incMother": 2,
            "isPurchaseMode": false,
            "decMother": 0,
            "purpose": "T",
            "incOtherMale": 0,
            "decOtherMale": 10,
            "time": "20:47",
            "incFather": 10,
            "date": "2026-05-01",
            "verifier": "",
            "incOtherUnknown": 0,
            "approvalStatus": "APPROVED",
            "decFather": 0,
            "decOtherUnknown": 0,
            "isGenderIdentifyMode": false,
            "incOtherFemale": 0
          },
          {
            "reason": "Xác định giới tính con con",
            "incOtherMale": 5,
            "id": "fluc_1792417838117",
            "isPurchaseMode": false,
            "decFather": 0,
            "decOtherFemale": 0,
            "incFather": 0,
            "decMother": 0,
            "incOtherFemale": 1,
            "decOtherUnknown": 6,
            "verifier": "",
            "isGenderIdentifyMode": true,
            "purpose": "T",
            "incMother": 0,
            "incOtherUnknown": 0,
            "createdAt": 1792417838117,
            "date": "2026-05-01",
            "time": "20:48",
            "approvalStatus": "APPROVED",
            "decOtherMale": 0
          },
          {
            "isPurchaseMode": false,
            "createdAt": 1792417884074,
            "decOtherUnknown": 0,
            "decMother": 0,
            "decOtherMale": 0,
            "incOtherUnknown": 4,
            "incMother": 0,
            "purpose": "T",
            "decOtherFemale": 0,
            "date": "2026-05-01",
            "decFather": 0,
            "incFather": 0,
            "id": "fluc_1792417884074",
            "time": "20:50",
            "incOtherFemale": 0,
            "verifier": "",
            "isGenderIdentifyMode": false,
            "incOtherMale": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "approvalStatus": "APPROVED"
          },
          {
            "purpose": "T",
            "incOtherUnknown": 4,
            "decFather": 0,
            "isGenderIdentifyMode": false,
            "approvalStatus": "APPROVED",
            "incFather": 0,
            "incOtherMale": 0,
            "verifier": "",
            "incOtherFemale": 0,
            "decOtherUnknown": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "createdAt": 1792417900794,
            "decOtherFemale": 0,
            "decOtherMale": 0,
            "isPurchaseMode": false,
            "incMother": 0,
            "time": "20:51",
            "decMother": 0,
            "id": "fluc_1792417900794",
            "date": "2026-05-04"
          },
          {
            "isGenderIdentifyMode": false,
            "purpose": "T",
            "createdAt": 1792418004771,
            "decOtherMale": 0,
            "isPurchaseMode": false,
            "decOtherFemale": 0,
            "id": "fluc_1792418004771",
            "incMother": 0,
            "decMother": 0,
            "decOtherUnknown": 0,
            "verifier": "",
            "incOtherFemale": 0,
            "decFather": 0,
            "time": "20:53",
            "date": "2026-05-10",
            "incFather": 0,
            "incOtherMale": 0,
            "incOtherUnknown": 3,
            "approvalStatus": "APPROVED",
            "reason": "Sinh sản lứa F2 mới nở/sinh"
          },
          {
            "decOtherUnknown": 0,
            "approvalStatus": "APPROVED",
            "id": "fluc_1792418025850",
            "decFather": 0,
            "incOtherUnknown": 4,
            "decOtherMale": 0,
            "incFather": 0,
            "incOtherFemale": 0,
            "purpose": "T",
            "verifier": "",
            "decMother": 0,
            "decOtherFemale": 0,
            "isGenderIdentifyMode": false,
            "incOtherMale": 0,
            "incMother": 0,
            "createdAt": 1792418025850,
            "reason": "Sinh sản lứa F2 mới n���/sinh",
            "date": "2026-05-25",
            "isPurchaseMode": false,
            "time": "20:53"
          },
          {
            "approvalStatus": "APPROVED",
            "createdAt": 1792418049385,
            "incOtherUnknown": 3,
            "incOtherFemale": 0,
            "incMother": 0,
            "decMother": 0,
            "id": "fluc_1792418049385",
            "decOtherUnknown": 0,
            "decOtherMale": 0,
            "incOtherMale": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decOtherFemale": 0,
            "isGenderIdentifyMode": false,
            "decFather": 0,
            "incFather": 0,
            "verifier": "",
            "time": "20:53",
            "date": "2026-06-07",
            "purpose": "T",
            "isPurchaseMode": false
          },
          {
            "id": "fluc_1792418078546",
            "incFather": 0,
            "incOtherFemale": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "purpose": "T",
            "decFather": 0,
            "date": "2026-06-14",
            "isGenderIdentifyMode": false,
            "time": "20:54",
            "approvalStatus": "APPROVED",
            "incOtherMale": 0,
            "decOtherMale": 0,
            "isPurchaseMode": false,
            "incOtherUnknown": 3,
            "createdAt": 1792418078546,
            "incMother": 0,
            "verifier": "",
            "decOtherUnknown": 0,
            "decOtherFemale": 0,
            "decMother": 0
          },
          {
            "decOtherUnknown": 0,
            "createdAt": 1792418108153,
            "verifier": "",
            "purpose": "T",
            "incOtherFemale": 0,
            "incOtherMale": 0,
            "incOtherUnknown": 3,
            "decMother": 0,
            "approvalStatus": "APPROVED",
            "incMother": 0,
            "id": "fluc_1792418108153",
            "incFather": 0,
            "isPurchaseMode": false,
            "isGenderIdentifyMode": false,
            "decFather": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "time": "20:54",
            "date": "2026-06-22",
            "decOtherMale": 0,
            "decOtherFemale": 0
          },
          {
            "isGenderIdentifyMode": false,
            "approvalStatus": "APPROVED",
            "purpose": "T",
            "incFather": 0,
            "decFather": 0,
            "incOtherMale": 0,
            "incOtherFemale": 0,
            "decOtherMale": 0,
            "decMother": 0,
            "incMother": 0,
            "decOtherFemale": 0,
            "incOtherUnknown": 3,
            "id": "fluc_1792418131817",
            "date": "2026-07-04",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "createdAt": 1792418131817,
            "isPurchaseMode": false,
            "time": "20:55",
            "decOtherUnknown": 0,
            "verifier": ""
          },
          {
            "decOtherUnknown": 0,
            "isGenderIdentifyMode": false,
            "incFather": 0,
            "decOtherMale": 0,
            "isPurchaseMode": false,
            "decFather": 0,
            "time": "20:55",
            "date": "2026-09-03",
            "verifier": "",
            "incOtherUnknown": 3,
            "decOtherFemale": 0,
            "createdAt": 1792418154936,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "incOtherFemale": 0,
            "purpose": "T",
            "decMother": 0,
            "id": "fluc_1792418154936",
            "incMother": 0,
            "incOtherMale": 0,
            "approvalStatus": "APPROVED"
          },
          {
            "time": "20:56",
            "isPurchaseMode": false,
            "date": "2026-09-07",
            "incFather": 0,
            "decFather": 0,
            "verifier": "",
            "decOtherFemale": 0,
            "decOtherMale": 0,
            "decOtherUnknown": 0,
            "decMother": 0,
            "incOtherMale": 0,
            "incMother": 0,
            "incOtherFemale": 0,
            "createdAt": 1792418181435,
            "incOtherUnknown": 3,
            "isGenderIdentifyMode": false,
            "purpose": "T",
            "id": "fluc_1792418181435",
            "approvalStatus": "APPROVED",
            "reason": "Sinh sản lứa F2 mới nở/sinh"
          },
          {
            "incOtherUnknown": 2,
            "purpose": "T",
            "approvalStatus": "APPROVED",
            "createdAt": 1792418225473,
            "time": "20:56",
            "incMother": 0,
            "decOtherUnknown": 0,
            "isGenderIdentifyMode": false,
            "incOtherFemale": 0,
            "date": "2026-09-13",
            "id": "fluc_1792418225473",
            "decOtherMale": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decMother": 0,
            "incOtherMale": 0,
            "decOtherFemale": 0,
            "incFather": 0,
            "decFather": 0,
            "verifier": "",
            "isPurchaseMode": false
          }
        ],
        "citesAppendix": "Phụ lục II CITES",
        "purposeCode": "T"
      }
    ],
    "updatedAt": "2026-10-19T13:57:05.473Z",
    "ownerName": "Lê Thanh Đức",
    "registrationCode": "IIB-C-DLC-060",
    "facilityName": "Cơ sở nuôi Lê Thanh Đức",
    "lng": 108.332398,
    "id": "fac_12",
    "note": "",
    "lat": 12.528258,
    "owner": "Lê Thanh Đức"
  },
  {
    "speciesList": [
      {
        "purposeCode": "T",
        "citesAppendix": "Phụ lục II CITES",
        "fluctuations": [
          {
            "createdAt": 1792416053149,
            "decOtherFemale": 0,
            "incOtherMale": 1,
            "incOtherUnknown": 0,
            "purpose": "T",
            "reason": "Xác định giới tính con con",
            "decMother": 0,
            "isPurchaseMode": false,
            "decOtherUnknown": 8,
            "incMother": 0,
            "verifier": "",
            "incFather": 0,
            "decFather": 0,
            "id": "fluc_1792416053149",
            "approvalStatus": "APPROVED",
            "decOtherMale": 0,
            "isGenderIdentifyMode": true,
            "date": "2025-12-01",
            "time": "20:18",
            "incOtherFemale": 7
          },
          {
            "id": "fluc_1792416354610",
            "approvalStatus": "APPROVED",
            "decOtherUnknown": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "incOtherFemale": 0,
            "incOtherUnknown": 2,
            "verifier": "",
            "decOtherMale": 0,
            "decFather": 0,
            "incFather": 0,
            "date": "2026-01-01",
            "isGenderIdentifyMode": false,
            "decOtherFemale": 0,
            "time": "20:25",
            "incMother": 0,
            "decMother": 0,
            "purpose": "T",
            "incOtherMale": 0,
            "isPurchaseMode": false,
            "createdAt": 1792416354610
          },
          {
            "reason": "Xuất bán thương mại cho cơ sở B",
            "purpose": "T",
            "decOtherUnknown": 0,
            "createdAt": 1792416591656,
            "decOtherFemale": 4,
            "isPurchaseMode": false,
            "incMother": 0,
            "verifier": "",
            "decMother": 0,
            "decOtherMale": 1,
            "incOtherUnknown": 0,
            "incOtherMale": 0,
            "decFather": 0,
            "incFather": 0,
            "approvalStatus": "APPROVED",
            "time": "20:29",
            "isGenderIdentifyMode": false,
            "date": "2026-04-10",
            "incOtherFemale": 0,
            "id": "fluc_1792416591656"
          },
          {
            "incOtherUnknown": 3,
            "date": "2026-04-28",
            "decOtherFemale": 0,
            "createdAt": 1792416647248,
            "decOtherMale": 0,
            "time": "20:30",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decMother": 0,
            "decOtherUnknown": 0,
            "verifier": "",
            "incMother": 0,
            "isPurchaseMode": false,
            "id": "fluc_1792416647248",
            "decFather": 0,
            "approvalStatus": "APPROVED",
            "incFather": 0,
            "purpose": "T",
            "isGenderIdentifyMode": false,
            "incOtherFemale": 0,
            "incOtherMale": 0
          },
          {
            "isPurchaseMode": false,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "createdAt": 1792416679840,
            "decOtherMale": 0,
            "incMother": 0,
            "decOtherFemale": 0,
            "decMother": 0,
            "purpose": "T",
            "isGenderIdentifyMode": false,
            "incOtherFemale": 0,
            "id": "fluc_1792416679840",
            "date": "2026-05-05",
            "incFather": 0,
            "verifier": "",
            "decOtherUnknown": 0,
            "time": "20:30",
            "decFather": 0,
            "approvalStatus": "APPROVED",
            "incOtherMale": 0,
            "incOtherUnknown": 2
          },
          {
            "decMother": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "incMother": 0,
            "approvalStatus": "APPROVED",
            "incOtherMale": 0,
            "createdAt": 1792416741735,
            "incOtherFemale": 0,
            "id": "fluc_1792416741735",
            "date": "2026-05-07",
            "decOtherMale": 0,
            "time": "20:31",
            "decOtherUnknown": 0,
            "decOtherFemale": 0,
            "isPurchaseMode": false,
            "incFather": 0,
            "isGenderIdentifyMode": false,
            "decFather": 0,
            "purpose": "T",
            "incOtherUnknown": 2,
            "verifier": ""
          },
          {
            "incOtherUnknown": 0,
            "verifier": "",
            "isGenderIdentifyMode": false,
            "id": "fluc_1792416788544",
            "approvalStatus": "APPROVED",
            "purpose": "T",
            "decOtherMale": 0,
            "createdAt": 1792416788544,
            "incMother": 0,
            "decOtherUnknown": 2,
            "incOtherFemale": 0,
            "decMother": 0,
            "reason": "Chết do thời tiết/bệnh lý",
            "date": "2026-06-05",
            "decOtherFemale": 0,
            "time": "20:32",
            "incFather": 0,
            "decFather": 0,
            "incOtherMale": 0,
            "isPurchaseMode": false
          },
          {
            "time": "20:33",
            "date": "2026-09-08",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "approvalStatus": "APPROVED",
            "purpose": "T",
            "incOtherMale": 0,
            "id": "fluc_1792416822192",
            "decFather": 0,
            "incOtherFemale": 0,
            "incFather": 0,
            "incMother": 0,
            "verifier": "",
            "incOtherUnknown": 3,
            "decMother": 0,
            "decOtherMale": 0,
            "decOtherFemale": 0,
            "isGenderIdentifyMode": false,
            "decOtherUnknown": 0,
            "isPurchaseMode": false,
            "createdAt": 1792416822192
          },
          {
            "reason": "Xuất bán thương mại cho cơ sở B",
            "createdAt": 1792416545121,
            "verifier": "",
            "decOtherFemale": 4,
            "decMother": 0,
            "isPurchaseMode": false,
            "time": "20:28",
            "date": "2026-10-01",
            "decOtherMale": 1,
            "incMother": 0,
            "incOtherMale": 0,
            "decOtherUnknown": 0,
            "decFather": 0,
            "incFather": 0,
            "purpose": "T",
            "approvalStatus": "APPROVED",
            "id": "fluc_1792416545121",
            "incOtherUnknown": 0,
            "incOtherFemale": 0,
            "isGenderIdentifyMode": false
          },
          {
            "isGenderIdentifyMode": false,
            "decOtherFemale": 0,
            "id": "fluc_1792416843767",
            "date": "2026-10-05",
            "verifier": "",
            "createdAt": 1792416843767,
            "decOtherUnknown": 0,
            "time": "20:33",
            "incMother": 0,
            "purpose": "T",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "incOtherUnknown": 1,
            "decOtherMale": 0,
            "isPurchaseMode": false,
            "decMother": 0,
            "incOtherMale": 0,
            "approvalStatus": "APPROVED",
            "incFather": 0,
            "decFather": 0,
            "incOtherFemale": 0
          }
        ],
        "id": "sp_13_1",
        "vietnameseName": "Cầy vòi Hương",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "scientificName": "Paradoxurus hermaphroditus",
        "baseline": {
          "mother": 7,
          "otherUnknown": "8",
          "otherFemale": 10,
          "father": 6,
          "otherMale": 7,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2025-07-31",
          "note": "Hiện trạng nuôi đăng ký"
        }
      }
    ],
    "id": "fac_13",
    "lng": 108.414746,
    "purposeCode": "T",
    "commune": "Xã Krông Bông",
    "address": "Thôn 8, Xã Krông Bông, Tỉnh Đắk Lắk",
    "ownerName": "Ngô Thị Trang",
    "note": "",
    "updatedAt": "2026-10-19T13:42:03.575Z",
    "phone": "",
    "registrationCode": "010-25/B-DLC",
    "lat": 12.53985,
    "owner": "Ngô Thị Trang",
    "facilityName": "Cơ sở nuôi Ngô Thị Trang",
    "name": "Cơ sở nuôi Ngô Thị Trang",
    "registrationDate": "2025-07-31"
  },
  {
    "lat": 12.492108,
    "facilityName": "Cơ sở nuôi Hà Huy Thanh",
    "address": "TDP4, Xã Krông Bông, Tỉnh Đắk Lắk",
    "commune": "Xã Krông Bông",
    "speciesList": [
      {
        "citesAppendix": "Phụ lục II CITES",
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 23,
          "father": 5,
          "otherFemale": 0,
          "date": "2026-03-17",
          "note": "Hiện trạng nuôi đăng ký",
          "otherUnknown": 0,
          "otherMale": 0
        },
        "scientificName": "Paguma larvata",
        "vietnameseName": "Cầy vòi mốc",
        "purposeCode": "T",
        "fluctuations": [],
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "id": "sp_14_1"
      },
      {
        "scientificName": "Rhizomys sumatrensis",
        "fluctuations": [],
        "vietnameseName": "Dúi má đào",
        "purposeCode": "T",
        "baseline": {
          "otherMale": 0,
          "mother": 34,
          "otherUnknown": 0,
          "father": 9,
          "note": "Hiện trạng nuôi loài Dúi má đào",
          "date": "2026-01-01",
          "otherFemale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông"
        },
        "group": "Động vật rừng thông thường",
        "citesAppendix": "Khai báo kiểm lâm",
        "id": "sp_14_2"
      }
    ],
    "registrationDate": "2026-03-17",
    "purposeCode": "T",
    "lng": 108.333327,
    "note": "",
    "owner": "Hà Huy Thanh",
    "name": "Cơ sở nuôi Hà Huy Thanh",
    "phone": "",
    "ownerName": "Hà Huy Thanh",
    "updatedAt": "2026-10-18T15:21:37.459Z",
    "id": "fac_14",
    "registrationCode": "18-26/B-DLC"
  },
  {
    "registrationCode": "52-26/B-DLC",
    "purposeCode": "T",
    "owner": "Trần Văn Tới",
    "speciesList": [
      {
        "purposeCode": "T",
        "fluctuations": [
          {
            "decMother": 0,
            "incMother": 0,
            "verifier": "",
            "decOtherMale": 0,
            "incOtherFemale": 0,
            "createdAt": 1714501860000,
            "reason": "Sinh sản lứa F1 mới nở/sinh.",
            "date": "2024-04-30",
            "time": "20:31",
            "incOtherUnknown": 29,
            "decOtherFemale": 0,
            "id": "fluc_15_1",
            "incFather": 0,
            "decFather": 0,
            "decOtherUnknown": 0,
            "incOtherMale": 0
          },
          {
            "createdAt": 1729534200000,
            "incOtherMale": 0,
            "id": "fluc_15_2",
            "decMother": 0,
            "decOtherFemale": 0,
            "incMother": 0,
            "verifier": "",
            "incFather": 0,
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "incOtherUnknown": 4,
            "decFather": 0,
            "incOtherFemale": 0,
            "decOtherUnknown": 0,
            "date": "2024-10-21",
            "time": "18:10",
            "decOtherMale": 0
          },
          {
            "decMother": 0,
            "incOtherUnknown": 0,
            "incOtherMale": 14,
            "incMother": 0,
            "createdAt": 1737534600000,
            "decOtherFemale": 0,
            "decOtherUnknown": 33,
            "date": "2025-01-22",
            "incOtherFemale": 19,
            "time": "10:30",
            "id": "fluc_15_3",
            "verifier": "",
            "decOtherMale": 0,
            "decFather": 0,
            "incFather": 0,
            "reason": "Xác định giới tính con con"
          },
          {
            "date": "2025-01-22",
            "decOtherFemale": 0,
            "decFather": 0,
            "time": "13:30",
            "incFather": 0,
            "verifier": "",
            "decOtherMale": 0,
            "createdAt": 1737545400000,
            "decOtherUnknown": 0,
            "id": "fluc_15_4",
            "incOtherMale": 0,
            "incOtherUnknown": 7,
            "decMother": 0,
            "incOtherFemale": 0,
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "incMother": 0
          },
          {
            "id": "fluc_15_5",
            "incOtherUnknown": 13,
            "incMother": 0,
            "decMother": 0,
            "date": "2025-06-20",
            "decOtherUnknown": 0,
            "time": "09:00",
            "incOtherFemale": 0,
            "incOtherMale": 0,
            "verifier": "",
            "createdAt": 1750406400000,
            "decOtherFemale": 0,
            "decOtherMale": 0,
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "incFather": 0,
            "decFather": 0
          },
          {
            "incOtherFemale": 0,
            "decFather": 0,
            "incFather": 13,
            "incOtherMale": 0,
            "verifier": "",
            "date": "2025-10-06",
            "time": "19:20",
            "reason": "Chuyển cá thể đực và cái đủ tuổi vào đàn bố mẹ.",
            "id": "fluc_15_6",
            "decOtherUnknown": 0,
            "decOtherMale": 13,
            "createdAt": 1759778400000,
            "incOtherUnknown": 0,
            "decOtherFemale": 18,
            "incMother": 18,
            "decMother": 0
          },
          {
            "decFather": 0,
            "incFather": 0,
            "incOtherFemale": 12,
            "incOtherUnknown": 0,
            "incOtherMale": 8,
            "decOtherUnknown": 20,
            "createdAt": 1759786080000,
            "id": "fluc_15_7",
            "verifier": "",
            "decMother": 0,
            "decOtherMale": 0,
            "reason": "Xác định giới tính con con",
            "time": "21:28",
            "date": "2025-10-06",
            "incMother": 0,
            "decOtherFemale": 0
          },
          {
            "decFather": 0,
            "incFather": 0,
            "decOtherFemale": 0,
            "time": "07:00",
            "incOtherMale": 0,
            "verifier": "",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "date": "2025-11-05",
            "id": "fluc_15_8",
            "createdAt": 1762326000000,
            "decOtherUnknown": 0,
            "decOtherMale": 0,
            "decMother": 0,
            "incOtherFemale": 0,
            "incMother": 0,
            "incOtherUnknown": 25
          },
          {
            "incOtherMale": 0,
            "incOtherFemale": 0,
            "decFather": 0,
            "incFather": 0,
            "verifier": "",
            "decOtherUnknown": 4,
            "incMother": 0,
            "date": "2025-11-10",
            "decMother": 0,
            "id": "fluc_15_9",
            "time": "08:00",
            "decOtherFemale": 0,
            "reason": "Chết do thời tiết/bệnh lý",
            "incOtherUnknown": 0,
            "createdAt": 1762761600000,
            "decOtherMale": 0
          },
          {
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "decMother": 0,
            "incMother": 0,
            "createdAt": 1767088800000,
            "incOtherMale": 0,
            "incOtherFemale": 0,
            "decOtherMale": 0,
            "decOtherFemale": 0,
            "incOtherUnknown": 18,
            "verifier": "",
            "incFather": 0,
            "decFather": 0,
            "id": "fluc_15_10",
            "time": "10:00",
            "decOtherUnknown": 0,
            "date": "2025-12-30"
          },
          {
            "decFather": 0,
            "decOtherUnknown": 20,
            "incFather": 0,
            "incOtherMale": 6,
            "decOtherFemale": 0,
            "incOtherUnknown": 0,
            "time": "19:28",
            "date": "2026-01-07",
            "createdAt": 1767814080000,
            "incOtherFemale": 14,
            "verifier": "",
            "decMother": 0,
            "id": "fluc_15_11",
            "reason": "Xác định giới tính con con",
            "incMother": 0,
            "decOtherMale": 0
          },
          {
            "id": "fluc_15_12",
            "decOtherUnknown": 0,
            "incFather": 15,
            "incOtherFemale": 0,
            "decFather": 0,
            "incOtherUnknown": 0,
            "decOtherMale": 15,
            "incOtherMale": 0,
            "decOtherFemale": 27,
            "decMother": 0,
            "incMother": 27,
            "verifier": "",
            "date": "2026-01-08",
            "reason": "Chuyển cá thể đực và cái đủ tuổi vào đàn bố mẹ.",
            "time": "07:48",
            "createdAt": 1767858480000
          },
          {
            "date": "2026-07-01",
            "time": "13:30",
            "createdAt": 1782912600000,
            "decOtherMale": 0,
            "incOtherUnknown": 28,
            "incOtherFemale": 0,
            "decMother": 0,
            "incMother": 0,
            "decOtherUnknown": 0,
            "incFather": 0,
            "decFather": 0,
            "decOtherFemale": 0,
            "verifier": "",
            "id": "fluc_15_13",
            "incOtherMale": 0,
            "reason": "Sinh sản lứa F1 mới nở/sinh"
          },
          {
            "createdAt": 1784532600000,
            "decOtherMale": 0,
            "incOtherFemale": 6,
            "decMother": 0,
            "incMother": 0,
            "incFather": 0,
            "decFather": 0,
            "decOtherFemale": 0,
            "id": "fluc_15_14",
            "incOtherMale": 6,
            "decOtherUnknown": 12,
            "date": "2026-07-20",
            "time": "07:30",
            "verifier": "",
            "reason": "Xác định giới tính con con",
            "incOtherUnknown": 0
          },
          {
            "incMother": 0,
            "decOtherFemale": 0,
            "date": "2026-08-01",
            "time": "12:30",
            "decMother": 0,
            "decOtherMale": 0,
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "createdAt": 1785587400000,
            "id": "fluc_15_15",
            "incOtherMale": 0,
            "verifier": "",
            "decOtherUnknown": 0,
            "incOtherFemale": 0,
            "incFather": 0,
            "incOtherUnknown": 11,
            "decFather": 0
          },
          {
            "decFather": 0,
            "decOtherFemale": 0,
            "incFather": 0,
            "id": "fluc_15_16",
            "verifier": "",
            "reason": "Chết do thời tiết/bệnh lý",
            "decOtherMale": 0,
            "createdAt": 1786906800000,
            "incOtherMale": 0,
            "date": "2026-08-16",
            "decOtherUnknown": 2,
            "time": "19:00",
            "decMother": 1,
            "incOtherFemale": 0,
            "incOtherUnknown": 0,
            "incMother": 0
          },
          {
            "isGenderIdentifyMode": false,
            "incOtherUnknown": 20,
            "reason": "Sinh sản lứa F1 mới nở/sinh",
            "isPurchaseMode": false,
            "purpose": "T",
            "decOtherFemale": 0,
            "verifier": "",
            "decOtherUnknown": 0,
            "decFather": 0,
            "incFather": 0,
            "decOtherMale": 0,
            "id": "fluc_1791031608601",
            "incOtherFemale": 0,
            "incOtherMale": 0,
            "incMother": 0,
            "decMother": 0,
            "date": "2026-10-03",
            "time": "19:45",
            "approvalStatus": "APPROVED",
            "createdAt": 1791031608601
          },
          {
            "incOtherFemale": 0,
            "incFather": 0,
            "verifier": "",
            "decFather": 20,
            "reason": "Tặng cho/chuyển nhượng theo quyết định",
            "approvalStatus": "APPROVED",
            "date": "2026-10-06",
            "decOtherMale": 0,
            "time": "19:51",
            "id": "fluc_1792327999641",
            "incOtherMale": 0,
            "decOtherUnknown": 0,
            "isGenderIdentifyMode": false,
            "isPurchaseMode": false,
            "createdAt": 1792327999641,
            "purpose": "T",
            "incMother": 0,
            "incOtherUnknown": 0,
            "decOtherFemale": 0,
            "decMother": 20
          },
          {
            "createdAt": 1792329025484,
            "decOtherFemale": 0,
            "id": "fluc_1792329025484",
            "decMother": 0,
            "isPurchaseMode": false,
            "verifier": "",
            "reason": "Xác định giới tính con con",
            "incOtherMale": 24,
            "incMother": 0,
            "decOtherUnknown": 41,
            "decFather": 0,
            "date": "2026-10-18",
            "purpose": "T",
            "decOtherMale": 0,
            "time": "20:03",
            "incFather": 0,
            "isGenderIdentifyMode": true,
            "approvalStatus": "PENDING",
            "incOtherUnknown": 0,
            "incOtherFemale": 17
          }
        ],
        "vietnameseName": "Dúi mốc lớn",
        "scientificName": "Rhizomys pruinosus",
        "group": "Động vật rừng thông thường",
        "baseline": {
          "father": 9,
          "otherMale": 0,
          "mother": 9,
          "date": "2023-11-02",
          "note": "Số lượng Dúi mốc lớn hiện có",
          "otherUnknown": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherFemale": 0
        },
        "id": "sp_15_1",
        "citesAppendix": "Khai báo kiểm lâm"
      }
    ],
    "commune": "xã Yang Mao",
    "address": "Thôn 1, xã Yang Mao, Tỉnh Đắk Lắk",
    "name": "Cơ sở nuôi Trần Văn Tới",
    "facilityName": "Cơ sở nuôi Trần Văn Tới",
    "note": "",
    "lng": 108.58051,
    "ownerName": "Trần Văn Tới",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "registrationDate": "2023-11-02",
    "lat": 12.477054,
    "id": "fac_15",
    "phone": ""
  },
  {
    "id": "fac_16",
    "name": "Cơ sở nuôi Lê Đình Tâm",
    "phone": "",
    "registrationDate": "",
    "facilityName": "Cơ sở nuôi Lê Đình Tâm",
    "lng": 108.551582,
    "ownerName": "Lê Đình Tâm",
    "commune": "xã Yang Mao",
    "owner": "Lê Đình Tâm",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "address": "Thôn Cư Drăm, xã Yang Mao, Tỉnh Đắk Lắk",
    "note": "",
    "registrationCode": "Đang cập nhật",
    "speciesList": [
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Rhizomys pruinosus",
        "vietnameseName": "Dúi mốc lớn",
        "fluctuations": [],
        "purposeCode": "T",
        "group": "Động vật rừng thông thường",
        "baseline": {
          "otherFemale": 6,
          "mother": 2,
          "father": 2,
          "otherUnknown": 0,
          "otherMale": 4,
          "note": "Số lượng Dúi mốc lớn hiện có",
          "date": "2026-01-01",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông"
        },
        "id": "sp_16_1"
      }
    ],
    "lat": 12.487572,
    "purposeCode": "T"
  },
  {
    "name": "Cơ sở nuôi Nguyễn Kim Danh",
    "facilityName": "Cơ sở nuôi Nguyễn Kim Danh",
    "registrationDate": "",
    "speciesList": [
      {
        "id": "sp_17_1",
        "baseline": {
          "otherFemale": 0,
          "mother": 10,
          "date": "2026-01-01",
          "note": "Số lượng Dúi mốc lớn hiện có",
          "father": 2,
          "otherMale": 0,
          "otherUnknown": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông"
        },
        "fluctuations": [],
        "citesAppendix": "Khai báo kiểm lâm",
        "purposeCode": "T",
        "scientificName": "Rhizomys pruinosus",
        "vietnameseName": "Dúi mốc lớn",
        "group": "Động vật rừng thông thường"
      }
    ],
    "purposeCode": "T",
    "phone": "",
    "id": "fac_17",
    "commune": "xã Yang Mao",
    "registrationCode": "Đang cập nhật",
    "address": "Buôn Tul, xã Yang Mao, Tỉnh Đắk Lắk",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "lng": 108.560116,
    "ownerName": "Nguyễn Kim Danh",
    "owner": "Nguyễn Kim Danh",
    "lat": 12.462085,
    "note": ""
  },
  {
    "registrationCode": "141-26/B-DLC",
    "lat": 12.547587,
    "owner": "Nguyễn Lĩnh",
    "purposeCode": "T",
    "commune": "xã Cư Pui",
    "address": "thôn 3, xã Cư Pui, tỉnh Đắk Lắk.",
    "note": "",
    "speciesList": [
      {
        "baseline": {
          "otherUnknown": 0,
          "date": "2026-07-24",
          "note": "Hiện trạng đăng ký ban đầu",
          "otherFemale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 0,
          "father": 1,
          "mother": 3
        },
        "fluctuations": [
          {
            "date": "2026-07-20",
            "time": "11:34",
            "isPurchaseMode": false,
            "verifier": "",
            "decFather": 0,
            "incFather": 0,
            "decOtherFemale": 0,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decOtherMale": 0,
            "incOtherFemale": 0,
            "decMother": 0,
            "decOtherUnknown": 0,
            "purpose": "T",
            "incOtherMale": 0,
            "incMother": 0,
            "id": "fluc_1786163683953",
            "createdAt": 1786163683953,
            "incOtherUnknown": 5
          }
        ],
        "citesAppendix": "Phụ lục II CITES",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "purposeCode": "T",
        "id": "sp_1786163645775_1",
        "vietnameseName": "Cầy vòi Hương",
        "scientificName": "Paradoxurus hermaphroditus"
      }
    ],
    "ownerName": "Nguyễn Lĩnh",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "lng": 108.455555,
    "registrationDate": "2026-07-24",
    "id": "fac_1786163645775",
    "name": "Nguyễn Lĩnh",
    "facilityName": "Nguyễn Lĩnh",
    "phone": "0866100652"
  },
  {
    "note": "",
    "facilityName": "Nguyễn Hoàng Dũng",
    "ownerName": "Nguyễn Hoàng Dũng",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "registrationDate": "2026-01-24",
    "phone": "0342017979",
    "id": "fac_1786419630740",
    "speciesList": [
      {
        "citesAppendix": "Phụ lục II CITES",
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "purposeCode": "T",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "id": "sp_1786419630740_1",
        "fluctuations": [
          {
            "incOtherMale": 0,
            "incFather": 0,
            "decFather": 0,
            "reason": "Mua từ cơ sở nuôi sinh sản khác",
            "time": "10:42",
            "id": "fluc_1786419778624",
            "incOtherFemale": 5,
            "date": "2026-08-11",
            "createdAt": 1786419778624,
            "decOtherUnknown": 0,
            "decOtherFemale": 0,
            "verifier": "",
            "isPurchaseMode": true,
            "decMother": 0,
            "decOtherMale": 0,
            "incMother": 0,
            "purpose": "T",
            "incOtherUnknown": 0
          }
        ],
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-07-24",
          "note": "Hiện trạng đăng ký ban đầu",
          "otherFemale": 0,
          "mother": 40,
          "otherMale": 0,
          "father": 2,
          "otherUnknown": 0
        }
      },
      {
        "fluctuations": [],
        "purposeCode": "T",
        "scientificName": "Paguma larvata",
        "vietnameseName": "Cầy vòi mốc",
        "baseline": {
          "date": "2026-07-24",
          "note": "Số lượng vật nuôi hiện có ban đầu",
          "verifier": "",
          "otherUnknown": 0,
          "otherMale": 0,
          "father": "4",
          "mother": "13",
          "otherFemale": 0
        },
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "id": "species_1786419708326",
        "citesAppendix": "Phụ lục II CITES"
      }
    ],
    "purposeCode": "T",
    "lng": 108.321947,
    "registrationCode": "142-26/B-DLC",
    "owner": "Nguyễn Hoàng Dũng",
    "address": "thôn 6, xã Dang Kang, tỉnh Đắk Lắk",
    "lat": 12.558599,
    "name": "Nguyễn Hoàng Dũng",
    "commune": "Xã Dang Kang"
  },
  {
    "note": "",
    "speciesList": [
      {
        "group": "Động vật rừng thông thường",
        "fluctuations": [
          {
            "time": "00:02",
            "date": "2026-07-08",
            "decOtherUnknown": 0,
            "decFather": 0,
            "incOtherMale": 0,
            "incFather": 0,
            "incOtherFemale": 0,
            "incOtherUnknown": 6,
            "createdAt": 1786467765630,
            "decOtherFemale": 0,
            "isPurchaseMode": false,
            "purpose": "T",
            "incMother": 0,
            "decOtherMale": 0,
            "decMother": 0,
            "verifier": "",
            "id": "fluc_1786468153021",
            "reason": "Sinh sản lứa F2 mới nở/sinh"
          },
          {
            "incOtherMale": 0,
            "incOtherUnknown": 4,
            "createdAt": 1786505722932,
            "decOtherUnknown": 0,
            "decMother": 0,
            "purpose": "T",
            "incMother": 0,
            "incOtherFemale": 0,
            "id": "fluc_1786518690491",
            "verifier": "",
            "reason": "sinh san F2",
            "incFather": 0,
            "decFather": 0,
            "decOtherFemale": 0,
            "time": "10:34",
            "isPurchaseMode": false,
            "date": "2026-08-12",
            "decOtherMale": 0
          },
          {
            "id": "fluc_1786518706173",
            "purpose": "T",
            "incOtherUnknown": 4,
            "incOtherMale": 0,
            "createdAt": 1786505722932,
            "incMother": 0,
            "incOtherFemale": 0,
            "reason": "sinh san F2",
            "decOtherUnknown": 0,
            "decMother": 0,
            "decOtherFemale": 0,
            "incFather": 0,
            "decFather": 0,
            "verifier": "",
            "date": "2026-08-12",
            "decOtherMale": 0,
            "time": "10:34",
            "isPurchaseMode": false
          }
        ],
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherUnknown": 0,
          "otherMale": 0,
          "mother": 4,
          "otherFemale": 0,
          "note": "Hiện trạng đăng ký ban đầu",
          "date": "2026-06-17",
          "father": 2
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "id": "sp_1786432202893_1",
        "vietnameseName": "Dúi mốc lớn",
        "scientificName": "Rhizomys pruinosus",
        "purposeCode": "T"
      }
    ],
    "id": "fac_1786432202893",
    "purposeCode": "T",
    "owner": "Phạm Duy Thắng",
    "address": "Thôn 23",
    "commune": "Xã Krông Bông",
    "registrationCode": "Chưa có mã số",
    "lng": 108.394137,
    "phone": "",
    "registrationDate": "2026-08-11",
    "lat": 12.520837,
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "name": "Phạm Duy Thắng",
    "ownerName": "Phạm Duy Thắng",
    "facilityName": "Phạm Duy Thắng"
  },
  {
    "commune": "Xã Dang Kang",
    "registrationDate": "2025-11-12",
    "address": "Thôn 6 xã Dang Kang",
    "owner": "Nguyễn Kim Tuấn",
    "facilityName": "Nguyễn Kim Tuấn",
    "note": "",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "ownerName": "Nguyễn Kim Tuấn",
    "id": "fac_1786504114807",
    "speciesList": [
      {
        "fluctuations": [
          {
            "incOtherMale": 38,
            "decMother": 0,
            "incMother": 0,
            "purpose": "T",
            "createdAt": 1786504203858,
            "verifier": "",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "time": "10:09",
            "id": "fluc_1786504203858",
            "incOtherFemale": 53,
            "date": "2026-08-12",
            "incOtherUnknown": 32,
            "decOtherFemale": 0,
            "incFather": 0,
            "decOtherUnknown": 0,
            "decFather": 0,
            "isPurchaseMode": false,
            "decOtherMale": 0
          }
        ],
        "baseline": {
          "father": 10,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherUnknown": 0,
          "mother": 30,
          "otherFemale": 0,
          "note": "Hiện trạng đăng ký ban đầu",
          "date": "2025-11-12",
          "otherMale": 0
        },
        "id": "sp_1786504114807_1",
        "group": "Động vật rừng thông thường",
        "citesAppendix": "Khai báo kiểm lâm",
        "vietnameseName": "Dúi mốc lớn",
        "scientificName": "Rhizomys pruinosus",
        "purposeCode": "T"
      }
    ],
    "registrationCode": "Chưa có mã số",
    "purposeCode": "T",
    "lat": "12.575576",
    "lng": "108.338165",
    "name": "Nguyễn Kim Tuấn",
    "phone": ""
  },
  {
    "address": "",
    "commune": "xã Cư Pui",
    "facilityName": "Nguyễn Hữu Lưu",
    "registrationDate": "2026-05-25",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "ownerName": "Nguyễn Hữu Lưu",
    "note": "",
    "owner": "Nguyễn Hữu Lưu",
    "phone": "",
    "registrationCode": "Chưa có mã số",
    "name": "Nguyễn Hữu Lưu",
    "id": "fac_1787585236556",
    "lat": "12.532135",
    "speciesList": [
      {
        "vietnameseName": "Chim Chào mào",
        "scientificName": "Pycnonotus jocosus",
        "fluctuations": [],
        "purposeCode": "T",
        "id": "sp_1787585236556_1",
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "mother": 1,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 1,
          "otherMale": 0,
          "note": "Hiện trạng đăng ký ban đầu",
          "date": "2026-05-25",
          "otherUnknown": 0,
          "otherFemale": 0
        },
        "group": "Động vật rừng thông thường (Lớp Chim)"
      }
    ],
    "purposeCode": "T",
    "lng": "108.431876"
  },
  {
    "speciesList": [
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "vietnameseName": "Chim Chào mào",
        "scientificName": "Pycnonotus jocosus",
        "fluctuations": [],
        "purposeCode": "T",
        "id": "sp_1787793901636_1",
        "baseline": {
          "otherFemale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-06-27",
          "note": "Hiện trạng đăng ký ban đầu",
          "mother": 0,
          "otherUnknown": 2,
          "otherMale": 0,
          "father": 0
        }
      }
    ],
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "note": "",
    "purposeCode": "T",
    "ownerName": "Nguyễn Tâm Châu",
    "registrationDate": "2026-06-27",
    "phone": "",
    "lat": 12.492318,
    "owner": "Nguyễn Tâm Châu",
    "name": "Nguyễn Tâm Châu",
    "commune": "xã Hòa Sơn",
    "id": "fac_1787793901636",
    "address": "",
    "facilityName": "Nguyễn Tâm Châu",
    "registrationCode": "Chưa có mã số",
    "lng": 108.324298
  },
  {
    "ownerName": "Nguyễn Thanh ",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "note": "",
    "registrationCode": "Chưa có mã số",
    "owner": "Nguyễn Thanh ",
    "lng": 108.294381,
    "purposeCode": "T",
    "speciesList": [
      {
        "purposeCode": "T",
        "baseline": {
          "mother": 0,
          "otherUnknown": 2,
          "father": 0,
          "otherMale": 1,
          "otherFemale": 1,
          "note": "Hiện trạng đăng ký ban đầu",
          "date": "2026-07-27",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông"
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "fluctuations": [],
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "id": "sp_1787794070148_1",
        "vietnameseName": "Chim Cu gáy",
        "scientificName": "Streptopelia chinensis"
      }
    ],
    "facilityName": "Nguyễn Thanh ",
    "phone": "",
    "lat": 12.495249,
    "address": "Thôn 2",
    "name": "Nguyễn Thanh ",
    "registrationDate": "2026-07-27",
    "id": "fac_1787794070148",
    "commune": "xã Hòa Sơn"
  },
  {
    "id": "fac_1787794146413",
    "registrationCode": "Chưa có mã số",
    "facilityName": "Trần Văn Ngọ",
    "lng": 108.32352,
    "address": "Thôn 9 Hòa Sơn",
    "owner": "Trần Văn Ngọ",
    "commune": "xã Hòa Sơn",
    "speciesList": [
      {
        "id": "sp_1787794146413_1",
        "scientificName": "Pycnonotus jocosus",
        "vietnameseName": "Chim Chào mào",
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "otherMale": 0,
          "otherFemale": 0,
          "note": "Hiện trạng đăng ký ban đầu",
          "date": "2026-07-27",
          "father": 0,
          "otherUnknown": 4,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 0
        },
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "purposeCode": "T",
        "fluctuations": []
      },
      {
        "fluctuations": [],
        "purposeCode": "T",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "scientificName": "Streptopelia chinensis",
        "vietnameseName": "Chim Cu gáy",
        "id": "species_1790753399574",
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "otherFemale": "1",
          "father": 0,
          "otherUnknown": 0,
          "otherMale": "1",
          "mother": 0,
          "note": "Số lượng vật nuôi hiện có ban đầu",
          "date": "2026-06-29",
          "verifier": ""
        }
      }
    ],
    "name": "Trần Văn Ngọ",
    "purposeCode": "T",
    "lat": 12.492941,
    "note": "",
    "registrationDate": "2026-07-27",
    "phone": "",
    "ownerName": "Trần Văn Ngọ",
    "updatedAt": "2026-10-18T15:21:37.460Z"
  },
  {
    "commune": "xã Hòa Sơn",
    "address": "thôn 9, xã Hoà Sơn, tỉnh Đắk Lắk0948861157",
    "registrationDate": "2026-08-27",
    "lng": 108.315073,
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "ownerName": "Nguyễn Duy Thông",
    "note": "Đang cập nhập",
    "lat": 12.490722,
    "phone": "0948861157",
    "registrationCode": "Chưa có mã số",
    "name": "Nguyễn Duy Thông",
    "owner": "Nguyễn Duy Thông",
    "speciesList": [
      {
        "purposeCode": "T",
        "fluctuations": [],
        "baseline": {
          "date": "2026-08-27",
          "note": "Hiện trạng đăng ký ban đầu",
          "otherFemale": "0",
          "otherMale": 0,
          "father": 2,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 2,
          "otherUnknown": 10
        },
        "id": "sp_1787794338130_1",
        "vietnameseName": "Chim Chào mào",
        "scientificName": "Pycnonotus jocosus",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "citesAppendix": "Khai báo kiểm lâm"
      },
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "purposeCode": "T",
        "scientificName": "Streptopelia chinensis",
        "vietnameseName": "Chim Cu gáy",
        "fluctuations": [],
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "id": "species_1788765271274",
        "baseline": {
          "otherFemale": "2",
          "otherMale": "2",
          "verifier": "",
          "otherUnknown": 0,
          "father": 0,
          "date": "2026-09-07",
          "note": "Số lượng vật nuôi hiện có ban đầu",
          "mother": 0
        }
      }
    ],
    "id": "fac_1787794338130",
    "purposeCode": "T",
    "facilityName": "Nguyễn Duy Thông"
  },
  {
    "phone": "0337825861",
    "name": "Vũ Hoàng Tân",
    "purposeCode": "T",
    "speciesList": [
      {
        "baseline": {
          "otherFemale": 0,
          "mother": 0,
          "otherUnknown": 2,
          "father": 0,
          "otherMale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-08-27",
          "note": "Hiện trạng đăng ký ban đầu"
        },
        "purposeCode": "T",
        "id": "sp_1787795701427_1",
        "vietnameseName": "Chim Chào mào",
        "scientificName": "Pycnonotus jocosus",
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "fluctuations": []
      }
    ],
    "registrationDate": "2026-08-27",
    "facilityName": "Vũ Hoàng Tân",
    "lng": 108.322735,
    "id": "fac_1787795701427",
    "address": "Thôn 10",
    "note": "",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "commune": "xã Hòa Sơn",
    "ownerName": "Vũ Hoàng Tân",
    "lat": 12.500922,
    "owner": "Vũ Hoàng Tân",
    "registrationCode": "Chưa có mã số"
  },
  {
    "phone": "0988.257.586",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "ownerName": "Nguyễn Văn Vinh",
    "registrationCode": "Chưa có mã số",
    "facilityName": "Nguyễn Văn Vinh",
    "note": "",
    "name": "Nguyễn Văn Vinh",
    "lat": 12.49798,
    "purposeCode": "T",
    "address": "thôn 10, xã Hoà Sơn, tỉnh Đắk Lắk",
    "speciesList": [
      {
        "fluctuations": [],
        "purposeCode": "T",
        "baseline": {
          "otherMale": 42,
          "note": "Hiện trạng đăng ký ban đầu",
          "date": "2026-10-05",
          "otherUnknown": 40,
          "otherFemale": 66,
          "mother": 6,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 6
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "id": "sp_1791188880545_1",
        "group": "Động vật rừng thông thường",
        "scientificName": "Rhizomys pruinosus",
        "vietnameseName": "Dúi mốc lớn"
      }
    ],
    "commune": "xã Hòa Sơn",
    "id": "fac_1791188880545",
    "lng": 108.322383,
    "owner": "Nguyễn Văn Vinh",
    "registrationDate": "2026-10-05"
  },
  {
    "lat": 12.526903,
    "facilityName": "Cơ sở nuôi Lê Quang Mạnh",
    "lng": 108.423608,
    "registrationDate": "",
    "note": "",
    "owner": "Lê Quang Mạnh",
    "phone": "",
    "name": "Cơ sở nuôi Lê Quang Mạnh",
    "speciesList": [
      {
        "baseline": {
          "otherMale": 10,
          "otherUnknown": 0,
          "note": "Số lượng Dúi má đào hiện có",
          "otherFemale": 12,
          "date": "2026-01-01",
          "father": 3,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 4
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "id": "sp_18_1",
        "fluctuations": [],
        "vietnameseName": "Dúi má đào",
        "scientificName": "Rhizomys sumatrensis",
        "group": "Động vật rừng thông thường",
        "purposeCode": "T"
      },
      {
        "id": "sp_18_2",
        "fluctuations": [],
        "group": "Động vật rừng thông thường",
        "scientificName": "Rhizomys pruinosus",
        "vietnameseName": "Dúi mốc lớn",
        "baseline": {
          "father": 19,
          "otherUnknown": 58,
          "mother": 61,
          "note": "Số lượng Dúi mốc lớn hiện có",
          "date": "2026-01-01",
          "otherMale": 17,
          "otherFemale": 15,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông"
        },
        "purposeCode": "T",
        "citesAppendix": "Khai báo kiểm lâm"
      }
    ],
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "purposeCode": "T",
    "id": "fac_18",
    "ownerName": "Lê Quang Mạnh",
    "address": "Thôn 29, Xã Krông Bông, Tỉnh Đắk Lắk",
    "commune": "Xã Krông Bông",
    "registrationCode": "Đang cập nhật"
  },
  {
    "ownerName": "Nguyễn Trương Đắc Nam",
    "lat": 12.528051,
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "owner": "Nguyễn Trương Đắc Nam",
    "purposeCode": "T",
    "lng": 108.328497,
    "registrationCode": "Đang cập nhật",
    "note": "",
    "speciesList": [
      {
        "purposeCode": "T",
        "fluctuations": [],
        "vietnameseName": "Dúi mốc lớn",
        "scientificName": "Rhizomys pruinosus",
        "group": "Động vật rừng thông thường",
        "id": "sp_19_1",
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 15,
          "otherUnknown": 0,
          "father": 10,
          "otherFemale": 0,
          "date": "2026-01-01",
          "note": "Số lượng Dúi mốc lớn hiện có",
          "otherMale": 0
        },
        "citesAppendix": "Khai báo kiểm lâm"
      }
    ],
    "name": "Cơ sở nuôi Nguyễn Trương Đắc Nam",
    "facilityName": "Cơ sở nuôi Nguyễn Trương Đắc Nam",
    "registrationDate": "",
    "phone": "",
    "id": "fac_19",
    "commune": "Xã Krông Bông",
    "address": "Thôn 9, Xã Krông Bông, Tỉnh Đắk Lắk"
  },
  {
    "note": "",
    "lat": 12.491634,
    "registrationDate": "2023-04-17",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "lng": 108.297682,
    "ownerName": "Nguyễn Văn Thúy",
    "owner": "Nguyễn Văn Thúy",
    "facilityName": "Cơ sở nuôi Nguyễn Văn Thúy",
    "address": "Thôn Quảng Đông, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "registrationCode": "IIB-C-DLC-028",
    "commune": "xã Hòa Sơn",
    "id": "fac_2",
    "phone": "",
    "name": "Cơ sở nuôi Nguyễn Văn Thúy",
    "speciesList": [
      {
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "baseline": {
          "father": 2,
          "otherFemale": 7,
          "date": "2025-12-30",
          "note": "Số lượng vật nuôi đăng ký",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherUnknown": 3,
          "mother": 3,
          "otherMale": 6
        },
        "id": "sp_2_1",
        "fluctuations": [
          {
            "decOtherUnknown": 3,
            "decOtherFemale": 0,
            "isPurchaseMode": false,
            "time": "22:03",
            "reason": "Xác định giới tính con con",
            "date": "2026-06-13",
            "decFather": 0,
            "decOtherMale": 0,
            "incFather": 0,
            "incOtherUnknown": 0,
            "purpose": "T",
            "verifier": "",
            "incMother": 0,
            "incOtherMale": 2,
            "approvalStatus": "APPROVED",
            "decMother": 0,
            "isGenderIdentifyMode": true,
            "id": "fluc_1792335832088",
            "createdAt": 1792335832088,
            "incOtherFemale": 1
          },
          {
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "isPurchaseMode": false,
            "verifier": "",
            "purpose": "T",
            "createdAt": 1792335872475,
            "incMother": 0,
            "decMother": 0,
            "decOtherFemale": 0,
            "incOtherMale": 0,
            "decOtherUnknown": 0,
            "date": "2026-06-13",
            "decOtherMale": 0,
            "time": "22:03",
            "id": "fluc_1792335872475",
            "decFather": 0,
            "isGenderIdentifyMode": false,
            "incOtherFemale": 0,
            "incFather": 0,
            "incOtherUnknown": 17,
            "approvalStatus": "APPROVED"
          },
          {
            "decOtherUnknown": 17,
            "reason": "Xác định giới tính con con",
            "id": "fluc_1792336162817",
            "incMother": 0,
            "incOtherFemale": 12,
            "decMother": 0,
            "incOtherMale": 5,
            "incOtherUnknown": 0,
            "date": "2026-07-06",
            "isGenderIdentifyMode": true,
            "approvalStatus": "APPROVED",
            "time": "22:08",
            "createdAt": 1792336162817,
            "isPurchaseMode": false,
            "decOtherMale": 0,
            "verifier": "",
            "purpose": "T",
            "incFather": 0,
            "decOtherFemale": 0,
            "decFather": 0
          },
          {
            "date": "2026-10-16",
            "isPurchaseMode": false,
            "time": "22:10",
            "incOtherUnknown": 0,
            "decOtherMale": 3,
            "incFather": 0,
            "decFather": 0,
            "decOtherUnknown": 0,
            "decOtherFemale": 7,
            "isGenderIdentifyMode": false,
            "incOtherFemale": 0,
            "reason": "Chết do thời tiết/bệnh lý",
            "createdAt": 1792336234681,
            "id": "fluc_1792336234681",
            "incOtherMale": 0,
            "incMother": 0,
            "decMother": 0,
            "verifier": "",
            "approvalStatus": "APPROVED",
            "purpose": "T"
          },
          {
            "time": "22:09",
            "incOtherFemale": 0,
            "createdAt": 1792336180572,
            "date": "2026-10-18",
            "incMother": 0,
            "incOtherMale": 0,
            "isGenderIdentifyMode": false,
            "purpose": "T",
            "id": "fluc_1792336180572",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "approvalStatus": "APPROVED",
            "decMother": 0,
            "decOtherUnknown": 0,
            "isPurchaseMode": false,
            "incFather": 0,
            "verifier": "",
            "decOtherMale": 0,
            "decFather": 0,
            "incOtherUnknown": 4,
            "decOtherFemale": 0
          }
        ],
        "vietnameseName": "Cầy vòi Hương",
        "scientificName": "Paradoxurus hermaphroditus",
        "purposeCode": "T",
        "citesAppendix": "Phụ lục II CITES"
      }
    ],
    "purposeCode": "T"
  },
  {
    "speciesList": [
      {
        "group": "Động vật rừng thông thường",
        "id": "sp_20_1",
        "baseline": {
          "mother": 26,
          "otherMale": 6,
          "otherFemale": 8,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 4,
          "otherUnknown": 11,
          "note": "Số lượng Dúi má đào hiện có",
          "date": "2026-01-01"
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "purposeCode": "T",
        "scientificName": "Rhizomys sumatrensis",
        "vietnameseName": "Dúi má đào",
        "fluctuations": []
      }
    ],
    "facilityName": "Cơ sở nuôi Trần Văn Lực",
    "id": "fac_20",
    "lng": 108.315384,
    "purposeCode": "T",
    "commune": "Xã Dang Kang",
    "address": "Buôn Cư Ênun A, Xã Dang Kang, Tỉnh Đắk Lắk",
    "note": "",
    "ownerName": "Trần Văn Lực",
    "phone": "",
    "registrationDate": "",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "lat": 12.58438,
    "owner": "Trần Văn Lực",
    "name": "Cơ sở nuôi Trần Văn Lực",
    "registrationCode": "Đang cập nhật"
  },
  {
    "registrationCode": "Đang cập nhật",
    "phone": "",
    "purposeCode": "T",
    "speciesList": [
      {
        "scientificName": "Rhizomys pruinosus",
        "vietnameseName": "Dúi mốc lớn",
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường",
        "purposeCode": "T",
        "fluctuations": [],
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 0,
          "otherFemale": 0,
          "otherUnknown": 0,
          "father": 10,
          "date": "2026-01-01",
          "note": "Số lượng Dúi mốc lớn hiện có",
          "mother": 10
        },
        "id": "sp_21_1"
      }
    ],
    "id": "fac_21",
    "address": "Thôn 3, Xã Dang Kang, Tỉnh Đắk Lắk",
    "note": "",
    "commune": "Xã Dang Kang",
    "facilityName": "Cơ sở nuôi Đinh Tiến Toàn",
    "name": "Cơ sở nuôi Đinh Tiến Toàn",
    "lat": 12.619158,
    "registrationDate": "",
    "lng": 108.339096,
    "ownerName": "Đinh Tiến Toàn",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "owner": "Đinh Tiến Toàn"
  },
  {
    "registrationCode": "Đang cập nhật",
    "id": "fac_22",
    "phone": "",
    "name": "Cơ sở nuôi Nguyễn Thanh",
    "address": "Thôn 2, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "speciesList": [
      {
        "vietnameseName": "Chim Cu gáy",
        "scientificName": "Streptopelia chinensis",
        "purposeCode": "T",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "citesAppendix": "Khai báo kiểm lâm",
        "id": "sp_22_1",
        "baseline": {
          "otherUnknown": 0,
          "otherFemale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 1,
          "otherMale": 0,
          "father": 1,
          "note": "Số lượng Chim Cu gáy nuôi",
          "date": "2026-01-01"
        },
        "fluctuations": []
      }
    ],
    "commune": "xã Hòa Sơn",
    "purposeCode": "T",
    "registrationDate": "",
    "note": "",
    "ownerName": "Nguyễn Thanh",
    "owner": "Nguyễn Thanh",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "facilityName": "Cơ sở nuôi Nguyễn Thanh"
  },
  {
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "ownerName": "Huỳnh Phúc Lợi",
    "registrationDate": "",
    "phone": "",
    "speciesList": [
      {
        "fluctuations": [],
        "purposeCode": "O",
        "scientificName": "Pycnonotus jocosus",
        "vietnameseName": "Chim Chào mào",
        "id": "sp_23_1",
        "baseline": {
          "otherFemale": 0,
          "father": 3,
          "mother": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "note": "Số lượng Chim Chào mào nuôi cảnh",
          "date": "2026-01-01",
          "otherMale": 0,
          "otherUnknown": 0
        },
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "citesAppendix": "Khai báo kiểm lâm"
      }
    ],
    "purposeCode": "O",
    "note": "Làm cảnh",
    "name": "Cơ sở nuôi Huỳnh Ph��c Lợi",
    "registrationCode": "Đang cập nhật",
    "owner": "Huỳnh Phúc Lợi",
    "commune": "xã Hòa Sơn",
    "id": "fac_23",
    "facilityName": "Cơ sở nuôi Huỳnh Phúc Lợi",
    "address": "Thôn 2, xã Hòa Sơn, Tỉnh Đắk Lắk"
  },
  {
    "id": "fac_24",
    "registrationCode": "Đang cập nhật",
    "name": "Cơ sở nuôi Phan Thanh Trúc",
    "phone": "",
    "registrationDate": "",
    "owner": "Phan Thanh Trúc",
    "note": "",
    "ownerName": "Phan Thanh Trúc",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "speciesList": [
      {
        "scientificName": "Pycnonotus jocosus",
        "vietnameseName": "Chim Chào mào",
        "baseline": {
          "otherFemale": 0,
          "note": "Số lượng Chim Chào mào nuôi",
          "date": "2026-01-01",
          "mother": 5,
          "otherUnknown": 0,
          "otherMale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 5
        },
        "id": "sp_24_1",
        "purposeCode": "T",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "citesAppendix": "Khai báo kiểm lâm",
        "fluctuations": []
      }
    ],
    "facilityName": "Cơ sở nuôi Phan Thanh Trúc",
    "commune": "xã Hòa Sơn",
    "purposeCode": "T",
    "address": "Thôn 4, xã Hòa Sơn, Tỉnh Đắk Lắk"
  },
  {
    "purposeCode": "T",
    "note": "",
    "speciesList": [
      {
        "purposeCode": "T",
        "citesAppendix": "Khai báo kiểm lâm",
        "id": "sp_25_1",
        "baseline": {
          "mother": 5,
          "otherMale": 0,
          "father": 5,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherUnknown": 0,
          "otherFemale": 0,
          "note": "Số lượng Chim Chào mào nuôi",
          "date": "2026-01-01"
        },
        "vietnameseName": "Chim Chào mào",
        "scientificName": "Pycnonotus jocosus",
        "fluctuations": [],
        "group": "Động vật rừng thông thường (Lớp Chim)"
      }
    ],
    "facilityName": "Cơ sở nuôi Thái Hồng Sơn",
    "commune": "Xã Krông Bông",
    "address": "Thôn 4, Xã Krông Bông, Tỉnh Đắk Lắk",
    "registrationCode": "Đang cập nhật",
    "phone": "",
    "lat": 12.502961,
    "owner": "Thái Hồng Sơn",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "ownerName": "Thái Hồng Sơn",
    "name": "Cơ sở nuôi Thái Hồng Sơn",
    "id": "fac_25",
    "registrationDate": "",
    "lng": 108.333624
  },
  {
    "registrationDate": "",
    "ownerName": "Nguyễn Trí",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "speciesList": [
      {
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "citesAppendix": "Khai báo kiểm lâm",
        "fluctuations": [],
        "vietnameseName": "Chim Cu gáy",
        "scientificName": "Streptopelia chinensis",
        "id": "sp_26_1",
        "baseline": {
          "mother": 11,
          "father": 11,
          "otherUnknown": 0,
          "otherMale": 1,
          "otherFemale": 1,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-01-01",
          "note": "Số lượng Chim Cu gáy nuôi"
        },
        "purposeCode": "T"
      }
    ],
    "lng": 108.336714,
    "owner": "Nguyễn Trí",
    "name": "Cơ sở nuôi Nguyễn Trí",
    "purposeCode": "T",
    "lat": 12.523945,
    "commune": "Xã Krông Bông",
    "id": "fac_26",
    "address": "Thôn 7, Xã Krông Bông, Tỉnh Đắk Lắk",
    "facilityName": "Cơ sở nuôi Nguyễn Trí",
    "registrationCode": "Đang cập nhật",
    "note": "",
    "phone": ""
  },
  {
    "registrationDate": "",
    "ownerName": "Nguyễn Văn Hòa",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "owner": "Nguyễn Văn Hòa",
    "id": "fac_27",
    "note": "",
    "purposeCode": "T",
    "name": "Cơ sở nuôi Nguyễn Văn Hòa",
    "speciesList": [
      {
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "baseline": {
          "otherUnknown": 0,
          "mother": 2,
          "otherFemale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 0,
          "father": 2,
          "note": "Số lượng Chim Chào mào nuôi",
          "date": "2026-01-01"
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "id": "sp_27_1",
        "vietnameseName": "Chim Chào mào",
        "scientificName": "Pycnonotus jocosus",
        "purposeCode": "T",
        "fluctuations": []
      }
    ],
    "commune": "Xã Krông Bông",
    "address": "Thôn 2, Xã Krông Bông, Tỉnh Đắk Lắk",
    "registrationCode": "Đang cập nhật",
    "phone": "",
    "facilityName": "Cơ sở nuôi Nguyễn Văn Hòa"
  },
  {
    "address": "Thôn 26, Xã Krông Bông, Tỉnh Đắk Lắk",
    "facilityName": "Cơ sở nuôi Trần Văn Hà",
    "lat": 12.547061,
    "commune": "Xã Krông Bông",
    "phone": "",
    "note": "",
    "updatedAt": "2026-10-18T15:21:37.460Z",
    "ownerName": "Trần Văn Hà",
    "lng": 108.401029,
    "registrationCode": "Đang cập nhật",
    "purposeCode": "T",
    "speciesList": [
      {
        "fluctuations": [],
        "purposeCode": "T",
        "baseline": {
          "otherFemale": 0,
          "otherUnknown": 0,
          "father": 1,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 1,
          "otherMale": 0,
          "note": "Số lượng Chim Chào mào nuôi",
          "date": "2026-01-01"
        },
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "citesAppendix": "Khai báo kiểm lâm",
        "vietnameseName": "Chim Chào mào",
        "scientificName": "Pycnonotus jocosus",
        "id": "sp_28_1"
      }
    ],
    "registrationDate": "",
    "name": "Cơ sở nuôi Trần Văn Hà",
    "owner": "Trần Văn Hà",
    "id": "fac_28"
  },
  {
    "registrationDate": "",
    "id": "fac_29",
    "name": "Cơ sở nuôi Trần Ngọc Long",
    "phone": "",
    "registrationCode": "Đang cập nhật",
    "owner": "Trần Ngọc Long",
    "commune": "Xã Krông Bông",
    "facilityName": "Cơ sở nuôi Trần Ngọc Long",
    "address": "Thôn 2, Xã Krông Bông, Tỉnh Đắk Lắk",
    "speciesList": [
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "father": 2,
          "note": "Số lượng Chim Cu gáy nuôi",
          "date": "2026-01-01",
          "mother": 2,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 0,
          "otherUnknown": 0,
          "otherFemale": 0
        },
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "purposeCode": "T",
        "vietnameseName": "Chim Cu gáy",
        "id": "sp_29_1",
        "scientificName": "Streptopelia chinensis",
        "fluctuations": []
      }
    ],
    "note": "",
    "purposeCode": "T",
    "ownerName": "Trần Ngọc Long",
    "updatedAt": "2026-10-18T15:21:37.460Z"
  },
  {
    "note": "Nghỉ nuôi",
    "speciesList": [
      {
        "id": "sp_3_1",
        "vietnameseName": "Cầy vòi Hương",
        "scientificName": "Paradoxurus hermaphroditus",
        "purposeCode": "T",
        "citesAppendix": "Phụ lục II CITES",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "fluctuations": [],
        "baseline": {
          "otherMale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2025-10-03",
          "note": "Cơ sở hiện nghỉ nuôi",
          "otherUnknown": 0,
          "mother": 0,
          "otherFemale": 0,
          "father": 0
        }
      }
    ],
    "purposeCode": "T",
    "registrationCode": "028-25/B-DLC",
    "phone": "",
    "commune": "xã Hòa Sơn",
    "address": "Thôn 4, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "id": "fac_3",
    "owner": "Trịnh Viết Long",
    "facilityName": "Cơ sở nuôi Trịnh Viết Long",
    "ownerName": "Trịnh Viết Long",
    "lat": 12.506699,
    "updatedAt": "2026-10-18T15:21:37.461Z",
    "name": "Cơ sở nuôi Trịnh Viết Long",
    "lng": 108.1885,
    "registrationDate": "2025-10-03"
  },
  {
    "purposeCode": "T",
    "speciesList": [
      {
        "vietnameseName": "Chim Chào mào",
        "scientificName": "Pycnonotus jocosus",
        "purposeCode": "T",
        "group": "Động vật rừng thông thường (Lớp Chim)",
        "baseline": {
          "otherMale": 3,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 2,
          "otherFemale": 2,
          "note": "Số lượng Chim Chào mào nuôi",
          "date": "2026-01-01",
          "father": 2,
          "otherUnknown": 3
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "fluctuations": [],
        "id": "sp_30_1"
      }
    ],
    "name": "Cơ sở nuôi Hoàng Văn Hải",
    "lat": 12.574027,
    "owner": "Hoàng Văn Hải",
    "id": "fac_30",
    "lng": 108.3365,
    "commune": "Xã Dang Kang",
    "address": "Thôn 6, Xã Dang Kang, Tỉnh Đắk Lắk",
    "registrationCode": "Đang cập nhật",
    "updatedAt": "2026-10-18T15:21:37.461Z",
    "ownerName": "Hoàng Văn Hải",
    "phone": "",
    "registrationDate": "",
    "facilityName": "Cơ sở nuôi Hoàng Văn Hải",
    "note": ""
  },
  {
    "commune": "Xã Dang Kang",
    "purposeCode": "O",
    "name": "Cơ sở nuôi Võ Văn Nhơn",
    "speciesList": [
      {
        "baseline": {
          "otherMale": 0,
          "otherFemale": 0,
          "otherUnknown": 0,
          "father": 1,
          "note": "Số lượng Chim Chào mào nuôi cảnh",
          "date": "2026-01-01",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 1
        },
        "fluctuations": [],
        "vietnameseName": "Chim Chào mào",
        "scientificName": "Pycnonotus jocosus",
        "purposeCode": "O",
        "id": "sp_31_1",
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường (Lớp Chim)"
      }
    ],
    "registrationCode": "Đang cập nhật",
    "address": "Thôn 7, Xã Dang Kang, Tỉnh Đắk Lắk",
    "ownerName": "Võ Văn Nhơn",
    "updatedAt": "2026-10-18T15:21:37.461Z",
    "phone": "",
    "id": "fac_31",
    "facilityName": "Cơ sở nuôi Võ Văn Nhơn",
    "lat": 12.562678,
    "registrationDate": "",
    "owner": "Võ Văn Nhơn",
    "lng": 108.33214,
    "note": "Làm cảnh"
  },
  {
    "id": "fac_4",
    "purposeCode": "T",
    "phone": "",
    "speciesList": [
      {
        "baseline": {
          "otherUnknown": 0,
          "mother": 11,
          "date": "2026-01-01",
          "note": "Chưa được cấp mã số cơ sở",
          "father": 4,
          "otherMale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherFemale": 0
        },
        "id": "sp_4_1",
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "citesAppendix": "Phụ lục II CITES",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "fluctuations": [],
        "purposeCode": "T"
      }
    ],
    "lat": 12.492824,
    "name": "Cơ sở nuôi Phạm Bá Quang",
    "registrationCode": "104-26/B-DLC",
    "lng": 108.29803,
    "ownerName": "Phạm Bá Quang",
    "updatedAt": "2026-10-18T15:21:37.461Z",
    "facilityName": "Cơ sở nuôi Phạm Bá Quang",
    "note": "104-26/B-DLC",
    "address": "Thôn 8, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "commune": "xã Hòa Sơn",
    "owner": "Phạm Bá Quang",
    "registrationDate": "2026-07-06"
  },
  {
    "name": "Cơ sở nuôi Phan Thanh Hùng",
    "registrationDate": "2022-04-22",
    "speciesList": [
      {
        "baseline": {
          "otherUnknown": 0,
          "date": "2022-04-22",
          "note": "Cơ sở nghỉ nuôi",
          "father": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 0,
          "otherFemale": 0,
          "mother": 0
        },
        "purposeCode": "T",
        "fluctuations": [],
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "id": "sp_5_1",
        "citesAppendix": "Phụ lục II CITES"
      }
    ],
    "purposeCode": "T",
    "ownerName": "Phan Thanh Hùng",
    "updatedAt": "2026-10-18T15:21:37.461Z",
    "address": "Thôn 1, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "commune": "xã Hòa Sơn",
    "owner": "Phan Thanh Hùng",
    "phone": "",
    "registrationCode": "IIB-DLC-021",
    "facilityName": "Cơ sở nuôi Phan Thanh Hùng",
    "id": "fac_5",
    "note": "Nghỉ nuôi"
  },
  {
    "ownerName": "Lê Nguyễn Nhật Tân",
    "updatedAt": "2026-10-18T15:21:37.461Z",
    "note": "Nghỉ nuôi",
    "owner": "Lê Nguyễn Nhật Tân",
    "id": "fac_6",
    "registrationCode": "IIB-DLC-025",
    "speciesList": [
      {
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "citesAppendix": "Phụ lục II CITES",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "id": "sp_6_1",
        "purposeCode": "T",
        "fluctuations": [],
        "baseline": {
          "father": 0,
          "otherMale": 0,
          "mother": 0,
          "note": "Cơ sở nghỉ nuôi",
          "date": "2026-01-01",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherUnknown": 0,
          "otherFemale": 0
        }
      }
    ],
    "address": "Thôn 6, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "purposeCode": "T",
    "commune": "xã Hòa Sơn",
    "phone": "",
    "registrationDate": "",
    "name": "Cơ sở nuôi Lê Nguyễn Nhật Tân",
    "facilityName": "Cơ sở nuôi Lê Nguyễn Nhật Tân"
  },
  {
    "lat": 12.472545,
    "ownerName": "Nguyễn Tấn Danh Nhân",
    "updatedAt": "2026-10-18T15:21:37.461Z",
    "registrationCode": "IIB-C-DLC-055",
    "lng": 108.562016,
    "speciesList": [
      {
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "purposeCode": "T",
        "baseline": {
          "father": 3,
          "otherMale": 12,
          "otherFemale": 14,
          "mother": 5,
          "date": "2024-07-03",
          "note": "Số lượng Cầy vòi Hương hiện có",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherUnknown": 19
        },
        "fluctuations": [],
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "citesAppendix": "Phụ lục II CITES",
        "id": "sp_7_1"
      },
      {
        "vietnameseName": "Cầy vòi mốc",
        "scientificName": "Paguma larvata",
        "citesAppendix": "Phụ lục II CITES",
        "baseline": {
          "mother": 3,
          "father": 2,
          "otherUnknown": 0,
          "note": "Số lượng Cầy vòi mốc hiện có",
          "date": "2024-07-03",
          "otherFemale": 0,
          "otherMale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông"
        },
        "purposeCode": "T",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "fluctuations": [],
        "id": "sp_7_2"
      },
      {
        "group": "Động vật rừng thông thường",
        "id": "sp_7_3",
        "fluctuations": [],
        "baseline": {
          "father": 1,
          "otherFemale": 0,
          "date": "2026-01-01",
          "note": "Hiện trạng nuôi loài Don",
          "otherMale": 0,
          "otherUnknown": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 1
        },
        "purposeCode": "T",
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Atherurus macrourus",
        "vietnameseName": "Don"
      },
      {
        "vietnameseName": "Nhím",
        "scientificName": "Hystrix brachyura",
        "citesAppendix": "Khai báo kiểm lâm",
        "id": "sp_7_4",
        "group": "Động vật rừng thông thường",
        "purposeCode": "T",
        "fluctuations": [],
        "baseline": {
          "otherUnknown": 11,
          "otherFemale": 31,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 21,
          "mother": 12,
          "date": "2026-01-01",
          "note": "Hiện trạng nuôi loài Nhím",
          "father": 6
        }
      }
    ],
    "note": "",
    "purposeCode": "T",
    "id": "fac_7",
    "owner": "Nguyễn Tấn Danh Nhân",
    "name": "Cơ sở nuôi Nguyễn Tấn Danh Nhân",
    "phone": "",
    "facilityName": "Cơ sở nuôi Nguyễn Tấn Danh Nhân",
    "registrationDate": "2024-07-03",
    "address": "Buôn Tơ Rang, xã Yang Mao, Tỉnh Đắk Lắk",
    "commune": "xã Yang Mao"
  },
  {
    "note": "",
    "facilityName": "Cơ sở nuôi Huỳnh Công Nam",
    "ownerName": "Huỳnh Công Nam",
    "updatedAt": "2026-10-18T15:21:37.461Z",
    "speciesList": [
      {
        "purposeCode": "T",
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-05-05",
          "note": "Hiện trạng nuôi ban đầu",
          "father": 1,
          "mother": 5,
          "otherUnknown": 4,
          "otherMale": 0,
          "otherFemale": 0
        },
        "fluctuations": [],
        "citesAppendix": "Phụ lục II CITES",
        "id": "sp_8_1",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)"
      }
    ],
    "purposeCode": "T",
    "registrationCode": "53-26/B-DLC",
    "phone": "",
    "owner": "Huỳnh Công Nam",
    "lng": 108.562716,
    "id": "fac_8",
    "registrationDate": "2026-05-05",
    "commune": "xã Yang Mao",
    "address": "Buôn chàm A, xã Yang Mao, Tỉnh Đắk Lắk",
    "name": "Cơ sở nuôi Huỳnh Công Nam",
    "lat": 12.483552
  },
  {
    "facilityName": "Cơ sở nuôi Trần Duy Quân",
    "address": "Thôn Ea Luêh, xã Yang Mao, Tỉnh Đắk Lắk",
    "commune": "xã Yang Mao",
    "registrationCode": "14-26/B-DLC",
    "id": "fac_9",
    "note": "",
    "owner": "Trần Duy Quân",
    "updatedAt": "2026-10-18T15:21:37.461Z",
    "ownerName": "Trần Duy Quân",
    "lng": 108.655302,
    "phone": "",
    "registrationDate": "2026-03-03",
    "speciesList": [
      {
        "baseline": {
          "otherUnknown": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 5,
          "otherMale": 0,
          "otherFemale": 0,
          "mother": 8,
          "date": "2026-03-03",
          "note": "Hiện trạng nuôi ban đầu"
        },
        "id": "sp_9_1",
        "citesAppendix": "Phụ lục II CITES",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "fluctuations": [],
        "scientificName": "Paradoxurus hermaphroditus",
        "vietnameseName": "Cầy vòi Hương",
        "purposeCode": "T"
      }
    ],
    "purposeCode": "T",
    "name": "Cơ sở nuôi Trần Duy Quân",
    "lat": 12.503389
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
