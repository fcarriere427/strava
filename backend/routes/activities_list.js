const db = require('../db');

module.exports = {
    path: "/api/strava/activities_list",
    config: (router) => {
        router
            .get("/", (req, res) => {
              // Si year est 'all' ou non défini, on ne passe pas de paramètre à activitiesList
              const year = req.query.year === '*** All ***' ? null : req.query.year;

              db.activitiesList(year) // année pour filtrer
              .then((data) => {
                console.log(new Date().toISOString(),
                '- activities_list.js - liste bien renvoyée - OK', 
                year ? `pour l'année ${year}` : 'pour toutes les années');
                res.setHeader('content-type', 'application/json');
                res.status(200).send(data);
              })
            })
            .post("/", (req, res) => res.send("No POST here!"));
        return router;
    },
};
