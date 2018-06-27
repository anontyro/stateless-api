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
        throw new Error('username or password not present');
    }

    connectToDatabase()
        .then(() => {
            User.findOne({email: email})
                .then(user => {
                    if(!user.verified){
                        reject('User is not verified');
                    }
                    const validate = bcrypt.compareSync(password, user.password);
                    if(!validate) {
                        reject('password is incorrect');
                    }
                    const token = jwt.sign(
                        {id: user._id, username: user.email}, 
                        process.env.JWT_SECRET, {expiresIn: 86400});
                    callback({statusCode: 200, body: JSON.stringify({auth: true, token: token})});
                })
                .catch(ex =>{
                    throw new Error(ex);
                })
                
        })
        .catch(ex => {
            throw new Error(ex);
        })

}

module.exports.register = (event, callback) => {
    const {firstname, lastname, email, password} = JSON.parse(event.body);

    if(!firstname || !lastname || !email || !password) {
        throw new Error('missing fields');
    }

    const hashedPass = bcrypt.hashSync(password, 8);

    connectToDatabase()
        .then(() => {
            User.create({
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: hashedPass,
                verified: false
            })
                .then(user => {
                    const token = jwt.sign({
                        id: user._id, username: user.email
                    }, process.env.JWT_SECRET, {expiresIn: 86400});
                    callback({
                        statusCode: 201,
                        body: JSON.stringify({
                            auth: true,
                            username: user.email,
                            token: token
                        })
                    });
                })
                .catch(err => callback('unable to create new user'));
        })

}

