import React, { Component } from 'react'
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from 'reactstrap'
import { strTime, strSpeed } from '../../utils/functions'

///////////////////////////////////////////////////////////////////////////////////////////////
class ActivitySummary extends Component {
  constructor(props){
    super(props);
    this.state = {};
   }

  handleClick = () => {
    this.props.navigate(`/activity/${this.props.data.doc.id}`);
  };

  render(){
    let newDate = new Date(this.props.data.doc.start_date_local);
    let date_str = newDate.toLocaleDateString('fr-FR')
    let time = newDate.toLocaleTimeString('fr-FR')
    let time_str = ' à ' + time.substring(0, time.length - 3); // on enlève les secondes

    return(
      <Container className="bg-light text-black border">
        <Row className="align-items-center">
          <Col className="fw-bold" xs="3">
            <p> 
              <button
                className="btn btn-link border-0 shadow-none" 
                onClick={this.handleClick}>
                  {date_str}
                </button>
              <span className="fw-light"><br/>{time_str}</span>
            </p>
          </Col>
          <Col  className="fw-bold text-end" xs="2">
            <p>{(Math.round(this.props.data.doc.distance / 1000 * 100) / 100).toLocaleString('fr-FR')} km</p>
          </Col>
          <Col className="text-end" xs="2">
            <p>{strTime(this.props.data.doc.moving_time)}</p>
          </Col>
          <Col className="text-end" xs="2">
            <p>{strSpeed(this.props.data.doc.average_speed)}</p>
          </Col>
          <Col className="fw-light text-start" xs="3">
            <p>{this.props.data.doc.name}</p>
          </Col>
        </Row>  
      </Container>
    )
  }
}

// Wrapper pour fournir navigate au composant de classe
function ActivitySummaryWithNavigate(props) {
  const navigate = useNavigate();
  return <ActivitySummary {...props} navigate={navigate} />;
}

///////////////////////////////////////////////////////////////////////////////////////////////
export {
  ActivitySummaryWithNavigate
}
