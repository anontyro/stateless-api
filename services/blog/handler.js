/**
 * @class Blog Handler
 */
'use strict'
require('dotenv').config()

const blog = require('./blog');

/**
 * Returns a list of all publicly viewable blog posts
 * these are filtered by current date Vs publish date along with
 * if the item is a draft or not
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
module.exports.getBlogs =(event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        blog.getblogs(response => {
            callback(null, response);
        });
    } catch(ex) {
        console.err(ex);
        callback(null, {
            statusCode: ex.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'An error occured whilst trying to return the blog list'
        });
    }

}

/**
 * Admin control to get all the blog listings, this returns everything
 * and should be behind some authroization to prevent hidden posts being displayed
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
module.exports.getAllBlogs = (event, context, callback) => {
    try {
        blog.getAllBlogs(response => {
            callback(null, response);
        });
    } catch(ex) { 
        console.err(ex);
        callback(null, {
            statusCode: ex.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'An error occured whilst trying to return the blog list'
        });
    }
}

/**
 * Get a specific blog post which requires the unique slug in the path params
 * it will then return the post if it exists
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
module.exports.getBlog =(event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const slug = event.pathParameters.slug;

    try {
        blog.getBlog(slug, response => {
            callback(null, response);
        })
    } catch(ex) {
        console.err(ex);
        callback(null, {
            statusCode: ex.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'An error occured whilst trying to return the blog list'
        });
    }

}

/**
 * Creates a new blog item requires the item to be posted in the body as JSON data
 * and should have a title and body at least
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
module.exports.createBlog = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        blog.createBlog(event, response => {
            callback(null, response);
        })
    } catch(ex) {
        console.error(ex);
        callback(null, {
            statusCode: ex.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'An error occured whilst trying to return the blog list'
        });
    }
}

/**
 * Update method that will take in the blog data and update it accordingly
 * cannot update slug that is fixed updated date is auto set here
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
module.exports.updateBlog = (event,context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    
    try {
        blog.updateBlog(event, response => {
            callback(null, response);
        })
    } catch(ex) {
        console.error(ex);
        callback(null, {
            statusCode: ex.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'An error occured whilst trying to return the blog list'
        });
    }
}

/**
 * Simple removal method that removes the blog by its unique ID number
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
module.exports.deleteBlog =(event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const id = event.pathParameters.id;

    try {
        blog.deleteBlogById(id, response => {
            callback(null, response);
        })
    } catch(ex) {
        console.err(ex);
        callback(null, {
            statusCode: ex.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'An error occured whilst trying to return the blog list'
        });
    }
}