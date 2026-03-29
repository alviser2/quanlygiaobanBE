import React from "react";
import { Row, Col, Table, Input, Button } from "reactstrap";
import Widget from "../../components/Widget";
import config from "../../config";
import s from "./MeetingManagement.module.scss";

const defaultMinuteForm = {
  meetingCode: "",
  meetingDate: "",
  meetingType: "Giao ban sáng",
  chair: "",
  attendees: "",
  summaryReport: "",
  labSummary: "",
  conclusion: "",
  assignmentSheet: "",
};

class MeetingManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minuteForm: { ...defaultMinuteForm },
      meetings: [],
      selectedMeetingId: "",
      loading: false,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchMeetings();
  }

  fetchMeetings = () => {
    this.setState({ loading: true, error: null });
    fetch(`${config.API_URL}/api/meetings`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          this.setState({
            meetings: data.data,
            loading: false,
            selectedMeetingId: data.data.length > 0 ? data.data[0].id : ""
          });
        } else {
          this.setState({ error: data.message, loading: false });
        }
      })
      .catch(err => {
        console.error("Lỗi fetch meetings:", err);
        this.setState({ error: "Không thể kết nối Backend", loading: false });
      });
  };

  handleMinuteInputChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      minuteForm: {
        ...prevState.minuteForm,
        [name]: value,
      },
    }));
  };

  handleSaveMinute = () => {
    const { minuteForm } = this.state;

    // Validate
    if (!minuteForm.meetingCode || !minuteForm.meetingDate || !minuteForm.chair || !minuteForm.conclusion) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    this.setState({ loading: true });

    fetch(`${config.API_URL}/api/meetings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(minuteForm),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          this.setState({
            minuteForm: { ...defaultMinuteForm },
            meetings: [data.data, ...this.state.meetings],
            selectedMeetingId: data.data.id,
            loading: false,
          });
          alert("Tạo biên bản thành công!");
        } else {
          alert("Lỗi: " + data.message);
          this.setState({ loading: false });
        }
      })
      .catch(err => {
        console.error("Lỗi tạo meeting:", err);
        alert("Không thể kết nối Backend!");
        this.setState({ loading: false });
      });
  };

  handleSelectMeeting = (meetingId) => {
    this.setState({ selectedMeetingId: meetingId });
  };

  handleDeleteMeeting = (meetingId) => {
    if (!window.confirm("Bạn có chắc muốn xóa biên bản này?")) return;

    fetch(`${config.API_URL}/api/meetings/${meetingId}`, {
      method: "DELETE",
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          this.setState(prevState => ({
            meetings: prevState.meetings.filter(m => m.id !== meetingId),
            selectedMeetingId: prevState.selectedMeetingId === meetingId
              ? (prevState.meetings.length > 1 ? prevState.meetings[0].id : "")
              : prevState.selectedMeetingId,
          }));
        } else {
          alert("Lỗi: " + data.message);
        }
      })
      .catch(err => {
        console.error("Lỗi xóa meeting:", err);
        alert("Không thể kết nối Backend!");
      });
  };

  handleApproveMeeting = (meetingId) => {
    fetch(`${config.API_URL}/api/meetings/${meetingId}/approve`, {
      method: "POST",
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          this.setState(prevState => ({
            meetings: prevState.meetings.map(m =>
              m.id === meetingId ? { ...m, signStatus: "APPROVED" } : m
            ),
          }));
          alert("Ký duyệt thành công!");
        } else {
          alert("Lỗi: " + data.message);
        }
      })
      .catch(err => {
        console.error("Lỗi approve meeting:", err);
        alert("Không thể kết nối Backend!");
      });
  };

  getSelectedMeeting = () => {
    const { selectedMeetingId, meetings } = this.state;
    return meetings.find(m => m.id === selectedMeetingId) || null;
  };

  render() {
    const { minuteForm, meetings, selectedMeetingId, loading, error } = this.state;
    const selectedMeeting = this.getSelectedMeeting();

    return (
      <div>
        <h1 className="page-title">
          Hospital OS - <span className="fw-semi-bold">Quản lý Giao ban</span>
        </h1>

        {error && (
          <Widget>
            <p style={{ color: "red" }}>Lỗi: {error}</p>
            <Button color="primary" onClick={this.fetchMeetings}>Thử lại</Button>
          </Widget>
        )}

        <Row>
          <Col lg={12} xs={12}>
            <Widget title={<h5>Danh sách biên bản giao ban ({meetings.length})</h5>}>
              {loading && <p>Đang tải...</p>}
              <Table responsive>
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>Ngày</th>
                    <th>Loại</th>
                    <th>Chủ tọa</th>
                    <th>Ký duyệt</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {meetings.length === 0 && !loading ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">Chưa có biên bản nào</td>
                    </tr>
                  ) : (
                    meetings.map((meeting) => (
                      <tr
                        key={meeting.id}
                        style={{
                          backgroundColor: selectedMeetingId === meeting.id ? "#e3f2fd" : "transparent",
                          cursor: "pointer"
                        }}
                        onClick={() => this.handleSelectMeeting(meeting.id)}
                      >
                        <td>{meeting.meetingCode}</td>
                        <td>{meeting.meetingDate}</td>
                        <td>{meeting.meetingType}</td>
                        <td>{meeting.chair}</td>
                        <td>
                          <span style={{
                            color: meeting.signStatus === "APPROVED" ? "green" :
                                   meeting.signStatus === "PENDING" ? "orange" : "gray"
                          }}>
                            {meeting.signStatus}
                          </span>
                        </td>
                        <td>
                          {meeting.signStatus !== "APPROVED" && (
                            <Button
                              size="sm"
                              color="success"
                              onClick={(e) => { e.stopPropagation(); this.handleApproveMeeting(meeting.id); }}
                            >
                              Ký duyệt
                            </Button>
                          )}
                          <Button
                            size="sm"
                            color="danger"
                            className="ml-2"
                            onClick={(e) => { e.stopPropagation(); this.handleDeleteMeeting(meeting.id); }}
                          >
                            Xóa
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
              <Button color="info" onClick={this.fetchMeetings}>Làm mới</Button>
            </Widget>
          </Col>
        </Row>

        <Row>
          <Col lg={8} xs={12}>
            <Widget title={<h5>Tạo biên bản giao ban mới</h5>}>
              <Row>
                <Col md={6} xs={12}>
                  <label className={s.formLabel}>Mã biên bản *</label>
                  <Input
                    type="text"
                    name="meetingCode"
                    value={minuteForm.meetingCode}
                    onChange={this.handleMinuteInputChange}
                    placeholder="VD: GB-2026-03-29-S"
                    className="mb-3"
                  />
                </Col>
                <Col md={6} xs={12}>
                  <label className={s.formLabel}>Ngày họp *</label>
                  <Input
                    type="date"
                    name="meetingDate"
                    value={minuteForm.meetingDate}
                    onChange={this.handleMinuteInputChange}
                    className="mb-3"
                  />
                </Col>
                <Col md={6} xs={12}>
                  <label className={s.formLabel}>Loại giao ban</label>
                  <Input
                    type="select"
                    name="meetingType"
                    value={minuteForm.meetingType}
                    onChange={this.handleMinuteInputChange}
                    className="mb-3"
                  >
                    <option>Giao ban sáng</option>
                    <option>Giao ban chiều</option>
                    <option>Giao ban tuần</option>
                    <option>Giao ban chuyên đề</option>
                  </Input>
                </Col>
                <Col md={6} xs={12}>
                  <label className={s.formLabel}>Chủ tọa *</label>
                  <Input
                    type="text"
                    name="chair"
                    value={minuteForm.chair}
                    onChange={this.handleMinuteInputChange}
                    placeholder="VD: BS. Nguyễn Văn Minh"
                    className="mb-3"
                  />
                </Col>
                <Col md={12} xs={12}>
                  <label className={s.formLabel}>Thành phần tham dự</label>
                  <Input
                    type="text"
                    name="attendees"
                    value={minuteForm.attendees}
                    onChange={this.handleMinuteInputChange}
                    placeholder="VD: Ban giám đốc, Trưởng khoa..."
                    className="mb-3"
                  />
                </Col>
              </Row>

              <label className={s.formLabel}>Báo cáo thường trực lãnh đạo/chuyên môn</label>
              <Input
                type="textarea"
                rows="3"
                className="mb-3"
                name="summaryReport"
                value={minuteForm.summaryReport}
                onChange={this.handleMinuteInputChange}
                placeholder="Nhập báo cáo..."
              />

              <label className={s.formLabel}>Tổng hợp cận lâm sàng</label>
              <Input
                type="textarea"
                rows="2"
                className="mb-3"
                name="labSummary"
                value={minuteForm.labSummary}
                onChange={this.handleMinuteInputChange}
                placeholder="Nhập tổng hợp cận lâm sàng..."
              />

              <label className={s.formLabel}>Kết luận giao ban *</label>
              <Input
                type="textarea"
                rows="3"
                className="mb-3"
                name="conclusion"
                value={minuteForm.conclusion}
                onChange={this.handleMinuteInputChange}
                placeholder="Nhập kết luận..."
              />

              <label className={s.formLabel}>Phiếu giao việc</label>
              <Input
                type="textarea"
                rows="3"
                className="mb-3"
                name="assignmentSheet"
                value={minuteForm.assignmentSheet}
                onChange={this.handleMinuteInputChange}
                placeholder="Khoa cấp cứu: Việc 1 | Khoa ngoại: Việc 2"
              />

              <Button
                color="success"
                onClick={this.handleSaveMinute}
                disabled={loading}
              >
                {loading ? "Đang lưu..." : "Lưu biên bản + phiếu giao việc"}
              </Button>
            </Widget>
          </Col>

          <Col lg={4} xs={12}>
            <Widget title={<h5>Chi tiết biên bản</h5>}>
              {selectedMeeting ? (
                <div>
                  <p><strong>Mã:</strong> {selectedMeeting.meetingCode}</p>
                  <p><strong>Ngày:</strong> {selectedMeeting.meetingDate}</p>
                  <p><strong>Loại:</strong> {selectedMeeting.meetingType}</p>
                  <p><strong>Chủ tọa:</strong> {selectedMeeting.chair}</p>
                  <p><strong>Thành phần:</strong> {selectedMeeting.attendees || "-"}</p>
                  <p><strong>Trạng thái:</strong> {selectedMeeting.signStatus}</p>
                  {selectedMeeting.summaryReport && (
                    <p><strong>Báo cáo:</strong><br/>{selectedMeeting.summaryReport}</p>
                  )}
                  {selectedMeeting.labSummary && (
                    <p><strong>Cận lâm sàng:</strong><br/>{selectedMeeting.labSummary}</p>
                  )}
                  <p><strong>Kết luận:</strong><br/>{selectedMeeting.conclusion}</p>
                  {selectedMeeting.assignmentSheet && (
                    <p><strong>Phiếu giao việc:</strong><br/>{selectedMeeting.assignmentSheet}</p>
                  )}
                </div>
              ) : (
                <p className="text-muted">Chọn một biên bản để xem chi tiết</p>
              )}
            </Widget>
          </Col>
        </Row>
      </div>
    );
  }
}

export default MeetingManagement;
