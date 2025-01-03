import React, { useEffect, useState } from 'react';
import { Row, Col, FormGroup, Label, Input } from 'reactstrap';

const Filters = ({ activities, onFilterChange, currentYear, updateHandler, locationFilters }) => {
  // États pour stocker les options uniques
  const [cities, setCities] = useState(locationFilters.city ? [locationFilters.city] : []);
  const [regions, setRegions] = useState(locationFilters.region ? [locationFilters.region] : []);
  const [countries, setCountries] = useState(locationFilters.country ? [locationFilters.country] : []);
  const [years, setYears] = useState([]);
  
  // Génération des années
  useEffect(() => {
    const startYear = 2015;
    const lastYear = new Date().getFullYear();
    const yearsList = ['all'];
    for (let year = lastYear; year >= startYear; year--) {
      yearsList.push(year.toString());
    }
    setYears(yearsList);
  }, []);

  // Extraction des options uniques à partir des activités
  useEffect(() => {
    const uniqueCities = ['all', ...new Set(activities.map(a => a.doc.location_city).filter(Boolean))].sort();
    const uniqueRegions = ['all', ...new Set(activities.map(a => a.doc.location_state).filter(Boolean))].sort();
    const uniqueCountries = ['all', ...new Set(activities.map(a => a.doc.location_country).filter(Boolean))].sort();

    setCities(uniqueCities);
    setRegions(uniqueRegions);
    setCountries(uniqueCountries);
  }, [activities]);

  // États pour les valeurs sélectionnées
  // États pour les valeurs sélectionnées
  const [selectedCity, setSelectedCity] = useState(locationFilters.city || 'all');
  const [selectedRegion, setSelectedRegion] = useState(locationFilters.region || 'all');
  const [selectedCountry, setSelectedCountry] = useState(locationFilters.country || 'all');
  
  const handleFilterChange = (type, value) => {
    switch(type) {
      case 'city':
        setSelectedCity(value);
        break;
      case 'region':
        setSelectedRegion(value);
        setSelectedCity('all'); // Reset city if region changes
        break;
      case 'country':
        setSelectedCountry(value);
        setSelectedCity('all'); // Reset city if country changes
        setSelectedRegion('all'); // Reset region if country changes
        break;
      default:
        break;
    }

    onFilterChange({
      city: type === 'city' ? value : selectedCity,
      region: type === 'region' ? value : selectedRegion,
      country: type === 'country' ? value : selectedCountry
    });
  };

  return (
    <Row className="align-items-end mb-3">
      <Col md={3}>
        <FormGroup>
          <Label for="yearFilter">Année</Label>
          <Input
            type="select"
            id="yearFilter"
            value={currentYear}
            onChange={updateHandler}
          >
            <option value="all">Toutes les années</option>
            {years.filter(year => year !== 'all').map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Input>
        </FormGroup>
      </Col>
      <Col md={3}>
        <FormGroup>
          <Label for="cityFilter">Ville</Label>
          <Input
            type="select"
            id="cityFilter"
            value={selectedCity}
            onChange={(e) => handleFilterChange('city', e.target.value)}
          >
            <option value="all">Toutes les villes</option>
            {cities.filter(city => city !== 'all').map(city => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Input>
        </FormGroup>
      </Col>
      <Col md={3}>
        <FormGroup>
          <Label for="regionFilter">Région</Label>
          <Input
            type="select"
            id="regionFilter"
            value={selectedRegion}
            onChange={(e) => handleFilterChange('region', e.target.value)}
          >
            <option value="all">Toutes les régions</option>
            {regions.filter(region => region !== 'all').map(region => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </Input>
        </FormGroup>
      </Col>
      <Col md={3}>
        <FormGroup>
          <Label for="countryFilter">Pays</Label>
          <Input
            type="select"
            id="countryFilter"
            value={selectedCountry}
            onChange={(e) => handleFilterChange('country', e.target.value)}
          >
            <option value="all">Tous les pays</option>
            {countries.filter(country => country !== 'all').map(country => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </Input>
        </FormGroup>
      </Col>
    </Row>
  );
};

export default Filters;