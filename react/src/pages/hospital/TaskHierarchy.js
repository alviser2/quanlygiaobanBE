import React from "react";
import { Row, Col, Table, Badge } from "reactstrap";
import Widget from "../../components/Widget";
import { hierarchy } from "./mockData";

const statusColor = (status) => {
  if (status === "Đã hoàn thành") return "success";
  if (status === "Đang triển khai") return "primary";
  if (status === "Quá hạn") return "danger";
  return "warning";
};

class TaskHierarchy extends React.Component {
  render() {
    return (
      <div>
        <h1 className="page-title">
          Hospital OS - <span className="fw-semi-bold">Task Hierarchy</span>
        </h1>

        <Row>
          <Col lg={12} xs={12}>
            <Widget title={<h5>Cây phân cấp công việc</h5>}>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Dự án gốc (Giám đốc)</th>
                    <th>Nhiệm vụ thành phần (PGĐ)</th>
                    <th>Việc cụ thể (Khoa/Phòng)</th>
                    <th>Người thực hiện</th>
                    <th>Trạng thái</th>
                    <th>Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {hierarchy.map((item) => (
                    <tr key={`${item.project}-${item.assignee}`}>
                      <td>{item.project}</td>
                      <td>{item.deputy}</td>
                      <td>{item.departmentTask}</td>
                      <td>{item.assignee}</td>
                      <td>
                        <Badge color={statusColor(item.status)}>{item.status}</Badge>
                      </td>
                      <td>{item.deadline}</td>
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

export default TaskHierarchy;
