import { IconListDetails, IconFileDescription, IconRulerMeasure, IconCamera } from '@tabler/icons-react';

export default function MetadataCard({ metadata }) {
  if (!metadata) return null;

  const getValue = (val, suffix = "") => {
    if (val === undefined || val === null || val === "Unknown" || val === "") return "N/A";
    return `${val}${suffix}`;
  };

  const formatDimensions = (w, h) => {
    if (!w || !h || w === "Unknown" || h === "Unknown") return "N/A";
    return `${w} × ${h} px`;
  };

  const formatFileSize = (size) => {
    if (!size || size === "Unknown") return "N/A";
    return `${size} MB`;
  };

  return (
    <div className="bg-[#FFFFFF] rounded-xl p-6 shadow-sm border border-slate-200 border-l-4 border-l-[#2563EB] hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out">
      
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="p-2 bg-blue-50 text-[#2563EB] rounded-lg">
          <IconListDetails size={24} stroke={1.5} />
        </div>
        <h2 className="text-[20px] font-semibold text-[#111827]">
          Comprehensive Metadata
        </h2>
      </div>

      <div className="space-y-6 text-[15px] text-[#1F2937]">
        
        {/* File Info Section */}
        <div>
          <h3 className="font-medium text-[#4B5563] text-[13px] uppercase tracking-wider mb-3 flex items-center gap-2">
            <IconFileDescription size={16} className="text-[#2563EB]" />
            File Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="flex flex-col"><strong className="text-[#111827] text-[13px] font-medium mb-1">Filename</strong> <span className="break-all">{getValue(metadata.filename)}</span></p>
            <p className="flex flex-col"><strong className="text-[#111827] text-[13px] font-medium mb-1">Size</strong> <span>{formatFileSize(metadata.filesize)}</span></p>
            <p className="flex flex-col"><strong className="text-[#111827] text-[13px] font-medium mb-1">Format</strong> <span>{getValue(metadata.format)}</span></p>
          </div>
        </div>

        {/* Image Info Section */}
        <div>
          <h3 className="font-medium text-[#4B5563] text-[13px] uppercase tracking-wider mb-3 flex items-center gap-2">
            <IconRulerMeasure size={16} className="text-[#2563EB]" />
            Image Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="flex flex-col"><strong className="text-[#111827] text-[13px] font-medium mb-1">Dimensions</strong> <span>{formatDimensions(metadata.width, metadata.height)}</span></p>
            <p className="flex flex-col"><strong className="text-[#111827] text-[13px] font-medium mb-1">Orientation</strong> <span>{getValue(metadata.orientation)}</span></p>
            <p className="flex flex-col"><strong className="text-[#111827] text-[13px] font-medium mb-1">DPI</strong> <span>{getValue(metadata.dpi, " DPI")}</span></p>
          </div>
        </div>

        {/* Camera Info Section */}
        <div>
          <h3 className="font-medium text-[#4B5563] text-[13px] uppercase tracking-wider mb-3 flex items-center gap-2">
            <IconCamera size={16} className="text-[#2563EB]" />
            Camera Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="flex flex-col"><strong className="text-[#111827] text-[13px] font-medium mb-1">Device</strong> <span>{getValue(metadata.camera)}</span></p>
            <p className="flex flex-col"><strong className="text-[#111827] text-[13px] font-medium mb-1">Date Taken</strong> <span>{getValue(metadata.datetime)}</span></p>
          </div>
        </div>

      </div>
    </div>
  );
}
