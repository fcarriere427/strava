import React, { useEffect, useState } from 'react';
import { Row, Col, FormGroup, Label, Input } from 'reactstrap';

const LocationFilters = ({ activities, onFilterChange }) => {
  // États pour stocker les options uniques
  const [cities, setCities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [countries, setCountries] = useState([]);
  
  // États pour les valeurs sélectionnées
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');

  // Extraction des options uniques à partir des activités
  useEffect(() => {
    const uniqueCities = ['all', ...new Set(activities.map(a => a.doc.location_city).filter(Boolean))].sort();
    const uniqueRegions = ['all', ...new Set(activities.map(a => a.doc.location_state).filter(Boolean))].sort();
    const uniqueCountries = ['all', ...new Set(activities.map(a => a.doc.location_country).filter(Boolean))].sort();

    setCities(uniqueCities);
    setRegions(uniqueRegions);
    setCountries(uniqueCountries);
  }, [activities]);

  // Gestion des changements de filtre
  const handleFilterChange = (type, value) => {
    switch(type) {
      case 'city':
        setSelectedCity(value);
        break;
      case 'region':
        setSelectedRegion(value);
        // Reset city if region changes
        setSelectedCity('all');
        break;
      case 'country':
        setSelectedCountry(value);
        // Reset city and region if country changes
        setSelectedCity('all');
        setSelectedRegion('all');
        break;
      default:
        break;
    }

    // Notifier le parent des changements
    onFilterChange({
      city: type === 'city' ? value : selectedCity,
      region: type === 'region' ? value : selectedRegion,
      country: type === 'country' ? value : selectedCountry
    });
  };

  return (
    <Row className="mb-3">
      <Col md={4}>
        <FormGroup>
          <Label for="cityFilter">Ville</Label>
          <Input
            type="select"
            id="cityFilter"
            value={selectedCity}
            onChange={(e) => handleFilterChange('city', e.target.value)}
          >
            {cities.map(city => (
              <option key={city} value={city}>
                {city === 'all' ? 'Toutes les villes' : city}
              </option>
            ))}
          </Input>
        </FormGroup>
      </Col>
      <Col md={4}>
        <FormGroup>
          <Label for="regionFilter">Région</Label>
          <Input
            type="select"
            id="regionFilter"
            value={selectedRegion}
            onChange={(e) => handleFilterChange('region', e.target.value)}
          >
            {regions.map(region => (
              <option key={region} value={region}>
                {region === 'all' ? 'Toutes les régions' : region}
              </option>
            ))}
          </Input>
        </FormGroup>
      </Col>
      <Col md={4}>
        <FormGroup>
          <Label for="countryFilter">Pays</Label>
          <Input
            type="select"
            id="countryFilter"
            value={selectedCountry}
            onChange={(e) => handleFilterChange('country', e.target.value)}
          >
            {countries.map(country => (
              <option key={country} value={country}>
                {country === 'all' ? 'Tous les pays' : country}
              </option>
            ))}
          </Input>
        </FormGroup>
      </Col>
    </Row>
  );
};

export default LocationFilters;