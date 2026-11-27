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
    "address": "Thôn 3, xã Hòa Sơn, Tỉnh Đắk Lắk",
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
    "registrationCode": "IIB-DLC-027",
    "note": "",
    "phone": "",
    "owner": "Lê Thị Xuân",
    "name": "Cơ sở nuôi Lê Thị Xuân",
    "lat": 12.496848,
    "updatedAt": "2026-11-26T00:29:15.343Z",
    "purposeCode": "T",
    "ownerName": "Lê Thị Xuân",
    "commune": "xã Hòa Sơn",
    "registrationDate": "2023-03-17",
    "id": "fac_1",
    "lng": 108.227912,
    "facilityName": "Cơ sở nuôi Lê Thị Xuân"
  },
  {
    "lng": 108.456819,
    "owner": "Trịnh Lục",
    "registrationCode": "52-26/B-DLC",
    "phone": "",
    "purposeCode": "T",
    "commune": "xã Cư Pui",
    "lat": 12.546946,
    "id": "fac_10",
    "ownerName": "Trịnh Lục",
    "note": "",
    "updatedAt": "2026-11-26T00:29:15.348Z",
    "facilityName": "Cơ sở nuôi Trịnh Lục",
    "address": "Thôn 3, xã Cư Pui, Tỉnh Đắk Lắk",
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
    "registrationDate": "2026-05-08",
    "name": "Cơ sở nuôi Trịnh Lục"
  },
  {
    "name": "Cơ sở nuôi Nguyễn Hữu Đô",
    "commune": "xã Cư Pui",
    "owner": "Nguyễn Hữu Đô",
    "phone": "",
    "registrationCode": "IIB-C-DLC-063",
    "updatedAt": "2026-11-08T03:23:43.581Z",
    "note": "",
    "lat": 12.548123,
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
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decOtherFemale": 0,
            "purpose": "T",
            "decOtherMale": 0,
            "incOtherMale": 0,
            "incOtherUnknown": 3
          }
        ]
      }
    ],
    "ownerName": "Nguyễn Hữu Đô",
    "registrationDate": "2024-09-25",
    "purposeCode": "T",
    "address": "Thôn 3, xã Cư Pui, Tỉnh Đắk Lắk",
    "facilityName": "Cơ sở nuôi Nguyễn Hữu Đô",
    "id": "fac_11",
    "lng": 108.458901
  },
  {
    "facilityName": "Cơ sở nuôi Lê Thanh Đức",
    "registrationCode": "IIB-C-DLC-060",
    "address": "Thôn 5, Xã Krông Bông, Tỉnh Đắk Lắk",
    "note": "",
    "name": "Cơ sở nuôi Lê Thanh Đức",
    "id": "fac_12",
    "purposeCode": "T",
    "lat": 12.528258,
    "ownerName": "Lê Thanh Đức",
    "updatedAt": "2026-11-26T00:29:15.356Z",
    "phone": "",
    "owner": "Lê Thanh Đức",
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
    "lng": 108.332398,
    "registrationDate": "2024-09-06"
  },
  {
    "name": "Cơ sở nuôi Ngô Thị Trang",
    "phone": "",
    "registrationDate": "2025-07-31",
    "commune": "Xã Krông Bông",
    "lng": 108.414746,
    "facilityName": "Cơ sở nuôi Ngô Thị Trang",
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
    "owner": "Ngô Thị Trang",
    "note": "",
    "id": "fac_13",
    "lat": 12.53985,
    "purposeCode": "T",
    "updatedAt": "2026-11-26T00:29:15.367Z",
    "address": "Thôn 8, Xã Krông Bông, Tỉnh Đắk Lắk",
    "registrationCode": "010-25/B-DLC",
    "ownerName": "Ngô Thị Trang"
  },
  {
    "name": "Cơ sở nuôi Hà Huy Thanh",
    "purposeCode": "T",
    "address": "TDP4, Xã Krông Bông, Tỉnh Đắk Lắk",
    "note": "",
    "lng": 108.333327,
    "id": "fac_14",
    "facilityName": "Cơ sở nuôi Hà Huy Thanh",
    "registrationCode": "18-26/B-DLC",
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
    "registrationDate": "2026-03-17",
    "owner": "Hà Huy Thanh",
    "ownerName": "Hà Huy Thanh",
    "phone": "",
    "updatedAt": "2026-11-26T00:29:15.368Z",
    "lat": 12.492108,
    "commune": "Xã Krông Bông"
  },
  {
    "note": "",
    "commune": "xã Yang Mao",
    "owner": "Trần Văn Tới",
    "purposeCode": "T",
    "lat": 12.477054,
    "registrationDate": "2023-11-02",
    "name": "Cơ sở nuôi Trần Văn Tới",
    "phone": "",
    "id": "fac_15",
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
    "updatedAt": "2026-11-26T00:29:15.368Z",
    "registrationCode": "52-26/B-DLC",
    "facilityName": "Cơ sở nuôi Trần Văn Tới",
    "lng": 108.58051,
    "ownerName": "Trần Văn Tới",
    "address": "Thôn 1, xã Yang Mao, Tỉnh Đắk Lắk"
  },
  {
    "lng": 108.551582,
    "facilityName": "Cơ sở nuôi Lê Đình Tâm",
    "registrationCode": "Đang cập nhật",
    "id": "fac_16",
    "address": "Thôn Cư Drăm, xã Yang Mao, Tỉnh Đắk Lắk",
    "ownerName": "Lê Đình Tâm",
    "purposeCode": "T",
    "updatedAt": "2026-11-26T00:29:15.576Z",
    "lat": 12.487572,
    "commune": "xã Yang Mao",
    "name": "Cơ sở nuôi Lê Đình Tâm",
    "owner": "Lê Đình Tâm",
    "phone": "",
    "note": "",
    "registrationDate": "",
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
    ]
  },
  {
    "registrationDate": "",
    "lng": 108.560116,
    "name": "Cơ sở nuôi Nguyễn Kim Danh",
    "address": "Buôn Tul, xã Yang Mao, Tỉnh Đắk Lắk",
    "id": "fac_17",
    "owner": "Nguyễn Kim Danh",
    "phone": "",
    "note": "",
    "purposeCode": "T",
    "ownerName": "Nguyễn Kim Danh",
    "facilityName": "Cơ sở nuôi Nguyễn Kim Danh",
    "lat": 12.462085,
    "updatedAt": "2026-11-26T00:29:15.576Z",
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
    "registrationCode": "Đang cập nhật",
    "commune": "xã Yang Mao"
  },
  {
    "name": "Nguyễn Lĩnh",
    "registrationCode": "141-26/B-DLC",
    "commune": "xã Cư Pui",
    "id": "fac_1786163645775",
    "ownerName": "Nguyễn Lĩnh",
    "purposeCode": "T",
    "lng": 108.455555,
    "note": "",
    "updatedAt": "2026-11-26T00:29:15.577Z",
    "phone": "0866100652",
    "facilityName": "Nguyễn Lĩnh",
    "registrationDate": "2026-07-24",
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
    "address": "thôn 3, xã Cư Pui, tỉnh Đắk Lắk.",
    "owner": "Nguyễn Lĩnh",
    "lat": 12.547587
  },
  {
    "facilityName": "Nguyễn Hoàng Dũng",
    "lat": 12.558599,
    "id": "fac_1786419630740",
    "note": "",
    "phone": "0342017979",
    "purposeCode": "T",
    "owner": "Nguyễn Hoàng Dũng",
    "commune": "Xã Dang Kang",
    "registrationDate": "2026-01-24",
    "name": "Nguyễn Hoàng Dũng",
    "lng": 108.321947,
    "registrationCode": "142-26/B-DLC",
    "address": "thôn 6, xã Dang Kang, tỉnh Đắk Lắk",
    "ownerName": "Nguyễn Hoàng Dũng",
    "updatedAt": "2026-11-26T00:29:15.577Z",
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
    ]
  },
  {
    "registrationCode": "Chưa có mã số",
    "commune": "Xã Krông Bông",
    "purposeCode": "T",
    "id": "fac_1786432202893",
    "lat": 12.520837,
    "ownerName": "Phạm Duy Thắng",
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
    "note": "",
    "phone": "",
    "updatedAt": "2026-11-26T00:29:15.577Z",
    "name": "Phạm Duy Thắng",
    "owner": "Phạm Duy Thắng",
    "address": "Thôn 23",
    "facilityName": "Phạm Duy Thắng",
    "lng": 108.394137,
    "registrationDate": "2026-08-11"
  },
  {
    "commune": "Xã Dang Kang",
    "note": "",
    "phone": "",
    "lng": "108.338165",
    "purposeCode": "T",
    "registrationDate": "2025-11-12",
    "facilityName": "Nguyễn Kim Tuấn",
    "owner": "Nguyễn Kim Tuấn",
    "name": "Nguyễn Kim Tuấn",
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
    "lat": "12.575576",
    "registrationCode": "Chưa có mã số",
    "id": "fac_1786504114807",
    "address": "Thôn 6 xã Dang Kang",
    "ownerName": "Nguyễn Kim Tuấn",
    "updatedAt": "2026-11-26T00:29:15.577Z"
  },
  {
    "note": "",
    "owner": "Nguyễn Hữu Lưu",
    "lng": "108.431876",
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
    "id": "fac_1787585236556",
    "address": "",
    "registrationDate": "2026-05-25",
    "facilityName": "Nguyễn Hữu Lưu",
    "phone": "",
    "name": "Nguyễn Hữu Lưu",
    "ownerName": "Nguyễn Hữu Lưu",
    "lat": "12.532135",
    "registrationCode": "Chưa có mã số",
    "updatedAt": "2026-11-26T00:29:15.577Z",
    "purposeCode": "T",
    "commune": "xã Cư Pui"
  },
  {
    "phone": "",
    "updatedAt": "2026-11-26T00:29:15.584Z",
    "registrationCode": "Chưa có mã số",
    "ownerName": "Nguyễn Tâm Châu",
    "lng": 108.324298,
    "commune": "xã Hòa Sơn",
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
    ],
    "owner": "Nguyễn Tâm Châu",
    "address": "",
    "name": "Nguyễn Tâm Châu",
    "facilityName": "Nguyễn Tâm Châu",
    "lat": 12.492318,
    "note": "",
    "purposeCode": "T",
    "registrationDate": "2026-06-27",
    "id": "fac_1787793901636"
  },
  {
    "note": "",
    "registrationDate": "2026-07-27",
    "lat": 12.495249,
    "purposeCode": "T",
    "name": "Nguyễn Thanh ",
    "commune": "xã Hòa Sơn",
    "id": "fac_1787794070148",
    "facilityName": "Nguyễn Thanh ",
    "owner": "Nguyễn Thanh ",
    "lng": 108.294381,
    "address": "Thôn 2",
    "ownerName": "Nguyễn Thanh ",
    "phone": "",
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
    "registrationCode": "Chưa có mã số"
  },
  {
    "lat": 12.492941,
    "phone": "",
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
    "name": "Trần Văn Ngọ",
    "registrationCode": "Chưa có mã số",
    "ownerName": "Trần Văn Ngọ",
    "note": "",
    "commune": "xã Hòa Sơn",
    "updatedAt": "2026-11-26T00:29:15.585Z",
    "owner": "Trần Văn Ngọ",
    "id": "fac_1787794146413",
    "lng": 108.32352,
    "address": "Thôn 9 Hòa Sơn",
    "purposeCode": "T",
    "registrationDate": "2026-07-27",
    "facilityName": "Trần Văn Ngọ"
  },
  {
    "facilityName": "Nguyễn Duy Thông",
    "id": "fac_1787794338130",
    "registrationDate": "2026-08-27",
    "commune": "xã Hòa Sơn",
    "lng": 108.315073,
    "purposeCode": "T",
    "address": "thôn 9, xã Hoà Sơn, tỉnh Đắk Lắk0948861157",
    "name": "Nguyễn Duy Thông",
    "phone": "0948861157",
    "registrationCode": "Chưa có mã số",
    "updatedAt": "2026-11-26T00:29:15.585Z",
    "lat": 12.490722,
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
    "ownerName": "Nguyễn Duy Thông",
    "owner": "Nguyễn Duy Thông",
    "note": "Đang cập nhập"
  },
  {
    "registrationDate": "2026-08-27",
    "address": "Thôn 10",
    "purposeCode": "T",
    "phone": "0337825861",
    "lng": 108.322735,
    "owner": "Vũ Hoàng Tân",
    "ownerName": "Vũ Hoàng Tân",
    "updatedAt": "2026-11-26T00:29:15.586Z",
    "note": "",
    "lat": 12.500922,
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
    "commune": "xã Hòa Sơn",
    "facilityName": "Vũ Hoàng Tân",
    "id": "fac_1787795701427",
    "name": "Vũ Hoàng Tân",
    "registrationCode": "Chưa có mã số"
  },
  {
    "id": "fac_1791188880545",
    "registrationCode": "Chưa có mã số",
    "note": "",
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
    "lng": 108.322383,
    "owner": "Nguyễn Văn Vinh",
    "commune": "xã Hòa Sơn",
    "updatedAt": "2026-11-26T00:29:15.586Z",
    "ownerName": "Nguyễn Văn Vinh",
    "registrationDate": "2026-10-05",
    "lat": 12.49798,
    "purposeCode": "T",
    "phone": "0988.257.586",
    "facilityName": "Nguyễn Văn Vinh"
  },
  {
    "note": "",
    "commune": "xã Hòa Sơn",
    "name": "Lương Thị Cẩm Thanh",
    "ownerName": "Lương Thị Cẩm Thanh",
    "purposeCode": "T",
    "registrationDate": "2026-10-11",
    "updatedAt": "2026-11-26T00:29:15.586Z",
    "lat": 12.507605,
    "owner": "Lương Thị Cẩm Thanh",
    "registrationCode": "Chưa có mã số",
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
    "facilityName": "Lương Thị Cẩm Thanh",
    "lng": 108.184749,
    "phone": "",
    "id": "fac_1794366309761",
    "address": "Thôn 1, xã Hòa Sơn"
  },
  {
    "registrationCode": "Chưa có mã số",
    "commune": "Xã Dang Kang",
    "owner": "Tăng Ngọc Tịnh",
    "id": "fac_1794367138616",
    "phone": "",
    "lat": "12.577273",
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
    "updatedAt": "2026-11-26T00:29:15.586Z",
    "name": "Tăng Ngọc Tịnh",
    "facilityName": "Tăng Ngọc Tịnh",
    "ownerName": "Tăng Ngọc Tịnh",
    "purposeCode": "T",
    "address": "Thôn 9, xã Dang Kang",
    "lng": "108.341248",
    "note": "",
    "registrationDate": "2026-11-11"
  },
  {
    "updatedAt": "2026-11-26T00:29:15.589Z",
    "id": "fac_1794368355384",
    "name": "Ngô Ngọc Tuân",
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
    "ownerName": "Ngô Ngọc Tuân",
    "registrationDate": "2026-11-11",
    "facilityName": "Ngô Ngọc Tuân",
    "lng": "108.186247",
    "commune": "xã Hòa Sơn",
    "note": "",
    "address": "Thôn 1",
    "purposeCode": "T",
    "phone": "0903550988",
    "registrationCode": "Chưa có mã số",
    "lat": "12.508668",
    "owner": "Ngô Ngọc Tuân"
  },
  {
    "registrationDate": "2026-11-12",
    "lat": "",
    "purposeCode": "T",
    "address": "Thôn 1, xã Hoà Sơn, Tỉnh Đắk Lắk",
    "facilityName": "Ngô Ngọc Tuân",
    "lng": "",
    "name": "Ngô Ngọc Tuân",
    "owner": "Ngô Ngọc Tuân",
    "commune": "xã Hòa Sơn",
    "id": "fac_1794453722654",
    "phone": "0903550988",
    "note": "Đang thử Nghiệm",
    "ownerName": "Ngô Ngọc Tuân",
    "registrationCode": "Chưa có mã số",
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
    "updatedAt": "2026-11-26T00:29:15.589Z"
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
    "name": "Cơ sở nuôi Lê Quang Mạnh",
    "lng": 108.423608,
    "note": "",
    "registrationCode": "Đang cập nhật",
    "address": "Thôn 29, Xã Krông Bông, Tỉnh Đắk Lắk",
    "updatedAt": "2026-11-26T00:29:15.589Z",
    "purposeCode": "T",
    "facilityName": "Cơ sở nuôi Lê Quang Mạnh",
    "owner": "Lê Quang Mạnh",
    "lat": 12.526903,
    "registrationDate": "",
    "ownerName": "Lê Quang Mạnh",
    "commune": "Xã Krông Bông",
    "phone": "",
    "id": "fac_18"
  },
  {
    "facilityName": "Cơ sở nuôi Nguyễn Trương Đắc Nam",
    "registrationDate": "",
    "address": "Thôn 9, Xã Krông Bông, Tỉnh Đắk Lắk",
    "id": "fac_19",
    "purposeCode": "T",
    "lat": 12.528051,
    "name": "Cơ sở nuôi Nguyễn Trương Đắc Nam",
    "owner": "Nguyễn Trương Đắc Nam",
    "updatedAt": "2026-11-26T00:29:15.589Z",
    "phone": "",
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
    ],
    "note": "",
    "lng": 108.328497,
    "ownerName": "Nguyễn Trương Đắc Nam",
    "registrationCode": "Đang cập nhật",
    "commune": "Xã Krông Bông"
  },
  {
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
    "phone": "",
    "registrationDate": "2023-04-17",
    "address": "Thôn Quảng Đông, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "id": "fac_2",
    "owner": "Nguyễn Văn Thúy",
    "lat": 12.491634,
    "name": "Cơ sở nuôi Nguyễn Văn Thúy",
    "commune": "xã Hòa Sơn",
    "purposeCode": "T",
    "facilityName": "Cơ sở nuôi Nguyễn Văn Thúy",
    "ownerName": "Nguyễn Văn Thúy",
    "registrationCode": "IIB-C-DLC-028",
    "note": "",
    "updatedAt": "2026-11-26T00:29:15.589Z",
    "lng": 108.297682
  },
  {
    "owner": "Trần Văn Lực",
    "id": "fac_20",
    "ownerName": "Trần Văn Lực",
    "lat": 12.58438,
    "updatedAt": "2026-11-26T00:29:15.590Z",
    "registrationDate": "",
    "purposeCode": "T",
    "phone": "",
    "address": "Buôn Cư Ênun A, Xã Dang Kang, Tỉnh Đắk Lắk",
    "registrationCode": "Đang cập nhật",
    "commune": "Xã Dang Kang",
    "note": "",
    "lng": 108.315384,
    "facilityName": "Cơ sở nuôi Trần Văn Lực",
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
    "name": "Cơ sở nuôi Trần Văn Lực"
  },
  {
    "commune": "Xã Dang Kang",
    "lng": 108.339096,
    "id": "fac_21",
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
          "note": "Số lượng Dúi mốc lớn hiện có"
        },
        "id": "sp_21_1",
        "fluctuations": []
      }
    ],
    "ownerName": "Đinh Tiến Toàn",
    "registrationDate": "",
    "updatedAt": "2026-11-26T00:29:15.590Z",
    "note": "",
    "lat": 12.619158,
    "facilityName": "Cơ sở nuôi Đinh Tiến Toàn",
    "phone": "",
    "registrationCode": "Đang cập nhật",
    "address": "Thôn 3, Xã Dang Kang, Tỉnh Đắk Lắk",
    "owner": "Đinh Tiến Toàn",
    "name": "Cơ sở nuôi Đinh Tiến Toàn",
    "purposeCode": "T"
  },
  {
    "commune": "xã Hòa Sơn",
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
    "registrationCode": "Đang cập nhật",
    "facilityName": "Cơ sở nuôi Nguyễn Thanh",
    "id": "fac_22",
    "phone": "",
    "registrationDate": "",
    "updatedAt": "2026-11-26T00:29:15.590Z",
    "name": "Cơ sở nuôi Nguyễn Thanh",
    "ownerName": "Nguyễn Thanh",
    "note": "",
    "purposeCode": "T",
    "address": "Thôn 2, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "owner": "Nguyễn Thanh"
  },
  {
    "ownerName": "Huỳnh Phúc Lợi",
    "registrationCode": "Đang cập nhật",
    "id": "fac_23",
    "updatedAt": "2026-11-26T00:29:15.590Z",
    "owner": "Huỳnh Phúc Lợi",
    "phone": "",
    "purposeCode": "O",
    "commune": "xã Hòa Sơn",
    "facilityName": "Cơ sở nuôi Huỳnh Phúc Lợi",
    "address": "Thôn 2, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "name": "Cơ sở nuôi Huỳnh Phúc Lợi",
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
    "note": "Làm cảnh",
    "registrationDate": ""
  },
  {
    "updatedAt": "2026-11-26T00:29:15.590Z",
    "purposeCode": "T",
    "name": "Cơ sở nuôi Phan Thanh Trúc",
    "ownerName": "Phan Thanh Trúc",
    "commune": "xã Hòa Sơn",
    "registrationDate": "",
    "note": "",
    "address": "Thôn 4, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "facilityName": "Cơ sở nuôi Phan Thanh Trúc",
    "registrationCode": "Đang cập nhật",
    "phone": "",
    "id": "fac_24",
    "speciesList": [
      {
        "fluctuations": [],
        "citesAppendix": "Khai báo ki��m lâm",
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
    "owner": "Phan Thanh Trúc"
  },
  {
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
    "id": "fac_25",
    "address": "Thôn 4, Xã Krông Bông, Tỉnh Đắk Lắk",
    "facilityName": "Cơ sở nuôi Thái Hồng Sơn",
    "lat": 12.502961,
    "registrationCode": "Đang cập nhật",
    "registrationDate": "",
    "owner": "Thái Hồng Sơn",
    "purposeCode": "T",
    "note": "",
    "lng": 108.333624,
    "updatedAt": "2026-11-26T00:29:15.590Z",
    "commune": "Xã Krông Bông",
    "name": "Cơ sở nuôi Thái Hồng Sơn",
    "ownerName": "Thái Hồng Sơn",
    "phone": ""
  },
  {
    "lng": 108.336714,
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
    "name": "Cơ sở nuôi Nguyễn Trí",
    "address": "Thôn 7, Xã Krông Bông, Tỉnh Đắk Lắk",
    "ownerName": "Nguyễn Trí",
    "note": "",
    "registrationCode": "Đang cập nhật",
    "updatedAt": "2026-11-26T00:29:15.590Z",
    "facilityName": "Cơ sở nuôi Nguyễn Trí",
    "commune": "Xã Krông Bông",
    "phone": "",
    "lat": 12.523945,
    "registrationDate": "",
    "id": "fac_26",
    "purposeCode": "T",
    "owner": "Nguyễn Trí"
  },
  {
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
    "name": "Cơ sở nuôi Nguyễn Văn Hòa",
    "commune": "Xã Krông Bông",
    "note": "",
    "updatedAt": "2026-11-26T00:29:15.658Z",
    "registrationCode": "Đang cập nhật",
    "ownerName": "Nguyễn Văn Hòa",
    "facilityName": "Cơ sở nuôi Nguyễn Văn Hòa",
    "registrationDate": "",
    "purposeCode": "T",
    "owner": "Nguyễn Văn Hòa",
    "phone": "",
    "id": "fac_27",
    "address": "Thôn 2, Xã Krông Bông, Tỉnh Đắk Lắk"
  },
  {
    "facilityName": "Cơ sở nuôi Trần Văn Hà",
    "note": "",
    "ownerName": "Trần Văn Hà",
    "commune": "Xã Krông Bông",
    "name": "Cơ sở nuôi Trần Văn Hà",
    "lat": 12.547061,
    "updatedAt": "2026-11-26T00:29:15.658Z",
    "registrationCode": "Đang cập nhật",
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
    "registrationDate": "",
    "owner": "Trần Văn Hà",
    "address": "Thôn 26, Xã Krông Bông, Tỉnh Đắk Lắk",
    "id": "fac_28",
    "lng": 108.401029,
    "purposeCode": "T",
    "phone": ""
  },
  {
    "phone": "",
    "facilityName": "Cơ sở nuôi Trần Ngọc Long",
    "purposeCode": "T",
    "name": "Cơ sở nuôi Trần Ngọc Long",
    "address": "Thôn 2, Xã Krông Bông, Tỉnh Đắk Lắk",
    "note": "",
    "registrationDate": "",
    "id": "fac_29",
    "owner": "Trần Ngọc Long",
    "commune": "Xã Krông Bông",
    "ownerName": "Trần Ngọc Long",
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
    "updatedAt": "2026-11-26T00:29:15.659Z",
    "registrationCode": "Đang cập nhật"
  },
  {
    "updatedAt": "2026-11-26T00:29:15.659Z",
    "registrationDate": "2025-10-03",
    "ownerName": "Trịnh Viết Long",
    "note": "Nghỉ nuôi",
    "lat": 12.506699,
    "address": "Thôn 4, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "purposeCode": "T",
    "name": "Cơ sở nuôi Trịnh Viết Long",
    "commune": "xã Hòa Sơn",
    "id": "fac_3",
    "facilityName": "Cơ sở nuôi Trịnh Viết Long",
    "phone": "",
    "lng": 108.1885,
    "owner": "Trịnh Viết Long",
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
    "registrationCode": "028-25/B-DLC"
  },
  {
    "registrationCode": "Đang cập nhật",
    "address": "Thôn 6, Xã Dang Kang, Tỉnh Đắk Lắk",
    "lng": 108.3365,
    "purposeCode": "T",
    "name": "Cơ sở nuôi Hoàng Văn Hải",
    "ownerName": "Hoàng Văn Hải",
    "phone": "",
    "updatedAt": "2026-11-26T00:29:15.660Z",
    "id": "fac_30",
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
    "commune": "Xã Dang Kang",
    "lat": 12.574027,
    "facilityName": "Cơ sở nuôi Hoàng Văn Hải",
    "owner": "Hoàng Văn Hải",
    "registrationDate": "",
    "note": ""
  },
  {
    "note": "Làm cảnh",
    "lat": 12.562678,
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
    "facilityName": "Cơ sở nuôi Võ Văn Nhơn",
    "commune": "Xã Dang Kang",
    "name": "Cơ sở nuôi Võ Văn Nhơn",
    "purposeCode": "O",
    "lng": 108.33214,
    "address": "Thôn 7, Xã Dang Kang, Tỉnh Đắk Lắk",
    "owner": "Võ Văn Nhơn",
    "id": "fac_31",
    "updatedAt": "2026-11-26T00:29:15.660Z",
    "registrationCode": "Đang cập nhật",
    "ownerName": "Võ Văn Nhơn",
    "phone": ""
  },
  {
    "purposeCode": "T",
    "updatedAt": "2026-11-26T00:29:15.660Z",
    "facilityName": "Cơ sở nuôi Phạm Bá Quang",
    "ownerName": "Phạm Bá Quang",
    "lat": 12.492824,
    "registrationDate": "2026-07-06",
    "address": "Thôn 8, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "id": "fac_4",
    "commune": "xã Hòa Sơn",
    "name": "Cơ sở nuôi Phạm Bá Quang",
    "registrationCode": "104-26/B-DLC",
    "owner": "Phạm Bá Quang",
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
    "lng": 108.29803,
    "phone": "",
    "note": "104-26/B-DLC"
  },
  {
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
    "address": "Thôn 1, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "phone": "",
    "owner": "Phan Thanh Hùng",
    "registrationDate": "2022-04-22",
    "registrationCode": "IIB-DLC-021",
    "purposeCode": "T",
    "note": "Nghỉ nuôi",
    "ownerName": "Phan Thanh Hùng",
    "name": "Cơ sở nuôi Phan Thanh Hùng",
    "facilityName": "Cơ sở nuôi Phan Thanh Hùng",
    "commune": "xã Hòa Sơn",
    "updatedAt": "2026-11-26T00:29:15.660Z"
  },
  {
    "purposeCode": "T",
    "updatedAt": "2026-11-26T00:29:15.660Z",
    "note": "Nghỉ nuôi",
    "ownerName": "Lê Nguyễn Nhật Tân",
    "name": "Cơ sở nuôi Lê Nguyễn Nhật Tân",
    "commune": "xã Hòa Sơn",
    "registrationCode": "IIB-DLC-025",
    "owner": "Lê Nguyễn Nhật Tân",
    "address": "Thôn 6, xã Hòa Sơn, Tỉnh Đắk Lắk",
    "registrationDate": "",
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
    "facilityName": "Cơ sở nuôi Lê Nguyễn Nhật Tân",
    "id": "fac_6",
    "phone": ""
  },
  {
    "purposeCode": "T",
    "note": "",
    "phone": "",
    "owner": "Nguyễn Tấn Danh Nhân",
    "registrationCode": "IIB-C-DLC-055",
    "address": "Buôn Tơ Rang, xã Yang Mao, Tỉnh Đắk Lắk",
    "name": "Cơ sở nuôi Nguyễn Tấn Danh Nhân",
    "lat": 12.472545,
    "commune": "xã Yang Mao",
    "updatedAt": "2026-11-26T00:29:15.662Z",
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
    "registrationDate": "2024-07-03",
    "ownerName": "Nguyễn Tấn Danh Nhân",
    "id": "fac_7",
    "lng": 108.562016,
    "facilityName": "Cơ sở nuôi Nguyễn Tấn Danh Nhân"
  },
  {
    "updatedAt": "2026-11-26T00:29:15.662Z",
    "purposeCode": "T",
    "address": "Buôn chàm A, xã Yang Mao, Tỉnh Đắk Lắk",
    "ownerName": "Huỳnh Công Nam",
    "registrationDate": "2026-05-05",
    "lat": 12.483552,
    "owner": "Huỳnh Công Nam",
    "facilityName": "Cơ sở nuôi Huỳnh Công Nam",
    "id": "fac_8",
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
    "note": "",
    "lng": 108.562716,
    "registrationCode": "53-26/B-DLC",
    "commune": "xã Yang Mao",
    "name": "Cơ sở nuôi Huỳnh Công Nam",
    "phone": ""
  },
  {
    "owner": "Trần Duy Quân",
    "address": "Thôn Ea Luêh, xã Yang Mao, Tỉnh Đắk Lắk",
    "purposeCode": "T",
    "ownerName": "Trần Duy Quân",
    "id": "fac_9",
    "updatedAt": "2026-11-26T00:29:15.662Z",
    "registrationCode": "14-26/B-DLC",
    "lat": 12.503389,
    "phone": "",
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
    "registrationDate": "2026-03-03",
    "facilityName": "Cơ sở nuôi Trần Duy Quân",
    "note": "",
    "name": "Cơ sở nuôi Trần Duy Quân",
    "commune": "xã Yang Mao",
    "lng": 108.655302
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
