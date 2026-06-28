import { useState } from 'react';
import Upload from '../components/Upload';

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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🔍 Metadata Forensics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Extract and analyze image metadata in seconds
          </p>
        </div>
        
        <Upload onUpload={handleUpload} isLoading={isLoading} />
      </div>
    </div>
  );
}
