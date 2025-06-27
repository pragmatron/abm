const body = {
  "FullyQualifiedName": context.payload.customerName || '', 
  "PrimaryEmailAddr": {
    "Address": context.payload.email ? context.payload.email : '',
  }, 
  "DisplayName": context.payload.customerName || '', 
  "PrimaryPhone": {
    "FreeFormNumber": context.payload.customerPhone || '',
  }, 
  "CompanyName": context.payload.customerName || '', 
  "BillAddr": {
    "Line1": context.payload.billingAddress ? context.payload.billingAddress : '', 
    "Country": "USA"
  }, 
}

context.data.customerBody = body

try {

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `https://quickbooks.api.intuit.com/v3/company/${context.companyId}/customer?minorversion=70`,
    headers: { 
      'Content-Type': 'application/json', 
      'Accept': 'application/json',
      'Authorization': `Bearer ${context.refreshed.access_token}`
    },
    data: body
  };

  let response = await axios(config)

  response = response.data
  context.customer = response.Customer
  context.data.apiresponsecust = response
} catch(err) {
  context.data.errorResponse = err.response.data || ''
  context.data.apierrorinv =err
  context.data.invoiceCreateError = err.message
}