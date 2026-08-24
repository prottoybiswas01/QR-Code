import { auth } from './firebase';

const BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Universal fetch wrapper with automatic Firebase Auth Token injection
 * @param {string} endpoint 
 * @param {RequestInit} options 
 * @returns {Promise<any>}
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Attach Firebase ID Token if user is logged in
  try {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken(false);
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      // Check for local storage mock token if any
      const devToken = localStorage.getItem('qrflex_dev_token');
      if (devToken) {
        headers['Authorization'] = `Bearer ${devToken}`;
      }
    }
  } catch (err) {
    console.warn('[API Service] Failed to get user token:', err.message);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  let data = null;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = { message: await response.text() };
  }

  if (!response.ok) {
    const error = new Error(data?.message || `HTTP error ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};
