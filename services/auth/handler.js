'use strict'
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
require('dotenv').config()
const connectToDatabase = require('../../connect');
const User = require('../../models/auth/personSchema').Person;


module.exports.register = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    
    const {firstname, lastname ,email, password} = JSON.parse(event.body);

    if(!firstname || !lastname || !email || !password) {
        throw new Exception('missing fields');
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
                    const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: 86400})
                    callback(null, {statusCode: 200,body: JSON.stringify({auth: true, token: token})})
                })
            .catch(err => callback(null, {
                statusCode: err.statusCode || 500,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Could not fetch the film list.'
            }));
        
    });
}

module.exports.login = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    
    const {email, password} = JSON.parse(event.body);

    connectToDatabase()
        .then(() => {
            User.findOne({email: email})
                .then(user => {
                    const validate = bcrypt.compareSync(password, user.password);
                    if(!validate) {
                        throw new Exception('Not authorised');
                    }
                    const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: 86400});
                    callback(null, {statusCode: 200,body: JSON.stringify({auth: true, token: token})})
                })
                .catch(err => callback(null, {

                }));
        });
}

module.exports.getUsers = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    connectToDatabase()
        .then(() => {
            User.find()
                .then(userList => callback(null, {
                    status: 200,
                    body: JSON.stringify(userList)
                }))
                .catch(err => callback(null, {
                    statusCode: err.statusCode || 500,
                    headers: { 'Content-Type': 'text/plain' },
                    body: 'Could not fetch the users list.'
                }));
        });

}

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