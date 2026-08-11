import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Check, X, Crosshair } from 'lucide-react';

export default function LocationPickerModal({
  isOpen,
  onClose,
  onConfirm,
  initialLat,
  initialLng,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  
  const [currentLat, setCurrentLat] = useState(initialLat || 12.455);
  const [currentLng, setCurrentLng] = useState(initialLng || 108.34);

  useEffect(() => {
    if (!isOpen) return;
    
    // Slight delay to ensure modal DOM is fully rendered before L.map attaches
    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;
      if (!mapInstanceRef.current) {
        const initialCenter = [currentLat, currentLng];

        const map = L.map(mapContainerRef.current, {
          center: initialCenter,
          zoom: 15,
          zoomControl: true,
        });

        // Use Google Satellite Hybrid
        L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          attribution: '&copy; Google Maps GIS',
        }).addTo(map);

        // Add draggable marker
        const marker = L.marker(initialCenter, { draggable: true }).addTo(map);
        
        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          setCurrentLat(pos.lat);
          setCurrentLng(pos.lng);
        });

        // Click on map to move marker
        map.on('click', (e) => {
          marker.setLatLng(e.latlng);
          setCurrentLat(e.latlng.lat);
          setCurrentLng(e.latlng.lng);
        });

        markerRef.current = marker;
        mapInstanceRef.current = map;
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Chọn Tọa Độ Trên Bản Đồ Vệ Tinh</h2>
              <p className="text-xs text-slate-500 font-medium">Kéo thả điểm ghim hoặc bấm vào bản đồ để chọn vị trí cơ sở.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <div ref={mapContainerRef} className="absolute inset-0 z-0" />
          
          {/* Target Overlay Crosshair */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[10]">
            <Crosshair className="w-8 h-8 text-white/50" />
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
            <div className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase">Vĩ độ (Lat)</span>
              <span>{Number(currentLat).toFixed(6)}</span>
            </div>
            <div className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase">Kinh độ (Lng)</span>
              <span>{Number(currentLng).toFixed(6)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-sm transition-colors"
            >
              Hủy Bỏ
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm(currentLat, currentLng);
                onClose();
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
            >
              <Check className="w-4 h-4" />
              Xác Nhận Tọa Độ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
