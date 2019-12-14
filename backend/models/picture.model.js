var mongoose = require('mongoose');


var pictureSchema = mongoose.Schema({
    pictureName: String,
    pictureURL: String,
    pictureInfo: Object
});

var pictureModel = mongoose.model('pictures', pictureSchema);

module.exports = pictureModel