// API URL:
// - Production: Để trống (frontend gọi /api/login, Netlify redirect đến function)
// - Development: localhost:3001 (backend chạy riêng)
const isProduction = process.env.NODE_ENV === 'production';

const API_URL = isProduction
  ? ''                    // Production: dùng relative path, Netlify redirect /api/* → /.netlify/functions/api/*
  : 'http://localhost:3001';  // Local: backend chạy riêng

export default {
  API_URL,
  auth: {
    email: 'admin@flatlogic.com',
    password: 'password'
  }
};
