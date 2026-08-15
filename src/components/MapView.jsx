import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { computeLogbookTable } from '../utils/calculations';
import {
  MapPin,
  Navigation,
  Search,
  Filter,
  Layers,
  Building2,
  ExternalLink,
  BookOpen,
  Compass,
  Sparkles,
  Maximize2,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Edit3,
  Check,
  X,
  Crosshair,
  Save,
  Radio,
} from 'lucide-react';

// Tile layer definitions for Google Maps
const TILE_LAYERS = {
  HYBRID: {
    name: '🛰️ Google Hybrid (Vệ Tinh + Đường)',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  },
  SATELLITE: {
    name: '🌍 Google Satellite (Vệ Tinh)',
    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  },
  STREETS: {
    name: '🗺️ Google Streets (Bản Đồ Đường)',
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  },
  TERRAIN: {
    name: '⛰️ Google Terrain (Địa Hình)',
    url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  },
};

// Default coordinates for Krông Bông District communes if facility doesn't specify custom ones
const COMMUNE_COORDS = {
  'xã Hòa Sơn': { lat: 12.482, lng: 108.315 },
  'xã Yang Mao': { lat: 12.395, lng: 108.41 },
  'xã Cư Pui': { lat: 12.42, lng: 108.38 },
  'Xã Krông Bông': { lat: 12.455, lng: 108.32 },
  'Xã Dang Kang': { lat: 12.51, lng: 108.28 },
};

export function getFacilityLatLng(facility, index = 0) {
  if (facility.lat && facility.lng) {
    return { lat: Number(facility.lat), lng: Number(facility.lng) };
  }

  // Fallback offset coordinates based on commune to ensure pins don't overlap completely
  const base = COMMUNE_COORDS[facility.commune] || { lat: 12.455, lng: 108.33 };
  const offsetLat = ((index % 5) - 2) * 0.0045 + (Math.sin(index) * 0.002);
  const offsetLng = (Math.floor(index / 5) - 1.5) * 0.0055 + (Math.cos(index) * 0.002);

  return {
    lat: Number((base.lat + offsetLat).toFixed(6)),
    lng: Number((base.lng + offsetLng).toFixed(6)),
  };
}

