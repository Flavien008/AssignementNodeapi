const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

let MatiereSchema = Schema({
    nom: String,
    photo: String, // Champ pour stocker la photo en base64
    idprof: { type: Schema.Types.ObjectId, ref: 'User' }
});

MatiereSchema.plugin(mongoosePaginate);

const Matiere = mongoose.model('matiere', MatiereSchema);

module.exports = Matiere;
