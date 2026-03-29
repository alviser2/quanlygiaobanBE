/**
 * Netlify Function: API Router
 * Điều hướng các request đến function phù hợp
 */

const meetings = require('./meetings');
const login = require('./login');

exports.handler = async (event) => {
  const path = event.path;

  // Điều hướng /api/login đến login function
  if (path === '/api/login' || path.startsWith('/api/login')) {
    return login.handler(event);
  }

  // Điều hướng tất cả /api/* đến meetings function
  if (path.startsWith('/api/')) {
    return meetings.handler(event);
  }

  // Root endpoint
  if (path === '/' && event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: '✅ API đang chạy!',
        endpoints: {
          'GET /api/meetings': 'Lấy danh sách biên bản',
          'GET /api/meetings/:id': 'Lấy 1 biên bản',
          'POST /api/meetings': 'Tạo biên bản mới',
          'PUT /api/meetings/:id': 'Cập nhật biên bản',
          'DELETE /api/meetings/:id': 'Xóa biên bản',
          'POST /api/meetings/:id/approve': 'Ký duyệt biên bản',
          'GET /api/meetings/:id/tasks': 'Lấy tasks từ biên bản',
          'POST /api/login': 'Đăng nhập'
        }
      })
    };
  }

  return {
    statusCode: 404,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: false, message: 'Not found' })
  };
};
