let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

let AssignmentSchema = Schema({
    titre: String,
    description: String,
    matiere: String,
    dateCreation: Date,
    dateLimite: Date,
    groupe: [{
        idGroupe: String
    }],
    lien: String,
    rendu: [{
        idEtudiant : String,
        matricule: String,
        auteur: String,
        dateRendu: String,
        file: String,
        description: String,
        note: String,
        remarque: String
    }],
    matierePhoto : String
});

AssignmentSchema.index({ dateCreation: 1 });
AssignmentSchema.plugin(mongoosePaginate);


// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
// assignment est le nom de la collection dans la base de données
// Mongoose tolère certaines erreurs dans le nom (ex: Assignent au lieu de assignments)
module.exports = mongoose.model('assignments', AssignmentSchema);
