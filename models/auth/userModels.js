/**
 * User MODEL
 * database model for a person who is signed up for the site
 */
const mongoose = require('mongoose');

const userModel = mongoose.Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    verified: {type: Boolean},
    verificationLink: {type: String},
});

const user = mongoose.model('User', userModel);

module.exports ={
    User: user
}

