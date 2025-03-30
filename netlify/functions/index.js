exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Canvas Landing Page API is running',
      endpoints: {
        users: {
          get: '/api/users - Get all users',
          post: '/api/users - Submit form data (name, email, company)'
        }
      }
    })
  };
}; 