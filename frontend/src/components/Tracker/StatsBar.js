import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { targetToDate, daysInYear } from '../../utils/functions'

///////////////////////////////////////////////////////////////////////////////////////////////
class StatsBar extends Component {
  render(){
    // pour les distances
    let target_date = targetToDate(this.props.target);
    // pour les gaps
    let delta_km = Math.round((this.props.current - target_date)*10)/10;
    let year = new Date().getFullYear().toString();
    let delta_days = Math.round(delta_km / this.props.target * daysInYear(year)*10)/10;
    // pour les targets
    let today = new Date();
    let start = new Date(today.getFullYear(), 0, 0);
    let diff = today - start;
    let day = Math.floor(diff / (1000 * 60 * 60 * 24)); // calcul = secondes dans 1 jour
    let remain_days = 365 - day ; // à partir du lendemain
    let new_avg_day = Math.round((this.props.target - this.props.current)/remain_days*100)/100;
    let new_avg_week = Math.round(new_avg_day * 7 * 10)/10;

    return(
      <Container fluid className='bg-grey text-black text-center'>
        {/* Ligne des distances */}
        <Row className="bg-secondary text-white py-2">
          <Col xs="2">
            <div>
              <p className="fw-light text-black"><i>Distances</i></p>
            </div>
          </Col>
          <Col xs="5">
            <div>
              <p>Current:<br/> {this.props.current} km</p>
            </div>
          </Col>
          <Col xs="5">
            <div>
              <p>Target:<br/> {target_date} km</p>
            </div>
          </Col>
        </Row>
        {/* Ligne des gaps */}
        <Row className="bg-secondary text-white py-2">
          <Col xs="2">
            <div>
              <p className="fw-light text-black"><i>Gaps</i></p>
            </div>
          </Col>
          <Col xs="5">
            <div>
              <p>{delta_km} km</p>
            </div>
          </Col>
          <Col xs="5">
            <div>
              <p>{delta_days} days</p>
            </div>
          </Col>
        </Row>
        {/* Ligne des new targets */}
        <Row className="bg-secondary text-white py-2">
          <Col xs="2">
            <div>
              <p className="fw-light text-black"><i>New target</i></p>
            </div>
          </Col>
          <Col xs="5">
            <div>
              <p>Day:<br/> {new_avg_day} km</p>
            </div>
          </Col>
          <Col xs="5">
            <div>
              <p>Week:<br/> {new_avg_week} km</p>
            </div>
          </Col>
        </Row>
        {/* Ligne des remaining days */}
        <Row className="bg-secondary text-white py-2">
          <div>
            <p className="fw-light text-black">Remaining days: {remain_days} days</p>
          </div>
        </Row>
      </Container>
    )
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////
export {
  StatsBar
}
