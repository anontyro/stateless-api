'use strict'
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
require('dotenv').config()
const mongoose = require('mongoose');
const util = require('../../utils/auth/auth');
const connectToDatabase = require('../../connect');

const Blog = require('../../models/blog/blogSchema').Blog;
