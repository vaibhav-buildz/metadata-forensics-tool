import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Analysis from './pages/Analysis'

export default function App() {
  return (
    <div className="min-h-screen bg-surface-500 bg-grid">
      {/* ── Nav ─────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-surface-500/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-forensic-500 to-forensic-700 flex items-center justify-center text-lg shadow-glow-cyan group-hover:shadow-lg transition-shadow">
              🔍
            </div>
            <span className="text-lg font-bold text-gradient tracking-tight">MetaForensics</span>
          </a>
          <div className="flex items-center gap-6">
            <a href="/" className="text-sm text-gray-400 hover:text-forensic-400 transition-colors">Home</a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-forensic-400 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* ── Content ─────────────────────────────── */}
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analysis" element={<Analysis />} />
        </Routes>
      </main>

      {/* ── Footer ──────────────────────────────── */}
      <footer className="border-t border-white/5 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2025 MetaForensics — Image Metadata Forensics Tool
          </p>
          <p className="text-xs text-gray-600">
            Built with FastAPI + React • All analysis runs locally
          </p>
        </div>
      </footer>
    </div>
  )
}
