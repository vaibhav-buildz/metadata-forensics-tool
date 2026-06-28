import { useEffect } from 'react';
import { IconMapPin } from '@tabler/icons-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet + Vite/Webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconRetinaUrl: iconRetina,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapDisplay({ location }) {
  if (!location) return null;

  return (
    <div className="bg-[#FFFFFF] rounded-xl p-6 shadow-sm border border-slate-200 border-l-4 border-l-[#16A34A] hover:shadow-md hover:-translate-y-[2px] transition-all duration-300 ease-out">
      
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="p-2 bg-emerald-50 text-[#16A34A] rounded-lg">
          <IconMapPin size={24} stroke={1.5} />
        </div>
        <h2 className="text-[18px] font-semibold text-[#111827]">
          GPS Location
        </h2>
      </div>

      <div className="space-y-4">
        {location.has_gps ? (
          <>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-[#1F2937] font-bold mb-3 flex items-start gap-2 text-[16px]">
                <IconMapPin size={22} className="shrink-0 mt-0.5 text-[#16A34A]" />
                <span>{location.address || "Address lookup failed"}</span>
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[12px] font-mono text-[#4B5563] shadow-sm">
                  {location.coordinates}
                </span>
                <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[12px] font-mono text-[#4B5563] shadow-sm">
                  Lat: {location.latitude}
                </span>
                <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[12px] font-mono text-[#4B5563] shadow-sm">
                  Lng: {location.longitude}
                </span>
              </div>
            </div>
            
            <div className="relative mt-4 h-[300px] bg-[#F8FAFC] rounded-xl border border-slate-200 overflow-hidden shadow-sm z-0">
              <MapContainer 
                center={[location.latitude, location.longitude]} 
                zoom={14} 
                scrollWheelZoom={true} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[location.latitude, location.longitude]}>
                  <Popup>
                    Photo taken here.
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-10 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
            <IconMapPin size={40} className="text-slate-300 mb-4" stroke={1} />
            <p className="text-[#4B5563] text-[15px] font-medium">No GPS data in image</p>
          </div>
        )}
      </div>
    </div>
  );
}
