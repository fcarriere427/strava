class GeoCoder {
    constructor() {
        this.lastNominatimRequest = 0; // Pour respecter la limite de débit
    }

    async getCommune(latitude, longitude) {
        // Respect de la limite de débit de Nominatim
        const now = Date.now();
        const limit = 1200; // 1 requête par seconde
        if (now - this.lastNominatimRequest < limit) {
            await new Promise(resolve => {
                setTimeout(resolve, limit - (now - this.lastNominatimRequest));
                console.log('Attente pour respecter la limite de débit de Nominatim...');
            }
        )}
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
}

module.exports = GeoCoder;

// Exemples d'utilisation :
/*
const geocoder = new Geocoder(); // Sans clé API = utilisation de Nominatim
const resultat = await geocoder.getCommune(48.8566, 2.3522);
*/