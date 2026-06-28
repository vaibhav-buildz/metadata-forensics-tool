import React, { useEffect, useState } from 'react'

export default function TamperingCard({ tampering }) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    if (!tampering) return
    // Animate score from 0 to actual value
    const timer = setTimeout(() => setAnimatedScore(tampering.score), 100)
    return () => clearTimeout(timer)
  }, [tampering])

  if (!tampering) return null

  const scoreColor = tampering.score >= 50
    ? 'from-accent-red to-red-400'
    : tampering.score >= 20
    ? 'from-accent-yellow to-yellow-300'
    : 'from-accent-green to-green-300'

  const scoreTextColor = tampering.score >= 50
    ? 'text-accent-red'
    : tampering.score >= 20
    ? 'text-accent-yellow'
    : 'text-accent-green'

  const badgeClass = tampering.score >= 50
    ? 'badge-red'
    : tampering.score >= 20
    ? 'badge-yellow'
    : 'badge-green'

  return (
    <div className="glass-card p-6 h-full">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h3 className="section-title">Tampering Detection</h3>
          <p className="text-xs text-gray-500">{tampering.checks_performed || 4} checks performed</p>
        </div>
      </div>

      {/* Verdict */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">{tampering.verdict}</div>
        <span className={badgeClass}>
          {tampering.is_tampered ? 'Likely Modified' : tampering.score > 20 ? 'Suspicious' : 'Authentic'}
        </span>
      </div>

      {/* Score gauge */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Suspicion Score</span>
          <span className={`text-lg font-bold font-mono ${scoreTextColor}`}>{tampering.score}/100</span>
        </div>
        <div className="gauge-track">
          <div
            className={`gauge-fill bg-gradient-to-r ${scoreColor}`}
            style={{
              width: `${animatedScore}%`,
              transition: 'width 1.5s ease-out',
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">Clean</span>
          <span className="text-xs text-gray-500">Tampered</span>
        </div>
      </div>

      {/* Reasons */}
      {tampering.reasons && tampering.reasons.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Findings</p>
          <div className="space-y-2">
            {tampering.reasons.map((reason, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-3 rounded-lg bg-surface-300/50 border border-white/5"
              >
                <span className="text-accent-yellow mt-0.5">⚠</span>
                <p className="text-sm text-gray-300 leading-relaxed">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No issues */}
      {(!tampering.reasons || tampering.reasons.length === 0) && (
        <div className="p-3 rounded-lg bg-accent-green/5 border border-accent-green/10">
          <p className="text-sm text-accent-green">✓ No tampering indicators detected</p>
        </div>
      )}
    </div>
  )
}
