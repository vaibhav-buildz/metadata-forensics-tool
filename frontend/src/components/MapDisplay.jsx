import React, { useEffect, useRef } from 'react'

export default function MapDisplay({ location }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    if (!location?.available || !mapRef.current || mapInstanceRef.current) return

    // Dynamically use Leaflet (loaded via CDN in index.html)
    const L = window.L
    if (!L) return

    const map = L.map(mapRef.current, {
      center: [location.latitude, location.longitude],
      zoom: 14,
      zoomControl: true,
      attributionControl: true,
    })

    // Dark-themed tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map)

    // Custom marker
    const markerIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 24px; height: 24px;
          background: #00d4ff;
          border-radius: 50%;
          border: 3px solid #0a0e1a;
          box-shadow: 0 0 15px rgba(0, 212, 255, 0.5);
          position: relative;
        ">
          <div style="
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 8px; height: 8px;
            background: #0a0e1a;
            border-radius: 50%;
          "></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })

    L.marker([location.latitude, location.longitude], { icon: markerIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: Inter, sans-serif; color: #333; min-width: 200px;">
          <strong>📍 Image Location</strong><br/>
          <small>${location.coordinates || ''}</small><br/>
          <small>${location.address || 'Address unavailable'}</small>
        </div>
      `)
      .openPopup()

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [location])

  return (
    <div className="glass-card p-6 h-full">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h3 className="section-title">GPS Location</h3>
          <p className="text-xs text-gray-500">
            {location?.available ? 'Coordinates extracted' : 'No GPS data'}
          </p>
        </div>
      </div>

      {location?.available ? (
        <>
          {/* Map */}
          <div
            ref={mapRef}
            className="w-full h-56 rounded-xl mb-4 border border-white/5"
            style={{ minHeight: 220 }}
          />

          {/* Location details */}
          <div className="space-y-0">
            <div className="data-row">
              <span className="data-label">Coordinates</span>
              <span className="data-value">{location.coordinates}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Latitude</span>
              <span className="data-value">{location.latitude}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Longitude</span>
              <span className="data-value">{location.longitude}</span>
            </div>
            {location.altitude && (
              <div className="data-row">
                <span className="data-label">Altitude</span>
                <span className="data-value">{location.altitude}</span>
              </div>
            )}
            {location.address && (
              <div className="mt-3 p-3 rounded-lg bg-surface-300/50 border border-white/5">
                <p className="text-xs text-gray-400 mb-1">Address</p>
                <p className="text-sm text-gray-200 leading-relaxed">{location.address}</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-300/50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">No GPS data found</p>
          <p className="text-gray-500 text-xs mt-1">This image doesn't contain location information</p>
        </div>
      )}
    </div>
  )
}
