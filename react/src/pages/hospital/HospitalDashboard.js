import React from "react";
import { Row, Col, Table, Progress, Button, Input } from "reactstrap";
import Widget from "../../components/Widget";
import {
  assignedTasks,
  departmentKpi,
  meetingHistory,
} from "./mockData";
import s from "./HospitalDashboard.module.scss";

class HospitalDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskFilter: "all",
      tasks: assignedTasks.map((task) => ({ ...task })),
      emergencyDirective: "",
      directiveLog: [],
    };
  }

  getTaskCounts = () => {
    const { tasks } = this.state;
    const completed = tasks.filter((task) => task.status === "Đã hoàn thành").length;
    const overdue = tasks.filter((task) => task.status === "Quá hạn").length;
    const inProgress = tasks.filter((task) => task.status === "Đang triển khai").length;
    const notCompleted = tasks.length - completed;

    return {
      total: tasks.length,
      completed,
      overdue,
      inProgress,
      notCompleted,
    };
  };

  getFilteredTasks = () => {
    const { tasks, taskFilter } = this.state;

    switch (taskFilter) {
      case "not_completed":
        return tasks.filter((task) => task.status !== "Đã hoàn thành");
      case "completed":
        return tasks.filter((task) => task.status === "Đã hoàn thành");
      case "overdue":
        return tasks.filter((task) => task.status === "Quá hạn");
      case "in_progress":
        return tasks.filter((task) => task.status === "Đang triển khai");
      default:
        return tasks;
    }
  };

  setTaskFilter = (filterKey) => {
    this.setState({ taskFilter: filterKey });
  };

  handleTaskStatusToggle = (taskId) => {
    this.setState((prevState) => ({
      tasks: prevState.tasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        if (task.status === "Đã hoàn thành") {
          return {
            ...task,
            status: "Đang triển khai",
          };
        }

        return {
          ...task,
          status: "Đã hoàn thành",
        };
      }),
    }));
  };

  handleDirectiveChange = (event) => {
    this.setState({ emergencyDirective: event.target.value });
  };

  handleSendDirective = () => {
    this.setState((prevState) => {
      const trimmedDirective = prevState.emergencyDirective.trim();
      if (!trimmedDirective) {
        return null;
      }

      return {
        emergencyDirective: "",
        directiveLog: [
          {
            content: trimmedDirective,
            createdAt: new Date().toLocaleString("vi-VN"),
          },
          ...prevState.directiveLog,
        ].slice(0, 5),
      };
    });
  };

  getCardClassName = (cardFilter) => {
    const { taskFilter } = this.state;
    return `${s.statCard} ${taskFilter === cardFilter ? s.activeCard : ""}`;
  };

  getFilterButtonClass = (filterKey) => {
    const { taskFilter } = this.state;
    return `${s.filterBtn} ${taskFilter === filterKey ? s.filterBtnActive : ""}`;
  };

  render() {
    const {
      taskFilter,
      emergencyDirective,
      directiveLog,
    } = this.state;
    const { total, completed, overdue, inProgress, notCompleted } = this.getTaskCounts();
    const onTimeRate = total > 0 ? Math.round(((total - overdue) / total) * 100) : 0;
    const filteredTasks = this.getFilteredTasks();

    return (
      <div className={s.root}>
        <h1 className="page-title">
          Hospital OS - <span className="fw-semi-bold">Dashboard Giám đốc</span>
        </h1>

        <Row>
          <Col md={3} xs={12}>
            <Widget
              title={<h6>Tổng đầu việc</h6>}
              className={this.getCardClassName("all")}
            >
              <h2 className="fw-semi-bold">{total}</h2>
              <button
                type="button"
                className={s.cardAction}
                onClick={() => this.setTaskFilter("all")}
              >
                Xem tất cả công việc
              </button>
            </Widget>
          </Col>
          <Col md={3} xs={12}>
            <Widget
              title={<h6>Tỷ lệ đúng hạn</h6>}
              className={this.getCardClassName("overdue")}
            >
              <h2 className="fw-semi-bold">{onTimeRate}%</h2>
              <button
                type="button"
                className={s.cardAction}
                onClick={() => this.setTaskFilter("overdue")}
              >
                Xem công việc quá hạn
              </button>
            </Widget>
          </Col>
          <Col md={3} xs={12}>
            <Widget
              title={<h6>Chưa hoàn thành</h6>}
              className={this.getCardClassName("not_completed")}
            >
              <h2 className="fw-semi-bold">{notCompleted}</h2>
              <button
                type="button"
                className={s.cardAction}
                onClick={() => this.setTaskFilter("not_completed")}
              >
                Mở danh sách chưa hoàn thành
              </button>
            </Widget>
          </Col>
          <Col md={3} xs={12}>
            <Widget
              title={<h6>Đã hoàn thành</h6>}
              className={this.getCardClassName("completed")}
            >
              <h2 className="fw-semi-bold text-success">{completed}</h2>
              <button
                type="button"
                className={s.cardAction}
                onClick={() => this.setTaskFilter("completed")}
              >
                Xem công việc đã xong
              </button>
            </Widget>
          </Col>
        </Row>

        <Row>
          <Col lg={12} xs={12}>
            <Widget title={<h5 className={s.taskSectionTitle}>Quản lý công việc điều hành</h5>}>
              <div className={s.taskToolbar}>
                <div className={s.quickFilters}>
                  <Button
                    size="sm"
                    color={taskFilter === "all" ? "primary" : "secondary"}
                    className={this.getFilterButtonClass("all")}
                    onClick={() => this.setTaskFilter("all")}
                  >
                    Tất cả ({total})
                  </Button>
                  <Button
                    size="sm"
                    color={taskFilter === "not_completed" ? "warning" : "secondary"}
                    className={this.getFilterButtonClass("not_completed")}
                    onClick={() => this.setTaskFilter("not_completed")}
                  >
                    Chưa hoàn thành ({notCompleted})
                  </Button>
                  <Button
                    size="sm"
                    color={taskFilter === "in_progress" ? "info" : "secondary"}
                    className={this.getFilterButtonClass("in_progress")}
                    onClick={() => this.setTaskFilter("in_progress")}
                  >
                    Đang triển khai ({inProgress})
                  </Button>
                  <Button
                    size="sm"
                    color={taskFilter === "overdue" ? "danger" : "secondary"}
                    className={this.getFilterButtonClass("overdue")}
                    onClick={() => this.setTaskFilter("overdue")}
                  >
                    Quá hạn ({overdue})
                  </Button>
                  <Button
                    size="sm"
                    color={taskFilter === "completed" ? "success" : "secondary"}
                    className={this.getFilterButtonClass("completed")}
                    onClick={() => this.setTaskFilter("completed")}
                  >
                    Đã hoàn thành ({completed})
                  </Button>
                </div>
              </div>
              <Table responsive className={s.taskTable}>
                <thead>
                  <tr>
                    <th>Mã việc</th>
                    <th>Nội dung</th>
                    <th>Người phụ trách</th>
                    <th>Hạn xử lý</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.id}</td>
                      <td>{task.content}</td>
                      <td>{task.assignee}</td>
                      <td>{task.deadline}</td>
                      <td>
                        <span
                          className={`${s.statusBadge} ${
                            task.status === "Đã hoàn thành"
                              ? s.statusCompleted
                              : task.status === "Quá hạn"
                              ? s.statusOverdue
                              : task.status === "Đang triển khai"
                              ? s.statusInProgress
                              : s.statusAssigned
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          color={task.status === "Đã hoàn thành" ? "secondary" : "success"}
                          onClick={() => this.handleTaskStatusToggle(task.id)}
                        >
                          {task.status === "Đã hoàn thành" ? "Mở lại" : "Hoàn thành"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredTasks.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        Không có công việc theo bộ lọc hiện tại.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Widget>
          </Col>
        </Row>

        <Row>
          <Col lg={8} xs={12}>
            <Widget title={<h5>Biểu đồ KPI các khoa/phòng (dạng bảng)</h5>}>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Khoa/Phòng</th>
                    <th>Khối lượng việc</th>
                    <th>Tỷ lệ đúng hạn</th>
                    <th>Đánh giá lãnh đạo</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentKpi.map((item) => (
                    <tr key={item.name}>
                      <td>{item.name}</td>
                      <td>
                        <Progress value={item.workload} color="primary" className="mb-1" />
                        {item.workload}%
                      </td>
                      <td>
                        <Progress value={item.onTimeRate} color="success" className="mb-1" />
                        {item.onTimeRate}%
                      </td>
                      <td>{item.leadershipScore}/10</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Widget>
          </Col>

          <Col lg={4} xs={12}>
            <Widget title={<h5>Chỉ đạo khẩn</h5>}>
              <Input
                type="textarea"
                rows="5"
                placeholder="Nhập chỉ đạo khẩn: ví dụ tăng cường trực cấp cứu tối nay..."
                className="mb-3"
                value={emergencyDirective}
                onChange={this.handleDirectiveChange}
              />
              <Button
                color="danger"
                block
                disabled={!emergencyDirective.trim()}
                onClick={this.handleSendDirective}
              >
                Phát lệnh ngay
              </Button>
              {directiveLog.length > 0 && (
                <div className={s.directiveHistory}>
                  <h6 className="mt-3">Lệnh vừa phát</h6>
                  <ul className={s.directiveList}>
                    {directiveLog.map((directive) => (
                      <li key={`${directive.createdAt}-${directive.content}`}>
                        <span>{directive.content}</span>
                        <small>{directive.createdAt}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Widget>
          </Col>
        </Row>

        <Row>
          <Col lg={12} xs={12}>
            <Widget title={<h5>Theo dõi nhanh giao ban sáng</h5>}>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Mã cuộc họp</th>
                    <th>Ngày</th>
                    <th>Loại</th>
                    <th>Chủ tọa</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {meetingHistory.map((meeting) => (
                    <tr key={meeting.id}>
                      <td>{meeting.id}</td>
                      <td>{meeting.date}</td>
                      <td>{meeting.type}</td>
                      <td>{meeting.chair}</td>
                      <td>{meeting.signStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Widget>
          </Col>
        </Row>
      </div>
    );
  }
}

export default HospitalDashboard;
