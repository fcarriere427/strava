import React, { useEffect, useState } from 'react';
import { Row, Col, FormGroup, Label, Input } from 'reactstrap';

const Filters = ({ activities, onFilterChange, currentYear, updateHandler, locationFilters }) => {
  // États pour stocker les options uniques
  console.log("locationFilters: " + locationFilters.city + " " + locationFilters.region + " " + locationFilters.country);
  const [cities, setCities] = useState(locationFilters.city ? [locationFilters.city] : []);
  const [regions, setRegions] = useState(locationFilters.region ? [locationFilters.region] : []);
  const [countries, setCountries] = useState(locationFilters.country ? [locationFilters.country] : []);
  const [years, setYears] = useState([]);

  // Génération des années
  useEffect(() => {
    const startYear = 2015;
    const lastYear = new Date().getFullYear();
    const yearsList = ['*** All ***'];
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
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');

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
            {years.map(year => (
              <option key={year} value={year}>
                {year === '*** All ***' ? 'Toutes les années' : year}
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
            {cities.map(city => (
              <option key={city} value={city}>
                {city === 'all' ? 'Toutes les villes' : city}
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
            {regions.map(region => (
              <option key={region} value={region}>
                {region === 'all' ? 'Toutes les régions' : region}
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

export default Filters;