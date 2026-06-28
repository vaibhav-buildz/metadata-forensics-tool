import MetadataCard from '../components/MetadataCard';
import MapDisplay from '../components/MapDisplay';
import TamperingCard from '../components/TamperingCard';
import HashCard from '../components/HashCard';
import DetectionCard from '../components/DetectionCard';
import { IconArrowLeft } from '@tabler/icons-react';

export default function Analysis({ results, onBack }) {
  return (
    <div className="min-h-screen py-10 px-4 md:px-8 bg-[#F8FAFC]">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-[#1F2937] tracking-tight">
              Analysis Results
            </h1>
            <p className="text-[#6B7280] font-medium mt-1">
              {results?.metadata?.filename || "Unknown file"}
            </p>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#4B5563] font-semibold rounded-xl border border-slate-200 shadow-sm hover:shadow hover:border-blue-400 hover:text-blue-600 transition-all duration-200 w-fit group"
          >
            <IconArrowLeft size={18} stroke={2} className="group-hover:-translate-x-1 transition-transform" />
            New Analysis
          </button>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
            {results?.metadata && (
              <MetadataCard metadata={results.metadata} />
            )}
            
            {results?.hashes && (
              <HashCard hashes={results.hashes} />
            )}
            
            {results?.detection && (
              <DetectionCard detection={results.detection} />
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 space-y-6 flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
            {results?.tampering && (
              <TamperingCard tampering={results.tampering} />
            )}
            
            {results?.location && (
              <MapDisplay location={results.location} />
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
