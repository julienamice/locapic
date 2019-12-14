var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true
}

mongoose.connect('mongodb+srv://julien:julien@cluster0-okk4r.gcp.mongodb.net/test',
    options, error => {
        if (error) {
            console.error(error);
        } else {
            console.log('Serveur BDD connecté')
        }
    }
);

module.exports = mongoose