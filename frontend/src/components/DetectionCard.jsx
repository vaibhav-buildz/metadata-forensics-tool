import { IconScanEye, IconUser, IconBox, IconShieldCheck, IconAlertTriangle } from '@tabler/icons-react';

export default function DetectionCard({ detection }) {
  if (!detection) return null;

  return (
    <div className="bg-[#FFFFFF] rounded-xl p-6 shadow-sm border border-slate-200 border-l-4 border-l-[#4F46E5] hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out">
      
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="p-2 bg-indigo-50 text-[#4F46E5] rounded-lg">
          <IconScanEye size={24} stroke={1.5} />
        </div>
        <h2 className="text-[20px] font-semibold text-[#111827]">
          AI Detection
        </h2>
      </div>

      <div className="space-y-5 text-[14px]">
        
        {/* Privacy Alert */}
        <div className={`p-4 rounded-xl border flex items-start gap-3 shadow-sm ${detection.privacy_alert ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
          {detection.privacy_alert ? <IconAlertTriangle size={20} className="shrink-0 mt-0.5 text-amber-600" /> : <IconShieldCheck size={20} className="shrink-0 mt-0.5 text-[#16A34A]" />}
          <div>
            <p className="font-semibold text-[15px]">{detection.privacy_alert ? 'Privacy Warning' : 'Privacy Clear'}</p>
            <p className="opacity-80 mt-1">{detection.privacy_alert ? 'Faces or sensitive objects detected.' : 'No immediately obvious privacy concerns.'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
            <IconUser size={24} className="text-[#4F46E5] mb-2" stroke={1.5} />
            <p className="text-3xl font-bold text-[#111827]">{detection.faces ?? 0}</p>
            <p className="text-[#6B7280] font-medium text-[13px] uppercase tracking-wider mt-1">Faces Found</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
            <IconBox size={24} className="text-[#4F46E5] mb-2" stroke={1.5} />
            <p className="text-3xl font-bold text-[#111827]">{detection.objects?.length || 0}</p>
            <p className="text-[#6B7280] font-medium text-[13px] uppercase tracking-wider mt-1">Objects</p>
          </div>
        </div>

        {detection.objects && detection.objects.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="font-semibold text-[#4B5563] mb-3 text-[13px] uppercase tracking-wider">Detected Objects</p>
            <div className="flex flex-wrap gap-2">
              {detection.objects.map((obj, i) => (
                <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 shadow-sm rounded-lg text-xs font-medium text-[#1F2937]">
                  {obj}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
