import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap'
import { useParams } from 'react-router-dom';
import { strTime, strDate, strSpeed } from "../utils/functions"
import Map from "./Activity/Map";
const axios = require('axios').default;

const Activity = () => {
  const { id } = useParams(); // Récupère le paramètre id de l'URL
  const [activity, setActivity] = useState({
    start_latlng: [0, 0],
    map: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const getActivity = async () => {
      try {
        const url = '/api/strava/activity?id=' + id;
        const response = await axios.get(url);
        setActivity(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log("ERREUR de l'API  : " + error);
        setIsLoading(false);
      }
    }

    getActivity();
  }, [id]);
  
  if (this.state.isLoading) {
    return <div>Loading...</div>;
  }
    
  return(
    <div>
      <Container fluid className='bg-light text-black border'>
        <Row>
          {/* Colonne avec la map */}
          <Col xs="12" md="8" className="p-0 h-100">
            <Map activity = {activity}/>
          </Col>
          {/* Colonne avec les détails */}
          <Col xs="11" md="3" className="p-0 h-100">
            <Row className="bg-primary text-white border ps-3">{strDate(activity)}</Row>
            <Row className="bg-primary text-white border ps-3">{activity.name}</Row>
            <Row className="bg-secondary text-white border ps-3">Distance: {Math.round(activity.distance / 1000 * 100) / 100}km</Row>
            <Row className="bg-secondary text-white border ps-3">Moving time: {strTime(activity.moving_time)}</Row>
            <Row className="bg-secondary text-white border ps-3">Average speed: {strSpeed(activity.average_speed)}</Row>
            <Row className="bg-secondary text-white border ps-3">Weighted average power: {activity.weighted_average_watts}W</Row>
            <Row className="bg-light border ps-3">Average heartrate: {activity.average_heartrate ? this.state.activity.average_heartrate : "N/A"}</Row>
            <Row className="bg-light border ps-3">Elevation gain: {activity.total_elevation_gain}m</Row>
            <Row className="bg-white fw-light border ps-3">Elapsed time: {strTime(activity.elapsed_time)}</Row>
            <Row className="bg-white fw-light border ps-3">Max speed: {strSpeed(activity.max_speed)}</Row>
            <Row className="bg-white fw-light border ps-3">Max heartrate: {activity.max_heartrate ? this.state.activity.max_heartrate : "N/A"}</Row>
            <Row className="bg-white fw-light border ps-3">Average power: {activity.average_watts}</Row>
            <Row className="bg-white fw-light border ps-3">Max power: {activity.max_watts}</Row>
            <Row className="bg-white fw-light border ps-3">Energie (kJ): {activity.kilojoules}</Row>
            <Row className="bg-white fw-light border ps-3">Max elevation: {activity.elev_high}m</Row>
            <Row className="bg-white fw-light border ps-3">Min elevation: {activity.elev_low}m</Row>
            <Row className="bg-white fw-light border ps-3">Average cadence: {activity.average_cadence ?this.state.activity.average_cadence : "N/A"}</Row>
            <Row className="bg-white fw-light border ps-3">City: {activity.location_city}</Row>
            <Row className="bg-white fw-light border ps-3">Region: {activity.location_state}</Row>
            <Row className="bg-white fw-light border ps-3">Country: {activity.location_country}</Row>
            <Row className="bg-white fw-light border ps-3">Id: {activity.id}</Row>
            {/* <Row><button onClick={handleBack}>Retour à la liste</button></Row> */}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Activity;