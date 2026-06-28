import { useState } from 'react';
import Upload from '../components/Upload';
import { IconScan, IconShieldCheck, IconMapPin } from '@tabler/icons-react';

export default function Home({ onAnalysisComplete }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (file) => {
    setIsLoading(true);
    try {
      const { analyzeImage } = await import('../services/api');
      const results = await analyzeImage(file);
      if (results.status === 'error') {
        throw new Error(results.message || 'Unknown error occurred');
      }
      onAnalysisComplete(results);
    } catch (error) {
      alert('Error analyzing image: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden bg-[#F8FAFC]">
      
      {/* Premium subtle background accents */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-3xl pointer-events-none mix-blend-multiply opacity-70"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-3xl pointer-events-none mix-blend-multiply opacity-70"></div>

      <div className="max-w-2xl w-full relative z-10">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center p-3 bg-white text-blue-600 rounded-2xl mb-6 shadow-sm border border-slate-200">
            <IconShieldCheck size={32} stroke={1.5} />
          </div>
          <h1 className="text-[40px] leading-tight sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-[#111827]">
            Analyze images with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">precision</span>
          </h1>
          <p className="text-lg md:text-xl text-[#4B5563] font-normal max-w-xl mx-auto leading-relaxed">
            Extract comprehensive EXIF metadata, plot GPS locations, and perform advanced tampering detection instantly.
          </p>
        </div>
        
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
          <Upload onUpload={handleUpload} isLoading={isLoading} />
        </div>
        
        <div className="mt-12 flex justify-center gap-8 text-[#6B7280] text-sm font-medium animate-in fade-in duration-700 delay-300 fill-mode-both">
          <div className="flex items-center gap-2"><IconMapPin size={18} stroke={1.5} /> Location Data</div>
          <div className="flex items-center gap-2"><IconShieldCheck size={18} stroke={1.5} /> Forensics</div>
          <div className="flex items-center gap-2"><IconScan size={18} stroke={1.5} /> Hash Analysis</div>
        </div>
      </div>
    </div>
  );
}
