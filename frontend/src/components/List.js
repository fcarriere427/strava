import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap'
import { ActivitySummaryWithNavigate } from './List/ActivitySummary'
import { SelectYear } from './List/SelectYear'
import { strSpeed } from '../utils/functions'

import axios from 'axios';

class List extends Component {
  constructor(props){
    super(props);
    this.state = {
      activitiesList: [],
      currentYear:new Date().getFullYear().toString(), //"*** All ***" si on veut afficher toutes les années par défaut
      stats: {
        count:0,
        totalDistance:0,
        totalDuration:0
      },
      isLoading: true // état de chargement
    };
  }

  componentDidMount(){
    this.getActivities(this.state.currentYear)
  }

  // Actions quand on modifie la cible
  updateYear(evt) {
    const year = evt.target.value === "*** All ***" ? "all" : evt.target.value;
    // bien penser à l'asynchrone...
    this.setState({ currentYear: evt.target.value }, () => {
      this.getActivities(year)
    })
  }

  calculateStats(activities) {
    const stats = {
      count: activities.length,
      totalDistance: activities.reduce((sum, activity) => sum + activity.doc.distance, 0),
      totalDuration: activities.reduce((sum, activity) => sum + activity.doc.moving_time, 0)
    };
    this.setState({ stats });
  }

  // Récupération des activités pour l'année donnée
  getActivities(year) {
    let url = year === "all" 
      ? '/api/strava/activities_list' 
      : '/api/strava/activities_list?year=' + year;
      
    axios.get(url)
      .then(response => { 
        const activities = response.data;
        this.setState({ 
          activitiesList: activities,
          isLoading: false 
        }, () => {
          this.calculateStats(activities);
        });
      })
      .catch(error => {
        console.error("API error:", error);
        this.setState({ isLoading: false });
      });
  }


  render() {
    if (this.state.isLoading) {
      return <div>Loading...</div>;
    }

    const { stats } = this.state;

    return (
      <Container fluid className='bg-grey text-black text-center'>
      
        {/* Year selector */}
        <Row className="py-2">
          <SelectYear currentYear={this.state.currentYear} updateHandler={(evt) => this.updateYear(evt)} />
        </Row>

        {/* Stats summary */}
        <Row className="py-3 bg-info">
          <Col>
            <strong>{stats.count}</strong> activités
          </Col>
          <Col>
            <strong>{(Math.round(stats.totalDistance / 1000 * 10) / 10).toLocaleString('fr-FR')}</strong> km
          </Col>
          <Col>
            <strong>{Math.floor(stats.totalDuration / 3600)}</strong>h <strong>{Math.floor((stats.totalDuration % 3600) / 60)}</strong>m
          </Col>
          <Col>
            <strong>{strSpeed(stats.totalDistance / stats.totalDuration)}</strong>
          </Col>
        </Row>

        {/* Activities list */}
        <Row className="py-3 bg-info">
          {this.state.activitiesList.map((d, index) =>
          <ActivitySummaryWithNavigate data={d} key={index} />
          )}
        </Row>
  
      </Container>
    );
  }
}

export default List;
