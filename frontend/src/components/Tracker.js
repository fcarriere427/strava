import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { GaugeChart } from './Tracker/Gauge'
import { StatsBar } from './Tracker/StatsBar'
import { TargetBlock } from './Tracker/TargetBlock'
import { UpdateBar } from './Tracker/UpdateBar'
import { targetManager } from '../utils/targetManager';

import axios from 'axios';

class Tracker extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentTarget: targetManager.get(),
      yearDistance: 0,  // Nombre au lieu de string
      isLoading: true
     };
  }

  componentDidMount(){
    // console.log("Montage du composant");
    this.updateYearDistance();
  }

  updateYearDistance() {
    this.setState({ isLoading: true });
    let url = '/api/strava/year_distances';
    let year = new Date().getFullYear().toString();
    axios.get(url)
    .then(
      (response) => {
        // Conversion explicite en nombre et vérification
        const distance = parseFloat(response.data[year]) || 0;
        // console.log("Distance reçue:", distance, typeof distance); // Debug
        this.setState({ 
          yearDistance: distance,
          isLoading: false
        });
      },
      (error) => {
        console.log("ERREUR de l'API  : " + error);
        this.setState({ isLoading: false });
      }
    )
  }

  // Actions quand on modifie la cible
  updateTarget(evt) {
    const newTarget = parseInt(evt.target.value);
    targetManager.set(newTarget);  // Sauvegarde dans localStorage
    this.setState({
      currentTarget: newTarget
    });
  }

  resetTarget() {
    const target = 1000;
    targetManager.set(target);  // Sauvegarde dans localStorage
    this.setState({
      currentTarget: target
    });
  }
  render() {
    // console.log("Rendu avec yearDistance:", this.state.yearDistance);
    return (
      <Container fluid className='bg-grey text-black text-center'>
        <Row className='mt-3 mb-3'>
          <Col xs="6">
            <GaugeChart current={this.state.yearDistance} target={this.state.currentTarget}/>
          </Col>
          <Col xs="6">
            <TargetBlock value={this.state.currentTarget} updateHandler={(evt) => this.updateTarget(evt)} resetHandler={(evt) => this.resetTarget()} />
          </Col>
        </Row>

        <Row className='mt-3 mb-3'>
          <StatsBar current={this.state.yearDistance} target={this.state.currentTarget} />
        </Row>

        <Row className='mt-3 mb-3'>
          <UpdateBar onChange={() => this.updateYearDistance()} />
        </Row>

      </Container>
    );
  }
}

export default Tracker;
