import React from 'react'

export default function DetectionCard({ detection, preview }) {
  if (!detection) return null

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <div>
          <h3 className="section-title">Face & Object Detection</h3>
          <p className="text-xs text-gray-500">AI-powered analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ── Faces ──────────────────────────────── */}
        <div className="p-4 rounded-xl bg-surface-300/50 border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white font-mono">{detection.faces}</p>
              <p className="text-xs text-gray-400">Face{detection.faces !== 1 ? 's' : ''} Detected</p>
            </div>
          </div>

          {detection.face_details && detection.face_details.length > 0 && (
            <div className="space-y-1.5">
              {detection.face_details.map((face) => (
                <div key={face.id} className="text-xs text-gray-400 font-mono">
                  Face #{face.id}: {face.position.width}×{face.position.height}px
                  @ ({face.position.x}, {face.position.y})
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Objects ────────────────────────────── */}
        <div className="p-4 rounded-xl bg-surface-300/50 border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center">
              <span className="text-2xl">🏷️</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white font-mono">{detection.object_count}</p>
              <p className="text-xs text-gray-400">Object{detection.object_count !== 1 ? 's' : ''} Identified</p>
            </div>
          </div>

          {detection.objects && detection.objects.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {detection.objects.map((obj, i) => (
                <span key={i} className="badge-cyan text-[10px]">{obj}</span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500">No objects detected</p>
          )}
        </div>

        {/* ── Privacy ────────────────────────────── */}
        <div className="p-4 rounded-xl bg-surface-300/50 border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              detection.privacy_alert
                ? 'bg-accent-red/10 border border-accent-red/20'
                : 'bg-accent-green/10 border border-accent-green/20'
            }`}>
              <span className="text-2xl">{detection.privacy_alert ? '🔴' : '🟢'}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                {detection.privacy_alert ? 'Privacy Alert' : 'No Concerns'}
              </p>
              <p className="text-xs text-gray-400">Privacy Assessment</p>
            </div>
          </div>

          {detection.privacy_reasons && detection.privacy_reasons.length > 0 ? (
            <div className="space-y-1.5">
              {detection.privacy_reasons.map((reason, i) => (
                <div
                  key={i}
                  className="flex items-start gap-1.5 text-xs text-accent-red"
                >
                  <span className="mt-0.5">⚠</span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-accent-green">✓ No privacy-sensitive content detected</p>
          )}
        </div>
      </div>
    </div>
  )
}
