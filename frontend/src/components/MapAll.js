import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { Container, Row } from 'reactstrap'
import { SelectYear} from './List/SelectYear'
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const polyUtil = require('../utils/polylineFunctions.js');

const MapAll = () => {
  const [traces, setTraces] = useState([]);
  const [year, setYear] = useState("all");

  useEffect(() => {
    const url = year === "all" 
      ? '/api/strava/activities_list' 
      : `/api/strava/activities_list?year=${year}`;
      
    axios.get(url)
      .then(response => {
        const activitiesWithTraces = response.data
          .filter(activity => activity.doc.map?.summary_polyline)
          .map(activity => ({
            id: activity.doc.id,
            trace: polyUtil.decode(activity.doc.map.summary_polyline)
          }));
        setTraces(activitiesWithTraces);
      });
  }, [year]);

  return (
    <Container fluid className='bg-grey text-black text-center'>
        <Row className="py-2">
          <SelectYear 
            currentYear={year} 
            updateHandler={setYear} />
        </Row>

        <MapContainer 
          center={[48.8534, 2.3488]} 
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
                color="red"
                weight={3}
                opacity={0.5}
              />
            ))}
        </MapContainer>
    </Container>
  );
};

export default MapAll;