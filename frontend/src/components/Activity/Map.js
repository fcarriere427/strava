import React from 'react';
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
// Supprimez l'import de hooks car useMap est maintenant importé directement de react-leaflet
import 'leaflet/dist/leaflet.css';

const Leaflet = window.L;
const polyUtil = require('./polylineFunctions.js');

function Map({ activity }) {
  return (
    <MapContainer
      center={[47.585505245113346, -2.9980409668985826]} //centré sur St Phi ;-)
      zoom={13}
      // scrollWheelZoom={false}
      style={{height: '90vh', width: '100%'}}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RunTrace start_latlng={activity.start_latlng} polyline={activity.map.summary_polyline} />
    </MapContainer>
  );
}

function RunTrace({start_latlng, polyline}) {
  const parentMap = useMap();
  
  // Utilisez useEffect pour les opérations sur la carte après le rendu
  React.useEffect(() => {
    parentMap.setView(start_latlng, parentMap.getZoom());
    
    const encodedRoute = polyline.split();
    
    for (let encoded of encodedRoute) {
      const coordinates = polyUtil.decode(encoded);
      const bounds = Leaflet.latLngBounds(coordinates);
      parentMap.fitBounds(bounds);
    }
  }, [parentMap, start_latlng, polyline]); // Dépendances du useEffect

  const traceColor = { color: 'red' };
  const coordinates = polyUtil.decode(polyline);

  return (
    <Polyline
      pathOptions={traceColor}
      positions={coordinates}
    />
  );
}

export {
  Map
};