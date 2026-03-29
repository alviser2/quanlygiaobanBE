/**
 * Netlify Function: Meetings API
 * Xử lý tất cả các operation liên quan đến meetings
 */

// In-memory data store (tồn tại trong function cold start, không persist giữa các request)
// Để persist, cần dùng database thật hoặc external storage
let meetings = [
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

let nextMeetingId = 3;

// Parse query params
const getQueryParams = (url) => {
  const params = {};
  const queryString = url.split('?')[1];
  if (queryString) {
    queryString.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
  }
  return params;
};

// Extract path segments from URL
const getPathSegments = (url) => {
  const path = url.split('?')[0];
  const segments = path.split('/').filter(Boolean);
  return segments;
};

exports.handler = async (event) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const segments = getPathSegments(event.path);
    const path = event.path;
    const queryParams = getQueryParams(event.path);

    // Route: GET /api/meetings
    if (event.httpMethod === 'GET' && path.match(/^\/api\/meetings$/)) {
      let result = [...meetings];

      if (queryParams.type) {
        result = result.filter(m => m.meetingType === queryParams.type);
      }
      if (queryParams.date) {
        result = result.filter(m => m.meetingDate === queryParams.date);
      }
      if (queryParams.status) {
        result = result.filter(m => m.signStatus === queryParams.status);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, count: result.length, data: result })
      };
    }

    // Route: GET /api/meetings/:id
    if (event.httpMethod === 'GET' && path.match(/^\/api\/meetings\/[^/]+$/)) {
      const id = segments[segments.length - 1];
      const meeting = meetings.find(m => m.id === id);

      if (!meeting) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ success: false, message: 'Không tìm thấy biên bản!' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, data: meeting })
      };
    }

    // Route: GET /api/meetings/:id/tasks
    if (event.httpMethod === 'GET' && path.match(/^\/api\/meetings\/[^/]+\/tasks$/)) {
      const id = segments[segments.length - 2];
      const meeting = meetings.find(m => m.id === id);

      if (!meeting) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ success: false, message: 'Không tìm thấy biên bản!' })
        };
      }

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

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, data: tasks })
      };
    }

    // Route: POST /api/meetings (create new)
    if (event.httpMethod === 'POST' && path.match(/^\/api\/meetings$/)) {
      const body = JSON.parse(event.body || '{}');
      const {
        meetingCode, meetingDate, meetingType, chair,
        attendees, summaryReport, labSummary, conclusion, assignmentSheet
      } = body;

      if (!meetingCode || !meetingDate || !chair || !conclusion) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Thiếu thông tin bắt buộc: meetingCode, meetingDate, chair, conclusion'
          })
        };
      }

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
        signStatus: 'DRAFT',
        createdAt: new Date().toLocaleString('vi-VN')
      };

      meetings.unshift(newMeeting);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ success: true, message: 'Tạo biên bản thành công!', data: newMeeting })
      };
    }

    // Route: PUT /api/meetings/:id
    if (event.httpMethod === 'PUT' && path.match(/^\/api\/meetings\/[^/]+$/)) {
      const id = segments[segments.length - 1];
      const meetingIndex = meetings.findIndex(m => m.id === id);

      if (meetingIndex === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ success: false, message: 'Không tìm thấy biên bản!' })
        };
      }

      const body = JSON.parse(event.body || '{}');
      const {
        meetingCode, meetingDate, meetingType, chair,
        attendees, summaryReport, labSummary, conclusion, assignmentSheet, signStatus
      } = body;

      meetings[meetingIndex] = {
        ...meetings[meetingIndex],
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

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Cập nhật thành công!', data: meetings[meetingIndex] })
      };
    }

    // Route: DELETE /api/meetings/:id
    if (event.httpMethod === 'DELETE' && path.match(/^\/api\/meetings\/[^/]+$/)) {
      const id = segments[segments.length - 1];
      const meetingIndex = meetings.findIndex(m => m.id === id);

      if (meetingIndex === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ success: false, message: 'Không tìm thấy biên bản!' })
        };
      }

      const deletedMeeting = meetings.splice(meetingIndex, 1)[0];

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Xóa biên bản thành công!', data: deletedMeeting })
      };
    }

    // Route: POST /api/meetings/:id/approve
    if (event.httpMethod === 'POST' && path.match(/^\/api\/meetings\/[^/]+\/approve$/)) {
      const id = segments[segments.length - 2];
      const meeting = meetings.find(m => m.id === id);

      if (!meeting) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ success: false, message: 'Không tìm thấy biên bản!' })
        };
      }

      meeting.signStatus = 'APPROVED';

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Ký duyệt thành công!', data: meeting })
      };
    }

    // Default: 404
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ success: false, message: 'Endpoint not found' })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: 'Lỗi server: ' + error.message })
    };
  }
};
