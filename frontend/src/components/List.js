import React, { useState, useCallback, useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap'
import { ActivitySummaryWithNavigate } from './List/ActivitySummary'
import { SelectYear } from './List/SelectYear'
import LocationFilters from './List/LocationFilters'
import { strSpeed } from '../utils/functions'
import axios from 'axios';

const List = () => {
  const [allActivities, setAllActivities] = useState([]); // Toutes les activités non filtrées
  const [filteredActivities, setFilteredActivities] = useState([]); // Activités après filtrage
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear().toString());
  const [locationFilters, setLocationFilters] = useState({
    city: 'all',
    region: 'all',
    country: 'all'
  });
  const [stats, setStats] = useState({
    count: 0,
    totalDistance: 0,
    totalDuration: 0,
    averagePower: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const calculateStats = useCallback((activities) => {
    if (activities.length === 0) {
      setStats({
        count: 0,
        totalDistance: 0,
        totalDuration: 0,
        averagePower: 0
      });
      return;
    }
    setStats({
      count: activities.length,
      totalDistance: activities.reduce((sum, activity) => sum + activity.doc.distance, 0),
      totalDuration: activities.reduce((sum, activity) => sum + activity.doc.moving_time, 0),
      averagePower: Math.round(activities.reduce((sum, activity) => sum + activity.doc.weighted_average_watts, 0) / activities.length)
    });
  }, []);

  const getActivities = useCallback(async (year) => {
    try{
      const url = year === "all" 
        ? '/api/strava/activities_list' 
        : `/api/strava/activities_list?year=${year}`;
      const response = await axios.get(url);
      setAllActivities(response.data);
      setFilteredActivities(response.data);
      calculateStats(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("API error:", error);
      setIsLoading(false);
    }
  }, [calculateStats]);
      
   // Appliquer les filtres sur les activités
   const applyFilters = useCallback(() => {
    let filtered = [...allActivities];

    if (locationFilters.city !== 'all') {
      filtered = filtered.filter(activity => 
        activity.doc.location_city === locationFilters.city
      );
    }
    if (locationFilters.region !== 'all') {
      filtered = filtered.filter(activity => 
        activity.doc.location_state === locationFilters.region
      );
    }
    if (locationFilters.country !== 'all') {
      filtered = filtered.filter(activity => 
        activity.doc.location_country === locationFilters.country
      );
    }
    setFilteredActivities(filtered);
    calculateStats(filtered);
  }, [allActivities, locationFilters, calculateStats]);

  // Effet pour appliquer les filtres quand ils changent
  useEffect(() => {
    applyFilters();
  }, [locationFilters, applyFilters]);

  // Effet initial pour charger les activités
  useEffect(() => {
    getActivities(currentYear);
  }, [currentYear, getActivities]);

  const handleYearChange = useCallback((evt) => {
    const value = evt.target.value;
    const year = value === "*** All ***" ? "all" : value;
    setCurrentYear(value);
    getActivities(year);
  }, [getActivities]);

  const handleLocationFilterChange = useCallback((filters) => {
    setLocationFilters(filters);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container fluid className='bg-grey text-black text-center'>
      <Row className="py-2">
        <SelectYear 
          currentYear={currentYear} 
          updateHandler={handleYearChange}
        />
      </Row>

      <LocationFilters
        activities={allActivities}
        onFilterChange={handleLocationFilterChange}
      />

      <Row className="py-3 bg-info">
        <Col><strong>{stats.count || 0}</strong> activités</Col>
        <Col><strong>{(Math.round(stats.totalDistance / 1000 * 10) / 10).toLocaleString('fr-FR') || 0}</strong> km</Col>
        <Col><strong>{Math.floor(stats.totalDuration / 3600)}</strong>h <strong>{Math.floor((stats.totalDuration % 3600) / 60) || 0}</strong>m</Col>
        <Col><strong>{strSpeed(stats.totalDistance / stats.totalDuration) || 0}</strong></Col>
        <Col><strong>{stats.averagePower || 0}</strong> W</Col>
      </Row>

      <Row className="py-3 bg-info">
        {filteredActivities.map((d, index) =>
          <ActivitySummaryWithNavigate data={d} key={index} />
        )}
      </Row>
    </Container>
  );
};

export default List;





// class List extends Component {
//   constructor(props){
//     super(props);
//     this.state = {
//       activitiesList: [],
//       currentYear:new Date().getFullYear().toString(), //"*** All ***" si on veut afficher toutes les années par défaut
//       stats: {
//         count:0,
//         totalDistance:0,
//         totalDuration:0,
//         averagePower:0
//       },
//       isLoading: true // état de chargement
//     };
//   }

//   componentDidMount(){
//     this.getActivities(this.state.currentYear)
//   }

//   // Actions quand on modifie la cible
//   updateYear(evt) {
//     const year = evt.target.value === "*** All ***" ? "all" : evt.target.value;
//     // bien penser à l'asynchrone...
//     this.setState({ currentYear: evt.target.value }, () => {
//       this.getActivities(year)
//     })
//   }

//   calculateStats(activities) {
//     const stats = {
//       count: activities.length,
//       totalDistance: activities.reduce((sum, activity) => sum + activity.doc.distance, 0),
//       totalDuration: activities.reduce((sum, activity) => sum + activity.doc.moving_time, 0),
//       averagePower: Math.round(activities.reduce((sum, activity) => sum + activity.doc.weighted_average_watts, 0) / activities.length)
//     };
//     this.setState({ stats });
//   }

//   // Récupération des activités pour l'année donnée
//   getActivities(year) {
//     let url = year === "all" 
//       ? '/api/strava/activities_list' 
//       : '/api/strava/activities_list?year=' + year;
      
//     axios.get(url)
//       .then(response => { 
//         const activities = response.data;
//         this.setState({ 
//           activitiesList: activities,
//           isLoading: false 
//         }, () => {
//           this.calculateStats(activities);
//         });
//       })
//       .catch(error => {
//         console.error("API error:", error);
//         this.setState({ isLoading: false });
//       });
//   }


//   render() {
//     if (this.state.isLoading) {
//       return <div>Loading...</div>;
//     }

//     const { stats } = this.state;

//     return (
//       <Container fluid className='bg-grey text-black text-center'>
      
//         {/* Year selector */}
//         <Row className="py-2">
//           <SelectYear currentYear={this.state.currentYear} updateHandler={(evt) => this.updateYear(evt)} />
//         </Row>

//         {/* Stats summary */}
//         <Row className="py-3 bg-info">
//           <Col>
//             <strong>{stats.count}</strong> activités
//           </Col>
//           <Col>
//             <strong>{(Math.round(stats.totalDistance / 1000 * 10) / 10).toLocaleString('fr-FR')}</strong> km
//           </Col>
//           <Col>
//             <strong>{Math.floor(stats.totalDuration / 3600)}</strong>h <strong>{Math.floor((stats.totalDuration % 3600) / 60)}</strong>m
//           </Col>
//           <Col>
//             <strong>{strSpeed(stats.totalDistance / stats.totalDuration)}</strong>
//           </Col>
//           <Col>
//             <strong>{stats.averagePower}</strong> W
//           </Col>
//         </Row>

//         {/* Activities list */}
//         <Row className="py-3 bg-info">
//           {this.state.activitiesList.map((d, index) =>
//           <ActivitySummaryWithNavigate data={d} key={index} />
//           )}
//         </Row>
  
//       </Container>
//     );
//   }
// }

// export default List;
