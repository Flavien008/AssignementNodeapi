let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

let UserSchema = Schema({
    username: String,
    password: String,
    name: String,
    role: String,
    matricule: String
});

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('users', UserSchema);
