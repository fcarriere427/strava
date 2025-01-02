import React, { useState, useNavigate, useLocation } from 'react';
import { Container, Row, Col } from 'reactstrap'
import { useParams } from 'react-router-dom';
import { strTime, strDate, strSpeed } from "../utils/functions"
import Map from "./Activity/Map";
const axios = require('axios').default;

const Activity = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const returnParams = new URLSearchParams(search).get('return');
  const [activity, setActivity] = useState({
    start_latlng: [0, 0], // Default value
    map: {} // Default value
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const getActivity = useCallback(async (id) => {
    try{
      const url = '/api/strava/activity?id=' + id;
      const response = await axios.get(url);
      setActivity(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("API error:", error);
      setIsLoading(false);
    }
  });

  // Effet initial pour charger les activités
  useEffect(() => {
    getActivity(id);
  }, [activity, getActivity]);

  const handleBack = useCallback(() => {
    if (returnParams) {
      navigate(`/list${returnParams}`);
    } else {
      navigate('/list');
    }
  });

  if (this.state.isLoading) {
    return <div>Loading...</div>;
  }
    
  return(
    <div>
      <Container fluid className='bg-light text-black border'>
        <Row>
          {/* Colonne avec la map */}
          <Col xs="12" md="8" className="p-0 h-100">
            <Map activity = {this.state.activity}/>
          </Col>
          {/* Colonne avec les détails */}
          <Col xs="11" md="3" className="p-0 h-100">
            <Row className="bg-primary text-white border ps-3">{strDate(this.state.activity)}</Row>
            <Row className="bg-primary text-white border ps-3">{this.state.activity.name}</Row>
            <Row className="bg-secondary text-white border ps-3">Distance: {Math.round(this.state.activity.distance / 1000 * 100) / 100}km</Row>
            <Row className="bg-secondary text-white border ps-3">Moving time: {strTime(this.state.activity.moving_time)}</Row>
            <Row className="bg-secondary text-white border ps-3">Average speed: {strSpeed(this.state.activity.average_speed)}</Row>
            <Row className="bg-secondary text-white border ps-3">Weighted average power: {this.state.activity.weighted_average_watts}W</Row>
            <Row className="bg-light border ps-3">Average heartrate: {this.state.activity.average_heartrate ? this.state.activity.average_heartrate : "N/A"}</Row>
            <Row className="bg-light border ps-3">Elevation gain: {this.state.activity.total_elevation_gain}m</Row>
            <Row className="bg-white fw-light border ps-3">Elapsed time: {strTime(this.state.activity.elapsed_time)}</Row>
            <Row className="bg-white fw-light border ps-3">Max speed: {strSpeed(this.state.activity.max_speed)}</Row>
            <Row className="bg-white fw-light border ps-3">Max heartrate: {this.state.activity.max_heartrate ? this.state.activity.max_heartrate : "N/A"}</Row>
            <Row className="bg-white fw-light border ps-3">Average power: {this.state.activity.average_watts}</Row>
            <Row className="bg-white fw-light border ps-3">Max power: {this.state.activity.max_watts}</Row>
            <Row className="bg-white fw-light border ps-3">Energie (kJ): {this.state.activity.kilojoules}</Row>
            <Row className="bg-white fw-light border ps-3">Max elevation: {this.state.activity.elev_high}m</Row>
            <Row className="bg-white fw-light border ps-3">Min elevation: {this.state.activity.elev_low}m</Row>
            <Row className="bg-white fw-light border ps-3">Average cadence: {this.state.activity.average_cadence ?this.state.activity.average_cadence : "N/A"}</Row>
            <Row className="bg-white fw-light border ps-3">City: {this.state.activity.location_city}</Row>
            <Row className="bg-white fw-light border ps-3">Region: {this.state.activity.location_state}</Row>
            <Row className="bg-white fw-light border ps-3">Country: {this.state.activity.location_country}</Row>
            <Row className="bg-white fw-light border ps-3">Id: {this.state.activity.id}</Row>
            <Row><button onClick={handleBack}>Retour à la liste</button></Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Activity;

// class Activity extends Component {

//   constructor(props){
//     super(props);
//     this.state = {
//       activity: {
//         start_latlng: [0, 0], // Default value
//         map: {} // Default value
//       },
//       isLoading: true // état de chargement
//     };
//   }

//   componentDidMount(){
//     this.getActivity(this.props.id);
//   }

//   getActivity(id) {
//     let url = '/api/strava/activity?id=' + id;
//     axios.get(url)
//     .then(
//       (response) => { 
//         this.setState({ 
//           activity: response.data,
//           isLoading: false // données chargées
//         })
//       },
//       (error) => { 
//         console.log("ERREUR de l'API  : " + error);
//         this.setState({ isLoading: false });
//       }
//     )
//   }

//   // Référence, ce qu'on peut afficher (= récupéré dans Activity) : https://developers.strava.com/docs/reference/#api-models-SummaryActivity
//   render() {
    
//     if (this.state.isLoading) {
//       return <div>Loading...</div>;
//     }
    
//     return(
//       <div>
//         <Container fluid className='bg-light text-black border'>
//           <Row>
//             {/* Colonne avec la map */}
//             <Col xs="12" md="8" className="p-0 h-100">
//               <Map activity = {this.state.activity}/>
//             </Col>
//             {/* Colonne avec les détails */}
//             <Col xs="11" md="3" className="p-0 h-100">
//               <Row className="bg-primary text-white border ps-3">{strDate(this.state.activity)}</Row>
//               <Row className="bg-primary text-white border ps-3">{this.state.activity.name}</Row>
//               <Row className="bg-secondary text-white border ps-3">Distance: {Math.round(this.state.activity.distance / 1000 * 100) / 100}km</Row>
//               <Row className="bg-secondary text-white border ps-3">Moving time: {strTime(this.state.activity.moving_time)}</Row>
//               <Row className="bg-secondary text-white border ps-3">Average speed: {strSpeed(this.state.activity.average_speed)}</Row>
//               <Row className="bg-secondary text-white border ps-3">Weighted average power: {this.state.activity.weighted_average_watts}W</Row>
//               <Row className="bg-light border ps-3">Average heartrate: {this.state.activity.average_heartrate ? this.state.activity.average_heartrate : "N/A"}</Row>
//               <Row className="bg-light border ps-3">Elevation gain: {this.state.activity.total_elevation_gain}m</Row>
//               <Row className="bg-white fw-light border ps-3">Elapsed time: {strTime(this.state.activity.elapsed_time)}</Row>
//               <Row className="bg-white fw-light border ps-3">Max speed: {strSpeed(this.state.activity.max_speed)}</Row>
//               <Row className="bg-white fw-light border ps-3">Max heartrate: {this.state.activity.max_heartrate ? this.state.activity.max_heartrate : "N/A"}</Row>
//               <Row className="bg-white fw-light border ps-3">Average power: {this.state.activity.average_watts}</Row>
//               <Row className="bg-white fw-light border ps-3">Max power: {this.state.activity.max_watts}</Row>
//               <Row className="bg-white fw-light border ps-3">Energie (kJ): {this.state.activity.kilojoules}</Row>
//               <Row className="bg-white fw-light border ps-3">Max elevation: {this.state.activity.elev_high}m</Row>
//               <Row className="bg-white fw-light border ps-3">Min elevation: {this.state.activity.elev_low}m</Row>
//               <Row className="bg-white fw-light border ps-3">Average cadence: {this.state.activity.average_cadence ?this.state.activity.average_cadence : "N/A"}</Row>
//               <Row className="bg-white fw-light border ps-3">City: {this.state.activity.location_city}</Row>
//               <Row className="bg-white fw-light border ps-3">Region: {this.state.activity.location_state}</Row>
//               <Row className="bg-white fw-light border ps-3">Country: {this.state.activity.location_country}</Row>
//               <Row className="bg-white fw-light border ps-3">Id: {this.state.activity.id}</Row>
//               <Row className="bg-white fw-light border ps-3"><button onClick={handleBack}>Retour à la liste</button></Row>
//             </Col>
//           </Row>
//         </Container>
//       </div>
//     );
//   }
// }

// // Wrapper qui utilise useParams et passe l'id à Activity
// function ActivityWrapper() {
//   const { id } = useParams();
//   return <Activity id={id} />;
// }

// export default ActivityWrapper;
