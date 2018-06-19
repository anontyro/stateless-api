const mongoose = require('mongoose');

const filmModel = mongoose.Schema({
    title: String,
    releaseDate: Date,
    blurb: String,
    dateAdded: Date
});

const film = mongoose.model('Film', filmModel);

module.exports = {
    Film: film
}