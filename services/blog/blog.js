'use strict'

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
require('dotenv').config()
const mongoose = require('mongoose');
const util = require('../../utils/utils');
const moment = require('moment');
const connectToDatabase = require('../../connect');

const Blog = require('../../models/blog/blogSchema').Blog;


module.exports.getblogs = (callback) => {
    const query = {
        draft: false
    };

    connectToDatabase()
        .then(() => {
            Blog.find(query)
                .then(blogList => callback({
                    statusCode: 200,
                    body: JSON.stringify({
                        blogList: blogList
                    })
                }));
        })
        .catch(err => callback(err))
}

module.exports.getBlog = (slug, callback) => {

    const query = {
        slug: slug
    }

    connectToDatabase()
        .then(() => {
            Blog.find(query)
                .then(blog => callback({
                    statusCode: 200,
                    body: JSON.stringify({
                        blog: blog
                    })
                }))
        })
        .catch(err => callback(err));
}

module.exports.createBlog = (event, callback) => {
    const blog = JSON.parse(event.body);

    if(!blog.title || !blog.body ) {
        throw new Error('must contain a title and body');
    }

    if(blog.title.length < 5 || blog.body.length < 50) {
        throw new Error('Title and bodt must have minimum content');
    }

    getUniqueSlug(title.replace(/\s/g, '_'), uniqueSlug => {
        
        blog.slug = uniqueSlug;
        
        connectToDatabase()
            .then(() => {
                Blog.create(blog)
                    .then(response => {
                        callback({
                            statusCode: 201,
                            body: JSON.stringify({
                                blog: response,
                                message: 'successfully create a new blog entry'
                            })
                        })
                    })
                    .catch(err => callback(err))
            })
    });
}

module.exports.deleteBlogById = (id, callback) => {
    connectToDatabase()
        .then(() => {
            Blog.findByIdAndRemove(id)
                .then(removed => {
                    callback({
                        statusCode: 200,
                        body: JSON.stringify({
                            blogId: id,
                            message: 'successfully removed blog from the database',
                            blog: removed
                        })
                    })
                })
                .catch(ex => callback(ex))
        })
}

// remove the spaces from the title and make it a slug
slugifyTitle = (title) => {
    return new Promise( (resolve, reject) => {
        resolve(title.replace(/\s/g, '_'));
    })
}

// check the database for a unique value for the current slug
getUniqueSlug = (slug, callback) => {
    const rand = util(1, 99);
    const nextSlug = slug + '_' + rand;

    connectToDatabase()
        .then(() => {
            Blog.find({slug: nextSlug})
            .then(results => {
                if(!results) {
                    callback(nextSlug);
                } else {
                    getUniqueSlug(slug, callback);
                }
            })
        })
        .catch(err => callback(err));

}