let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let assignmentroutes = require('./routes/assignments-routes');
let userroutes = require('./routes/user-routes');
let matiereroutes = require('./routes/matiere-routes');
let grouperoutes = require('./routes/groupe-routes');
let renduroutes = require('./routes/rendu-routes');
let mailroutes = require('./routes/mail');
const auth = require('./middlewares/authMiddleware');

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
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});



// Pour les formulaires
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));


// Obligatoire si déploiement dans le cloud !
let port = process.env.PORT || 8010;

// les routes
const prefix = '/api';

app.route(prefix + '/signup')
    .post(userroutes.signup);

app.route(prefix + '/login')
    .post(userroutes.login)

app.route(prefix + '/etudiants')
    .get(auth, userroutes.getStudents)

app.route(prefix + '/etudiants/not-in-group')
    .get(auth, userroutes.getStudentsNotInGroup)

app.route(prefix + '/etudiants/in-group')
    .get(auth, userroutes.getStudentsInGroup)

app.route(prefix + '/profs')
    .get(auth, userroutes.getProfs)

app.route(prefix + '/allprofs')
    .get(auth, userroutes.getAllProfs)

// http://serveur..../assignments

app.route(prefix + '/updateAss').get(assignmentroutes.updateUsernamesWithEmails);

app.route(prefix + '/assignments')
    .post(auth, assignmentroutes.postAssignment)
    .put(auth, assignmentroutes.updateAssignment)
    .get(auth, assignmentroutes.getAssignments);

app.route(prefix + '/matiere/statistique')
    .get(auth, assignmentroutes.getPercentageAssignmentsBySubject);

app.route(prefix + '/assignments/statistique')
    .get(auth, assignmentroutes.getAssignmentCountBetweenDates);

app.route(prefix + '/assignments/:id')
    .get(auth, assignmentroutes.getAssignment)
    .delete(auth, assignmentroutes.deleteAssignment);

app.route(prefix + '/assignments/group/:id')
    .get(auth, assignmentroutes.getAssignmentsByGroupId);

app.route(prefix + '/rendu')
    .post(auth, renduroutes.createRendu)
    .get(auth, renduroutes.getRendus)
    .put(auth, renduroutes.updateRendu)

app.route(prefix + '/matiere')
    .get(auth, matiereroutes.getMatieres)
    .post(auth, matiereroutes.createMatiere)
    .put(auth, matiereroutes.updateMatiere);

app.route(prefix + '/matieres')
    .get(auth, matiereroutes.getMatiere)

app.route(prefix + '/matiere/:id')
    .get(auth, matiereroutes.getMatiereById)
    .delete(auth, matiereroutes.deleteMatiere);



//pour groupes
app.route(prefix + '/groupes')
    .get(auth, grouperoutes.getGroupes)
    .post(auth, grouperoutes.createGroup)
    .put(auth, grouperoutes.updateGroup)

app.route(prefix + '/groupe/:id')
    .get(auth, grouperoutes.getGroup)

app.route(prefix + '/groupes/membre')
    .post(auth, grouperoutes.addUserToGroup)
    .delete(auth, grouperoutes.removeUserToGroup)

app.route(prefix + '/groupesAll')
    .get(auth, grouperoutes.getGroups)

app.route(prefix + '/groupes/etudiant/:id')
    .get(auth, grouperoutes.getGroupesByStudent);

app.route(prefix + '/groupes/:id')
    .get(auth, grouperoutes.getGroup)
    .delete(auth, grouperoutes.deleteGroup)

app.route(prefix + '/sendmail')
    .post(auth, mailroutes.sendMail)


// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);

module.exports = app;


