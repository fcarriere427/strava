import React from 'react';
import ReactDOM from 'react-dom';  // Notez le changement ici
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { Header, Footer, Tracker, List, Report, MapAll, Activity } from './components';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Header name="Florian"/>
      <Routes>
        <Route path="/" element={<Tracker />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/list" element={<List />} />
        <Route path="/report" element={<Report />} />
        <Route path="/map" element={<MapAll year={currentYear} />} />
        <Route path="/activity/:id" element={<Activity />} /> 
      </Routes>
      <Footer />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);