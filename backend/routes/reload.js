const dbFun = require('../dbFunctions');
const strava = require('../strava');

module.exports = {
    path: "/api/strava/reload",
    config: (router) => {
        router
            .get("/", (req, res) => {
              // param de getActivities = nbPages --> ici 10(*100) car 908 activités Strava le 27/12/24 (cf. dashboard Strava) --> il faut mettre la centaine supérieure, pas plus !
              var nbPages = 10;
              dbFun.renewDB()
              .then(() => strava.renewTokens())
              .then(() => strava.getActivities(nbPages))
              .then((data) => {
                console.log(new Date().toISOString(),'- month_distance.js - Toutes activités récupérées - OK');
                res.status(200).json(data);
              })
            })
            .post("/", (req, res) => res.send("No POST here!"));
        return router;
    },
};
