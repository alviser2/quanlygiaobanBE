import React from "react";
import { Row, Col, Card, CardBody, CardTitle, CardText, Button, Badge } from "reactstrap";
import Widget from "../../components/Widget";
import { staffMyTasks } from "./mockData";

class StaffMobile extends React.Component {
  render() {
    return (
      <div>
        <h1 className="page-title">
          Hospital OS - <span className="fw-semi-bold">Staff Mobile App</span>
        </h1>

        <Row>
          <Col lg={8} xs={12}>
            <Widget title={<h5>Việc của tôi (mobile view)</h5>}>
              {staffMyTasks.map((task) => (
                <Card key={task.title} className="mb-3">
                  <CardBody>
                    <CardTitle className="fw-semi-bold">{task.title}</CardTitle>
                    <CardText>
                      Deadline: <strong>{task.deadline}</strong>
                    </CardText>
                    <Badge color="info" className="mr-2">{task.status}</Badge>
                    <div className="mt-3">
                      <Button color="primary" size="sm" className="mr-2">Bắt đầu</Button>
                      <Button color="success" size="sm">Báo cáo</Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </Widget>
          </Col>

          <Col lg={4} xs={12}>
            <Widget title={<h5>Báo cáo đa phương tiện</h5>}>
              <p>- Chụp ảnh minh chứng hoàn thành công việc.</p>
              <p>- Ghi âm báo cáo và chuyển giọng nói thành văn bản (Voice-to-text).</p>
              <Button color="warning" block className="mb-2">Chụp ảnh minh chứng</Button>
              <Button color="secondary" block>Báo cáo giọng nói</Button>
            </Widget>
          </Col>
        </Row>
      </div>
    );
  }
}

export default StaffMobile;
