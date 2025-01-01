//////// Fonctions nécessaires aux API 

// Récupération des clés pour se connecter à couchDB
const couchKeys = require('./keys/couchDB.json');
var user = couchKeys.user;
var pwd = couchKeys.password;
var host = couchKeys.host;
var port = couchKeys.port;
var url = 'http://' + user + ':' + pwd + '@' + host + ':' + port;
// Ouverture de la BDD
const nano = require ('nano')(url);
const DBNAME = 'strava'
var stravaDb = nano.db.use(DBNAME);

// Renvoie la date de la dernière activité, au  format "2022-04-02T07:43:20Z" (UTC)
function readLastActivityDate() {
  return new Promise((resolve, reject) => {
    stravaDb.view('strava', 'activities_by_date',{limit: 1, include_docs: true, descending: true}, function(err,body) {
      if (!err) {
          // for each... mais il n'y a qu'une ligne normalement !
          body.rows.forEach(doc => { resolve(doc.doc.start_date) })
      } else {
          console.log('error readLastActivityDate = ' + JSON.stringify(err));
      }
    });
  })
}

// Renvoie un json avec les distances (km) pour toutes les années
function yearDistances() {
  let year_distances = [];
  return new Promise((resolve, reject) => {
    stravaDb.view('strava', 'group_by_month', {reduce: true, group_level: 1}, function(err,body) {
      if (!err) {
        body.rows.forEach(doc => {
          let year = doc.key.toString();
          let distance = Math.round(doc.value/1000*10)/10;
          year_distances[`${year}`] = `${distance}`;
        });
        let response = JSON.stringify(Object.assign({}, year_distances));
        resolve(response);
      } else {
        console.log('error yearDistances = ' + JSON.stringify(err));
      }
    });
  })
}

// Renvoie un json avec les distances (km) pour tous les mois de toutes les années
function monthDistances() {
  let month_distances = [];
  return new Promise((resolve, reject) => {
    stravaDb.view('strava', 'group_by_month', {reduce: true, group_level: 2}, function(err,body) {
      if (!err) {
        body.rows.forEach(doc => {
          let month = doc.key.toString().replace(",", "-");
          let distance = Math.round(doc.value/1000*10)/10;
          month_distances[`${month}`] = `${distance}`;
        });
        let response = JSON.stringify(Object.assign({}, month_distances));
        resolve(response);
      } else {
        console.log('error monthDistances = ' + JSON.stringify(err));
      }
    });
  })
}

// Renvoie la liste des activités d'une année donnée (?year=xxxx), au format JSON
function activitiesList(year) {
  // Si year est 'all' ou null, on prend une plage de dates très large
  let s_key, e_key;
  
  if (!year || year === '*** All ***') {
    // Du futur jusqu'au passé (puisqu'on est en ordre descendant)
    s_key = "2099-12-31T23:59:59Z";  // Date future
    e_key = "2000-01-01T00:00:00Z";  // Date passée
  } else {
    // Comportement normal pour une année spécifique
    s_key = year + "-12-31T23:59:59Z";
    e_key = year + "-01-01T00:00:00Z";
  }
  return new Promise((resolve, reject) => {
    stravaDb.view('strava', 'activities_by_date',
      {
        startkey: s_key, 
        endkey: e_key, 
        include_docs: true, 
        descending: true
      },
      function(err,body) {
        if (!err) {
          resolve(body.rows);
        } else {
          console.log('error activitiesList = ' + err);
        }
      }
    );
  });
}

// Renvoie toutes les infos pour une activité donnée (?id=xxxxxx)
function activityDetail(id) {
  return new Promise((resolve, reject) => {
    const idNum = parseInt(id); /// des heures pour trouver ça... :-(
    stravaDb.view('strava', 'activities_by_id', {key: idNum, include_docs: true}, function(err,body) {
      if (!err) {
        // for each... mais il n'y a qu'une ligne normalement !
        body.rows.forEach(doc => { resolve(doc.doc) })
      } else {
        console.log('error activityDetail = ' + JSON.stringify(err));
      }
    });
  })
}

function getYearlyReport(year, yearlyTarget) {
  //console.log("getYearlyReport appelé avec:", { year, yearlyTarget }); // Debug
  return new Promise((resolve, reject) => {
      // Définir les objectifs mensuels
      const monthlyTargets = {};
      for (let month = 0; month < 12; month++) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInYear = new Date(year, 11, 31).getDate() + 334; // 365 ou 366
        monthlyTargets[new Date(year, month).toLocaleString('en-US', { month: 'short' })] = 
          Math.round((yearlyTarget * daysInMonth / daysInYear) * 10) / 10;
      }

      //console.log("Objectifs mensuels calculés:", monthlyTargets); // Debug

      stravaDb.view('strava', 'activities_by_date', {
          startkey: `${year}-12-31T23:59:59Z`,
          endkey: `${year}-01-01T00:00:00Z`,
          include_docs: true,
          descending: true
      }, function(err, body) {
          if (err) {
              console.log('Erreur dans la vue:', err);
              reject(err);
              return;
          }

          //console.log("Nombre d'activités trouvées:", body.rows.length); // Debug
          //console.log("Premier élément:", body.rows[0]?.doc); // Debug  

          try {
              // Initialiser les données mensuelles
              const monthlyData = [];
              let actualCumul = 0;
              let targetCumul = 0;

              // Traiter chaque mois
              for (const month of Object.keys(monthlyTargets)) {
                  const monthActivities = body.rows.filter(row => {
                      const date = new Date(row.doc.start_date);
                      return date.toLocaleString('en-US', { month: 'short' }) === month;
                  });

                  // Calculer le total du mois
                  const actual = monthActivities.reduce((sum, row) => sum + row.doc.distance / 1000, 0);
                  const target = monthlyTargets[month];
                  actualCumul += actual;
                  targetCumul += target;
                  
                  // Calculer les moyennes
                  const daysInMonth = new Date(year, Object.keys(monthlyTargets).indexOf(month) + 1, 0).getDate();
                  const avgPerDay = actual / daysInMonth;
                  const avgPerWeek = actual / (daysInMonth / 7);

                  monthlyData.push({
                      month,
                      actual: Math.round(actual * 10) / 10,
                      target,
                      delta: Math.round((actual - target) * 10) / 10,
                      actualCumul: Math.round(actualCumul * 10) / 10,
                      targetCumul: Math.round(targetCumul * 10) / 10,
                      deltaCumul: Math.round((actualCumul - targetCumul) * 10) / 10,
                      avgPerDay: Math.round(avgPerDay * 100) / 100,
                      avgPerWeek: Math.round(avgPerWeek * 10) / 10
                  });
              }

              // Calculer les totaux
              const total = {
                  actual: Math.round(actualCumul * 10) / 10,
                  target: Math.round(targetCumul * 10) / 10,
                  delta: Math.round((actualCumul - targetCumul) * 10) / 10,
                  actualCumul: Math.round(actualCumul * 10) / 10,
                  targetCumul: Math.round(targetCumul * 10) / 10,
                  deltaCumul: Math.round((actualCumul - targetCumul) * 10) / 10,
                  avgPerDay: Math.round((actualCumul / 365) * 100) / 100,
                  avgPerWeek: Math.round((actualCumul / 52) * 10) / 10
              };

              resolve({
                  monthly: monthlyData,
                  total
              });

          } catch (error) {
            console.log('Erreur dans getYearlyReport:', error);
            reject(error);
          }
      });
  });
}


module.exports = {
   readLastActivityDate,
   yearDistances,
   monthDistances,
   activitiesList,
   activityDetail, 
   getYearlyReport
 }
