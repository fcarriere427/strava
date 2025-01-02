import React from 'react';
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from 'reactstrap';
import { strTime, strSpeed } from '../../utils/functions';

const ActivitySummary = ({ data, searchParams }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/activity/${data.doc.id}?${searchParams.toString()}`);
  };

  const newDate = new Date(data.doc.start_date_local);
  const date_str = newDate.toLocaleDateString('fr-FR');
  const time = newDate.toLocaleTimeString('fr-FR');
  const time_str = ' à ' + time.substring(0, time.length - 3); // on enlève les secondes

  return (
    <Container className="bg-light text-black border">
      <Row className="align-items-center">
        <Col className="fw-bold" md="1" xs="4">
          <p>
            <button
              className="btn btn-link border-0 shadow-none p-0"
              onClick={handleClick}
            >
              {date_str}
            </button>
            <span className="fw-light text-center"><br/>{time_str}</span>
          </p>
        </Col>
        <Col className="fw-bold text-end" md="1" xs="4">
          <p>{(Math.round(data.doc.distance / 1000 * 100) / 100).toLocaleString('fr-FR')} km</p>
        </Col>
        <Col className="fw-bold text-end" md="1" xs="4">
          <p>{strTime(data.doc.moving_time)}</p>
        </Col>
        <Col md="1" xs="4">
          <p>{strSpeed(data.doc.average_speed)}</p>
        </Col>
        <Col md="1" xs="4">
          <p>{data.doc.weighted_average_watts} W</p>
        </Col>
        <Col className="fw-light" md="2" xs="4">
          <p>{data.doc.name}</p>
        </Col>
        <Col className="fw-light" md="2" xs="4">
          <p>{data.doc.location_city}</p>
        </Col>
        <Col className="fw-light" md="2" xs="4">
          <p>{data.doc.location_state}</p>
        </Col>
        <Col className="fw-light" md="1" xs="4">
          <p>{data.doc.location_country}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default ActivitySummary;