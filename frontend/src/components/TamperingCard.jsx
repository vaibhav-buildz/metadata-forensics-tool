import { IconShieldCheck, IconShieldX, IconAlertTriangle } from '@tabler/icons-react';

export default function TamperingCard({ tampering }) {
  if (!tampering) return null;

  const isTampered = tampering.is_tampered;
  
  // Clean SaaS color themes based on score
  const getThemeColor = () => {
    if (tampering.tampering_score <= 20) return { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700', icon: 'text-[#16A34A]', bar: 'bg-[#16A34A]' };
    if (tampering.tampering_score <= 50) return { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', icon: 'text-amber-500', bar: 'bg-amber-500' };
    return { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-700', icon: 'text-[#DC2626]', bar: 'bg-[#DC2626]' };
  };

  const theme = getThemeColor();

  return (
    <div className={`bg-[#FFFFFF] rounded-xl p-6 shadow-sm border border-slate-200 border-l-4 ${isTampered ? 'border-l-[#DC2626]' : 'border-l-[#16A34A]'} hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out`}>
      
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className={`p-2 rounded-lg ${isTampered ? 'bg-red-50 text-[#DC2626]' : 'bg-emerald-50 text-[#16A34A]'}`}>
          {isTampered ? <IconShieldX size={24} stroke={1.5} /> : <IconShieldCheck size={24} stroke={1.5} />}
        </div>
        <h2 className="text-[20px] font-semibold text-[#111827]">
          Forensics Analysis
        </h2>
      </div>

      <div className="space-y-6">
        
        {/* Verdict Badge */}
        <div className={`p-5 rounded-xl border ${theme.bg} ${theme.border} flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 bg-white rounded-full shadow-sm ${theme.icon}`}>
              {isTampered ? <IconShieldX size={32} stroke={1.5} /> : <IconShieldCheck size={32} stroke={1.5} />}
            </div>
            <div>
              <p className={`font-bold text-lg ${theme.text}`}>{tampering.verdict}</p>
              <p className="text-[13px] text-[#4B5563] font-medium mt-0.5">Confidence Level: {tampering.confidence}</p>
            </div>
          </div>
          <div className="sm:text-right bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-100 w-fit">
            <p className={`text-2xl font-bold ${theme.text}`}>{tampering.tampering_score}</p>
            <p className="text-[11px] uppercase tracking-wider font-bold text-[#6B7280]">Score</p>
          </div>
        </div>

        {/* Score Progress Bar */}
        <div>
          <div className="flex justify-between text-[12px] font-bold text-[#9CA3AF] mb-2 px-1">
            <span>0</span>
            <span>20</span>
            <span>50</span>
            <span>100</span>
          </div>
          <div className="w-full h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden relative shadow-inner">
            <div className={`absolute top-0 left-0 h-full ${theme.bar} transition-all duration-1000 ease-out`} style={{ width: `${Math.max(tampering.tampering_score, 2)}%` }}></div>
            {/* Markers */}
            <div className="absolute top-0 left-[20%] w-px h-full bg-white/70"></div>
            <div className="absolute top-0 left-[50%] w-px h-full bg-white/70"></div>
          </div>
        </div>

        {/* Reasons List */}
        {tampering.reasons && tampering.reasons.length > 0 && (
          <div>
            <h3 className="font-semibold text-[#4B5563] text-[13px] uppercase tracking-wider mb-3 mt-8">
              Analysis Details
            </h3>
            <ul className="space-y-2.5">
              {tampering.reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-3 text-[14px] text-[#1F2937] bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <IconAlertTriangle size={18} className={`shrink-0 mt-0.5 ${isTampered ? 'text-amber-500' : 'text-slate-400'}`} stroke={2} />
                  <span className="font-medium leading-snug">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
