import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Alert } from 'reactstrap';
import { decode } from '@mapbox/polyline';

const Map = ({ activity }) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const positions = activity?.map?.summary_polyline ? decode(activity.map.summary_polyline) : null;
    const hasValidRoute = positions && positions.length > 0;
    const startPoint = Array.isArray(activity?.start_latlng) && activity.start_latlng.length >= 2
      ? activity.start_latlng
      : [47.58550, -2.99804];

    // Initialiser la carte si elle n'existe pas
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(startPoint, 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }

    // Si nous avons une route valide
    if (hasValidRoute) {
      // Calcul des limites
      const bounds = L.latLngBounds(positions);
      mapRef.current.fitBounds(bounds);

      // Ajouter la polyline
      L.polyline(positions, {
        color: 'purple',
        weight: 3,
        opacity: 0.7
      }).addTo(mapRef.current);
    }

    // Nettoyage
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [activity]);

  return (
    <div className="h-100 d-flex flex-column">
      {activity?.map?.summary_polyline ? null : (
        <Alert color="warning" className="m-2" fade={false}>
          Pas de tracé GPS disponible pour cette activité
        </Alert>
      )}
      <div 
        ref={mapContainerRef} 
        style={{ height: '90vh', width: '100%' }}
      />
    </div>
  );
};

export default Map;