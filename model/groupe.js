const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = require('../model/user');

const GroupSchema = new Schema({
    nom: String,
    utilisateurs: [UserSchema]
});

module.exports = mongoose.model('Group', GroupSchema);
