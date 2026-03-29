export const meetingHistory = [
  {
    id: "GB-2026-03-17-S",
    date: "17/03/2026",
    type: "Giao ban sáng",
    chair: "BS. Nguyễn Văn Minh (Giám đốc)",
    signStatus: "Đã ký duyệt",
  },
  {
    id: "GB-2026-03-16-C",
    date: "16/03/2026",
    type: "Giao ban chiều",
    chair: "BS. Trần Thị Hạnh (PGĐ Chuyên môn)",
    signStatus: "Chờ ký số",
  },
  {
    id: "GB-2026-W11",
    date: "15/03/2026",
    type: "Giao ban tuần",
    chair: "BS. Nguyễn Văn Minh (Giám đốc)",
    signStatus: "Đã xuất PDF",
  },
];

export const patientSummary = {
  admitted: 124,
  discharged: 117,
  death: 1,
  inHospital: 486,
  emergency: 38,
  surgery: 19,
};

export const directorConclusions = [
  "Khoa Cấp cứu triển khai luồng phân loại đỏ-vàng-xanh trước 07:30 hàng ngày.",
  "Phòng Vật tư hoàn tất sửa máy ECG phòng khám tim mạch trước 18/03.",
  "Khoa Hồi sức báo cáo riêng 02 ca nặng sau 16:00, kèm phác đồ điều trị cập nhật.",
];

export const assignedTasks = [
  {
    id: "TASK-001",
    content: "Rà soát tồn kho thuốc cấp cứu",
    deputyDirector: "PGĐ Hậu cần",
    assignee: "Dược sĩ trưởng",
    deadline: "18/03/2026 17:00",
    expectedResult: "Danh mục thiếu + kế hoạch bổ sung",
    status: "Đang triển khai",
  },
  {
    id: "TASK-002",
    content: "Chuẩn hóa checklist bàn giao ca trực ICU",
    deputyDirector: "PGĐ Chuyên môn",
    assignee: "Trưởng khoa Hồi sức",
    deadline: "19/03/2026 10:00",
    expectedResult: "Checklist áp dụng toàn khoa",
    status: "Đã giao khoa",
  },
  {
    id: "TASK-003",
    content: "Sửa điều hòa phòng hậu phẫu số 2",
    deputyDirector: "PGĐ Hậu cần",
    assignee: "Tổ cơ điện",
    deadline: "17/03/2026 20:00",
    expectedResult: "Thiết bị hoạt động ổn định",
    status: "Quá hạn",
  },
];

export const hierarchy = [
  {
    project: "Đề án giảm thời gian chờ khám dưới 45 phút",
    director: "Giám đốc",
    deputy: "PGĐ Chuyên môn",
    departmentTask: "Khoa Khám bệnh chuẩn hóa quy trình tiếp nhận",
    assignee: "Điều dưỡng trưởng khu khám",
    status: "Đang triển khai",
    deadline: "20/03/2026",
  },
  {
    project: "Nâng cao an toàn người bệnh nội trú",
    director: "Giám đốc",
    deputy: "PGĐ Điều dưỡng",
    departmentTask: "Khoa Nội kiểm tra nhận diện vòng tay",
    assignee: "Tổ kiểm soát chất lượng",
    status: "Đã giao khoa",
    deadline: "22/03/2026",
  },
  {
    project: "Bảo trì thiết bị trọng yếu tháng 3",
    director: "Giám đốc",
    deputy: "PGĐ Hậu cần",
    departmentTask: "Phòng Vật tư bảo trì ECG và monitor",
    assignee: "Kỹ sư thiết bị y tế",
    status: "Đã hoàn thành",
    deadline: "16/03/2026",
  },
];

export const departmentKpi = [
  { name: "Khoa Nội", workload: 92, onTimeRate: 96, leadershipScore: 9.1 },
  { name: "Khoa Ngoại", workload: 88, onTimeRate: 91, leadershipScore: 8.8 },
  { name: "Khoa Sản Nhi", workload: 95, onTimeRate: 93, leadershipScore: 9.3 },
  { name: "Khoa Cấp cứu", workload: 97, onTimeRate: 89, leadershipScore: 8.6 },
];

export const dutyRoster = [
  {
    department: "Khoa Nội",
    shift: "Ca sáng 07:00-14:00",
    doctor: "BS. Lê Quang",
    nurse: "ĐD. Mai Anh",
    orderly: "HL. Văn Bình",
  },
  {
    department: "Khoa Ngoại",
    shift: "Ca chiều 14:00-21:00",
    doctor: "BS. Thu Hương",
    nurse: "ĐD. Khánh Linh",
    orderly: "HL. Minh Phúc",
  },
  {
    department: "Khoa Sản Nhi",
    shift: "Ca đêm 21:00-07:00",
    doctor: "BS. Thanh Vân",
    nurse: "ĐD. Thảo Vy",
    orderly: "HL. Quốc Dũng",
  },
];

export const maintenanceList = [
  {
    equipment: "Máy ECG - Khám Tim mạch",
    issue: "Mất tín hiệu kênh V2",
    status: "Đang sửa",
    eta: "18/03/2026 15:00",
  },
  {
    equipment: "Điều hòa - Hậu phẫu số 2",
    issue: "Không đủ lạnh",
    status: "Quá hạn",
    eta: "17/03/2026 20:00",
  },
  {
    equipment: "Monitor theo dõi - ICU Bed 04",
    issue: "Pin dự phòng yếu",
    status: "Đã hoàn thành",
    eta: "16/03/2026 11:30",
  },
];

export const staffMyTasks = [
  {
    title: "Kiểm tra tủ thuốc trực đêm",
    deadline: "17/03/2026 19:30",
    status: "Sắp đến hạn",
  },
  {
    title: "Cập nhật hồ sơ ca hậu phẫu #HP-2241",
    deadline: "17/03/2026 20:15",
    status: "Đang làm",
  },
  {
    title: "Báo cáo ảnh thiết bị ECG sau sửa",
    deadline: "17/03/2026 21:00",
    status: "Chưa bắt đầu",
  },
];
