// Gestion de la BDD : accès (création des activités), RAZ de la BDD

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

// tableau pour la liste des ID existants // global car appelé dans les 2 fonctions
var existingID = [];

// Met à jour la BDD avec les données fournies (si elles n'existent pas déjà : check par l'ID Strava)
function updateDB(data, page) {
  existingID = [];
  return new Promise((resolve, reject) => {
    console.log('   ... mise à jour de la DB avec la page ' + page + '...');
    readID(stravaDb)
    .then(() => insertNew(data,stravaDb))
    .then(data => resolve(data))
  })
}

// Supprime et recrée la BDD, en créant les vues (cf. createViewDB)
async function renewDB() {
  try {
    await nano.db.destroy(DBNAME);
    console.log('DB détruite...');
  } catch (e) {
    console.log('DB does not exist!');
  }
  await nano.db.create(DBNAME);
  console.log('... DB recréee, OK !');
  console.log('Création de vue...');
  await createViewDB();
  console.log('... vue créee, OK !');
}

//////////////////////
// Fonctions locales à ce fichier (pas besoin de les exporter)
//////////////////////

// Création d'un tableau avec la liste des ID Strava déjà existants dans la BDD
function readID(stravaDb) {
  return new Promise((resolve, reject) => {
    //console.log("      ... mise à jour du tableau des ID Strava, à partir de la BDD existante...");
    var count = 0;
    // pour chaque ligne de la BDD, on va écrire un élément dans le tableau existingID
    stravaDb.list()
    .then((body) => {
      if (body.rows.length == 0){
        // si la BDD est vide, on ne fait rien
        //console.log("      ... pas d\'ID existant, la BDD est vide !");
        resolve();
      }
      else {
        // sinon on remplit le tableau existingID
        body.rows.forEach((item, i) => {
          stravaDb.get(body.rows[i].id)
          .then((doc) => {
            existingID[i] = doc["id"];
            count = count + 1;
            // console.log('   ... count = ' + count);
            if(count==body.rows.length){
              //console.log('      ... tableau des ID Strava mis à jour !');
              resolve();
            }
          })
        })
      }
    })
  })
}

// Insertion dans la BDD des activités n'existant pas déjà dans la BDD (check via le tableau crée par readID)
function insertNew(data, stravaDb){
  // Création d'un enregistrement pour chaque activité
  console.log('   ... mise à jour de la DB avec '+ data.length + ' éléments...');
  return new Promise((resolve, reject) => {
    // count = longueur du tableau = tous les enregistrements qu'on a va essayer d'insérer
    // count_insert = nb d'enregistrements qu'on aura vraimenté insérés ici
    var count = 0;
    var count_insert = 0;
    for (let i = 0; i < data.length; i++) {
      // si l'ID n'existe pas déjà, on ajoute l'enregistrement
      if(!existingID.includes(data[i].id)) {
        stravaDb.insert(data[i], function(){
          count = count + 1;
          count_insert = count_insert + 1;
          if(count==data.length){
            console.log('   ... OK, DB mise à jour avec ' + count_insert + ' élements (sur les ' + data.length + ' initiaux)');
            resolve(count_insert);
          }
        })
      } else {
        // sinon, si l'ID existait déjà, on ne fait rien...
        count = count + 1;
        // .sauf si  on est au dernier enregistrement...
        if(count==data.length){
          //... et où on renvoie le nb d'enregistrements créés
          console.log('      ... OK, DB mise à jour avec ' + count_insert + ' élements (sur les ' + data.length + ' initiaux)');
          resolve(count_insert);
        };
      }
    }
  })
}

// Créee les vues nécessaires dans la BDD
function createViewDB() {
  stravaDb.insert({
    "views":{
      "activities_by_date": {
        "map": function (doc) { if(doc.type == 'Run') emit(doc.start_date, doc.distance) }
      },
      "activities_by_id": {
        "map": function (doc) { if(doc.type == 'Run') emit (doc.id, null); }
      },
      // Comment : pas utilisé pour le moment
      // "activities_by_distance": {
      //   "map": function (doc) { if(doc.type == 'Run') emit (doc.distance, null); }
      // },
      "group_by_month": {
        "map": function (doc) {
          if(doc.type == 'Run') {
            const [date, time] = doc.start_date.split("T");
            const [year, month, day] = date.split("-");
            emit([year, month, day], doc.distance);
          }
        },
        "reduce":"_sum"
      }
    }
  },
  '_design/strava',
  function (error, response) {
    if (!error){
      console.log('OK, design created!');
    } else {
      console.log('Error, design not created! Error = ' + error);
    }
  })
}

//////////////////////
// Legacy : fonctions nécessaires pour OLD APP only
//////////////////////

// ???  Description
function readRec(id) {
  return new Promise((resolve, reject) => {
    const idNum = parseInt(id); /// des heures pour trouver ça... :-(
    stravaDb.view('strava', 'activities_by_id', {key: idNum, include_docs: true}, function(err,body) {
      if (!err) {
        // for each... mais il n'y a qu'une ligne normalement !
        body.rows.forEach(doc => { resolve(doc.doc) })
      } else {
        console.log('error readRec = ' + JSON.stringify(err));
      }
    });
  })
}

// ???  Description
function readDB(year) {
  let s_key = year + "-12-31T23:59:59Z"; // attention, on est en ordre descendant !
  let e_key = year + "-01-01T00:00:00Z";
  return new Promise((resolve, reject) => {
    stravaDb.view('strava', 'activities_by_date',{startkey: s_key, endkey: e_key, include_docs: true, descending: true}, function(err,body) {
      if (!err) {
        resolve(body.rows);
      } else {
        console.log('error readDB = ' + err);
      }
    });
  })
}


// Renvoie un json avec les distances (km) pour tous les mois de toutes les années
function readMonthTotal() {
  return new Promise((resolve, reject) => {
    stravaDb.view('strava', 'group_by_month', {reduce: true, group_level: 2}, function(err,body) {
      if (!err) {
        resolve(body);
      } else {
        console.log('error readMonthTotal = ' + JSON.stringify(err));
      }
    });
  })
}




module.exports = {
   updateDB,
   renewDB,
   // en dessous : nécessaire pour OLD APP seulement 
   readDB,
   readRec,
   readMonthTotal
 }
