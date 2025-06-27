
if(context.err) return

if(context.payload.terms) {

  await $log.debug('queried terms ' + context.payload.terms)

let response

try {
  // Retrieve customer using api call
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://quickbooks.api.intuit.com/v3/company/${context.companyId}/query?query=select * from Term where Name = \'${context.payload.terms}\'`,
    headers: { 
      'Content-Type': 'application/json', 
      'Accept': 'application/json', 
      'Authorization': `Bearer ${context.refreshed.access_token}`
    }
  };

  response = await axios(config)
  response = response.data

  context.data.customerapi = response


} catch(err) {
  context.data.err 
  context.err = true
  context.data.errMessage = err.message
  context.terms = false
  await $log.debug(err.message)
}


  await $log.debug('after terms query')
  
  //context.customer = false


  if(response && response.QueryResponse && response.QueryResponse.Term && response.QueryResponse.Term.length > 0) {
    context.customerTerms = response.QueryResponse.Term[0].Id
    context.data.customerTerms = response.QueryResponse.Term[0].Id


  } else {
    context.terms = false
  }
}
