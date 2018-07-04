const mongoose = require('mongoose');

const programLanguagesSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
});

const programLanguages = mongoose.model('ProgramLanguages', programLanguagesSchema);

module.exports ={
    ProgramLanguages: programLanguages
}