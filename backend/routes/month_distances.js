const db = require('../db');

module.exports = {
    path: "/api/strava/month_distances",
    config: (router) => {
        router
          .get("/", (req, res) => {
            db.monthDistances() // récup du json avec toutes les années
            .then((data) => {
              console.log(new Date().toISOString(),'- month_distances.js - Liste des distances par mois bien renvoyée (=' + data + ') - OK');
              res.setHeader('content-type', 'application/json');
              res.status(200).send(data);
            })
          })
          .post("/", (req, res) => res.send("No POST here!"));
        return router;
    },
};
