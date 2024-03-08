const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = require('../model/user');

const GroupSchema = new Schema({
    nom: String,
    utilisateurs: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Group', GroupSchema);
