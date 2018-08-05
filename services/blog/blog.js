'use strict'

require('dotenv').config()
const util = require('../../utils/utils');
const moment = require('moment');
const connectToDatabase = require('../../connect');
const Blog = require('../../models/blog/blogSchema').Blog;

/**
 * Method used to get a list of all the currently public blogs
 * will filte out with the query those that should be hidden
 * @param {*} callback 
 */
module.exports.getblogs = (callback) => {
    const dt = moment().toDate();
    const query = {
        draft: false,
        publish: {$lte: dt}
    };

    connectToDatabase()
        .then(() => {
            Blog.find(query)
                .then(blogList => {
                    const output = util.createCalback(200, {blogList: blogList});
                    callback(output);
                });
        })
        .catch(err => callback(err))
}

/**
 * Admin version of getBlogs this returns everything
 * in the blog table regardless of hidden or not
 * @param {*} callback 
 */
module.exports.getAllBlogs = (callback) => {
    connectToDatabase()
        .then(() => {
            Blog.find()
                .then(blogList =>  {
                    const output = util.createCalback(200, {blogList: blogList});
                    callback(output);
                }
            );
        })
        .catch(err => callback(err))
};

/**
 * Uses the slug to return the specific blog post details
 * @param {*} slug 
 * @param {*} callback 
 */
module.exports.getBlog = (slug, callback) => {

    const query = {
        slug: slug
    }

    connectToDatabase()
        .then(() => {
            Blog.find(query)
                .then(blog => {
                    const output = util.createCalback(200, {blog: blog});
                    callback(output);
                })
        })
        .catch(err => callback(err));
}

/**
 * Ensures taht there is a title and body, makes sure that the body and title
 * length are greater than 5 and 50 respectively, generates a basic slug
 * that appends a random number to the end and ensure that number isn't in the database before continuing
 * @param {*} event 
 * @param {*} callback 
 */
module.exports.createBlog = (event, callback) => {
    const blog = JSON.parse(event.body);

    if(!blog.title || !blog.body ) {
        throw new Error('must contain a title and body');
    }

    if(blog.title.length < 5 || blog.body.length < 50) {
        throw new Error('Title and body must have minimum content');
    }

    getUniqueSlug(blog.title.replace(/\s/g, '_'), uniqueSlug => {
        
        blog.slug = uniqueSlug;
        
        connectToDatabase()
            .then(() => {
                Blog.create(blog)
                    .then(response => {
                        const output = util.createCalback(200, {blog: response, message: 'Successfully created a new blog'});
                        callback(output);
                    })
                    .catch(err => callback(err))
            })
    });
}

/**
 * Update method that removes the slug from the object if provided and updates the last modified date
 * to now
 * @param {*} event 
 * @param {*} callback 
 */
module.exports.updateBlog = (event, callback) => {
    const blog = JSON.parse(event.body);
    if(blog.slug) { 
        delete blog.slug;
    }
    
    blog.lastModified = Date.now;

    connectToDatabase()
        .then(() => {
            Blog.findByIdAndUpdate(blog._id, blog)
                .then(updated => {
                    const output = util.createCalback(200, {message: blog.title +  ' has been successfully updated'});
                    callback(output);
                })
        })
        .catch(err => callback('unable to update blog entry: ') + blog._id);

}

/**
 * Required a valid id for the removal and returns the removed object and message along with blogId in the 
 * body
 * @param {*} id 
 * @param {*} callback 
 */
module.exports.deleteBlogById = (id, callback) => {
    connectToDatabase()
        .then(() => {
            Blog.findByIdAndRemove(id)
                .then(removed => {
                    const output = util.createCalback(200, {
                        blogId: id,
                        message: 'Successfully removed blog from the database',
                        blog: removed
                    })
                    callback(output);
                })
                .catch(ex => callback(ex))
        })
}

// remove the spaces from the title and make it a slug
const slugifyTitle = (title) => {
    return new Promise( (resolve, reject) => {
        resolve(title.replace(/\s/g, '_'));
    })
}

// check the database for a unique value for the current slug
const getUniqueSlug = (slug, callback) => {
    const rand = util.getRandomNumber(1, 99);
    const nextSlug = slug + '_' + rand;

    connectToDatabase()
        .then(() => {
            Blog.find({slug: nextSlug})
            .then(results => {
                if(results.length == 0) {
                    callback(nextSlug);
                } else {
                    getUniqueSlug(slug, callback);
                }
            })
        })
        .catch(err => callback(err));

}