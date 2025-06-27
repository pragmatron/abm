
if(context.err) return

  await $log.debug('queried customer' + context.payload.customerName)
  $log.debug( context.refreshed)

let response

// Set companyId
context.companyId = context.credentials.companyID

if(!context.companyId) {
  $log('Company ID missing from API Credentials')
  context.err = true
  context.data.err = 'Company ID missing from API Credentials, please set it in API Credentials or hardcode it in the workflow'
}

try {
  // Retrieve customer using api call
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://quickbooks.api.intuit.com/v3/company/${context.companyId}/query?query=select * from Customer WHERE FullyQualifiedName = \'${context.payload.customerName}\'`,
    headers: { 
      'Content-Type': 'application/json', 
      'Accept': 'application/json', 
      'Authorization': `Bearer ${context.refreshed.access_token}`
    }
  };
  response = await axios(config)
  response = response.data
  context.data.expiresAt = context.refreshed
  context.data.customerapi = response


} catch(err) {
  context.data.err = err.response?.data || err;
  context.err = true
  context.data.errMessage = err.message
  context.customer = false
  await $log.debug(err.message)
}


  await $log.debug('after customer query')
  
  //context.customer = false


  if(response && response.QueryResponse && response.QueryResponse.Customer && response.QueryResponse.Customer.length > 0) {
    context.customer = response.QueryResponse.Customer[0]
    context.data.customer = response.QueryResponse.Customer[0]
    if(response.QueryResponse.Customer[0].SalesTermRef && response.QueryResponse.Customer[0].SalesTermRef.value) {
      context.customerTerms = response.QueryResponse.Customer[0].SalesTermRef.value
    }


  } else {
    context.customer = false
  }

