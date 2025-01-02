import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { SelectYear } from './List/SelectYear';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const polyUtil = require('../utils/polylineFunctions.js');

const MapAll = () => {
  const [currentYear, setCurrentYear] = useState("*** All ***");
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const polylinesRef = useRef([]);

  // Premier useEffect pour initialiser la carte
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const startPoint = [47.58550, -2.99804]; // St Phi par défaut
    mapRef.current = L.map(mapContainerRef.current).setView(startPoint, 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Deuxième useEffect pour charger et afficher les traces
  useEffect(() => {
    const fetchAndDisplayTraces = async () => {
      try {
        // Nettoyer les polylines existantes
        polylinesRef.current.forEach(polyline => polyline.remove());
        polylinesRef.current = [];

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

        if (!mapRef.current) return;

        // Calculer les limites globales
        const bounds = activitiesWithTraces.reduce((totalBounds, activity) => {
          const activityBounds = L.latLngBounds(activity.trace);
          return totalBounds ? totalBounds.extend(activityBounds) : activityBounds;
        }, null);

        // Ajouter toutes les traces à la carte
        activitiesWithTraces.forEach(trace => {
          const polyline = L.polyline(trace.trace, {
            color: 'purple',
            weight: 3,
            opacity: 0.5
          }).addTo(mapRef.current);
          polylinesRef.current.push(polyline);
        });

        // Ajuster la vue si on a des traces
        if (bounds && activitiesWithTraces.length > 0) {
          mapRef.current.fitBounds(bounds);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des traces:", error);
      }
    };

    fetchAndDisplayTraces();
  }, [currentYear]);

  return (
    <div className="bg-grey text-black text-center">
      <div className="p-2">
        <SelectYear 
          currentYear={currentYear} 
          updateHandler={(evt) => setCurrentYear(evt.target.value)}
        />
      </div>

      <div style={{ height: "calc(100vh - 100px)" }}>
        <div 
          ref={mapContainerRef} 
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </div>
  );
};

export default MapAll;