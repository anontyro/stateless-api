'use strict'
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
require('dotenv').config()
const connectToDatabase = require('../../connect');
const User = require('../../models/auth/personSchema').Person;
const policyCreation = require('../../utils/auth/auth').buildIAMPolicy;

const auth = require('../../services/auth/auth');

/**
 * Method used to register a new user in the database
 * the inital user created will be not authorized initally and must be verifed
 * @param {*} event must contain a JSON body with {firstname, lastname, email, password}
 * @param {*} context 
 * @param {*} callback lambda callback first value must be null second is a JSON object
 */
module.exports.register = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    
    try{
        auth.register(event, response => {
            callback(null,response);
        });
    }
    catch(ex) {
        console.err(ex);
        callback(null, {
            statusCode: ex.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'An error occured whilst trying to create a new user.'
        });
    }
}

/**
 * Login method used to create a JWT for the user
 * this methodchecks if the user account is verified if not it will reject
 * @param {*} event body is JSON and must contain {email, password}
 * @param {*} context 
 * @param {*} callback 
 */
module.exports.login = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    
    const {email, password} = JSON.parse(event.body);

    try {
        auth.login(email, password, response =>{
            callback(null, response);
        })
    } catch (ex) {
        callback(null, {
            statusCode: 401,
            headers: {'Content-Type': 'text/plain'},
            body: 'username or password incorrect',
            error: ex
        });
    }

}

/**
 * Admin method used to return all the users in teh database
 * will return a restricted list not all data from the table
 * requires Authorization header with the JWT present
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
module.exports.getUsers = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        auth.getUserList(list => {
            console.log(list);
            callback(null, list);
        })
    } catch (ex) {
        callback(null, {
            statusCode: 400,
            headers: {'Content-Type': 'text/plain'},
            body: 'an error occured whilst getting user data',
            error: ex
        });
    }

}

/**
 * Method used to remove users from the database
 * this requires the _id in the url
 * requiresd Authorization token in the header
 * @param {*} event path parameter of id using the user _id value
 * @param {*} context 
 * @param {*} callback 
 */
module.exports.deleteUser = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    connectToDatabase()
        .then(() => {
            User.findByIdAndRemove(event.pathParameters.id)
                .then(user => callback(null, {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'Removed note with id: ' + user._id, user: user })
                }))
                .catch(err => callback(null, {
                    statusCode: err.statusCode || 500,
                    headers: { 'Content-Type': 'text/plain' },
                    body: 'Could not remove user with user id: ' + event.pathParameters.id
                }))
        })
}

module.exports.isUserAuthorised = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const token = event.authorizationToken;
    
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        console.log(decoded);

        userLookupById(userId, user => {
            const isAllowed = 'Allow';
            const authContext = {user: JSON.stringify({ id: user._id, username: user.email, firstname: user.firstname, lastname: user.lastname})};
            const policy = policyCreation(userId, isAllowed, event.methodArn, authContext);
            callback(null, policy);
        })

    }
    catch(ex) {
        callback('Unauthorized');
    }
};

// helper method to be moved
const userLookupById = (id, callback) => {
    connectToDatabase()
        .then(() => {
            User.findById(id)
                .then(user => callback(user) )
                .catch(err => {
                    console.error(err);
                    throw new Exception(err);
                })
        });
};