'use strict'

require('dotenv').config()
const util = require('../../utils/utils');
const moment = require('moment');
const connectToDatabase = require('../../connect');

const Resume = require('../../models/resume/resumeSchema').Resume;

module.exports.getResume = (callback) => {

}

module.exports.createResume = (event, callback) => {
    const resume = JSON.parse(event.body);

}

module.exports.updateResume = (event, callback) => {
    const resume = JSON.parse(event.body);
    
}

module.exports.deleteResumeById = (id, callback) => {
    connectToDatabase()
        .then(() => {
            Resume.findByIdAndRemove(id)
                .then(removed => {
                    callback({
                        statusCode: 200,
                        body: JSON.stringify({
                            resumeId: id,
                            message: 'successfully removed resume item',
                            resume: removed
                        })
                    })
                })
                .catch(ex => callback(ex))
        })
}




