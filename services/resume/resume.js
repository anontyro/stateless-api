'use strict'

require('dotenv').config()
const util = require('../../utils/utils');
const moment = require('moment');
const connectToDatabase = require('../../connect');

const Resume = require('../../models/resume/resumeSchema').Resume;

module.exports.getResumes = (callback) => {
    connectToDatabase()
        .then(() => {
            Resume.find()
                .then(resumeList => callback({
                    statusCode: 200,
                    body: JSON.stringify({
                        resumeList: resumeList
                    })
                }));
        })
        .catch(err => callback(err))
}

module.exports.getResume = (callback) => {
    const query = {
        currentlyActive: true
    }
    connectToDatabase()
        .then(() => {
            Resume.find(query)
                .then(resume => callback({
                    statusCode: 200,
                    body: JSON.stringify({
                        resume: resume
                    })
                }))
        })
        .catch(err => callback(err));
}

module.exports.createResume = (event, callback) => {
    const resume = JSON.parse(event.body);

    // check it is not set to active else look up and deactive
}

module.exports.patchResumeActive = (event, callback) => {
    const resume = JSON.parse(event.body);

    // look up and find current active resume, deactivate it

    // then look up this resume and patch the active to true


}

module.exports.updateResume = (event, callback) => {
    const resume = JSON.parse(event.body);

    // check it is not set to active else look up and deactive


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




