var mongoose = require('mongoose');


var userSchema = mongoose.Schema({
    email: String,
    password: String,
    token: String,
    salt: String,
    positions: Array
});

var userModel = mongoose.model('users', userSchema);

module.exports = userModel