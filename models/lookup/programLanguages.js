/**
 * @class Program Language
 * Lookup table for the languages making it easy to fill in select lists and select a range of languages held
 * in the collection
 */
const mongoose = require('mongoose');

const programLanguagesSchema = mongoose.Schema({
    /** Name of the language */
    name: {
        type: String,
        required: true,
    },
    /** Usually refering to base type such as C based or other */
    langType: {
        type: String
    },
    /** Additional information about the language */
    info: {
        type: String
    }
});

const programLanguages = mongoose.model('ProgramLanguages', programLanguagesSchema);

module.exports ={
    ProgramLanguages: programLanguages
}