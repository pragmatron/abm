
const client = new SecretManagerServiceClient()
let dashboardId = callDash
context.client = client


if(!dashboardId) {
  context.err = true
  context.data.err = 'Cannot access dashboard id from callDash variable'
  $log('Cannot access dashboard id from callDash variable')
}

// Get token and token values
let tokenValue
let  tokenName = `token-${dashboardId}-qbOnline`
context.tokenName = tokenName
context.data.dashboardId = dashboardId

  try {
    let [version] = await client.accessSecretVersion({
      name: `projects/${process.env.GCLOUD_PROJECT}/secrets/token-${dashboardId}-qbOnline/versions/latest`,
    })
    tokenValue = version
      ? version.payload.data.toString('utf8')
      : 'No secret found'



      context.data.tokenValue = JSON.parse(tokenValue)
      context.tokenValue = JSON.parse(tokenValue)
  } catch (error) {
    $log.debug(console.error('Error accessing secret:'+ error))
    console.error('Error accessing secret:', error)
    context.err = true
    context.error = error.message
    return res
      .status(500)
      .json({ message: `Error accessing secret: ${error.message}` })
  }

// Get credentials
let credentials
let credentialsName 
credentialsName=`${dashboardId}-qbOnline`

 try {
    let [version2] = await client.accessSecretVersion({
        name: `projects/${process.env.GCLOUD_PROJECT}/secrets/${dashboardId}-qbOnline/versions/latest`,
      })
    credentials = version2
      ? version2.payload.data.toString('utf8')
      : 'No secret found'

    $log.debug('credentials are ')
    $log.debug(credentials)


    context.data.credentials = JSON.parse(credentials)
    context.credentials = JSON.parse(credentials)
  } catch (error) {
      $log.debug(console.error('Error accessing secret:'+ error))
    console.error('Error accessing credentials:', error)
    return res
      .status(500)
      .json({ message: `Error accessing secret: ${error.message}` })
  }
  
  $log.debug(context.tokenValue)
  $log.debug('token value is')
  $log.debug(tokenValue)


  if(!context.credentials || !context.tokenValue) {
    context.data.err = 'Missing credentials or token data step 1'

    context.err =true
    // need to return here
    return
  }
