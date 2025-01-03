import React, { useState, useCallback, useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap'
import { useSearchParams } from 'react-router-dom';  // Ajouter cet import
import ActivitySummary from './List/ActivitySummary'
import Filters from './List/Filters'
import { strSpeed } from '../utils/functions'
const axios = require('axios').default;

const List = () => {
  const [searchParams, setSearchParams] = useSearchParams();  // Ajout des searchParams
  
  const [allActivities, setAllActivities] = useState([]); // Toutes les activités non filtrées
  const [filteredActivities, setFilteredActivities] = useState([]); // Activités après filtrage
  const [currentYear, setCurrentYear]  = useState(
    searchParams.get('year') || 'all'
  );
  const [locationFilters, setLocationFilters] = useState({
    city: searchParams.get('city') || 'all',
    region: searchParams.get('region') || 'all',
    country: searchParams.get('country') || 'all'
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
    const year = evt.target.value;
    setCurrentYear(year);
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (year === 'all') {
        newParams.delete('year');
      } else {
        newParams.set('year', year);
      }
      return newParams;
    });
    getActivities(year === 'all' ? undefined : year);
  }, [getActivities, setSearchParams]);

  const handleLocationFilterChange = useCallback((filters) => {
    setLocationFilters(filters);setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== 'all') {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });
      return newParams;
    });
  }, [setSearchParams]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container fluid className='bg-grey text-black text-center'>
    
      <Filters
        activities={allActivities}
        onFilterChange={handleLocationFilterChange}
        currentYear={currentYear}
        updateHandler={handleYearChange}
        locationFilters={locationFilters}
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
          <ActivitySummary data={d} key={index} searchParams={searchParams}/>
        )}
      </Row>
    </Container>
  );
};

export default List;