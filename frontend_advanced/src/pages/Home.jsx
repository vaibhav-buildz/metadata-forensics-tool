import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Upload from '../components/Upload'
import Results from '../components/Results'
import { analyzeImage } from '../services/api'

export default function Home() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState(null)

  const handleUpload = useCallback(async (file) => {
    setLoading(true)
    setError(null)
    setProgress(0)
    setResults(null)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)

    try {
      const data = await analyzeImage(file, setProgress)
      setResults(data)
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        'Analysis failed. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleReset = useCallback(() => {
    setResults(null)
    setError(null)
    setProgress(0)
    setPreview(null)
    setLoading(false)
  }, [])

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* ── Hero Section ──────────────────────────── */}
      {!results && (
        <section className="relative py-20 px-6">
          {/* Background glow effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-forensic-500/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forensic-500/10 border border-forensic-500/20 mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-forensic-500 animate-pulse" />
              <span className="text-sm text-forensic-400 font-medium">Image Forensics Analysis</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight animate-slide-up">
              Uncover the <span className="text-gradient">Hidden Story</span>
              <br />Behind Every Image
            </h1>

            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Extract metadata, detect tampering, locate GPS coordinates, generate
              hash fingerprints, and identify faces & objects — all in one click.
            </p>

            {/* ── Feature Cards ─────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-14 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {[
                { icon: '📋', label: 'EXIF Metadata' },
                { icon: '📍', label: 'GPS Location' },
                { icon: '🛡️', label: 'Tampering Check' },
                { icon: '🔐', label: 'Hash Fingerprint' },
                { icon: '👁️', label: 'Face & Object' },
              ].map((f, i) => (
                <div key={i} className="glass-card p-4 text-center">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <div className="text-xs text-gray-400 font-medium">{f.label}</div>
                </div>
              ))}
            </div>

            {/* ── Upload ────────────────────────────── */}
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Upload onUpload={handleUpload} loading={loading} progress={progress} />
            </div>

            {/* ── Error ─────────────────────────────── */}
            {error && (
              <div className="mt-6 p-4 rounded-xl bg-accent-red/10 border border-accent-red/20 text-accent-red text-sm animate-slide-up">
                ❌ {error}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Results Section ────────────────────────── */}
      {results && (
        <section className="py-10 px-6 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            {/* Header bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                {preview && (
                  <img
                    src={preview}
                    alt="Uploaded"
                    className="w-14 h-14 rounded-xl object-cover border border-white/10"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
                  <p className="text-sm text-gray-400 mt-0.5">{results.filename}</p>
                </div>
              </div>
              <button onClick={handleReset} className="btn-secondary text-sm">
                ← Analyze Another
              </button>
            </div>

            <Results data={results} preview={preview} />
          </div>
        </section>
      )}

      {/* ── Loading Overlay ─────────────────────────── */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-500/80 backdrop-blur-sm">
          <div className="glass-card p-10 text-center max-w-sm mx-4">
            <div className="spinner mx-auto mb-6" />
            <h3 className="text-lg font-bold text-white mb-2">Analyzing Image...</h3>
            <p className="text-sm text-gray-400 mb-4">Running 5 forensic checks</p>
            <div className="gauge-track">
              <div
                className="gauge-fill bg-gradient-to-r from-forensic-600 to-forensic-400"
                style={{ width: `${Math.max(progress, 10)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{progress}% uploaded</p>
          </div>
        </div>
      )}
    </div>
  )
}
