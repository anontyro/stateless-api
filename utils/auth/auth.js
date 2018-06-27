const buildIAMPolicy = (userId, effect, resource, context) => {
    const policy = {
      principalId: userId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource,
          },
        ],
      },
      context,
    };
  
    return policy;
  };

const errorResponse = (errMsg, content, status) => {
    const output = {
        statusCode: status || 400,
        body: JSON.stringify({
            error: errMsg,
            username: user.email,
            content: content
        })
    }
    
    return output;
}
  
  module.exports = {
    buildIAMPolicy,
    errorResponse,
  }
