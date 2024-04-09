let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let assignmentroutes = require('./routes/assignments-routes');
let userroutes = require('./routes/user-routes');
let matiereroutes = require('./routes/matiere-routes');
let grouperoutes = require('./routes/groupe-routes');
let renduroutes = require('./routes/rendu-routes');

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// mongoose.set('debug', true);

// remplacer toute cette chaine par l'URI de connexion à votre propre base dans le cloud s
//const uri = 'mongodb+srv://mb:P7zM3VePm0caWA1L@cluster0.zqtee.mongodb.net/assignments?retryWrites=true&w=majority';
const uri = 'mongodb+srv://mean:mean1234@cluster0.tstxgfw.mongodb.net/MBDSM2?retryWrites=true&w=majority';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB assignments dans le cloud !");
    console.log("at URI = " + uri);
    console.log("vérifiez with http://localhost:" + port + "/api/assignments que cela fonctionne")
  },
    err => {
      console.log('Erreur de connexion: ', err);
    });

// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Pour les formulaires
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Obligatoire si déploiement dans le cloud !
let port = process.env.PORT || 8010;

// les routes
const prefix = '/api';

app.route(prefix + '/signup')
  .post(userroutes.signup);

  app.route(prefix + '/login')
  .post(userroutes.login)

// http://serveur..../assignments
app.route(prefix + '/assignments')
  .post(assignmentroutes.postAssignment)
  .put(assignmentroutes.updateAssignment)
  .get(assignmentroutes.getAssignments);

  app.route(prefix + '/matiere/statistique')
  .get(assignmentroutes.getPercentageAssignmentsBySubject);

  app.route(prefix + '/assignments/statistique')
  .get(assignmentroutes.getAssignmentCountBetweenDates);

app.route(prefix + '/assignments/:id')
  .get(assignmentroutes.getAssignment)
  .delete(assignmentroutes.deleteAssignment);

  app.route(prefix + '/assignments/group/:id')
  .get(assignmentroutes.getAssignmentsByGroupId);

  app.route(prefix + '/rendu')
  .post(renduroutes.createRendu)
  .get(renduroutes.getRendus);

  app.route(prefix +'/assignments/:assignmentId/rendu/:renduId')
  .put(assignmentroutes.updateRendu);
  

app.route(prefix + '/matiere')
  .get(matiereroutes.getMatieres)
  .post(matiereroutes.saveMatiere);

  //pour groupes
  app.route(prefix + '/groupes')
    .get(grouperoutes.getGroupes)
    .post(grouperoutes.postGroup)
    .put(grouperoutes.updateGroup)

    app.route(prefix + '/groupesAll')
    .get(grouperoutes.getGroups)
    
    app.route(prefix + '/groupes/etudiant/:id')
    .get(grouperoutes.getGroupesByStudent);



  app.route(prefix + '/groupes/:id')
    .get(grouperoutes.getGroup)
    .delete(grouperoutes.deleteGroup)



// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;


