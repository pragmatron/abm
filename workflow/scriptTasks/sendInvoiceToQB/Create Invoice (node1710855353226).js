
const qs = require('qs');
//Body sample from API explorer examples
const body = {
  //"DocNumber": "AUTO_GENERATE",
  "Line": context.payload.lines, 
  "CustomerRef": {
    "value": context.customer.Id
  },
  "DueDate": context.payload.dueDate,
  "TxnDate": context.payload.TxnDate,
  // "CustomField": [
  //     {
  //         "DefinitionId": "1",
  //         "Name": "P.O. Number",
  //         "Type": "StringType",
  //         "StringValue": context.payload.purchaseOrder
  //     },
  //     {
  //         "DefinitionId": "2",
  //         "Name": "Sales Rep",
  //         "Type": "StringType",
  //         "StringValue": context.payload.salesRep
  //     },
  //     {
  //         "DefinitionId": "3",
  //         "Name": "Priority",
  //         "Type": "StringType",
  //         "StringValue": context.payload.priority
  //     },
  //     {
  //         "DefinitionId": "4",
  //         "Name": "Terms",
  //         "Type": "StringType",
  //         "StringValue": context.payload.terms
  //     }
  // ],
  "TrackingNum": context.payload.trackingNum,
  "SalesTermRef": {
    "value": context.customerTerms ? context.customerTerms : ''
  }
}

context.data.bodySent = body

try {

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `https://quickbooks.api.intuit.com/v3/company/${context.companyId}/invoice?minorversion=40`,
    headers: { 
      'Content-Type': 'application/json', 
      'Accept': 'application/json',
      'Authorization': `Bearer ${context.refreshed.access_token}`
    },
    data : body
  };

  let response = await axios(config)

  response = response.data


  context.data.apiresponseinv = response
} catch(err) {
  const errorResponse =  err.response.data

  context.data.apierrorinv = err;
  context.data.invoiceCreateError = err.message;

  // Add error response data to the context for debugging
  if (errorResponse) {
    context.data.invoiceErrorResponse = errorResponse;
  }
}




