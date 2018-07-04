'use strict'
require('dotenv').config()

const blog = require('../blog/blog');

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