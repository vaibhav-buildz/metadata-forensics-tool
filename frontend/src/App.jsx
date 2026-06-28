import { useState } from 'react';
import Home from './pages/Home';
import Analysis from './pages/Analysis';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleAnalysisComplete = (results) => {
    setAnalysisResults(results);
    setCurrentPage('analysis');
  };

  const handleBackHome = () => {
    setCurrentPage('home');
    setAnalysisResults(null);
  };

  return (
    <div className="min-h-screen transition-opacity duration-300 ease-in-out font-sans bg-[#F8FAFC] text-[#1F2937] selection:bg-blue-100">
      {currentPage === 'home' ? (
        <Home onAnalysisComplete={handleAnalysisComplete} />
      ) : (
        <Analysis results={analysisResults} onBack={handleBackHome} />
      )}
    </div>
  );
}

export default App;
