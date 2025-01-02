import React, { useMemo} from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { Alert } from 'reactstrap';
import { decode } from '@mapbox/polyline';

const Map = ({ activity }) => {
  const { positions, hasValidRoute } = useMemo(() => {
    const positions = activity?.map?.summary_polyline ? decode(activity.map.summary_polyline) : null;
    const hasValidRoute = positions && positions.length > 0;
    return { positions, hasValidRoute };
  }, [activity]);

  const mapContent = useMemo(() => {
  
    const startPoint = Array.isArray(activity?.start_latlng) && activity.start_latlng.length >= 2
      ? activity.start_latlng
      : [47.58550, -2.99804];

    if (!hasValidRoute) {
      return (
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
      );
    }
  
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
    <MapContainer
        bounds={bounds}
        style={{height: '90vh', width: '100%'}}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline
          positions={positions}
          color="purple"
          weight={3}
          opacity={0.7}
        />
      </MapContainer>
    );
  }, [hasValidRoute, positions, activity]);

  return (
    <div className="h-100 d-flex flex-column">
      {!hasValidRoute && (
        <Alert color="warning" className="m-2" fade={false}>
          Pas de tracé GPS disponible pour cette activité
        </Alert>
      )}
      {mapContent}
    </div>
  );
};

export default Map; 
