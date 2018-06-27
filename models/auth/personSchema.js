/**
 * PERSON MODEL
 * database model for a person who is signed up for the site
 */
const mongoose = require('mongoose');

const personSchema = mongoose.Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {
        type: String, 
        match: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        required: true
    },
    password: {type: String, required: true},
    verified: {type: Boolean},
    verificationLink: {type: String},
    createdDate: {
        type: Date,
        default: Date.now
    }
});

const person = mongoose.model('Person', personSchema);

module.exports ={
    Person: person
}



