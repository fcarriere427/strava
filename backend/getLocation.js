// /!\ Clés Google : suppose qu'on a fait les démarches sur Google cloud
const key = require('./keys/google.json');
// Récupération des clés et tokens Strava
var api_key = key.api_key;

class GeoCoder {
    constructor(googleApiKey = null) {
        this.googleApiKey = googleApiKey;
        this.lastNominatimRequest = 0; // Pour respecter la limite de débit
    }

    async getCommune(latitude, longitude, forceNominatim = false) {
        if (!forceNominatim && this.googleApiKey) {
            return this.getGoogleCommune(latitude, longitude);
        }
        return this.getNominatimCommune(latitude, longitude);
    }

    async getGoogleCommune(latitude, longitude) {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${this.googleApiKey}&language=fr`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.status !== 'OK') {
                throw new Error(`Erreur Google Maps: ${data.status}`);
            }

            let commune = null;
            for (const result of data.results) {
                for (const component of result.address_components) {
                    if (component.types.includes('locality')) {
                        commune = {
                            nom: component.long_name,
                            departement: result.address_components.find(c => c.types.includes('administrative_area_level_2'))?.long_name,
                            region: result.address_components.find(c => c.types.includes('administrative_area_level_1'))?.long_name,
                            pays: result.address_components.find(c => c.types.includes('country'))?.long_name,
                            source: 'google'
                        };
                        break;
                    }
                }
                if (commune) break;
            }

            return commune || { error: 'Commune non trouvée', coordinates: { lat: latitude, lng: longitude } };
        } catch (error) {
            console.error('Erreur Google Maps:', error);
            // En cas d'erreur, on essaie avec Nominatim
            return this.getNominatimCommune(latitude, longitude);
        }
    }

    async getNominatimCommune(latitude, longitude) {
        // Respect de la limite de débit de Nominatim
        const now = Date.now();
        if (now - this.lastNominatimRequest < 1000) {
            await new Promise(resolve => 
                setTimeout(resolve, 1000 - (now - this.lastNominatimRequest))
            );
        }
        this.lastNominatimRequest = Date.now();

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?` +
                `format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'GeocodingApp/1.0'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();

            return {
                nom: data.address.city || data.address.town || data.address.village || data.address.municipality,
                departement: data.address.county,
                region: data.address.state,
                pays: data.address.country,
                source: 'nominatim'
            };
        } catch (error) {
            console.error('Erreur Nominatim:', error);
            return {
                error: error.message,
                coordinates: { lat: latitude, lng: longitude }
            };
        }
    }

    async processBatch(coordinates) {
        const results = [];
        const batchSize = this.googleApiKey ? 50 : 1; // 50 pour Google, 1 pour Nominatim
        
        for (let i = 0; i < coordinates.length; i += batchSize) {
            const batch = coordinates.slice(i, i + batchSize);
            
            const batchPromises = batch.map(coord => 
                this.getCommune(coord.lat, coord.lng, !this.googleApiKey)
                    .catch(error => ({
                        error: error.message,
                        coordinates: coord
                    }))
            );

            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);

            // Si on utilise Nominatim, on attend 1 seconde entre chaque requête
            if (!this.googleApiKey && i + batchSize < coordinates.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        return results;
    }
}

module.exports = {
    GeoCoder
  }

// Exemples d'utilisation :

// 1. Pour le lot initial avec Google Maps
/*
const geocoder = new Geocoder('VOTRE_CLE_API_GOOGLE');
const coordonnees = [
    { lat: 48.8566, lng: 2.3522 },
    { lat: 45.7578, lng: 4.8320 },
    // ... autres coordonnées
];
const resultats = await geocoder.processBatch(coordonnees);
*/

// 2. Pour les requêtes ponctuelles avec Nominatim (pas besoin de clé API)
/*
const geocoder = new Geocoder(); // Sans clé API = utilisation de Nominatim
const resultat = await geocoder.getCommune(48.8566, 2.3522);
*/