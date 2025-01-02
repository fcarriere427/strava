import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Alert } from 'reactstrap';
import { decode } from '@mapbox/polyline';

const Map = ({ activity }) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const polylineRef = useRef(null);

  // Premier useEffect pour initialiser la carte
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const startPoint = [47.58550, -2.99804]; // Point par défaut
    mapRef.current = L.map(mapContainerRef.current).setView(startPoint, 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);

    // Nettoyage lors du démontage
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Dépendances vides - s'exécute une seule fois au montage

  // Deuxième useEffect pour gérer les mises à jour des données
  useEffect(() => {
    if (!mapRef.current) return;

    // Nettoyer la polyline existante
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    const positions = activity?.map?.summary_polyline ? decode(activity.map.summary_polyline) : null;
    const hasValidRoute = positions && positions.length > 0;

    if (hasValidRoute) {
      const bounds = L.latLngBounds(positions);
      mapRef.current.fitBounds(bounds);

      polylineRef.current = L.polyline(positions, {
        color: 'purple',
        weight: 3,
        opacity: 0.7
      }).addTo(mapRef.current);
    } else {
      const startPoint = Array.isArray(activity?.start_latlng) && activity.start_latlng.length >= 2
        ? activity.start_latlng
        : [47.58550, -2.99804];
      mapRef.current.setView(startPoint, 13);
    }
  }, [activity]); // Se déclenche uniquement quand activity change

  return (
    <div className="h-100 d-flex flex-column">
      {!activity?.map?.summary_polyline && (
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