/**
 * Netlify Function: Login API
 * Xử lý đăng nhập
 */

const users = [
  { id: 1, email: 'admin@flatlogic.com', password: 'password', name: 'Admin User' },
  { id: 2, email: 'user@flatlogic.com', password: 'password', name: 'Normal User' },
];

exports.handler = async (event) => {
  // Chỉ cho phép POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };
  }

  try {
    const { email, password } = JSON.parse(event.body || '{}');

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: 'Vui lòng nhập email và mật khẩu'
        })
      };
    }

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: 'Đăng nhập thành công!',
          user: {
            id: user.id,
            email: user.email,
            name: user.name
          }
        })
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({
          success: false,
          message: 'Email hoặc mật khẩu không đúng'
        })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Lỗi server' })
    };
  }
};
