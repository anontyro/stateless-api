
module.exports.getRandomNumber = (min, max) => {
    return Math.floor(Math.random()*(max-min+1)+min);
}

module.exports.createCalback = (statusCode, body) => {
    return {
        statusCode: statusCode || 200,
        body: JSON.stringify(body),
        headers: {
            "Access-Control-Allow-Origin": "*" 
        }
    }
}