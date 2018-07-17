/**
 * @class Resume Schema
 * Resume is a large schema that drives a lot of the site content
 * it contains the important information currently up to date about the author
 * This allows for dynamic CV creation along with filling in page details
 */
const mongoose = require('mongoose');

const resumeSchema = mongoose.Schema({
    /** Records when this object was added will add the time now */
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    /** Only one resume should be currently active at any one time, this boolean is set to false */
    currentlyActive: {
        type: Boolean,
        required: true,
        default: false
    },
    /** Date Time the author started coding */
    startedCoding: {
        type: Date,
        required: true,
        default: Date.now
    },
    /** The Authors email which defaults to mine */
    authorEmail: {
        type: String,
        required: true,
        default: 'alexwilkinson@gmail.com'
    },
    /** Current geograhical location of the author currently defaults to Singapore */
    currentLocation: {
        type: String,
        required: true,
        default: 'Singapore'
    },
    /** Boolean that defines if they are looking for work or not defaults to true */
    lookingForWork: {
        type: Boolean,
        required: true,
        default: true
    },
    /** What are they currently learning the name and extra information in HTML */
    currentlyLearning: {
        name: String,
        info: String
    },
    /** Object[] which contains all the projects the user has worked/ is working on and details */
    projectList: [{
        language: String,
        title: String,
        location: String,
        info: String,
        started: Date,
        completed: Date
    }],
    /** 
     * Object[] containing all the important items the user knows and information about them, item
     * should indicate the specific thing they are learning such as language C or framework VueJS or database MySQL
     */
    knowledgeList: [{
        name: String,
        item: String,
        abilityLevel: Number,
        startLearning: Date,
        info: String
    }],
    /** Media connections for the user such as social media or sites */
    connections: [{
        name: String,
        url: String,
        info: String
    }],
    /** Object[] Relivant list of education that the user has done or is currently undergoing */
    Education: [{
        name: String,
        level: String,
        info: String
    }],
    /** Generally work related experience  */
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