/**
 * LocalStorage manager and sample demo data for Wildlife Monitoring Application
 */

const STORAGE_KEY = 'wildlife_manager_data_v5';

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

export const REAL_FACILITIES_DATA = [
  {
    "updatedAt": "2026-08-12T14:23:57.697Z",
    "purposeCode": "T",
    "registrationDate": "2023-03-17",
    "lng": 108.227912,
    "note": "",
    "address": "Thôn 3, xã Hòa Sơn, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "phone": "",
    "speciesList": [
      {
        "id": "sp_1_1",
        "vietnameseName": "Cầy vòi Hương",
        "purposeCode": "T",
        "fluctuations": [],
        "scientificName": "Paradoxurus hermaphroditus",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "citesAppendix": "Phụ lục II CITES",
        "baseline": {
          "father": 4,
          "mother": 5,
          "date": "2023-03-17",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 8,
          "otherUnknown": 2,
          "note": "Số lượng vật nuôi theo chứng nhận cơ sở",
          "otherFemale": 10
        }
      }
    ],
    "commune": "xã Hòa Sơn",
    "id": "fac_1",
    "ownerName": "Lê Thị Xuân",
    "lat": 12.496848,
    "registrationCode": "IIB-DLC-027",
    "facilityName": "Cơ sở nuôi Lê Thị Xuân"
  },
  {
    "facilityName": "Cơ sở nuôi Trịnh Lục",
    "lat": 12.546946,
    "registrationCode": "52-26/B-DLC",
    "id": "fac_10",
    "ownerName": "Trịnh Lục",
    "speciesList": [
      {
        "id": "sp_10_1",
        "vietnameseName": "Cầy vòi Hương",
        "purposeCode": "T",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "scientificName": "Paradoxurus hermaphroditus",
        "fluctuations": [
          {
            "incOtherMale": 0,
            "decOtherUnknown": 0,
            "isPurchaseMode": true,
            "decMother": 0,
            "id": "fluc_1786413132829",
            "decOtherFemale": 0,
            "createdAt": 1786413132829,
            "purpose": "T",
            "verifier": "",
            "incOtherFemale": 0,
            "incFather": 2,
            "incOtherUnknown": 0,
            "date": "2026-06-16",
            "reason": "Mua từ cơ sở nuôi sinh sản khác",
            "decFather": 0,
            "incMother": 4,
            "time": "08:51",
            "decOtherMale": 0
          },
          {
            "id": "fluc_1786413181544",
            "decOtherFemale": 0,
            "createdAt": 1786413181544,
            "incOtherMale": 0,
            "decOtherUnknown": 0,
            "isPurchaseMode": false,
            "decMother": 0,
            "date": "2026-06-09",
            "incOtherUnknown": 4,
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decFather": 0,
            "incMother": 0,
            "decOtherMale": 0,
            "time": "08:52",
            "verifier": "",
            "purpose": "T",
            "incOtherFemale": 0,
            "incFather": 0
          },
          {
            "incOtherFemale": 14,
            "verifier": "",
            "purpose": "T",
            "incFather": 0,
            "incOtherUnknown": 0,
            "date": "2026-07-10",
            "reason": "Mua từ cơ sở nuôi sinh sản khác",
            "decOtherMale": 0,
            "time": "08:53",
            "incMother": 0,
            "decFather": 0,
            "incOtherMale": 1,
            "isPurchaseMode": true,
            "decOtherUnknown": 0,
            "decMother": 0,
            "id": "fluc_1786413220093",
            "createdAt": 1786413220093,
            "decOtherFemale": 0
          },
          {
            "verifier": "",
            "purpose": "T",
            "incOtherFemale": 0,
            "incFather": 0,
            "incOtherUnknown": 12,
            "date": "2026-07-11",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decFather": 0,
            "incMother": 0,
            "decOtherMale": 0,
            "time": "08:54",
            "incOtherMale": 0,
            "decOtherUnknown": 0,
            "isPurchaseMode": false,
            "decMother": 0,
            "id": "fluc_1786413284623",
            "decOtherFemale": 0,
            "createdAt": 1786413284623
          },
          {
            "id": "fluc_1786413405967",
            "createdAt": 1786413405967,
            "decOtherFemale": 5,
            "incOtherMale": 0,
            "isPurchaseMode": false,
            "decOtherUnknown": 0,
            "decMother": 0,
            "incOtherUnknown": 0,
            "date": "2026-08-11",
            "reason": "Xuất bán thương mại cho cơ sở B",
            "time": "08:56",
            "decOtherMale": 0,
            "incMother": 0,
            "decFather": 0,
            "incOtherFemale": 0,
            "purpose": "T",
            "verifier": "",
            "incFather": 0
          }
        ],
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-05-08",
          "mother": 3,
          "father": 2,
          "otherFemale": 0,
          "note": "Hiện trạng nuôi ban đầu",
          "otherUnknown": 0,
          "otherMale": 0
        },
        "citesAppendix": "Phụ lục II CITES"
      }
    ],
    "phone": "",
    "commune": "xã Cư Pui",
    "address": "Thôn 3, xã Cư Pui, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "note": "",
    "lng": 108.456819,
    "updatedAt": "2026-08-12T14:23:57.697Z",
    "registrationDate": "2026-05-08",
    "purposeCode": "T"
  },
  {
    "registrationDate": "2024-09-25",
    "purposeCode": "T",
    "updatedAt": "2026-08-12T14:23:57.697Z",
    "lng": 108.453559,
    "note": "",
    "address": "Thôn 3, xã Cư Pui, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "commune": "xã Cư Pui",
    "phone": "",
    "speciesList": [
      {
        "purposeCode": "T",
        "vietnameseName": "Cầy vòi Hương",
        "id": "sp_11_1",
        "baseline": {
          "mother": 7,
          "father": 4,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2024-09-25",
          "otherUnknown": 19,
          "otherMale": 5,
          "otherFemale": 16,
          "note": "Hiện trạng nuôi đăng ký"
        },
        "citesAppendix": "Phụ lục II CITES",
        "fluctuations": [
          {
            "id": "fluc_1786414971813",
            "createdAt": 1786414971813,
            "decOtherFemale": 0,
            "incOtherMale": 0,
            "isPurchaseMode": false,
            "decOtherUnknown": 0,
            "decMother": 0,
            "date": "2026-08-11",
            "incOtherUnknown": 0,
            "reason": "Xuất bán thương mại cho cơ sở B",
            "time": "09:22",
            "decOtherMale": 1,
            "incMother": 0,
            "decFather": 0,
            "incOtherFemale": 0,
            "verifier": "",
            "purpose": "T",
            "incFather": 0
          }
        ],
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "scientificName": "Paradoxurus hermaphroditus"
      }
    ],
    "ownerName": "Nguyễn Hữu Đô",
    "id": "fac_11",
    "registrationCode": "IIB-C-DLC-063",
    "lat": 12.548206,
    "facilityName": "Cơ sở nuôi Nguyễn Hữu Đô"
  },
  {
    "ownerName": "Lê Thanh Đức",
    "id": "fac_12",
    "lat": 12.528258,
    "registrationCode": "IIB-C-DLC-060",
    "facilityName": "Cơ sở nuôi Lê Thanh Đức",
    "purposeCode": "T",
    "registrationDate": "2024-09-06",
    "updatedAt": "2026-08-12T14:23:57.697Z",
    "lng": 108.332398,
    "note": "",
    "address": "Thôn 5, Xã Krông Bông, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "speciesList": [
      {
        "vietnameseName": "Cầy vòi Hương",
        "purposeCode": "T",
        "id": "sp_12_1",
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2024-09-06",
          "father": 2,
          "mother": 7,
          "note": "Hiện trạng nuôi đăng ký",
          "otherFemale": 9,
          "otherMale": 11,
          "otherUnknown": 6
        },
        "citesAppendix": "Phụ lục II CITES",
        "scientificName": "Paradoxurus hermaphroditus",
        "fluctuations": [],
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)"
      }
    ],
    "phone": "",
    "commune": "Xã Krông Bông"
  },
  {
    "facilityName": "Cơ sở nuôi Ngô Thị Trang",
    "registrationCode": "010-25/B-DLC",
    "lat": 12.53985,
    "id": "fac_13",
    "ownerName": "Ngô Thị Trang",
    "commune": "Xã Krông Bông",
    "phone": "",
    "speciesList": [
      {
        "purposeCode": "T",
        "vietnameseName": "Cầy vòi Hương",
        "id": "sp_13_1",
        "citesAppendix": "Phụ lục II CITES",
        "baseline": {
          "father": 6,
          "mother": 7,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2025-07-31",
          "otherMale": 7,
          "otherUnknown": 7,
          "note": "Hiện trạng nuôi đăng ký",
          "otherFemale": 10
        },
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "scientificName": "Paradoxurus hermaphroditus",
        "fluctuations": []
      }
    ],
    "note": "",
    "address": "Thôn 8, Xã Krông Bông, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "lng": 108.414746,
    "updatedAt": "2026-08-12T14:23:57.697Z",
    "registrationDate": "2025-07-31",
    "purposeCode": "T"
  },
  {
    "address": "TDP4, Xã Krông Bông, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "note": "",
    "phone": "",
    "speciesList": [
      {
        "vietnameseName": "Cầy vòi mốc",
        "purposeCode": "T",
        "id": "sp_14_1",
        "baseline": {
          "father": 5,
          "mother": 23,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-03-17",
          "otherMale": 0,
          "otherUnknown": 0,
          "note": "Hiện trạng nuôi đăng ký",
          "otherFemale": 0
        },
        "citesAppendix": "Phụ lục II CITES",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "scientificName": "Paguma larvata",
        "fluctuations": []
      },
      {
        "id": "sp_14_2",
        "purposeCode": "T",
        "vietnameseName": "Dúi má đào",
        "fluctuations": [],
        "scientificName": "Rhizomys sumatrensis",
        "group": "Động vật rừng (Nhóm IIB)",
        "baseline": {
          "date": "2026-01-01",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 34,
          "father": 9,
          "otherFemale": 0,
          "note": "Hiện trạng nuôi loài Dúi má đào",
          "otherUnknown": 0,
          "otherMale": 0
        },
        "citesAppendix": "Phụ lục II CITES"
      }
    ],
    "commune": "Xã Krông Bông",
    "updatedAt": "2026-08-12T14:23:57.697Z",
    "purposeCode": "T",
    "registrationDate": "2026-03-17",
    "lng": 108.333327,
    "lat": 12.492108,
    "registrationCode": "18-26/B-DLC",
    "facilityName": "Cơ sở nuôi Hà Huy Thanh",
    "id": "fac_14",
    "ownerName": "Hà Huy Thanh"
  },
  {
    "registrationCode": "Đang cập nhật",
    "lat": 12.477054,
    "facilityName": "Cơ sở nuôi Trần Văn Tới",
    "ownerName": "Trần Văn Tới",
    "id": "fac_15",
    "address": "Thôn 1, xã Yang Mao, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "note": "",
    "commune": "xã Yang Mao",
    "speciesList": [
      {
        "purposeCode": "T",
        "vietnameseName": "Dúi mốc lớn",
        "id": "sp_15_1",
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "otherFemale": 45,
          "note": "Số lượng Dúi mốc lớn hiện có",
          "otherUnknown": 47,
          "otherMale": 28,
          "date": "2026-01-01",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 9,
          "father": 9
        },
        "fluctuations": [],
        "scientificName": "Rhizomys pruinosus",
        "group": "Động vật rừng thông thường"
      }
    ],
    "phone": "",
    "registrationDate": "",
    "purposeCode": "T",
    "updatedAt": "2026-08-12T14:23:57.697Z",
    "lng": 108.58051
  },
  {
    "phone": "",
    "speciesList": [
      {
        "id": "sp_16_1",
        "vietnameseName": "Dúi mốc lớn",
        "purposeCode": "T",
        "group": "Động vật rừng thông thường",
        "fluctuations": [],
        "scientificName": "Rhizomys pruinosus",
        "baseline": {
          "otherUnknown": 0,
          "otherMale": 4,
          "otherFemale": 6,
          "note": "Số lượng Dúi mốc lớn hiện có",
          "mother": 2,
          "father": 2,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-01-01"
        },
        "citesAppendix": "Khai báo kiểm lâm"
      }
    ],
    "commune": "xã Yang Mao",
    "note": "",
    "address": "Thôn Cư Drăm, xã Yang Mao, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "lng": 108.551582,
    "updatedAt": "2026-08-12T14:23:57.697Z",
    "purposeCode": "T",
    "registrationDate": "",
    "facilityName": "Cơ sở nuôi Lê Đình Tâm",
    "lat": 12.487572,
    "registrationCode": "Đang cập nhật",
    "id": "fac_16",
    "ownerName": "Lê Đình Tâm"
  },
  {
    "commune": "xã Yang Mao",
    "speciesList": [
      {
        "vietnameseName": "Dúi mốc lớn",
        "purposeCode": "T",
        "id": "sp_17_1",
        "baseline": {
          "father": 2,
          "mother": 10,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-01-01",
          "otherMale": 0,
          "otherUnknown": 0,
          "note": "Số lượng Dúi mốc lớn hiện có",
          "otherFemale": 0
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Rhizomys pruinosus",
        "fluctuations": [],
        "group": "Động vật rừng thông thường"
      }
    ],
    "phone": "",
    "note": "",
    "address": "Buôn Tul, xã Yang Mao, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "lng": 108.560116,
    "updatedAt": "2026-08-12T14:23:57.698Z",
    "purposeCode": "T",
    "registrationDate": "",
    "facilityName": "Cơ sở nuôi Nguyễn Kim Danh",
    "registrationCode": "Đang cập nhật",
    "lat": 12.462085,
    "id": "fac_17",
    "ownerName": "Nguyễn Kim Danh"
  },
  {
    "speciesList": [
      {
        "fluctuations": [
          {
            "incOtherMale": 0,
            "decOtherUnknown": 0,
            "isPurchaseMode": false,
            "decMother": 0,
            "id": "fluc_1786163683953",
            "decOtherFemale": 0,
            "createdAt": 1786163683953,
            "purpose": "T",
            "verifier": "",
            "incOtherFemale": 0,
            "incFather": 0,
            "incOtherUnknown": 5,
            "date": "2026-07-20",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decFather": 0,
            "incMother": 0,
            "decOtherMale": 0,
            "time": "11:34"
          }
        ],
        "scientificName": "Paradoxurus hermaphroditus",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "citesAppendix": "Phụ lục II CITES",
        "baseline": {
          "date": "2026-07-24",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 3,
          "father": 1,
          "otherFemale": 0,
          "note": "Hiện trạng đăng ký ban đầu",
          "otherUnknown": 0,
          "otherMale": 0
        },
        "id": "sp_1786163645775_1",
        "purposeCode": "T",
        "vietnameseName": "Cầy vòi Hương"
      }
    ],
    "phone": "0866100652",
    "commune": "xã Cư Pui",
    "address": "thôn 3, xã Cư Pui, tỉnh Đắk Lắk.",
    "note": "",
    "lng": 108.455555,
    "updatedAt": "2026-08-12T14:23:57.698Z",
    "purposeCode": "T",
    "registrationDate": "2026-07-24",
    "facilityName": "Nguyễn Lĩnh",
    "lat": 12.547587,
    "registrationCode": "141-26/B-DLC",
    "id": "fac_1786163645775",
    "ownerName": "Nguyễn Lĩnh"
  },
  {
    "id": "fac_1786163777938",
    "ownerName": " Nguyễn Hoàng Dũng",
    "facilityName": " Nguyễn Hoàng Dũng",
    "lat": 12.558497,
    "registrationCode": "142-26/B-DLC",
    "lng": 108.321909,
    "updatedAt": "2026-08-12T14:23:57.698Z",
    "registrationDate": "2026-07-24",
    "purposeCode": "T",
    "phone": "0342017979",
    "speciesList": [
      {
        "id": "sp_1786163777938_1",
        "purposeCode": "T",
        "vietnameseName": "Cầy vòi Hương",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "fluctuations": [],
        "scientificName": "Paradoxurus hermaphroditus",
        "citesAppendix": "Phụ lục II CITES",
        "baseline": {
          "father": 2,
          "mother": 4,
          "date": "2026-07-24",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 0,
          "otherUnknown": 0,
          "note": "Hiện trạng đăng ký ban đầu",
          "otherFemale": 0
        }
      },
      {
        "fluctuations": [],
        "scientificName": "Paguma larvata",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "citesAppendix": "Phụ lục II CITES",
        "baseline": {
          "father": "4",
          "mother": "13",
          "date": "2026-07-10",
          "verifier": "",
          "otherMale": 0,
          "otherUnknown": 0,
          "note": "Số lượng vật nuôi hiện có ban đầu",
          "otherFemale": 0
        },
        "id": "species_1786163827161",
        "vietnameseName": "Cầy vòi mốc",
        "purposeCode": "T"
      }
    ],
    "commune": "xã Hòa Sơn",
    "note": "",
    "address": "thôn 6, xã Dang Kang, tỉnh Đắk Lắk"
  },
  {
    "lng": 108.321947,
    "updatedAt": "2026-08-12T14:23:57.698Z",
    "purposeCode": "T",
    "registrationDate": "2026-01-24",
    "phone": "0342017979",
    "speciesList": [
      {
        "vietnameseName": "Cầy vòi Hương",
        "purposeCode": "T",
        "id": "sp_1786419630740_1",
        "citesAppendix": "Phụ lục II CITES",
        "baseline": {
          "father": 2,
          "mother": 40,
          "date": "2026-07-24",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 0,
          "otherUnknown": 0,
          "note": "Hiện trạng đăng ký ban đầu",
          "otherFemale": 0
        },
        "scientificName": "Paradoxurus hermaphroditus",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "fluctuations": [
          {
            "createdAt": 1786419778624,
            "decOtherFemale": 0,
            "id": "fluc_1786419778624",
            "decMother": 0,
            "isPurchaseMode": true,
            "decOtherUnknown": 0,
            "incOtherMale": 0,
            "decOtherMale": 0,
            "time": "10:42",
            "incMother": 0,
            "decFather": 0,
            "reason": "Mua từ cơ sở nuôi sinh sản khác",
            "incOtherUnknown": 0,
            "date": "2026-08-11",
            "incFather": 0,
            "incOtherFemale": 5,
            "purpose": "T",
            "verifier": ""
          }
        ]
      },
      {
        "id": "species_1786419708326",
        "purposeCode": "T",
        "vietnameseName": "Cầy vòi mốc",
        "fluctuations": [],
        "scientificName": "Paguma larvata",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "citesAppendix": "Phụ lục II CITES",
        "baseline": {
          "note": "Số lượng vật nuôi hiện có ban đầu",
          "otherFemale": 0,
          "otherMale": 0,
          "otherUnknown": 0,
          "date": "2026-07-24",
          "verifier": "",
          "father": "4",
          "mother": "13"
        }
      }
    ],
    "commune": "Xã Dang Kang",
    "address": " thôn 6, xã Dang Kang, tỉnh Đắk Lắk",
    "note": "",
    "id": "fac_1786419630740",
    "ownerName": "Nguyễn Hoàng Dũng",
    "facilityName": "Nguyễn Hoàng Dũng",
    "lat": 12.558599,
    "registrationCode": "142-26/B-DLC"
  },
  {
    "lat": 12.520837,
    "registrationCode": "Chưa có mã số",
    "facilityName": "Phạm Duy Thắng",
    "id": "fac_1786432202893",
    "ownerName": "Phạm Duy Thắng",
    "address": "Thôn 23",
    "note": "",
    "speciesList": [
      {
        "id": "sp_1786432202893_1",
        "purposeCode": "T",
        "vietnameseName": "Dúi mốc lớn",
        "group": "Động vật rừng thông thường",
        "fluctuations": [
          {
            "incOtherUnknown": 6,
            "date": "2026-07-08",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "incMother": 0,
            "decOtherMale": 0,
            "time": "00:02",
            "decFather": 0,
            "incOtherFemale": 0,
            "purpose": "T",
            "verifier": "",
            "incFather": 0,
            "id": "fluc_1786468153021",
            "createdAt": 1786467765630,
            "decOtherFemale": 0,
            "incOtherMale": 0,
            "isPurchaseMode": false,
            "decOtherUnknown": 0,
            "decMother": 0
          },
          {
            "decMother": 0,
            "decOtherUnknown": 0,
            "isPurchaseMode": false,
            "incOtherMale": 0,
            "decOtherFemale": 0,
            "createdAt": 1786505722932,
            "id": "fluc_1786518690491",
            "incFather": 0,
            "verifier": "",
            "purpose": "T",
            "incOtherFemale": 0,
            "decFather": 0,
            "time": "10:34",
            "incMother": 0,
            "decOtherMale": 0,
            "reason": "sinh san F2",
            "date": "2026-08-12",
            "incOtherUnknown": 4
          },
          {
            "date": "2026-08-12",
            "incOtherUnknown": 4,
            "reason": "sinh san F2",
            "decFather": 0,
            "decOtherMale": 0,
            "incMother": 0,
            "time": "10:34",
            "purpose": "T",
            "verifier": "",
            "incOtherFemale": 0,
            "incFather": 0,
            "id": "fluc_1786518706173",
            "decOtherFemale": 0,
            "createdAt": 1786505722932,
            "incOtherMale": 0,
            "decOtherUnknown": 0,
            "isPurchaseMode": false,
            "decMother": 0
          }
        ],
        "scientificName": "Rhizomys pruinosus",
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-06-17",
          "mother": 4,
          "father": 2,
          "otherFemale": 0,
          "note": "Hiện trạng đăng ký ban đầu",
          "otherUnknown": 0,
          "otherMale": 0
        }
      }
    ],
    "phone": "",
    "commune": "Xã Krông Bông",
    "updatedAt": "2026-08-12T14:23:57.698Z",
    "registrationDate": "2026-08-11",
    "purposeCode": "T",
    "lng": 108.394137
  },
  {
    "id": "fac_1786504114807",
    "ownerName": "Nguyễn Kim Tuấn",
    "facilityName": "Nguyễn Kim Tuấn",
    "registrationCode": "Chưa có mã số",
    "lat": "12.575576",
    "lng": "108.338165",
    "updatedAt": "2026-08-12T14:23:57.698Z",
    "registrationDate": "2025-11-12",
    "purposeCode": "T",
    "commune": "Xã Dang Kang",
    "speciesList": [
      {
        "id": "sp_1786504114807_1",
        "purposeCode": "T",
        "vietnameseName": "Dúi mốc lớn",
        "scientificName": "Rhizomys pruinosus",
        "group": "Động vật rừng thông thường",
        "fluctuations": [
          {
            "purpose": "T",
            "verifier": "",
            "incOtherFemale": 53,
            "incFather": 0,
            "incOtherUnknown": 32,
            "date": "2026-08-12",
            "reason": "Sinh sản lứa F2 mới nở/sinh",
            "decFather": 0,
            "incMother": 0,
            "decOtherMale": 0,
            "time": "10:09",
            "incOtherMale": 38,
            "decOtherUnknown": 0,
            "isPurchaseMode": false,
            "decMother": 0,
            "id": "fluc_1786504203858",
            "decOtherFemale": 0,
            "createdAt": 1786504203858
          }
        ],
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "date": "2025-11-12",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 30,
          "father": 10,
          "otherFemale": 0,
          "note": "Hiện trạng đăng ký ban đầu",
          "otherUnknown": 0,
          "otherMale": 0
        }
      }
    ],
    "phone": "",
    "note": "",
    "address": "Thôn 6 xã Dang Kang"
  },
  {
    "lng": 108.423608,
    "registrationDate": "",
    "purposeCode": "T",
    "updatedAt": "2026-08-12T14:23:57.698Z",
    "phone": "",
    "speciesList": [
      {
        "scientificName": "Rhizomys sumatrensis",
        "group": "Động vật rừng (Nhóm IIB)",
        "fluctuations": [],
        "baseline": {
          "father": 3,
          "mother": 4,
          "date": "2026-01-01",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherMale": 10,
          "otherUnknown": 0,
          "note": "Số lượng Dúi má đào hiện có",
          "otherFemale": 12
        },
        "citesAppendix": "Phụ lục II CITES",
        "id": "sp_18_1",
        "purposeCode": "T",
        "vietnameseName": "Dúi má đào"
      },
      {
        "scientificName": "Rhizomys pruinosus",
        "group": "Động vật rừng thông thường",
        "fluctuations": [],
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "otherFemale": 15,
          "note": "Số lượng Dúi mốc lớn hiện có",
          "otherUnknown": 58,
          "otherMale": 17,
          "date": "2026-01-01",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 61,
          "father": 19
        },
        "id": "sp_18_2",
        "vietnameseName": "Dúi mốc lớn",
        "purposeCode": "T"
      }
    ],
    "commune": "Xã Krông Bông",
    "address": "Thôn 29, Xã Krông Bông, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "note": "",
    "ownerName": "Lê Quang Mạnh",
    "id": "fac_18",
    "facilityName": "Cơ sở nuôi Lê Quang Mạnh",
    "lat": 12.526903,
    "registrationCode": "Đang cập nhật"
  },
  {
    "lng": 108.328497,
    "updatedAt": "2026-08-12T14:23:57.698Z",
    "purposeCode": "T",
    "registrationDate": "",
    "phone": "",
    "speciesList": [
      {
        "purposeCode": "T",
        "vietnameseName": "Dúi mốc lớn",
        "id": "sp_19_1",
        "baseline": {
          "otherFemale": 0,
          "note": "Số lượng Dúi mốc lớn hiện có",
          "otherUnknown": 0,
          "otherMale": 0,
          "date": "2026-01-01",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 15,
          "father": 10
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "scientificName": "Rhizomys pruinosus",
        "fluctuations": [],
        "group": "Động vật rừng thông thường"
      }
    ],
    "commune": "Xã Krông Bông",
    "note": "",
    "address": "Thôn 9, Xã Krông Bông, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "id": "fac_19",
    "ownerName": "Nguyễn Trương Đắc Nam",
    "facilityName": "Cơ sở nuôi Nguyễn Trương Đắc Nam",
    "lat": 12.528051,
    "registrationCode": "Đang cập nhật"
  },
  {
    "purposeCode": "T",
    "registrationDate": "2023-04-17",
    "updatedAt": "2026-08-12T14:23:57.698Z",
    "lng": 108.297682,
    "note": "",
    "address": "Thôn Quảng Đông, xã Hòa Sơn, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "phone": "",
    "speciesList": [
      {
        "id": "sp_2_1",
        "purposeCode": "T",
        "vietnameseName": "Cầy vòi Hương",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "scientificName": "Paradoxurus hermaphroditus",
        "fluctuations": [],
        "baseline": {
          "otherFemale": 7,
          "note": "Số lượng vật nuôi đăng ký",
          "otherUnknown": 3,
          "otherMale": 6,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2023-04-17",
          "mother": 3,
          "father": 2
        },
        "citesAppendix": "Phụ lục II CITES"
      }
    ],
    "commune": "xã Hòa Sơn",
    "ownerName": "Nguyễn Văn Thúy",
    "id": "fac_2",
    "lat": 12.491634,
    "registrationCode": "IIB-C-DLC-028",
    "facilityName": "Cơ sở nuôi Nguyễn Văn Thúy"
  },
  {
    "lng": 108.315384,
    "purposeCode": "T",
    "registrationDate": "",
    "updatedAt": "2026-08-12T14:23:57.698Z",
    "phone": "",
    "speciesList": [
      {
        "id": "sp_20_1",
        "vietnameseName": "Dúi má đào",
        "purposeCode": "T",
        "group": "Động vật rừng (Nhóm IIB)",
        "fluctuations": [],
        "scientificName": "Rhizomys sumatrensis",
        "citesAppendix": "Phụ lục II CITES",
        "baseline": {
          "otherFemale": 8,
          "note": "Số lượng Dúi má đào hiện có",
          "otherUnknown": 11,
          "otherMale": 6,
          "date": "2026-01-01",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 26,
          "father": 4
        }
      }
    ],
    "commune": "Xã Dang Kang",
    "note": "",
    "address": "Buôn Cư Ênun A, Xã Dang Kang, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "ownerName": "Trần Văn Lực",
    "id": "fac_20",
    "facilityName": "Cơ sở nuôi Trần Văn Lực",
    "lat": 12.58438,
    "registrationCode": "Đang cập nhật"
  },
  {
    "commune": "Xã Dang Kang",
    "phone": "",
    "speciesList": [
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "otherMale": 0,
          "otherUnknown": 0,
          "note": "Số lượng Dúi mốc lớn hiện có",
          "otherFemale": 0,
          "father": 10,
          "mother": 10,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-01-01"
        },
        "scientificName": "Rhizomys pruinosus",
        "fluctuations": [],
        "group": "Động vật rừng thông thường",
        "vietnameseName": "Dúi mốc lớn",
        "purposeCode": "T",
        "id": "sp_21_1"
      }
    ],
    "note": "",
    "address": "Thôn 3, Xã Dang Kang, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "lng": 108.339096,
    "purposeCode": "T",
    "registrationDate": "",
    "updatedAt": "2026-08-12T14:23:57.698Z",
    "facilityName": "Cơ sở nuôi Đinh Tiến Toàn",
    "registrationCode": "Đang cập nhật",
    "lat": 12.619158,
    "ownerName": "Đinh Tiến Toàn",
    "id": "fac_21"
  },
  {
    "updatedAt": "2026-08-12T14:23:57.698Z",
    "purposeCode": "T",
    "registrationDate": "",
    "id": "fac_22",
    "ownerName": "Nguyễn Thanh",
    "registrationCode": "Đang cập nhật",
    "address": "Thôn 2, xã Hòa Sơn, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "note": "",
    "facilityName": "Cơ sở nuôi Nguyễn Thanh",
    "commune": "xã Hòa Sơn",
    "phone": "",
    "speciesList": [
      {
        "purposeCode": "T",
        "vietnameseName": "Chim Cu gáy",
        "id": "sp_22_1",
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "otherFemale": 0,
          "note": "Số lượng Chim Cu gáy nuôi",
          "otherUnknown": 0,
          "otherMale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-01-01",
          "mother": 1,
          "father": 1
        },
        "fluctuations": [],
        "scientificName": "Streptopelia Chinensis",
        "group": "Động vật rừng thông thường (Chim)"
      }
    ]
  },
  {
    "speciesList": [
      {
        "purposeCode": "O",
        "vietnameseName": "Chim Chào mào",
        "id": "sp_23_1",
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "otherMale": 0,
          "otherUnknown": 0,
          "note": "Số lượng Chim Chào mào nuôi cảnh",
          "otherFemale": 0,
          "father": 3,
          "mother": 0,
          "date": "2026-01-01",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông"
        },
        "scientificName": "Pycnonotus Jocosus",
        "fluctuations": [],
        "group": "Động vật rừng thông thường (Chim)"
      }
    ],
    "phone": "",
    "facilityName": "Cơ sở nuôi Huỳnh Phúc Lợi",
    "commune": "xã Hòa Sơn",
    "address": "Thôn 2, xã Hòa Sơn, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "note": "Làm cảnh",
    "registrationCode": "Đang cập nhật",
    "ownerName": "Huỳnh Phúc Lợi",
    "id": "fac_23",
    "purposeCode": "O",
    "registrationDate": "",
    "updatedAt": "2026-08-12T14:23:57.699Z"
  },
  {
    "updatedAt": "2026-08-12T14:23:57.699Z",
    "purposeCode": "T",
    "registrationDate": "",
    "id": "fac_24",
    "ownerName": "Phan Thanh Trúc",
    "registrationCode": "Đang cập nhật",
    "note": "",
    "address": "Thôn 4, xã Hòa Sơn, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "facilityName": "Cơ sở nuôi Phan Thanh Trúc",
    "commune": "xã Hòa Sơn",
    "speciesList": [
      {
        "id": "sp_24_1",
        "vietnameseName": "Chim Chào mào",
        "purposeCode": "T",
        "fluctuations": [],
        "group": "Động vật rừng thông thường (Chim)",
        "scientificName": "Pycnonotus Jocosus",
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "otherUnknown": 0,
          "otherMale": 0,
          "otherFemale": 0,
          "note": "Số lượng Chim Chào mào nuôi",
          "mother": 5,
          "father": 5,
          "date": "2026-01-01",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông"
        }
      }
    ],
    "phone": ""
  },
  {
    "registrationDate": "",
    "purposeCode": "T",
    "updatedAt": "2026-08-12T14:23:57.699Z",
    "lng": 108.333624,
    "address": "Thôn 4, Xã Krông Bông, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "note": "",
    "commune": "Xã Krông Bông",
    "phone": "",
    "speciesList": [
      {
        "vietnameseName": "Chim Chào mào",
        "purposeCode": "T",
        "id": "sp_25_1",
        "baseline": {
          "note": "Số lượng Chim Chào mào nuôi",
          "otherFemale": 0,
          "otherMale": 0,
          "otherUnknown": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-01-01",
          "father": 5,
          "mother": 5
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "fluctuations": [],
        "scientificName": "Pycnonotus Jocosus",
        "group": "Động vật rừng thông thường (Chim)"
      }
    ],
    "ownerName": "Thái Hồng Sơn",
    "id": "fac_25",
    "registrationCode": "Đang cập nhật",
    "lat": 12.502961,
    "facilityName": "Cơ sở nuôi Thái Hồng Sơn"
  },
  {
    "ownerName": "Nguyễn Trí",
    "id": "fac_26",
    "registrationCode": "Đang cập nhật",
    "lat": 12.523945,
    "facilityName": "Cơ sở nuôi Nguyễn Trí",
    "registrationDate": "",
    "purposeCode": "T",
    "updatedAt": "2026-08-12T14:23:57.699Z",
    "lng": 108.336714,
    "note": "",
    "address": "Thôn 7, Xã Krông Bông, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "commune": "Xã Krông Bông",
    "phone": "",
    "speciesList": [
      {
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "otherUnknown": 0,
          "otherMale": 1,
          "otherFemale": 1,
          "note": "Số lượng Chim Cu gáy nuôi",
          "mother": 11,
          "father": 11,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-01-01"
        },
        "fluctuations": [],
        "scientificName": "Streptopelia Chinensis",
        "group": "Động vật rừng thông thường (Chim)",
        "vietnameseName": "Chim Cu gáy",
        "purposeCode": "T",
        "id": "sp_26_1"
      }
    ]
  },
  {
    "registrationCode": "Đang cập nhật",
    "address": "Thôn 2, Xã Krông Bông, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "note": "",
    "commune": "Xã Krông Bông",
    "facilityName": "Cơ sở nuôi Nguyễn Văn Hòa",
    "speciesList": [
      {
        "group": "Động vật rừng thông thường (Chim)",
        "scientificName": "Pycnonotus Jocosus",
        "fluctuations": [],
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-01-01",
          "mother": 2,
          "father": 2,
          "otherFemale": 0,
          "note": "Số lượng Chim Chào mào nuôi",
          "otherUnknown": 0,
          "otherMale": 0
        },
        "id": "sp_27_1",
        "vietnameseName": "Chim Chào mào",
        "purposeCode": "T"
      }
    ],
    "phone": "",
    "updatedAt": "2026-08-12T14:23:57.699Z",
    "registrationDate": "",
    "purposeCode": "T",
    "id": "fac_27",
    "ownerName": "Nguyễn Văn Hòa"
  },
  {
    "lng": 108.401029,
    "updatedAt": "2026-08-12T14:23:57.699Z",
    "registrationDate": "",
    "purposeCode": "T",
    "speciesList": [
      {
        "vietnameseName": "Chim Chào mào",
        "purposeCode": "T",
        "id": "sp_28_1",
        "citesAppendix": "Khai báo kiểm lâm",
        "baseline": {
          "mother": 1,
          "father": 1,
          "date": "2026-01-01",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherUnknown": 0,
          "otherMale": 0,
          "otherFemale": 0,
          "note": "Số lượng Chim Chào mào nuôi"
        },
        "scientificName": "Pycnonotus Jocosus",
        "fluctuations": [],
        "group": "Động vật rừng thông thường (Chim)"
      }
    ],
    "phone": "",
    "commune": "Xã Krông Bông",
    "address": "Thôn 26, Xã Krông Bông, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "note": "",
    "id": "fac_28",
    "ownerName": "Trần Văn Hà",
    "facilityName": "Cơ sở nuôi Trần Văn Hà",
    "lat": 12.547061,
    "registrationCode": "Đang cập nhật"
  },
  {
    "updatedAt": "2026-08-12T14:23:57.699Z",
    "purposeCode": "T",
    "registrationDate": "",
    "id": "fac_29",
    "ownerName": "Trần Ngọc Long",
    "commune": "Xã Krông Bông",
    "facilityName": "Cơ sở nuôi Trần Ngọc Long",
    "speciesList": [
      {
        "vietnameseName": "Chim Cu gáy",
        "purposeCode": "T",
        "id": "sp_29_1",
        "baseline": {
          "date": "2026-01-01",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "father": 2,
          "mother": 2,
          "note": "Số lượng Chim Cu gáy nuôi",
          "otherFemale": 0,
          "otherMale": 0,
          "otherUnknown": 0
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "fluctuations": [],
        "scientificName": "Streptopelia Chinensis",
        "group": "Động vật rừng thông thường (Chim)"
      }
    ],
    "phone": "",
    "registrationCode": "Đang cập nhật",
    "note": "",
    "address": "Thôn 2, Xã Krông Bông, Huyện Krông Bông, Tỉnh Đắk Lắk"
  },
  {
    "lng": 108.1885,
    "registrationDate": "2025-10-03",
    "purposeCode": "T",
    "updatedAt": "2026-08-12T14:23:57.699Z",
    "commune": "xã Hòa Sơn",
    "speciesList": [
      {
        "purposeCode": "T",
        "vietnameseName": "Cầy vòi Hương",
        "id": "sp_3_1",
        "citesAppendix": "Phụ lục II CITES",
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2025-10-03",
          "father": 0,
          "mother": 0,
          "note": "Cơ sở hiện nghỉ nuôi",
          "otherFemale": 0,
          "otherMale": 0,
          "otherUnknown": 0
        },
        "fluctuations": [],
        "scientificName": "Paradoxurus hermaphroditus",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)"
      }
    ],
    "phone": "",
    "address": "Thôn 4, xã Hòa Sơn, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "note": "Nghỉ nuôi",
    "ownerName": "Trịnh Viết Long",
    "id": "fac_3",
    "facilityName": "Cơ sở nuôi Trịnh Viết Long",
    "registrationCode": "028-25/B-DLC",
    "lat": 12.506699
  },
  {
    "lng": 108.3365,
    "purposeCode": "T",
    "registrationDate": "",
    "updatedAt": "2026-08-12T14:23:57.699Z",
    "commune": "Xã Dang Kang",
    "speciesList": [
      {
        "purposeCode": "T",
        "vietnameseName": "Chim Chào mào",
        "id": "sp_30_1",
        "baseline": {
          "mother": 2,
          "father": 2,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-01-01",
          "otherUnknown": 3,
          "otherMale": 3,
          "otherFemale": 2,
          "note": "Số lượng Chim Chào mào nuôi"
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "group": "Động vật rừng thông thường (Chim)",
        "fluctuations": [],
        "scientificName": "Pycnonotus Jocosus"
      }
    ],
    "phone": "",
    "address": "Thôn 6, Xã Dang Kang, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "note": "",
    "ownerName": "Hoàng Văn Hải",
    "id": "fac_30",
    "facilityName": "Cơ sở nuôi Hoàng Văn Hải",
    "registrationCode": "Đang cập nhật",
    "lat": 12.574027
  },
  {
    "ownerName": "Võ Văn Nhơn",
    "id": "fac_31",
    "lat": 12.562678,
    "registrationCode": "Đang cập nhật",
    "facilityName": "Cơ sở nuôi Võ Văn Nhơn",
    "purposeCode": "O",
    "registrationDate": "",
    "updatedAt": "2026-08-12T14:23:57.699Z",
    "lng": 108.33214,
    "note": "Làm cảnh",
    "address": "Thôn 7, Xã Dang Kang, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "speciesList": [
      {
        "scientificName": "Pycnonotus Jocosus",
        "fluctuations": [],
        "group": "Động vật rừng thông thường (Chim)",
        "baseline": {
          "otherMale": 0,
          "otherUnknown": 0,
          "note": "Số lượng Chim Chào mào nuôi cảnh",
          "otherFemale": 0,
          "father": 1,
          "mother": 1,
          "date": "2026-01-01",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông"
        },
        "citesAppendix": "Khai báo kiểm lâm",
        "id": "sp_31_1",
        "vietnameseName": "Chim Chào mào",
        "purposeCode": "O"
      }
    ],
    "phone": "",
    "commune": "Xã Dang Kang"
  },
  {
    "note": "Chưa có mã số",
    "address": "Thôn 3, xã Hòa Sơn, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "commune": "xã Hòa Sơn",
    "phone": "",
    "speciesList": [
      {
        "purposeCode": "T",
        "vietnameseName": "Cầy vòi Hương",
        "id": "sp_4_1",
        "citesAppendix": "Phụ lục II CITES",
        "baseline": {
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-01-01",
          "father": 4,
          "mother": 11,
          "note": "Chưa được cấp mã số cơ sở",
          "otherFemale": 0,
          "otherMale": 0,
          "otherUnknown": 0
        },
        "fluctuations": [],
        "scientificName": "Paradoxurus hermaphroditus",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)"
      }
    ],
    "updatedAt": "2026-08-12T14:23:57.699Z",
    "registrationDate": "",
    "purposeCode": "T",
    "lng": 108.29803,
    "registrationCode": "Chưa có mã số",
    "lat": 12.492824,
    "facilityName": "Cơ sở nuôi Phạm Bá Quang",
    "id": "fac_4",
    "ownerName": "Phạm Bá Quang"
  },
  {
    "address": "Thôn 1, xã Hòa Sơn, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "note": "Nghỉ nuôi",
    "registrationCode": "IIB-DLC-021",
    "speciesList": [
      {
        "vietnameseName": "Cầy vòi Hương",
        "purposeCode": "T",
        "id": "sp_5_1",
        "citesAppendix": "Phụ lục II CITES",
        "baseline": {
          "father": 0,
          "mother": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2022-04-22",
          "otherMale": 0,
          "otherUnknown": 0,
          "note": "Cơ sở nghỉ nuôi",
          "otherFemale": 0
        },
        "scientificName": "Paradoxurus hermaphroditus",
        "fluctuations": [],
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)"
      }
    ],
    "phone": "",
    "facilityName": "Cơ sở nuôi Phan Thanh Hùng",
    "commune": "xã Hòa Sơn",
    "ownerName": "Phan Thanh Hùng",
    "id": "fac_5",
    "purposeCode": "T",
    "registrationDate": "2022-04-22",
    "updatedAt": "2026-08-12T14:23:57.699Z"
  },
  {
    "updatedAt": "2026-08-12T14:23:57.699Z",
    "registrationDate": "",
    "purposeCode": "T",
    "id": "fac_6",
    "ownerName": "Lê Nguyễn Nhật Tân",
    "facilityName": "Cơ sở nuôi Lê Nguyễn Nhật Tân",
    "commune": "xã Hòa Sơn",
    "speciesList": [
      {
        "id": "sp_6_1",
        "vietnameseName": "Cầy vòi Hương",
        "purposeCode": "T",
        "scientificName": "Paradoxurus hermaphroditus",
        "fluctuations": [],
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "baseline": {
          "otherFemale": 0,
          "note": "Cơ sở nghỉ nuôi",
          "otherUnknown": 0,
          "otherMale": 0,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-01-01",
          "mother": 0,
          "father": 0
        },
        "citesAppendix": "Phụ lục II CITES"
      }
    ],
    "phone": "",
    "registrationCode": "IIB-DLC-025",
    "note": "Nghỉ nuôi",
    "address": "Thôn 6, xã Hòa Sơn, Huyện Krông Bông, Tỉnh Đắk Lắk"
  },
  {
    "address": "Buôn Tơ Rang, xã Yang Mao, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "note": "",
    "commune": "xã Yang Mao",
    "speciesList": [
      {
        "citesAppendix": "Phụ lục II CITES",
        "baseline": {
          "mother": 5,
          "father": 3,
          "date": "2024-07-03",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "otherUnknown": 19,
          "otherMale": 12,
          "otherFemale": 14,
          "note": "Số lượng Cầy vòi Hương hiện có"
        },
        "scientificName": "Paradoxurus hermaphroditus",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "fluctuations": [],
        "vietnameseName": "Cầy vòi Hương",
        "purposeCode": "T",
        "id": "sp_7_1"
      },
      {
        "id": "sp_7_2",
        "purposeCode": "T",
        "vietnameseName": "Cầy vòi mốc",
        "scientificName": "Paguma larvata",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)",
        "fluctuations": [],
        "baseline": {
          "otherUnknown": 0,
          "otherMale": 0,
          "otherFemale": 0,
          "note": "Số lượng Cầy vòi mốc hiện có",
          "mother": 3,
          "father": 2,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2024-07-03"
        },
        "citesAppendix": "Phụ lục II CITES"
      },
      {
        "fluctuations": [],
        "scientificName": "Atherurus macrourus",
        "group": "Động vật rừng (Nhóm IIB)",
        "baseline": {
          "father": 1,
          "mother": 1,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-01-01",
          "otherMale": 0,
          "otherUnknown": 0,
          "note": "Hiện trạng nuôi loài Don",
          "otherFemale": 0
        },
        "citesAppendix": "Phụ lục II CITES",
        "id": "sp_7_3",
        "vietnameseName": "Don",
        "purposeCode": "T"
      },
      {
        "id": "sp_7_4",
        "vietnameseName": "Nhím",
        "purposeCode": "T",
        "scientificName": "Hystrix brachyura",
        "fluctuations": [],
        "group": "Động vật rừng thông thường",
        "baseline": {
          "otherMale": 21,
          "otherUnknown": 11,
          "note": "Hiện trạng nuôi loài Nhím",
          "otherFemale": 31,
          "father": 6,
          "mother": 12,
          "date": "2026-01-01",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông"
        },
        "citesAppendix": "Khai báo kiểm lâm"
      }
    ],
    "phone": "",
    "updatedAt": "2026-08-12T14:23:57.699Z",
    "registrationDate": "2024-07-03",
    "purposeCode": "T",
    "lng": 108.562016,
    "registrationCode": "IIB-C-DLC-055",
    "lat": 12.472545,
    "facilityName": "Cơ sở nuôi Nguyễn Tấn Danh Nhân",
    "id": "fac_7",
    "ownerName": "Nguyễn Tấn Danh Nhân"
  },
  {
    "ownerName": "Huỳnh Công Nam",
    "id": "fac_8",
    "facilityName": "Cơ sở nuôi Huỳnh Công Nam",
    "registrationCode": "53-26/B-DLC",
    "lat": 12.483552,
    "lng": 108.562716,
    "registrationDate": "2026-05-05",
    "purposeCode": "T",
    "updatedAt": "2026-08-12T14:23:57.700Z",
    "commune": "xã Yang Mao",
    "speciesList": [
      {
        "vietnameseName": "Cầy vòi Hương",
        "purposeCode": "T",
        "id": "sp_8_1",
        "citesAppendix": "Phụ lục II CITES",
        "baseline": {
          "date": "2026-05-05",
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "mother": 5,
          "father": 1,
          "otherFemale": 0,
          "note": "Hiện trạng nuôi ban đầu",
          "otherUnknown": 4,
          "otherMale": 0
        },
        "fluctuations": [],
        "scientificName": "Paradoxurus hermaphroditus",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)"
      }
    ],
    "phone": "",
    "note": "",
    "address": "Buôn chàm A, xã Yang Mao, Huyện Krông Bông, Tỉnh Đắk Lắk"
  },
  {
    "note": "",
    "address": "Thôn Ea Luêh, xã Yang Mao, Huyện Krông Bông, Tỉnh Đắk Lắk",
    "commune": "xã Yang Mao",
    "phone": "",
    "speciesList": [
      {
        "purposeCode": "T",
        "vietnameseName": "Cầy vòi Hương",
        "id": "sp_9_1",
        "citesAppendix": "Phụ lục II CITES",
        "baseline": {
          "father": 5,
          "mother": 8,
          "verifier": "Hạt Kiểm lâm Huyện Krông Bông",
          "date": "2026-03-03",
          "otherMale": 0,
          "otherUnknown": 0,
          "note": "Hiện trạng nuôi ban đầu",
          "otherFemale": 0
        },
        "fluctuations": [],
        "scientificName": "Paradoxurus hermaphroditus",
        "group": "Động vật rừng nguy cấp, quý, hiếm (Nhóm IIB)"
      }
    ],
    "updatedAt": "2026-08-12T14:23:57.700Z",
    "registrationDate": "2026-03-03",
    "purposeCode": "T",
    "lng": 108.655302,
    "registrationCode": "14-26/B-DLC",
    "lat": 12.503389,
    "facilityName": "Cơ sở nuôi Trần Duy Quân",
    "id": "fac_9",
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
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return resetToDemoData();
    }
    const parsed = JSON.parse(raw);

    // Load saved facilities list from localStorage if present, otherwise fallback to REAL_FACILITIES_DATA
    const facilitiesList =
      parsed.facilitiesList && Array.isArray(parsed.facilitiesList) && parsed.facilitiesList.length > 0
        ? parsed.facilitiesList
        : REAL_FACILITIES_DATA;

    const activeFacilityId = parsed.activeFacilityId || facilitiesList[0]?.id || null;
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
