const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MatiereSchema = Schema({
    nom: String
});

const Matiere = mongoose.model('matiere', MatiereSchema);

module.exports = Matiere;