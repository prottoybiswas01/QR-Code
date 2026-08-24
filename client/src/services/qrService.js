import { apiRequest } from './api';

export const qrService = {
  // Fetch user's QR codes with pagination and filters
  getQRCodes: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    return apiRequest(`/api/qr?${query.toString()}`);
  },

  // Fetch single QR Code by ID
  getQRCodeById: (id) => {
    return apiRequest(`/api/qr/${id}`);
  },

  // Create new QR Code (Dynamic or Static)
  createQRCode: (data) => {
    return apiRequest('/api/qr', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update existing QR Code (slug stays identical!)
  updateQRCode: (id, data) => {
    return apiRequest(`/api/qr/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Duplicate an existing QR Code
  duplicateQRCode: (id) => {
    return apiRequest(`/api/qr/${id}/duplicate`, {
      method: 'POST',
    });
  },

  // Delete QR Code
  deleteQRCode: (id) => {
    return apiRequest(`/api/qr/${id}`, {
      method: 'DELETE',
    });
  },

  // Get QR Analytics for specific QR
  getQRAnalytics: (id, period = '30d') => {
    return apiRequest(`/api/qr/${id}/analytics?period=${period}`);
  },

  // Get global dashboard overview
  getDashboardOverview: () => {
    return apiRequest('/api/analytics/overview');
  },

  // Public QR Data for dynamic viewer pages
  getPublicQRData: (slug) => {
    return apiRequest(`/api/public/q/${slug}`);
  },
};
