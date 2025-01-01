// routes/report.js
const db = require('../db');

module.exports = {
    path: "/api/strava/report",
    config: (router) => {
        router.get('/', (req, res) => {
            console.log("Route /api/strava/report appelée avec:", {
                year: req.query.year,
                target: req.query.target
            });
            const yearlyTarget = parseInt(req.query.target) || 1200; // Valeur par défaut si non spécifiée
            db.getYearlyReport(req.query.year, yearlyTarget)
            .then((data) => {
                res.setHeader('content-type', 'application/json');
                res.status(200).send(data);
            })
            .catch(error => {
                console.log('Error:', error);
                res.status(500).send(error);
            });
        });
        return router;
    },
};