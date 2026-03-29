import React from "react";
import { Row, Col, Table } from "reactstrap";
import Widget from "../../components/Widget";
import { dutyRoster, maintenanceList, departmentKpi } from "./mockData";

class DepartmentsKPI extends React.Component {
  render() {
    return (
      <div>
        <h1 className="page-title">
          Hospital OS - <span className="fw-semi-bold">Khoa/Phòng & KPI</span>
        </h1>

        <Row>
          <Col lg={12} xs={12}>
            <Widget title={<h5>Quản lý hành chính khoa - Danh sách trực</h5>}>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Khoa</th>
                    <th>Ca trực</th>
                    <th>Bác sĩ</th>
                    <th>Điều dưỡng</th>
                    <th>Hộ lý</th>
                  </tr>
                </thead>
                <tbody>
                  {dutyRoster.map((row) => (
                    <tr key={`${row.department}-${row.shift}`}>
                      <td>{row.department}</td>
                      <td>{row.shift}</td>
                      <td>{row.doctor}</td>
                      <td>{row.nurse}</td>
                      <td>{row.orderly}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Widget>
          </Col>
        </Row>

        <Row>
          <Col lg={6} xs={12}>
            <Widget title={<h5>Bảo trì thiết bị</h5>}>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Thiết bị</th>
                    <th>Sự cố</th>
                    <th>Trạng thái</th>
                    <th>ETA</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceList.map((item) => (
                    <tr key={item.equipment}>
                      <td>{item.equipment}</td>
                      <td>{item.issue}</td>
                      <td>{item.status}</td>
                      <td>{item.eta}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Widget>
          </Col>

          <Col lg={6} xs={12}>
            <Widget title={<h5>Chấm điểm KPI tháng</h5>}>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Khoa/Phòng</th>
                    <th>Khối lượng việc</th>
                    <th>Tỷ lệ đúng hạn</th>
                    <th>Điểm lãnh đạo</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentKpi.map((item) => (
                    <tr key={item.name}>
                      <td>{item.name}</td>
                      <td>{item.workload}%</td>
                      <td>{item.onTimeRate}%</td>
                      <td>{item.leadershipScore}</td>
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

export default DepartmentsKPI;
