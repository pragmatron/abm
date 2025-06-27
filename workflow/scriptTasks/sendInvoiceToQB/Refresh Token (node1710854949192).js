if(context.err) return

const qs = require('qs');

await $log.debug('refreshed start')

// retrieve credentials
const clientId = context.credentials.clientID; 
const clientSecret = context.credentials.clientSecret; 
const redirectUri = context.credentials.redirectURI; 
const refreshToken = context.tokenValue.refresh_token; 
const accessToken = context.tokenValue.access_token


// Concatenate the username and password, separated by a colon
const credentials = clientId + ':' + clientSecret;

// Encode the credentials in Base64
const encodedCredentials = Buffer.from(credentials).toString('base64');

// Form the Basic Authorization header value
const authHeader = 'Basic ' + encodedCredentials;

context.data.object = {
    clientId, clientSecret, redirectUri, refreshToken, authHeader
}




let refreshResponse
try {


  // Make api call to refresh the token
  let data = qs.stringify({
    'grant_type': 'refresh_token',
    'refresh_token': refreshToken 
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'Authorization': `${authHeader}`
    },
    data : data
  };


  refreshResponse = await axios(config)

  refreshResponse = refreshResponse.data

  context.data.refreshResponse = refreshResponse

  context.refreshed = refreshResponse

} catch(err) {
    context.refreshErr = true
    context.err = true
    await $log.error('Something went wrong refreshing token with api call')
    await $log.error(err.message)
    console.error(err.message)
}

try {
 // if refresh happened with no errors save refreshed token
 if(!context.refreshErr && refreshResponse) {
   $log.debug('saving new tokens')
   const client = new SecretManagerServiceClient()

     const [version] = await client.addSecretVersion({
      parent: `projects/${process.env.GCLOUD_PROJECT}/secrets/${context.tokenName}`,
      payload: {
        data: Buffer.from(JSON.stringify(refreshResponse), 'utf8'),//Buffer.from(str, 'utf8'),
      },
    })

 } else {
   context.err =true
 }

} catch(err) {
    context.err = true
    await $log.error('Something went wrong refreshing token')
    await $log.error(err.message)
  
}
$log.debug('refreshed end')


