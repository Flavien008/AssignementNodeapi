const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

const UserSchema = require('../model/user');

const GroupSchema = new Schema({
    nom: String,
    utilisateurs: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

GroupSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('groups', GroupSchema);
