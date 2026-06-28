import React, { useRef, useState, useCallback } from 'react'

const ALLOWED = ['image/jpeg', 'image/png', 'image/tiff', 'image/webp', 'image/bmp', 'image/heic']
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

export default function Upload({ onUpload, loading, progress }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const validate = useCallback((file) => {
    if (!file) return 'No file selected'
    if (!ALLOWED.includes(file.type) && !file.name.match(/\.(jpe?g|png|tiff?|webp|bmp|heic)$/i)) {
      return 'Unsupported file type. Use JPG, PNG, TIFF, WebP, BMP, or HEIC.'
    }
    if (file.size > MAX_SIZE) {
      return `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum: 10 MB.`
    }
    return null
  }, [])

  const handleFile = useCallback((file) => {
    const err = validate(file)
    if (err) {
      alert(err)
      return
    }
    setSelectedFile(file)
    onUpload(file)
  }, [validate, onUpload])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  const onDragOver = useCallback((e) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const onDragLeave = useCallback(() => setDragOver(false), [])

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !loading && inputRef.current?.click()}
      >
        {/* Scan line effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-forensic-500 to-transparent"
            style={{
              animation: 'scanLine 3s linear infinite',
              top: 0,
            }}
          />
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.tiff,.tif,.webp,.bmp,.heic"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
          disabled={loading}
        />

        <div className="relative z-10 p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-2xl bg-forensic-500/10 border border-forensic-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-forensic-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>

          <h3 className="text-lg font-bold text-white mb-2">
            {loading ? 'Processing...' : 'Drop your image here'}
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            or <span className="text-forensic-400 font-medium cursor-pointer hover:underline">browse files</span>
          </p>

          {/* Supported formats */}
          <div className="flex flex-wrap justify-center gap-2">
            {['JPG', 'PNG', 'TIFF', 'WebP', 'BMP', 'HEIC'].map((fmt) => (
              <span key={fmt} className="px-2.5 py-1 rounded-md bg-surface-300 text-xs text-gray-400 font-mono">
                .{fmt.toLowerCase()}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">Maximum file size: 10 MB</p>
        </div>
      </div>

      {/* Selected file info */}
      {selectedFile && !loading && (
        <div className="mt-4 p-3 rounded-xl bg-surface-300/50 border border-white/5 flex items-center gap-3 animate-slide-up">
          <div className="w-10 h-10 rounded-lg bg-forensic-500/10 flex items-center justify-center text-lg">
            📸
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">{selectedFile.name}</p>
            <p className="text-xs text-gray-400">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
