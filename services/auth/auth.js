'use strict'
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
require('dotenv').config()
const mongoose = require('mongoose');
const policyCreation = require('../../utils/auth/auth').buildIAMPolicy;
const connectToDatabase = require('../../connect');

const User = require('../../models/auth/personSchema').Person;

module.exports.login = (email, password, callback)  => {

    if(!email || !password) {
        throw new Exception('username or password not present');
    }

    connectToDatabase()
        .then(() => {
            User.findOne({email: email})
                .then(user => {
                    const validate = bcrypt.compareSync(password, user.password);
                    if(!validate) {
                        throw new Exception('Not authorised');
                    }
                    const token = jwt.sign(
                        {id: user._id, username: user.email}, 
                        process.env.JWT_SECRET, {expiresIn: 86400});
                    callback({statusCode: 200, body: JSON.stringify({auth: true, token: token})});
                })
        })
        .catch(err => callback({
            status: 401,
            headers: {'Content-Type': 'text/plain'},
            body: 'username or password incorrect'
        }));

}

function createResponse(status, body) {
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: status,
      body: JSON.stringify(body)
    }
  }