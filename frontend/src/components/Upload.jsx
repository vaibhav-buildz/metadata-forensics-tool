import { useState, useRef } from 'react';
import { IconCloudUpload, IconLoader2, IconPhotoPlus } from '@tabler/icons-react';

export default function Upload({ onUpload, isLoading }) {
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      onUpload(file);
    }
  };

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 p-2">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative overflow-hidden border-[1.5px] border-dashed rounded-[16px] p-12 text-center cursor-pointer transition-all duration-300 ease-in-out
          ${isDragging 
            ? 'border-blue-500 bg-blue-50/50' 
            : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
          }
          ${isLoading ? 'opacity-70 pointer-events-none border-slate-200 bg-slate-50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isLoading}
          className="hidden"
        />
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center animate-pulse py-4">
            <IconLoader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" stroke={1.5} />
            <p className="text-[#111827] font-semibold text-lg mb-1">Processing Image</p>
            <p className="text-[#6B7280] text-sm font-medium">Extracting metadata and analyzing...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center transition-transform duration-300 group py-4">
            <div className={`mb-5 p-4 rounded-2xl transition-all duration-300 
              ${isDragging ? 'bg-blue-100 text-blue-600 scale-110' : 'bg-slate-100 text-slate-500 group-hover:scale-105 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
              {isDragging ? <IconPhotoPlus size={40} stroke={1.5} /> : <IconCloudUpload size={40} stroke={1.5} />}
            </div>
            <p className="text-[18px] font-semibold text-[#111827] mb-2">
              {isDragging ? "Drop to upload" : "Click or drag image to upload"}
            </p>
            <p className="text-[#6B7280] text-sm font-medium">
              {fileName ? (
                <span className="text-blue-600 truncate max-w-xs block px-4 py-1 bg-blue-50 rounded-full">{fileName}</span>
              ) : (
                "PNG, JPG, WEBP up to 50MB"
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
