# Backend đơn giản - Quản lý Giao Ban

Backend này dùng **Node.js + Express** (không cần database thật, dùng mảng tạm trong RAM).

## Cách chạy

```bash
cd D:/github/quanlygiaoban/backend
npm install
npm start
```

Server sẽ chạy tại: **http://localhost:3001**

## Các API endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Kiểm tra server có chạy không |
| GET | `/api/meetings` | Lấy danh sách biên bản (lọc theo `?type=`, `?date=`, `?status=`) |
| GET | `/api/meetings/:id` | Lấy 1 biên bản |
| POST | `/api/meetings` | Tạo biên bản mới |
| PUT | `/api/meetings/:id` | Cập nhật biên bản |
| DELETE | `/api/meetings/:id` | Xóa biên bản |
| POST | `/api/meetings/:id/approve` | Ký duyệt biên bản |
| GET | `/api/meetings/:id/tasks` | Lấy tasks từ biên bản |

## Test nhanh bằng curl

```bash
# Lấy danh sách biên bản
curl http://localhost:3001/api/meetings

# Tạo biên bản mới
curl -X POST http://localhost:3001/api/meetings \
  -H "Content-Type: application/json" \
  -d '{
    "meetingCode": "GB-2026-03-21-S",
    "meetingDate": "2026-03-21",
    "meetingType": "Giao ban sáng",
    "chair": "BS. Lê Hoàng Nam",
    "conclusion": "Tăng cường nhân viên y tế"
  }'

# Ký duyệt biên bản
curl -X POST http://localhost:3001/api/meetings/MEETING-001/approve
```

## Kết nối với Frontend React

Sửa `src/config.js` trong React frontend:

```js
const config = {
  API_URL: 'http://localhost:3001'
};
```

Sau đó gọi API trong React:

```js
// Ví dụ: Lấy danh sách biên bản
fetch('http://localhost:3001/api/meetings')
  .then(res => res.json())
  .then(data => console.log(data));
```
