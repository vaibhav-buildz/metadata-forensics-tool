import { useState, useRef } from 'react';

export default function Upload({ onUpload, isLoading }) {
  const [fileName, setFileName] = useState('');
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
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      onUpload(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isLoading}
        className="hidden"
      />
      
      <div className="text-4xl mb-3">📷</div>
      
      {isLoading ? (
        <div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">Analyzing...</p>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : (
        <div>
          <p className="text-lg font-medium mb-1">Click or drag image</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {fileName || 'JPG, PNG, GIF, BMP (max 50MB)'}
          </p>
        </div>
      )}
    </div>
  );
}
