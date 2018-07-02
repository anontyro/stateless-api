'use strict'

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
require('dotenv').config()
const mongoose = require('mongoose');
const util = require('../../utils/auth/auth');
const moment = require('moment');
const connectToDatabase = require('../../connect');

const Blog = require('../../models/blog/blogSchema').Blog;


module.exports.getblogs = (callback) => {
    const query = {
        draft: false,
        publish: moment()
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