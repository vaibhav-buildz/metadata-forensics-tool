import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Analysis from './pages/Analysis';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener('change', handleChange);
    return () => darkModeQuery.removeEventListener('change', handleChange);
  }, []);

  const handleAnalysisComplete = (results) => {
    setAnalysisResults(results);
    setCurrentPage('analysis');
  };

  const handleBackHome = () => {
    setCurrentPage('home');
    setAnalysisResults(null);
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen transition-colors duration-200
        bg-slate-50 text-slate-900
        dark:bg-slate-900 dark:text-slate-50">
        
        {currentPage === 'home' ? (
          <Home onAnalysisComplete={handleAnalysisComplete} />
        ) : (
          <Analysis results={analysisResults} onBack={handleBackHome} />
        )}
      </div>
    </div>
  );
}

export default App;
