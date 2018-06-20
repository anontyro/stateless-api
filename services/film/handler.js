'use strict';

const connectToDatabase = require('../../connect');
const Film = require('../../models/film/filmModels').Film;

module.exports.getFilms = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Film.find()
        .then(film => callback(null, {
          statusCode: 200,
          body: JSON.stringify(film)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Could not fetch the film list.'
        }));
    });

}

// module.exports.hello = (event, context, callback) => {
//   const response = {
//     statusCode: 200,
//     body: JSON.stringify({
//       message: 'Go Serverless v1.0! Your function executed successfully!',
//       input: event,
//     }),
//   };

//   callback(null, response);

//   // Use this code if you don't use the http event with the LAMBDA-PROXY integration
//   // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
// };
