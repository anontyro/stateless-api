'use strict'
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const util = require('../../utils/utils');
require('dotenv').config()
const connectToDatabase = require('../../connect');

const User = require('../../models/auth/personSchema').Person;

/**
 * Login logic that will first check for email and password
 * then check the database if it finds the user is not validatd
 * it will throw an error, if all is good returns
 * the JWT
 * @param {*} email users unique email
 * @param {*} password users password
 * @param {*} callback 
 */
module.exports.login = (email, password, callback)  => {

    if(!email || !password) {
        throw new Error('username or password not present');
    }

    connectToDatabase()
        .then(() => {
            User.findOne({email: email})
                .then(user => {
                    if(!user.verified){
                        const output = util.createCalback(401, {
                            error: 'user is not verified, unable to login',
                            username: user.email
                        })
                        callback(output);
                    }
                    const validate = bcrypt.compareSync(password, user.password);
                    if(!validate) {
                        const output = util.createCalback(401, {
                            error: 'password is not correct',
                            username: user.email
                        })
                        callback(output);
                    }
                    const token = jwt.sign(
                        {id: user._id, username: user.email}, 
                        process.env.JWT_SECRET, {expiresIn: 86400});

                    const output = util.createCalback(200, {
                        auth: true,
                        token: token
                    });
                    console.log(output);
                    callback(output);
                })
                .catch(ex =>{
                    throw new Error(ex);
                })
                
        })
        .catch(ex => {
            throw new Error(ex);
        })

}

/**
 * Method used to allow a user to register for hte site
 * by default users are not verfied, as this is for a private site
 * this will be manually done
 * @param {*} event 
 * @param {*} callback 
 */
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

/**
 * Update method this will remove the password nad email if they exist in the object
 * this is to prevent updating via this means
 * returns a callback object containing a body that will list the update was completed successfully
 * @param {*} user 
 * @param {*} callback 
 */
module.exports.updateUser = (user, callback) => {
    
    const updateModel =  JSON.parse(JSON.stringify(user));
    updateModel
    delete updateModel._id;

    if( updateModel.password) {
        delete updateModel.password;
    }

    if( updateModel.email) {
        delete updateModel.email;
    }
    
   connectToDatabase()
    .then(() => {
        User.findByIdAndUpdate(user._id, updateModel)
        .then(updated => {
            callback({
                statusCode: 200,
                body: JSON.stringify({
                    message: user.email? user.email: user.firstname + ' has been successfully updated'
                })
            })
        })
    })
    .catch(err => callback('unable to update user'));
}

/**
 * Requires username (email) old and new password in a post request JSON object
 * this then tests the user has correct details and that the old password != new password
 * before rehashing and updating
 * @param {*} event 
 * @param {*} callback 
 */
module.exports.updatePassword = (event, callback) => {
    
    const {username, oldPassword, newPassword} = JSON.parse(event.body);    

    if(!username || !oldPassword || !newPassword) {
        throw new Error('not all fields are present in request');
    }

    if(newPassword === oldPassword) {
        throw new Error('new password cannot be the same as the current password');
    }
    
    connectToDatabase()
        .then(() => {
            User.findOne({email: username})
                .then(user => {
                    const validate = bcrypt.compareSync(oldPassword, user.password);
                    if(!validate) {
                        callback({
                            statusCode: 401,
                            body: JSON.stringify({
                                error: 'password is not correct',
                                username: user.email
                            })
                        });
                    }

                    const hashedNewPass = bcrypt.hashSync(newPassword, 8);
                    User.findByIdAndUpdate(user._id, {password: hashedNewPass})
                        .then(updated => {
                            callback({
                                statusCode: 200,
                                body: JSON.stringify({
                                    message: 'User password has been successfully updated for: ' + user.email
                                })
                            })
                        })
                })
                .catch(ex => callback({
                    statusCode: 400,
                    body: JSON.stringify({
                        message: 'Unable to update user password',
                        error: ex
                    })
                }))
        })
}

/**
 * logic to find the user in the database and remove them
 * @param {*} userId unique mongodb _id
 * @param {*} callback 
 */
module.exports.deleteUserById = (userId, callback) => {
    connectToDatabase()
        .then(() => {
            User.findByIdAndRemove(userId)
                .then(user => callback({
                    statusCode: 200,
                    body: JSON.stringify({
                        userId: userId,
                        message: 'successfully removed user from the database',
                        user: user
                    })
                }))
        })
        .catch(err => callback('unable to remove user'));
}

/**
 * logic used to return a restircted list of users in the database
 * other fields can be hidden if required and params can be added to
 * filter the list more
 * @param {*} callback 
 */
module.exports.getUserList = (callback) => {

    const retUsers = {
        password: false,
        __v: false
    }

    connectToDatabase()
        .then(() => {
            User.find({}, retUsers)
                .then(userList => callback({
                    statusCode: 200,
                    body: JSON.stringify({
                        userList: userList
                    })
                }));
        })
        .catch(err => callback('unable to get user list'));

}

