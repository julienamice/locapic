var mongoose = require('mongoose');


var positionSchema = mongoose.Schema({
    long: Number,
    lat: Number,
});

var positionModel = mongoose.model('positions', positionSchema);

module.exports = positionModel