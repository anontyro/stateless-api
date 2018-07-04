const mongoose = require('mongoose');

const resumeSchema = mongoose.Schema({
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    startedCoding: {
        type: Date,
        required: true,
        default: Date.now
    },
    authorEmail: {
        type: String,
        default: 'alexwilkinson@gmail.com'
    },
    currentLocation: {
        type: String,
        default: 'Singapore'
    },
    lookingForWork: {
        type: Boolean,
        default: true
    },
    currentlyLearning: {
        name: String,
        info: String
    },
    projectList: [{
        language: String,
        title: String,
        location: String,
        info: String,
        started: Date,
        completed: Date
    }],
    knowledgeList: [{
        name: String,
        item: String,
        abilityLevel: Number,
        startLearning: Date,
        info: String
    }],
    connections: [{
        name: String,
        url: String,
        info: String
    }],
    Education: [{
        name: String,
        level: String,
        info: String
    }],
    Experience: [{
        name: String,
        title: String,
        location: String,
        startDate: Date,
        EndDate: Date,
        info: String
    }]
});

const resume = mongoose.model('Resume', resumeSchema);

module.exports = {
    Resume: resume
}