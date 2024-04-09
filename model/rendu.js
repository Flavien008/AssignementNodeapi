let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

let RenduSchema = Schema({
    idEtudiant : String,
    idAssignment : String,
    matricule: String,
    auteur: String,
    dateRendu: String,
    file: String,
    description: String,
    note: String,
    remarque: String
});

RenduSchema.plugin(mongoosePaginate);


// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
// assignment est le nom de la collection dans la base de données
// Mongoose tolère certaines erreurs dans le nom (ex: Assignent au lieu de assignments)
module.exports = mongoose.model('rendu', RenduSchema );
