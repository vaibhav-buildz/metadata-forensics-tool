import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000, // 2 minutes for large files + YOLO inference
})

/**
 * Upload an image file for forensic analysis.
 * @param {File} file – The image file to analyze
 * @param {Function} onProgress – Progress callback (0-100)
 * @returns {Promise<Object>} Analysis results
 */
export async function analyzeImage(file, onProgress) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post('/api/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        const percent = Math.round((event.loaded / event.total) * 100)
        onProgress(percent)
      }
    },
  })

  return response.data
}

/**
 * Check backend health.
 * @returns {Promise<Object>} Health status
 */
export async function checkHealth() {
  const response = await api.get('/api/health')
  return response.data
}

export default api
