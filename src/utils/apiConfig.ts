/**
 * Backend API configuration.
 * Uses VITE_API_BASE_URL if set (for standalone API deployment on Render Web Service),
 * or falls back to empty string for relative paths in local development.
 */
export const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL : '').replace(/\/+$/, '');
