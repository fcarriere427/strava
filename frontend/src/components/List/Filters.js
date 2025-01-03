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
  const [selectedCity, setSelectedCity] = useState(locationFilters.city || 'all');
  const [selectedRegion, setSelectedRegion] = useState(locationFilters.region || 'all');
  const [selectedCountry, setSelectedCountry] = useState(locationFilters.country || 'all');

  // Fonctions utilitaires pour gérer l'interdépendance des filtres:
  const getAvailableRegions = (activities, selectedCity, selectedCountry) => {
    return [...new Set(activities
      .filter(activity => 
        (selectedCity === 'all' || activity.doc.location_city === selectedCity) &&
        (selectedCountry === 'all' || activity.doc.location_country === selectedCountry)
      )
      .map(activity => activity.doc.location_state)
      .filter(Boolean)
    )].sort();
  };

  const getAvailableCities = (activities, selectedRegion, selectedCountry) => {
    return [...new Set(activities
      .filter(activity => 
        (selectedRegion === 'all' || activity.doc.location_state === selectedRegion) &&
        (selectedCountry === 'all' || activity.doc.location_country === selectedCountry)
      )
      .map(activity => activity.doc.location_city)
      .filter(Boolean)
    )].sort();
  };

  const getAvailableCountries = (activities, selectedCity, selectedRegion) => {
    return [...new Set(activities
      .filter(activity => 
        (selectedCity === 'all' || activity.doc.location_city === selectedCity) &&
        (selectedRegion === 'all' || activity.doc.location_state === selectedRegion)
      )
      .map(activity => activity.doc.location_country)
      .filter(Boolean)
    )].sort();
  };
  
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
            onChange={(e) => handleLocationFilterChange({
              ...locationFilters,
              city: e.target.value,
              // Réinitialiser les autres filtres si nécessaire
              region: e.target.value !== 'all' ? 'all' : locationFilters.region,
              country: e.target.value !== 'all' ? 'all' : locationFilters.country
            })}
          >
            <option value="all">Toutes les villes</option>
            {getAvailableCities(activities, locationFilters.region, locationFilters.country)
              .map(city => (
                <option key={city} value={city}>{city}</option>
              ))
            }
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
            onChange={(e) => handleLocationFilterChange({
              ...locationFilters,
              region: e.target.value
            })}
          >
            <option value="all">Toutes les régions</option>
            {getAvailableRegions(activities, locationFilters.city, locationFilters.country)
              .map(region => (
                <option key={region} value={region}>{region}</option>
              ))
            }
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
            onChange={(e) => handleLocationFilterChange({
              ...locationFilters,
              country: e.target.value
            })}
          >
            <option value="all">Tous les pays</option>
            {getAvailableCountries(activities, locationFilters.city, locationFilters.region)
              .map(country => (
                <option key={country} value={country}>{country}</option>
              ))
            }
          </Input>
        </FormGroup>
      </Col>
    </Row>
  );
};

export default Filters;