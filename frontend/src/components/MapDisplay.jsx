import { IconMapPin, IconMap } from '@tabler/icons-react';

export default function MapDisplay({ location }) {
  if (!location) return null;

  return (
    <div className="bg-[#FFFFFF] rounded-xl p-6 shadow-sm border border-slate-200 border-l-4 border-l-[#16A34A] hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out">
      
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="p-2 bg-emerald-50 text-[#16A34A] rounded-lg">
          <IconMapPin size={24} stroke={1.5} />
        </div>
        <h2 className="text-[20px] font-semibold text-[#111827]">
          GPS Location
        </h2>
      </div>

      <div className="space-y-4">
        {location.has_gps ? (
          <>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-[#1F2937] font-medium mb-3 flex items-start gap-2 text-[15px]">
                <IconMapPin size={20} className="shrink-0 mt-0.5 text-[#16A34A]" />
                <span>{location.address || "Address lookup failed"}</span>
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-mono text-[#4B5563] shadow-sm">
                  {location.coordinates}
                </span>
                <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-mono text-[#4B5563] shadow-sm">
                  Lat: {location.latitude}
                </span>
                <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-mono text-[#4B5563] shadow-sm">
                  Lng: {location.longitude}
                </span>
              </div>
            </div>
            
            <div className="relative mt-4 h-48 bg-[#F8FAFC] rounded-xl flex flex-col items-center justify-center border border-slate-200 overflow-hidden group">
              {/* Subtle grid background pattern */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              <IconMap size={48} className="text-emerald-200 mb-2 group-hover:scale-110 transition-transform duration-500 ease-out" stroke={1} />
              <p className="text-[#4B5563] font-medium text-[14px] relative z-10 bg-white/90 px-4 py-1.5 rounded-full shadow-sm backdrop-blur-sm border border-slate-100">Interactive map view coming soon</p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-10 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
            <IconMapPin size={40} className="text-slate-300 mb-4" stroke={1} />
            <p className="text-[#4B5563] text-[15px] font-medium">No GPS coordinates embedded in this image</p>
          </div>
        )}
      </div>
    </div>
  );
}
