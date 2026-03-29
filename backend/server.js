/**
 * Backend đơn giản - Quản lý Giao ban
 * Dùng Node.js + Express (không cần database, dùng mảng tạm để demo)
 * Giúp bạn hiểu cách BE hoạt động
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3005'],
  credentials: true
};
app.use(cors(corsOptions));              // Cho phép frontend gọi API
app.use(express.json());      // Đọc JSON từ request body

// ============================================
// DỮ LIỆU MẪU (thay vì database)
 // Thay vì Database thật, ta dùng mảng tạm trong RAM
// Khi server restart, dữ liệu sẽ mất (giống localStorage trong React)
const meetings = [
  {
    id: 'MEETING-001',
    meetingCode: 'GB-2026-03-19-S',
    meetingDate: '2026-03-19',
    meetingType: 'Giao ban sáng',
    chair: 'BS. Nguyễn Văn Minh',
    attendees: 'Ban giám đốc, Trưởng khoa',
    summaryReport: 'Tình hình hoạt động ổn định',
    labSummary: '100 ca xét nghiệm, 5 ca chụp X-quang',
    conclusion: 'Tiếp tục duy trì quy trình khám chữa bệnh',
    assignmentSheet: 'Khoa cấp cứu: Tăng cường 2 nhân viên',
    signStatus: 'APPROVED',
    createdAt: '2026-03-19 08:30:00'
  },
  {
    id: 'MEETING-002',
    meetingCode: 'GB-2026-03-20-S',
    meetingDate: '2026-03-20',
    meetingType: 'Giao ban sáng',
    chair: 'BS. Trần Thị Lan',
    attendees: 'Ban giám đốc',
    summaryReport: 'Có 1 ca tai nạn giao thông nhập viện',
    labSummary: '50 ca xét nghiệm',
    conclusion: 'Khoa cấp cứu ưu tiên xử lý ca nặng',
    assignmentSheet: 'Khoa ngoại: Chuẩn bị phẫu thuật',
    signStatus: 'PENDING',
    createdAt: '2026-03-20 08:30:00'
  }
];

let nextMeetingId = 3; // Tự tăng ID cho meeting mới

// ============================================
// AUTH - Đăng nhập đơn giản (demo)
const users = [
  { id: 1, email: 'admin@flatlogic.com', password: 'password', name: 'Admin User' },
  { id: 2, email: 'user@flatlogic.com', password: 'password', name: 'Normal User' },
];

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng nhập email và mật khẩu'
    });
  }

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Email hoặc mật khẩu không đúng'
    });
  }
});

// ============================================
// ROUTES (Các endpoint API)

// --- ROOT: Test server có chạy không ---
app.get('/', (req, res) => {
  res.json({
    message: '✅ Server đang chạy!',
    endpoints: {
      'GET /api/meetings': 'Lấy danh sách biên bản',
      'GET /api/meetings/:id': 'Lấy 1 biên bản',
      'POST /api/meetings': 'Tạo biên bản mới',
      'PUT /api/meetings/:id': 'Cập nhật biên bản',
      'DELETE /api/meetings/:id': 'Xóa biên bản',
      'GET /api/meetings/:id/tasks': 'Lấy tasks từ biên bản',
    }
  });
});

// --- GET /api/meetings: Lấy danh sách biên bản ---
// Query params: ?type=Giao ban sáng&date=2026-03-19&status=APPROVED
app.get('/api/meetings', (req, res) => {
  try {
    let result = [...meetings]; // Copy mảng

    // Lọc theo loại giao ban
    if (req.query.type) {
      result = result.filter(m => m.meetingType === req.query.type);
    }

    // Lọc theo ngày
    if (req.query.date) {
      result = result.filter(m => m.meetingDate === req.query.date);
    }

    // Lọc theo trạng thái ký
    if (req.query.status) {
      result = result.filter(m => m.signStatus === req.query.status);
    }

    res.json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// --- GET /api/meetings/:id: Lấy 1 biên bản theo ID ---
app.get('/api/meetings/:id', (req, res) => {
  const meeting = meetings.find(m => m.id === req.params.id);

  if (!meeting) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy biên bản!'
    });
  }

  res.json({ success: true, data: meeting });
});

// --- POST /api/meetings: Tạo biên bản mới ---
// Frontend gửi JSON body lên đây
app.post('/api/meetings', (req, res) => {
  try {
    const {
      meetingCode,
      meetingDate,
      meetingType,
      chair,
      attendees,
      summaryReport,
      labSummary,
      conclusion,
      assignmentSheet
    } = req.body;

    // ---- VALIDATION: Kiểm tra dữ liệu đầu vào ----
    // Nếu thiếu trường bắt buộc, trả lỗi về cho frontend
    if (!meetingCode || !meetingDate || !chair || !conclusion) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: meetingCode, meetingDate, chair, conclusion'
      });
    }

    // ---- TẠO MỚI ----
    const newMeeting = {
      id: `MEETING-${String(nextMeetingId++).padStart(3, '0')}`,
      meetingCode: meetingCode.trim(),
      meetingDate,
      meetingType: meetingType || 'Giao ban sáng',
      chair: chair.trim(),
      attendees: attendees || '',
      summaryReport: summaryReport || '',
      labSummary: labSummary || '',
      conclusion: conclusion.trim(),
      assignmentSheet: assignmentSheet || '',
      signStatus: 'DRAFT',  // Mặc định là DRAFT (chưa ký)
      createdAt: new Date().toLocaleString('vi-VN')
    };

    // Lưu vào mảng "database"
    meetings.unshift(newMeeting); // unshift = thêm vào đầu mảng

    // ---- TRẢ KẾT QUẢ CHO FRONTEND ----
    res.status(201).json({
      success: true,
      message: 'Tạo biên bản thành công!',
      data: newMeeting
    });

  } catch (error) {
    console.error('Lỗi tạo meeting:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// --- PUT /api/meetings/:id: Cập nhật biên bản ---
app.put('/api/meetings/:id', (req, res) => {
  const meetingId = req.params.id;
  const meetingIndex = meetings.findIndex(m => m.id === meetingId);

  if (meetingIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy biên bản!'
    });
  }

  const {
    meetingCode,
    meetingDate,
    meetingType,
    chair,
    attendees,
    summaryReport,
    labSummary,
    conclusion,
    assignmentSheet,
    signStatus
  } = req.body;

  // Cập nhật các trường được gửi lên (giữ nguyên các trường khác)
  meetings[meetingIndex] = {
    ...meetings[meetingIndex],  // Giữ nguyên các trường cũ
    ...(meetingCode && { meetingCode: meetingCode.trim() }),
    ...(meetingDate && { meetingDate }),
    ...(meetingType && { meetingType }),
    ...(chair && { chair: chair.trim() }),
    ...(attendees !== undefined && { attendees: attendees.trim() }),
    ...(summaryReport !== undefined && { summaryReport: summaryReport.trim() }),
    ...(labSummary !== undefined && { labSummary: labSummary.trim() }),
    ...(conclusion && { conclusion: conclusion.trim() }),
    ...(assignmentSheet !== undefined && { assignmentSheet: assignmentSheet.trim() }),
    ...(signStatus && { signStatus })
  };

  res.json({
    success: true,
    message: 'Cập nhật thành công!',
    data: meetings[meetingIndex]
  });
});

// --- DELETE /api/meetings/:id: Xóa biên bản ---
app.delete('/api/meetings/:id', (req, res) => {
  const meetingId = req.params.id;
  const meetingIndex = meetings.findIndex(m => m.id === meetingId);

  if (meetingIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy biên bản!'
    });
  }

  // Xóa khỏi mảng
  const deletedMeeting = meetings.splice(meetingIndex, 1)[0];

  res.json({
    success: true,
    message: 'Xóa biên bản thành công!',
    data: deletedMeeting
  });
});

// --- POST /api/meetings/:id/approve: Ký duyệt biên bản ---
app.post('/api/meetings/:id/approve', (req, res) => {
  const meetingId = req.params.id;
  const meeting = meetings.find(m => m.id === meetingId);

  if (!meeting) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy biên bản!'
    });
  }

  meeting.signStatus = 'APPROVED';

  res.json({
    success: true,
    message: 'Ký duyệt thành công!',
    data: meeting
  });
});

// --- GET /api/meetings/:id/tasks: Lấy tasks từ biên bản ---
// Tạm thời parse assignmentSheet thành tasks (demo đơn giản)
app.get('/api/meetings/:id/tasks', (req, res) => {
  const meeting = meetings.find(m => m.id === req.params.id);

  if (!meeting) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy biên bản!'
    });
  }

  // Demo: Parse đơn giản từ assignmentSheet
  // Format: "Khoa cấp cứu: Tăng cường 2 nhân viên | Khoa ngoại: Chuẩn bị phẫu thuật"
  const tasks = meeting.assignmentSheet
    ? meeting.assignmentSheet.split('|').map((item, index) => {
        const [dept, content] = item.split(':').map(s => s.trim());
        return {
          id: `TASK-${meeting.id}-${index + 1}`,
          meetingId: meeting.id,
          department: dept || 'Không xác định',
          content: content || item,
          status: 'ASSIGNED',
          deadline: meeting.meetingDate
        };
      })
    : [];

  res.json({
    success: true,
    data: tasks
  });
});

// ============================================
// KHỞI ĐỘNG SERVER
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🚀 Server đang chạy!                          ║
║                                                   ║
║   Local:  http://localhost:${PORT}                  ║
║   API:    http://localhost:${PORT}/api              ║
║                                                   ║
║   Cách test (bằng curl hoặc Postman):            ║
║   1. GET    /api/meetings                         ║
║   2. POST   /api/meetings  (tạo mới)             ║
║   3. GET    /api/meetings/MEETING-001            ║
║   4. PUT    /api/meetings/MEETING-001            ║
║   5. DELETE /api/meetings/MEETING-001            ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);
});
