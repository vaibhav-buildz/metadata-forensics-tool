import React, { useState } from 'react'

export default function HashCard({ hashes }) {
  if (!hashes) return null

  const hashItems = [
    { label: 'MD5', value: hashes.md5, description: 'Fast verification hash' },
    { label: 'SHA-256', value: hashes.sha256, description: 'Cryptographically secure' },
    { label: 'pHash', value: hashes.perceptual, description: 'Perceptual (content-based)' },
  ].filter(h => h.value)

  return (
    <div className="glass-card p-6 h-full">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div>
          <h3 className="section-title">Hash Fingerprints</h3>
          <p className="text-xs text-gray-500">{hashItems.length} hashes generated</p>
        </div>
      </div>

      {/* Hash values */}
      <div className="space-y-3">
        {hashItems.map((h, i) => (
          <HashRow key={i} label={h.label} value={h.value} description={h.description} />
        ))}
      </div>

      {hashItems.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-gray-400 text-sm">Hash generation failed</p>
        </div>
      )}
    </div>
  )
}

function HashRow({ label, value, description }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const ta = document.createElement('textarea')
      ta.value = value
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="p-3 rounded-xl bg-surface-300/50 border border-white/5">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="badge-cyan text-[10px]">{label}</span>
          <span className="text-xs text-gray-500">{description}</span>
        </div>
        <button
          onClick={handleCopy}
          className={`copy-btn ${copied ? 'copied' : ''}`}
          title={copied ? 'Copied!' : 'Copy to clipboard'}
        >
          {copied ? (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
      <code className="text-xs text-forensic-300 font-mono break-all leading-relaxed select-all">
        {value}
      </code>
    </div>
  )
}
