'use strict'
require('dotenv').config()

const resume = require('./resume');

module.exports.getResume = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try{

    } catch(ex) {
        console.err(ex);
        callback(null, {
            statusCode: ex.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'An error occured whilst trying to return the blog list'
        });
    }

}

module.exports.createResume = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try{

    } catch(ex) {
        console.err(ex);
        callback(null, {
            statusCode: ex.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'An error occured whilst trying to return the blog list'
        });
    }

}

module.exports.updateResume = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try{

    } catch(ex) {
        console.err(ex);
        callback(null, {
            statusCode: ex.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'An error occured whilst trying to return the blog list'
        });
    }

    module.exports.deleteResume = (event, context, callback) => {
        context.callbackWaitsForEmptyEventLoop = false;
    
        try{
    
        } catch(ex) {
            console.err(ex);
            callback(null, {
                statusCode: ex.statusCode || 500,
                headers: { 'Content-Type': 'text/plain' },
                body: 'An error occured whilst trying to return the blog list'
            });
        }
    
    }

}