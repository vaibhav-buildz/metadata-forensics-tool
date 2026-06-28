import React, { useState } from 'react'

export default function MetadataCard({ metadata }) {
  const [expanded, setExpanded] = useState(false)

  if (!metadata) return null

  const primaryFields = [
    { label: 'Filename', value: metadata.filename },
    { label: 'File Size', value: metadata.filesize },
    { label: 'Dimensions', value: metadata.dimensions },
    { label: 'Format', value: metadata.format },
    { label: 'Camera', value: metadata.camera_make && metadata.camera_model
        ? `${metadata.camera_make} ${metadata.camera_model}`
        : metadata.camera_model || metadata.camera_make },
    { label: 'Date Taken', value: metadata.datetime_original },
    { label: 'Orientation', value: metadata.orientation },
    { label: 'Software', value: metadata.software },
  ].filter(f => f.value)

  const technicalFields = [
    { label: 'ISO', value: metadata.iso },
    { label: 'Aperture', value: metadata.aperture },
    { label: 'Shutter Speed', value: metadata.shutter_speed },
    { label: 'Focal Length', value: metadata.focal_length },
    { label: 'Flash', value: metadata.flash },
    { label: 'White Balance', value: metadata.white_balance },
    { label: 'Exposure Mode', value: metadata.exposure_mode },
    { label: 'Metering Mode', value: metadata.metering_mode },
    { label: 'Color Space', value: metadata.color_space },
    { label: 'Color Mode', value: metadata.mode },
  ].filter(f => f.value)

  const allTagCount = metadata.all_tags ? Object.keys(metadata.all_tags).length : 0

  return (
    <div className="glass-card p-6 h-full">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h3 className="section-title">EXIF Metadata</h3>
          <p className="text-xs text-gray-500">{allTagCount} tags extracted</p>
        </div>
      </div>

      {/* Primary fields */}
      <div className="space-y-0">
        {primaryFields.map((f, i) => (
          <div key={i} className="data-row">
            <span className="data-label">{f.label}</span>
            <span className="data-value" title={f.value}>{f.value}</span>
          </div>
        ))}
      </div>

      {/* Technical fields */}
      {technicalFields.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full mt-4 py-2 text-xs text-forensic-400 font-medium hover:text-forensic-300 transition-colors flex items-center justify-center gap-1"
          >
            {expanded ? '▲ Hide' : '▼ Show'} Technical Details ({technicalFields.length})
          </button>

          {expanded && (
            <div className="space-y-0 animate-slide-up">
              {technicalFields.map((f, i) => (
                <div key={i} className="data-row">
                  <span className="data-label">{f.label}</span>
                  <span className="data-value" title={f.value}>{f.value}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* No metadata fallback */}
      {primaryFields.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-gray-400 text-sm">No EXIF metadata found</p>
          <p className="text-gray-500 text-xs mt-1">This image may have been stripped of metadata</p>
        </div>
      )}
    </div>
  )
}
