/**
 * PERSON MODEL
 * database model for a person who is signed up for the site
 */
const mongoose = require('mongoose');

const personSchema = mongoose.Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    verified: {type: Boolean},
    verificationLink: {type: String},
});

const person = mongoose.model('Person', personSchema);

module.exports ={
    Person: person
}