export default function MapView({
  facilitiesList = [],
  activeFacilityId,
  onSelectFacility,
  targetFacilityId,
  onUpdateFacilityCoords,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersRef = useRef({});

  const [activeTileKey, setActiveTileKey] = useState('HYBRID');
  const [selectedCommune, setSelectedCommune] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL'); // ALL | MAMMAL | BIRD
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [currentZoomLevel, setCurrentZoomLevel] = useState(13);

  // Smart Mobile Sub-Tab State ('MAP' | 'LIST')
  const [mobileTab, setMobileTab] = useState('MAP');

  // Edit Location Mode State
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [tempCoords, setTempCoords] = useState(null); // { lat, lng }

  // Manual Coordinates Modal State
  const [isCoordModalOpen, setIsCoordModalOpen] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

  // Calculate totals & species category for each facility
  const processedFacilities = facilitiesList.map((fac, idx) => {
    const coords = getFacilityLatLng(fac, idx);
    let totalAnimals = 0;
    let hasBird = false;
    let hasMammal = false;

    fac.speciesList.forEach((sp) => {
      const processedRows = computeLogbookTable(sp.baseline || {}, sp.fluctuations || []);
      const lastRow = processedRows[processedRows.length - 1];
      const spTotal = lastRow ? (lastRow.total || 0) : 0;
      totalAnimals += spTotal;

      const nameLower = (sp.vietnameseName || '').toLowerCase();
      if (nameLower.includes('chim') || nameLower.includes('cu gáy') || nameLower.includes('chào mào')) {
        hasBird = true;
      } else {
        hasMammal = true;
      }
    });

    let catType = 'MAMMAL';
    if (hasBird && hasMammal) catType = 'MIXED';
    else if (hasBird) catType = 'BIRD';

    return {
      ...fac,
      coords,
      totalAnimals,
      catType,
    };
  });

  // Filter facilities list
  const filteredFacilities = processedFacilities.filter((fac) => {
    if (selectedCommune !== 'ALL' && fac.commune !== selectedCommune) return false;
    if (selectedCategory === 'MAMMAL' && fac.catType === 'BIRD') return false;
    if (selectedCategory === 'BIRD' && fac.catType === 'MAMMAL') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchOwner = fac.ownerName.toLowerCase().includes(q);
      const matchCode = (fac.registrationCode || '').toLowerCase().includes(q);
      const matchAddress = fac.address.toLowerCase().includes(q);
      const matchSpecies = fac.speciesList.some((s) => s.vietnameseName.toLowerCase().includes(q));
      return matchOwner || matchCode || matchAddress || matchSpecies;
    }

    return true;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center on Krông Bông district, Đắk Lắk
      const map = L.map(mapContainerRef.current, {
        center: [12.455, 108.34],
        zoom: 13,
        zoomControl: false,
      });

      map.on('zoomend', () => {
        setCurrentZoomLevel(map.getZoom());
      });

      const tileConfig = TILE_LAYERS[activeTileKey];
      const layer = L.tileLayer(tileConfig.url, {
        maxZoom: tileConfig.maxZoom,
        subdomains: tileConfig.subdomains,
        attribution: '&copy; Google Maps GIS Hybrid',
      }).addTo(map);

      tileLayerRef.current = layer;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Tile Layer Change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const tileConfig = TILE_LAYERS[activeTileKey];

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const newLayer = L.tileLayer(tileConfig.url, {
      maxZoom: tileConfig.maxZoom,
      subdomains: tileConfig.subdomains,
      attribution: '&copy; Google Maps GIS Hybrid',
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
  }, [activeTileKey]);

  // Handle Map Click in Edit Mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleMapClick = (e) => {
      if (isEditMode && editingFacility) {
        const newLat = Number(e.latlng.lat.toFixed(6));
        const newLng = Number(e.latlng.lng.toFixed(6));
        setTempCoords({ lat: newLat, lng: newLng });

        // Move marker
        const marker = markersRef.current[editingFacility.id];
        if (marker) {
          marker.setLatLng([newLat, newLng]);
        }
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [isEditMode, editingFacility]);

  // Update Map Markers on Filter / Data Changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    Object.values(markersRef.current).forEach((m) => map.removeLayer(m));
    markersRef.current = {};

    filteredFacilities.forEach((fac) => {
      const isBeingEdited = isEditMode && editingFacility?.id === fac.id;
      const { lat, lng } = isBeingEdited && tempCoords ? tempCoords : fac.coords;

      // Color badge based on facility category
      let iconColorClass = 'bg-emerald-600 border-white text-white shadow-emerald-500/50';
      let iconEmoji = '🦔';

      if (fac.catType === 'BIRD') {
        iconColorClass = 'bg-amber-500 border-white text-white shadow-amber-500/50';
        iconEmoji = '🦜';
      } else if (fac.catType === 'MIXED') {
        iconColorClass = 'bg-indigo-600 border-white text-white shadow-indigo-500/50';
        iconEmoji = '🐾';
      }

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="relative group cursor-pointer ${isBeingEdited ? 'animate-bounce' : ''}">
            <div class="w-10 h-10 rounded-full ${
              isBeingEdited ? 'bg-rose-600 ring-4 ring-rose-400 border-white' : iconColorClass
            } border-2 shadow-2xl flex items-center justify-center text-sm font-extrabold transition-all duration-300 group-hover:scale-125">
              ${isBeingEdited ? '📍' : iconEmoji}
            </div>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 ${
              isBeingEdited ? 'bg-rose-700' : 'bg-slate-900'
            } text-white font-mono text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border border-white shadow-md whitespace-nowrap">
              ${isBeingEdited ? 'Vị trí mới' : fac.totalAnimals}
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([lat, lng], {
        icon: customIcon,
        draggable: isBeingEdited,
      }).addTo(map);

      if (isBeingEdited) {
        marker.on('dragend', (event) => {
          const position = event.target.getLatLng();
          setTempCoords({
            lat: Number(position.lat.toFixed(6)),
            lng: Number(position.lng.toFixed(6)),
          });
        });
      }

      // Popup Content
      const speciesBadgesHTML = fac.speciesList
        .map(
          (s) =>
            `<span class="inline-block bg-slate-100 border border-slate-300 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md mr-1 mb-1">
              ${s.vietnameseName} (${s.citesAppendix || 'Thông thường'})
            </span>`
        )
        .join('');

      const popupHTML = `
        <div class="p-3 min-w-[275px] max-w-[320px] font-sans">
          <div class="flex items-center justify-between gap-2 border-b border-slate-200 pb-2 mb-2">
            <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              📍 ${fac.commune}
            </span>
            <span class="font-mono text-xs font-bold text-indigo-700">
              ${fac.registrationCode || 'Chưa mã số'}
            </span>
          </div>

          <h4 class="font-extrabold text-slate-900 text-sm mb-0.5">${fac.ownerName}</h4>
          <p class="text-xs text-slate-600 mb-1.5 font-medium">📍 ${fac.address}</p>
          <p class="text-[11px] font-mono text-slate-500 mb-2">GPS: <strong>${lat}, ${lng}</strong></p>

          <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-2 mb-2 flex items-center justify-between">
            <span class="text-xs font-bold text-emerald-900">Tổng quy mô đàn:</span>
            <span class="font-mono text-base font-black text-emerald-700">${fac.totalAnimals} cá thể</span>
          </div>

          <div class="mb-3">
            <p class="text-[11px] font-bold text-slate-700 mb-1">Các loài đang nuôi:</p>
            <div>${speciesBadgesHTML}</div>
          </div>

          <div class="space-y-1.5 pt-2 border-t border-slate-200">
            <div class="grid grid-cols-2 gap-1.5">
              <button
                id="btn-zoom-${fac.id}"
                class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] py-1.5 px-2 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs"
              >
                🔍 Zoom (18x)
              </button>
              <button
                id="btn-edit-location-${fac.id}"
                class="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] py-1.5 px-2 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs"
              >
                ✏️ Vị trí mới
              </button>
            </div>

            <button
              id="btn-logbook-${fac.id}"
              class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] py-1.5 px-2 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs"
            >
              📖 Mở Sổ Theo Dõi Mẫu II
            </button>

            {/* Smart Navigation App Launcher Buttons */}
            <div class="grid grid-cols-2 gap-1 pt-0.5">
              <button
                id="btn-google-nav-${fac.id}"
                class="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-[10px] py-1.5 px-1 rounded-lg transition-colors text-center flex items-center justify-center gap-1"
              >
                🗺️ Google Maps
              </button>
              <button
                id="btn-apple-nav-${fac.id}"
                class="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-[10px] py-1.5 px-1 rounded-lg transition-colors text-center flex items-center justify-center gap-1"
              >
                🍏 Apple (iPhone)
              </button>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHTML, { maxWidth: 340, className: 'leaflet-popup-custom' });

      marker.on('click', () => {
        setSelectedFacility(fac);

        // Bind dynamic button events inside popup
        setTimeout(() => {
          const btnLogbook = document.getElementById(`btn-logbook-${fac.id}`);
          if (btnLogbook) btnLogbook.onclick = () => onSelectFacility(fac.id);

          const btnZoom = document.getElementById(`btn-zoom-${fac.id}`);
          if (btnZoom) btnZoom.onclick = () => zoomToFacility(fac, 18);

          const btnEditLoc = document.getElementById(`btn-edit-location-${fac.id}`);
          if (btnEditLoc) btnEditLoc.onclick = () => startEditMode(fac);

          const btnGNav = document.getElementById(`btn-google-nav-${fac.id}`);
          if (btnGNav) {
            btnGNav.onclick = () =>
              window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
          }

          const btnANav = document.getElementById(`btn-apple-nav-${fac.id}`);
          if (btnANav) {
            btnANav.onclick = () =>
              window.open(`https://maps.apple.com/?daddr=${lat},${lng}&q=${encodeURIComponent(fac.ownerName)}`, '_blank');
          }
        }, 100);
      });

      markersRef.current[fac.id] = marker;
    });

    // Auto fit bounds if markers exist and not editing
    if (filteredFacilities.length > 0 && !isEditMode && !selectedFacility) {
      const group = L.featureGroup(Object.values(markersRef.current));
      map.fitBounds(group.getBounds().pad(0.15));
    }
  }, [filteredFacilities, activeTileKey, isEditMode, editingFacility, tempCoords]);

  // Zoom to facility with specified zoom level
  const zoomToFacility = (fac, zoomLevel = 18) => {
    setMobileTab('MAP'); // Automatically switch to Map view on smart mobile!
    setSelectedFacility(fac);
    const map = mapInstanceRef.current;
    if (!map) return;

    const { lat, lng } = fac.coords;
    map.flyTo([lat, lng], zoomLevel, { duration: 1.5 });

    const marker = markersRef.current[fac.id];
    if (marker) {
      marker.openPopup();
    }
  };

  // Start Edit Mode for a facility
  const startEditMode = (fac) => {
    setEditingFacility(fac);
    setTempCoords(fac.coords);
    setIsEditMode(true);
    zoomToFacility(fac, 18);
  };

  // Save new coordinates
  const handleSaveNewCoords = () => {
    if (!editingFacility || !tempCoords) return;
    if (onUpdateFacilityCoords) {
      onUpdateFacilityCoords(editingFacility.id, tempCoords.lat, tempCoords.lng);
    }
    alert(`Đã cập nhật vị trí mới thành công cho ${editingFacility.ownerName}: (${tempCoords.lat}, ${tempCoords.lng})`);
    setIsEditMode(false);
    setEditingFacility(null);
    setTempCoords(null);
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingFacility(null);
    setTempCoords(null);
  };

  // Save manual Lat/Lng modal
  const handleSaveManualCoords = (e) => {
    e.preventDefault();
    const lat = Number(manualLat);
    const lng = Number(manualLng);

    if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
      alert('Vui lòng nhập định dạng Latitude & Longitude hợp lệ (ví dụ: 12.48325, 108.31842)');
      return;
    }

    if (editingFacility && onUpdateFacilityCoords) {
      onUpdateFacilityCoords(editingFacility.id, lat, lng);
      alert(`Đã cập nhật tọa độ GPS mới cho ${editingFacility.ownerName}!`);
      setIsCoordModalOpen(false);
      setIsEditMode(false);
      setEditingFacility(null);
    }
  };

  useEffect(() => {
    if (targetFacilityId && mapInstanceRef.current) {
      const fac = processedFacilities.find((f) => f.id === targetFacilityId);
      if (fac) {
        zoomToFacility(fac, 18);
      }
    }
  }, [targetFacilityId]);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[600px] gap-2 sm:gap-4">
      {/* Smart Mobile Sub-Tab Switcher (Visible only on < lg screens) */}
      <div className="flex lg:hidden items-center justify-center p-1 bg-slate-200/90 rounded-2xl gap-1 font-bold text-xs shadow-inner">
        <button
          onClick={() => setMobileTab('MAP')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'MAP' ? 'bg-emerald-600 text-white shadow-md font-extrabold' : 'text-slate-700 hover:bg-white/60'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>🗺️ Bản Đồ Vệ Tinh</span>
        </button>
        <button
          onClick={() => setMobileTab('LIST')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'LIST' ? 'bg-emerald-600 text-white shadow-md font-extrabold' : 'text-slate-700 hover:bg-white/60'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>📋 Danh Sách ({filteredFacilities.length} CS)</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        {/* Sidebar Controls & Facility Directory */}
        <div
          className={`lg:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col overflow-hidden flex-shrink-0 ${
            mobileTab === 'LIST' ? 'flex flex-1' : 'hidden lg:flex'
          }`}
        >
          {/* Header */}
          <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 sm:p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Bản Đồ Định Vị GIS</h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Google Hybrid Satellite Navigation</p>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                {filteredFacilities.length}/{facilitiesList.length} CS
              </span>
            </div>

            {/* Search Box */}
            <div className="relative mb-2.5">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm chủ cơ sở, mã số, địa chỉ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 sm:py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-500 shadow-xs"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 sm:mb-1">
                  Lọc Theo Xã
                </label>
                <select
                  value={selectedCommune}
                  onChange={(e) => setSelectedCommune(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 font-bold focus:outline-none focus:border-emerald-500 shadow-xs cursor-pointer"
                >
                  <option value="ALL">📍 Tất cả 5 xã</option>
                  <option value="xã Hòa Sơn">xã Hòa Sơn</option>
                  <option value="xã Yang Mao">xã Yang Mao</option>
                  <option value="xã Cư Pui">xã Cư Pui</option>
                  <option value="Xã Krông Bông">Xã Krông Bông</option>
                  <option value="Xã Dang Kang">Xã Dang Kang</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5 sm:mb-1">
                  Phân Loại Loài
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 font-bold focus:outline-none focus:border-emerald-500 shadow-xs cursor-pointer"
                >
                  <option value="ALL">🐾 Tất cả loài</option>
                  <option value="MAMMAL">🦔 Lớp Thú</option>
                  <option value="BIRD">🦜 Nhóm Chim</option>
                </select>
              </div>
            </div>
          </div>

          {/* Directory Facility List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 scrollbar-thin">
            {filteredFacilities.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold">Không tìm thấy cơ sở nuôi phù hợp</p>
              </div>
            ) : (
              filteredFacilities.map((fac) => {
                const isSelected = selectedFacility?.id === fac.id;
                const isCurrentActiveLogbook = activeFacilityId === fac.id;

                return (
                  <div
                    key={fac.id}
                    onClick={() => zoomToFacility(fac, 18)}
                    className={`p-2.5 sm:p-3 rounded-xl cursor-pointer transition-all mb-1 border ${
                      isSelected
                        ? 'bg-emerald-50/90 border-emerald-400 shadow-sm'
                        : isCurrentActiveLogbook
                        ? 'bg-slate-50 border-indigo-300'
                        : 'hover:bg-slate-50/80 border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                            {fac.ownerName}
                          </span>
                          {fac.catType === 'BIRD' ? (
                            <span className="text-[9px] sm:text-[10px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.2 rounded border border-amber-200">
                              🦜 Chim
                            </span>
                          ) : (
                            <span className="text-[9px] sm:text-[10px] bg-teal-100 text-teal-900 font-extrabold px-1.5 py-0.2 rounded border border-teal-200">
                              🦔 Thú
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-500 truncate font-medium">📍 {fac.address}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] sm:text-[11px]">
                          <span className="font-mono text-indigo-700 font-bold">
                            {fac.registrationCode || 'Chưa mã số'}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="font-mono font-black text-emerald-700">
                            {fac.totalAnimals} cá thể
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            zoomToFacility(fac, 18);
                          }}
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-transform active:scale-95 shadow-sm flex items-center justify-center"
                          title="Phóng to cận cảnh vị trí cơ sở trên bản đồ (Zoom 18x)"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditMode(fac);
                          }}
                          className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-transform active:scale-95 shadow-sm flex items-center justify-center"
                          title="Chỉnh sửa cập nhật vị trí tọa độ cơ sở"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Main Google Hybrid Leaflet Map Display */}
        <div
          className={`flex-1 bg-slate-900 border border-slate-200 rounded-2xl shadow-xl overflow-hidden relative flex flex-col ${
            mobileTab === 'MAP' ? 'flex flex-1' : 'hidden lg:flex'
          }`}
        >
        {/* Top Control Bar: Tile Layer Switcher & Zoom Presets */}
        <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Tile Layer Switcher */}
          <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl rounded-2xl p-1.5 flex flex-wrap items-center gap-1 pointer-events-auto">
            {Object.keys(TILE_LAYERS).map((key) => {
              const isSelected = activeTileKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTileKey(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {TILE_LAYERS[key].name}
                </button>
              );
            })}
          </div>

          {/* Explicit Zoom Controls & Presets */}
          <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl rounded-2xl p-1.5 flex items-center gap-1 pointer-events-auto">
            <span className="text-xs font-mono font-bold text-slate-700 px-2 border-r border-slate-200">
              🔍 Zoom: {currentZoomLevel}x
            </span>

            <button
              onClick={() => {
                if (selectedFacility) zoomToFacility(selectedFacility, 18);
                else if (mapInstanceRef.current) mapInstanceRef.current.setZoom(18);
              }}
              className="px-2.5 py-1 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors"
              title="Zoom cận cảnh trại nuôi (18x)"
            >
              Cận cảnh (18x)
            </button>

            <button
              onClick={() => mapInstanceRef.current && mapInstanceRef.current.setZoom(14)}
              className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              title="Zoom mức Toàn Xã (14x)"
            >
              Toàn Xã (14x)
            </button>

            <button
              onClick={() => mapInstanceRef.current && mapInstanceRef.current.setZoom(12)}
              className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              title="Zoom mức Toàn Huyện (12x)"
            >
              Toàn Huyện (12x)
            </button>

            <div className="flex items-center gap-0.5 ml-1 border-l border-slate-200 pl-1">
              <button
                onClick={() => mapInstanceRef.current && mapInstanceRef.current.zoomIn()}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold"
                title="Phóng to (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => mapInstanceRef.current && mapInstanceRef.current.zoomOut()}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold"
                title="Thu nhỏ (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Location Editing Active Banner */}
        {isEditMode && editingFacility && (
          <div className="absolute top-20 left-4 right-4 z-[400] bg-rose-900/95 backdrop-blur-md text-white border-2 border-rose-400 shadow-2xl rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500 text-white rounded-xl animate-pulse">
                <Crosshair className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                  CHẾ ĐỘ CẬP NHẬT VỊ TRÍ CHO: <span className="text-amber-300 uppercase">{editingFacility.ownerName}</span>
                </h4>
                <p className="text-xs text-rose-100">
                  👉 <strong>Kéo thả ghim đỏ</strong> hoặc <strong>Nhấp trực tiếp lên bản đồ vệ tinh Google</strong> để chọn vị trí mới!
                </p>
                {tempCoords && (
                  <p className="text-xs font-mono font-bold text-amber-200 mt-0.5">
                    Tọa độ mới chọn: Lat = {tempCoords.lat}, Lng = {tempCoords.lng}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setManualLat(tempCoords ? String(tempCoords.lat) : String(editingFacility.coords.lat));
                  setManualLng(tempCoords ? String(tempCoords.lng) : String(editingFacility.coords.lng));
                  setIsCoordModalOpen(true);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-slate-600 shadow-sm flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Nhập tay số liệu GPS</span>
              </button>

              <button
                onClick={handleCancelEdit}
                className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                <span>Hủy</span>
              </button>

              <button
                onClick={handleSaveNewCoords}
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs transition-all shadow-lg flex items-center gap-1.5 scale-105"
              >
                <Save className="w-4 h-4" />
                <span>Lưu vị trí mới</span>
              </button>
            </div>
          </div>
        )}

        {/* Leaflet Map DOM Element */}
        <div ref={mapContainerRef} className="w-full h-full z-10 min-h-[500px]" />
      </div>
    </div>

      {/* Manual Coordinates Input Modal */}
      {isCoordModalOpen && editingFacility && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Cập Nhật Tọa Độ GPS Thủ Công</h3>
                  <p className="text-xs text-slate-500 font-medium">{editingFacility.ownerName} - {editingFacility.commune}</p>
                </div>
              </div>
              <button
                onClick={() => setIsCoordModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManualCoords} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Latitude (Vĩ độ)</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 12.48325"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Longitude (Kinh độ)</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 108.31842"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          setManualLat(pos.coords.latitude.toFixed(6));
                          setManualLng(pos.coords.longitude.toFixed(6));
                        },
                        (err) => alert('Lỗi lấy GPS: ' + err.message)
                      );
                    }
                  }}
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  📡 Lấy GPS vị trí thiết bị hiện tại
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsCoordModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
                >
                  Lưu Tọa Độ GPS Mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
