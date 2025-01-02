import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { Header, Footer, Tracker, List, Report, MapAll, Activity } from './components';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Router>
      <Header name="Florian"/>
      <Routes>
        <Route path="/" element={<Tracker />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/list" element={<List />} />
        <Route path="/report" element={<Report />} />
        <Route path="/map" element={<MapAll />} />
        <Route path="/activity/:id" element={<Activity />} /> 
      </Routes>
      <Footer />
    </Router>
  </React.StrictMode>,
  //document.getElementById('root')
);