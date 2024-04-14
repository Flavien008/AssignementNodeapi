const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MatiereSchema = Schema({
    nom: String,
    photo: String, // Champ pour stocker la photo en base64
    type: { type: Schema.Types.ObjectId, ref: 'User' }
});

const Matiere = mongoose.model('matiere', MatiereSchema);

module.exports = Matiere;
