import React from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { Alert } from 'reactstrap';
import { decode } from '@mapbox/polyline';

// Créer un composant wrapper pour la carte
const LeafletMap = React.memo(({ children, ...props }) => (
  <MapContainer {...props}>
    {children}
  </MapContainer>
));

const Map = ({ activity }) => {
  const positions = activity?.map?.summary_polyline ? decode(activity.map.summary_polyline) : null;
  const hasValidRoute = positions && positions.length > 0;
  const startPoint = Array.isArray(activity?.start_latlng) && activity.start_latlng.length >= 2
    ? activity.start_latlng
    : [47.58550, -2.99804];

  const bounds = positions.reduce(
    (bounds, position) => {
      if (!Array.isArray(position) || position.length < 2) {
        return bounds;
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
    <div className="h-100 d-flex flex-column">
      {!hasValidRoute && (
        <Alert color="warning" className="m-2" fade={false}>
          Pas de tracé GPS disponible pour cette activité
        </Alert>
      )}
       <LeafletMap
        bounds={bounds}
        center={startPoint}
        zoom={13}
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
      </LeafletMap>
    </div>
  );
};

export default Map;