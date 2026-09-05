import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Store, Home, Radio } from 'lucide-react';

// Custom html icons with crisp SVG/HTML styling for Leaflet
const createCustomIcon = (type, label) => {
  let bg = 'bg-blue-600';
  let iconHtml = '📍';
  
  if (type === 'restaurant') {
    bg = 'bg-red-600';
    iconHtml = '🍕';
  } else if (type === 'customer') {
    bg = 'bg-emerald-600';
    iconHtml = '🏠';
  } else if (type === 'rider') {
    bg = 'bg-blue-600 animate-pulse';
    iconHtml = '🛵';
  }

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="w-10 h-10 ${bg} text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white text-lg">
          ${iconHtml}
        </div>
        ${label ? `<span class="absolute -bottom-6 whitespace-nowrap bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">${label}</span>` : ''}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
};

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MapView({ 
  restaurantCoords = { lat: 28.6139, lng: 77.2090 },
  customerCoords = { lat: 28.6324, lng: 77.2187 },
  riderCoords = null,
  ipData = null,
  mode = 'restaurant', // 'restaurant' or 'tracking'
  customerName = 'Customer',
  deliveryAddress = 'Delivery Address',
  paymentMethod = 'COD'
}) {
  const centerLat = riderCoords ? (restaurantCoords.lat + customerCoords.lat) / 2 : restaurantCoords.lat;
  const centerLng = riderCoords ? (restaurantCoords.lng + customerCoords.lng) / 2 : restaurantCoords.lng;

  const polylineRoute = riderCoords 
    ? [
        [restaurantCoords.lat, restaurantCoords.lng],
        [riderCoords.lat, riderCoords.lng],
        [customerCoords.lat, customerCoords.lng]
      ]
    : [
        [restaurantCoords.lat, restaurantCoords.lng],
        [customerCoords.lat, customerCoords.lng]
      ];

  return (
    <div className="relative w-full h-full min-h-[320px] rounded-2xl overflow-hidden shadow-inner border border-slate-200 bg-slate-50">
      <MapContainer 
        center={[centerLat, centerLng]} 
        zoom={mode === 'tracking' ? 14 : 15} 
        scrollWheelZoom={false}
        className="w-full h-full min-h-[320px] z-0"
      >
        <ChangeView center={[centerLat, centerLng]} zoom={mode === 'tracking' ? 14 : 15} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Restaurant Pin */}
        <Marker 
          position={[restaurantCoords.lat, restaurantCoords.lng]}
          icon={createCustomIcon('restaurant', "Domino's Pizza")}
        >
          <Popup>
            <div className="p-1 font-sans text-xs">
              <strong className="text-red-600 block text-sm">Domino's Pizza</strong>
              <span>Plot 14, Connaught Place, New Delhi</span>
              <div className="mt-1 text-[11px] text-slate-500 font-mono">Lat: {restaurantCoords.lat}, Lng: {restaurantCoords.lng}</div>
            </div>
          </Popup>
        </Marker>

        {/* Customer Location Pin */}
        {(mode === 'tracking' || customerCoords) && (
          <Marker 
            position={[customerCoords.lat, customerCoords.lng]}
            icon={createCustomIcon('customer', `${customerName} (Customer)`)}
          >
            <Popup>
              <div className="p-1 font-sans text-xs">
                <strong className="text-emerald-700 block text-sm">Customer: {customerName}</strong>
                <span>{deliveryAddress}</span>
                <div className="mt-1 font-bold text-slate-700">Payment: {paymentMethod}</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Live Rider Location Pin with IP Tracking info */}
        {riderCoords && (
          <Marker 
            position={[riderCoords.lat, riderCoords.lng]}
            icon={createCustomIcon('rider', 'Live Executive')}
          >
            <Popup>
              <div className="p-1 font-sans text-xs">
                <strong className="text-blue-600 block text-sm flex items-center gap-1">
                  <Radio className="w-3 h-3 text-blue-500 animate-spin" /> Live IP Tracking
                </strong>
                <div>Executive: Rahul Sharma</div>
                {ipData && (
                  <div className="mt-1 pt-1 border-t border-slate-200 text-[11px] text-slate-600 font-mono">
                    <div>IP: {ipData.ip}</div>
                    <div>ISP: {ipData.org}</div>
                    <div>City: {ipData.city}</div>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route line */}
        <Polyline 
          positions={polylineRoute} 
          pathOptions={{ color: '#2563eb', weight: 4, opacity: 0.8, dashArray: riderCoords ? '6, 8' : undefined }} 
        />
      </MapContainer>

      {/* Floating Lat/Lng overlay pill */}
      <div className="absolute top-3 right-3 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-slate-200 text-[11px] font-semibold text-slate-700 flex items-center gap-2">
        <MapPin className="w-3.5 h-3.5 text-blue-600" />
        <span>Lat: {restaurantCoords.lat} | Long: {restaurantCoords.lng}</span>
      </div>

      {ipData && (
        <div className="absolute bottom-3 left-3 z-[400] bg-slate-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md text-[10px] font-mono flex items-center gap-2">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>IP Tracking: {ipData.ip} ({ipData.city})</span>
        </div>
      )}
    </div>
  );
}
