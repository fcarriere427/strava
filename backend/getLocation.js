class GeoCoder {
    constructor() {
        this.lastNominatimRequest = 0; // Pour respecter la limite de débit
    }

    async getCommune(latitude, longitude) {
         // Validation des coordonnées
        if (!latitude || !longitude || 
            isNaN(latitude) || isNaN(longitude) ||
            latitude < -90 || latitude > 90 ||
            longitude < -180 || longitude > 180) {
            console.error(`Coordonnées invalides : lat=${latitude}, lng=${longitude}`);
            return {
                nom: "Localisation inconnue",
                departement: "Non défini",
                region: "Non défini",
                pays: "Non défini",
                source: 'error'
            };
        }

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
            console.log(`Tentative de géocodage pour : lat=${latitude}, lng=${longitude}`);
            const url = `https://nominatim.openstreetmap.org/reverse?` +
              `format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;
      
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'GeocodingApp/1.0'
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status} - ${await response.text()}`);
            }

            const data = await response.json();

            if (!data || !data.address) {
                throw new Error('Réponse invalide de Nominatim');
            }

            return {
                nom: data.address.city || data.address.town || data.address.village || 
                 data.address.municipality || "Non défini",
                departement: data.address.county || "Non défini",
                region: data.address.state || "Non défini",
                pays: data.address.country || "Non défini",
                source: 'nominatim'
            };
        } catch (error) {
            console.error('Erreur Nominatim détaillée:', {
                message: error.message,
                coordinates: { lat: latitude, lng: longitude },
                timestamp: new Date().toISOString()
            });
    
            // On renvoie une localisation par défaut au lieu de propager l'erreur
            return {
                nom: "Localisation inconnue",
                departement: "Non défini",
                region: "Non défini",
                pays: "Non défini",
                source: 'error'
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