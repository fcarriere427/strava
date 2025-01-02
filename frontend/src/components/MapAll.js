import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { Container, Row } from 'reactstrap'
import { SelectYear} from './List/SelectYear'
import 'leaflet/dist/leaflet.css';
import axios from 'axios';  // Modifié ici pour utiliser l'import ES6
//const axios = require('axios').default;

const polyUtil = require('../utils/polylineFunctions.js');

const MapAll = () => {
  const [traces, setTraces] = useState([]);
  const [currentYear, setCurrentYear] = useState("*** All ***");
  const [mapCenter, setMapCenter] = useState([48.8534, 2.3488]); // Paris par défaut

  useEffect(() => {
    const fetchTraces = async () => {
      try {
        const year = currentYear === "*** All ***" ? "all" : currentYear;
        const url = year === "all" 
          ? '/api/strava/activities_list' 
          : `/api/strava/activities_list?year=${year}`;
        
        const response = await axios.get(url);
        const activitiesWithTraces = response.data
          .filter(activity => activity.doc.map?.summary_polyline)
          .map(activity => ({
            id: activity.doc.id,
            trace: polyUtil.decode(activity.doc.map.summary_polyline)
          }));
        setTraces(activitiesWithTraces);
      } catch (error) {
        console.error("Erreur lors de la récupération des traces:", error);
      }
    };

    fetchTraces();
  }, [currentYear]);


  const handleYearChange = (evt) => {
    setCurrentYear(evt.target.value);
  };

  return (
    <Container fluid className='bg-grey text-black text-center'>
      {/* Remplacement de Row par une simple div pour éviter problème de Context ?!?  */}
        <div className="mb-3">
          <SelectYear 
            currentYear={currentYear} 
            updateHandler={handleYearChange} />
        </div> 

        <MapContainer 
          center={mapCenter} 
          zoom={13} 
          style={{ height: "600px", width: "100%" }}
        >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {traces.map(trace => (
              <Polyline 
                key={trace.id}
                positions={trace.trace}
                color="purple"
                weight={3}
                opacity={0.5}
              />
            ))}
        </MapContainer>
    </Container>
  );
};

export default MapAll;