const db = require('../db');

module.exports = {
    path: "/api/strava/year_distances",
    config: (router) => {
        router
          .get("/", (req, res) => {
            db.yearDistances() // récup du json avec toutes les années
            .then((data) => {
              console.log(new Date().toISOString(),'- month_distance.js - Distances par année bien renvoyée - OK');
              res.setHeader('content-type', 'application/json');
              res.status(200).send(data);
            })
          })
          .post("/", (req, res) => res.send("No POST here!"));
        return router;
    },
};
