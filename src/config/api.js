/**
 * Centralized API Configuration for Reyansh Studio
 * 
 * Works seamlessly across:
 * 1. Local development (proxied to http://localhost:5000 via Vite)
 * 2. Vercel frontend + Render backend (https://reyansh-studio.onrender.com)
 * 3. Unified fullstack deployment on Render or custom domain
 */

const getBaseUrl = () => {
  // If explicitly configured via environment variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '')
  }

  // If running locally in development, use relative path (proxied by Vite)
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0') {
      return ''
    }
  }

  // In production (e.g. Vercel), default to the live Render backend
  return 'https://reyansh-studio.onrender.com'
}

export const API_BASE_URL = getBaseUrl()

/**
 * Returns a fully-qualified URL for any API endpoint.
 * Example: apiUrl('/api/contact') => 'https://reyansh-studio.onrender.com/api/contact'
 */
export const apiUrl = (endpoint) => {
  if (!endpoint) return API_BASE_URL
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${API_BASE_URL}${cleanEndpoint}`
}

export default {
  API_BASE_URL,
  apiUrl,
}
