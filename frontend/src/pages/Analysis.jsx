import React from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import Results from '../components/Results'

/**
 * Standalone analysis results page.
 * Receives results via router state (from Home page navigation).
 */
export default function Analysis() {
  const location = useLocation()
  const data = location.state?.results
  const preview = location.state?.preview

  // Redirect to home if no data
  if (!data) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            {preview && (
              <img
                src={preview}
                alt="Analyzed"
                className="w-14 h-14 rounded-xl object-cover border border-white/10"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">Analysis Results</h1>
              <p className="text-sm text-gray-400 mt-0.5">{data.filename}</p>
            </div>
          </div>
          <a href="/" className="btn-secondary text-sm">← Analyze Another</a>
        </div>

        <Results data={data} preview={preview} />
      </div>
    </div>
  )
}
