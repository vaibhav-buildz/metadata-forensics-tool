import React from 'react'
import MetadataCard from './MetadataCard'
import MapDisplay from './MapDisplay'
import TamperingCard from './TamperingCard'
import HashCard from './HashCard'
import DetectionCard from './DetectionCard'

export default function Results({ data, preview }) {
  if (!data) return null

  const { metadata, location, tampering, hashes, detection } = data

  return (
    <div className="space-y-6">
      {/* ── Top Row: Metadata + Location ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <MetadataCard metadata={metadata} />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <MapDisplay location={location} />
        </div>
      </div>

      {/* ── Middle Row: Tampering + Hashes ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
          <TamperingCard tampering={tampering} />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          <HashCard hashes={hashes} />
        </div>
      </div>

      {/* ── Bottom Row: Detection ──────────────────── */}
      <div className="animate-slide-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
        <DetectionCard detection={detection} preview={preview} />
      </div>

      {/* ── Download Report ────────────────────────── */}
      <div className="flex justify-center pt-4 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
        <button
          onClick={() => downloadReport(data)}
          className="btn-primary"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Report (JSON)
        </button>
      </div>
    </div>
  )
}

function downloadReport(data) {
  const report = {
    report_generated: new Date().toISOString(),
    tool: 'Metadata Forensics Tool v1.0',
    ...data,
  }
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `forensic-report-${data.filename || 'image'}.json`
  a.click()
  URL.revokeObjectURL(url)
}
