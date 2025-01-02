import React from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { Alert } from 'reactstrap';
import { decode } from '@mapbox/polyline';

const Map = ({ activity }) => {
 // Vérifications de sécurité pour les coordonnées
 const positions = activity?.map?.summary_polyline ? decode(activity.map.summary_polyline) : null;
 const hasValidRoute = positions && positions.length > 0;

 // Validation plus robuste du point de départ
 const startPoint = Array.isArray(activity?.start_latlng) && activity.start_latlng.length >= 2
   ? activity.start_latlng
   : [47.58550, -2.99804]; // St Phi par défaut

  if (!hasValidRoute) {
    return (
      <div className="h-100 d-flex flex-column">
        <Alert color="warning" className="m-2" fade={false}>
          Pas de tracé GPS disponible pour cette activité
        </Alert>
        <MapContainer
          center={startPoint}
          zoom={13}
          style={{height: '90vh', width: '100%'}}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>
    );
  }

  try {
    // Calcul des limites de la carte avec vérification supplémentaire
      const bounds = positions.reduce(
      (bounds, position) => {
        if (!Array.isArray(position) || position.length < 2) {
          return bounds; // Ignore les positions invalides
        }
        return [
          [
            Math.min(bounds[0][0], position[0]),
            Math.min(bounds[0][1], position[1])
          ],
          [
            Math.max(bounds[1][0], position[0]),
            Math.max(bounds[1][1], position[1])
          ]
        ];
      },
      [[positions[0][0], positions[0][1]], [positions[0][0], positions[0][1]]]
    );

    return (
      <MapContainer
        bounds={bounds}
        style={{height: '90vh', width: '100%'}}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {positions && (
          <Polyline
            positions={positions}
            color="purple"
            weight={3}
            opacity={0.7}
          />
        )}
      </MapContainer>
    );
  } catch (error) {

    // Fallback en cas d'erreur de calcul des bounds
    return (
      <div className="h-100 d-flex flex-column">
        <Alert color="warning" className="m-2" fade={false}>
          Erreur lors du chargement de la carte
        </Alert>
        <MapContainer
          center={startPoint}
          zoom={13}
          style={{height: '90vh', width: '100%'}}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>
    );
  }
};

export default Map;