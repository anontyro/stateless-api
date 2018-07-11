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

module.exports.createResume = async (event, callback) => {
    const resume = JSON.parse(event.body);
    let currentActive;
    // check it is not set to active else look up and deactive
    if(resume.currentlyActive) {
        currentActive = await findActiveResume();
        const success = await deactiveResumeById(currentActive._id);
        if(!success) {
            throw new Error('Unable to update resume: ' + currentActive);
        }
    }

    callback({
        statusCode: 201,
        body: JSON.stringify({
            resume: await createNewResume(resume),
            message: 'successfully added a new resume'
        })
    })
    
    
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

const findActiveResume = () => {
    
    connectToDatabase()
        .then(() => {
            return Resume.find({currentlyActive: true});
        })
}

const deactiveResumeById = (id) => {
    connectToDatabase()
        .then(() => {
            return Resume.findByIdAndUpdate(id, {
                currentlyActive: false
            });
        })
}

const createNewResume = (resume) => {
    if(resume._id) {
        throw new Error('Resume already exists use update method');
    }

    connectToDatabase()
        .then(() => {
            return Resume.create(resume);
        });
}




