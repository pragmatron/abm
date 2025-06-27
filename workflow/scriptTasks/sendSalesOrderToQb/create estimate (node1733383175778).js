if (context.err) return;

const qs = require('qs');

if (context.payload.salesLines && context.payload.salesLines.length) {
    let salesLines = context.payload.salesLines;

    for (let i = 0; i < salesLines.length; i++) {
        try {
            if (!context.missingItems) {
                let config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: `https://quickbooks.api.intuit.com/v3/company/${context.companyId}/query?query=select * from Item WHERE FullyQualifiedName = '${salesLines[i].$part$display}'`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${context.refreshed.access_token}`
                    }
                };

                let response = await axios(config);
                response = response.data;

                if (response && response.QueryResponse && response.QueryResponse.Item && response.QueryResponse.Item.length > 0) {
                    let item = response.QueryResponse.Item[0];

                    // Update ItemRef value with QuickBooks Item ID
                    salesLines[i].ItemRef = item.Id;
                } else {
                    // Item doesn't exist - create it
                    try {
                        // First, query to get a valid income account ID
                        let accountConfig = {
                            method: 'get',
                            maxBodyLength: Infinity,
                            url: `https://quickbooks.api.intuit.com/v3/company/${context.companyId}/query?query=select * from Account WHERE AccountType = 'Income' MAXRESULTS 1000`,
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'Authorization': `Bearer ${context.refreshed.access_token}`
                            }
                        };
                        
                        const accountResponse = await axios(accountConfig);
                        const accountData = accountResponse.data;
                        context.data.accountsdata = accountData
                        
                        // Use the first income account found or the one specified in payload
                        const incomeAccountId = context.payload.incomeAccountId || 
                            (accountData.QueryResponse && 
                             accountData.QueryResponse.Account && 
                             accountData.QueryResponse.Account.length > 0 ? 
                             accountData.QueryResponse.Account[0].Id : null);
                             
                        if (!incomeAccountId) {
                            throw new Error("No valid income account found in QuickBooks");
                        }
                        
                        const itemBody = {
                            "Name": salesLines[i].$part$display,
                            IncomeAccountRef: {
                            value: "286",
                            name:"40001" // The ID of your Revenue account
                            },
                            "Type": "Service", // Default to Service type
                            "Description": salesLines[i].description || "",
                            "Active": true,
                            "Taxable": context.payload.isTaxable || false,
                            "UnitPrice": salesLines[i].unitPrice || 0
                        };

                        // Add inventory-related fields if needed
                        if (context.payload.isInventoryItem) {
                            // For inventory items, we need to find valid asset and expense accounts
                            let assetAccountId = context.payload.assetAccountId;
                            let expenseAccountId = context.payload.expenseAccountId;
                            
                            if (!assetAccountId || !expenseAccountId) {
                                // Query for valid asset account
                                let assetConfig = {
                                    method: 'get',
                                    maxBodyLength: Infinity,
                                    url: `https://quickbooks.api.intuit.com/v3/company/${context.companyId}/query?query=select * from Account WHERE AccountType = 'Other Current Asset' MAXRESULTS 1`,
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json',
                                        'Authorization': `Bearer ${context.refreshed.access_token}`
                                    }
                                };
                                
                                // Query for valid expense account
                                let expenseConfig = {
                                    method: 'get',
                                    maxBodyLength: Infinity,
                                    url: `https://quickbooks.api.intuit.com/v3/company/${context.companyId}/query?query=select * from Account WHERE AccountType = 'Cost of Goods Sold' MAXRESULTS 1`,
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json',
                                        'Authorization': `Bearer ${context.refreshed.access_token}`
                                    }
                                };
                                
                                const [assetResponse, expenseResponse] = await Promise.all([
                                    axios(assetConfig),
                                    axios(expenseConfig)
                                ]);
                                
                                assetAccountId = assetAccountId || 
                                    (assetResponse.data.QueryResponse && 
                                     assetResponse.data.QueryResponse.Account && 
                                     assetResponse.data.QueryResponse.Account.length > 0 ? 
                                     assetResponse.data.QueryResponse.Account[0].Id : null);
                                     
                                expenseAccountId = expenseAccountId || 
                                    (expenseResponse.data.QueryResponse && 
                                     expenseResponse.data.QueryResponse.Account && 
                                     expenseResponse.data.QueryResponse.Account.length > 0 ? 
                                     expenseResponse.data.QueryResponse.Account[0].Id : null);
                            }
                            
                            if (!assetAccountId || !expenseAccountId) {
                                // If we can't find valid accounts, don't create as inventory item
                                context.data.inventoryAccountWarning = "Could not find valid asset or expense accounts for inventory item";
                            } else {
                                itemBody.TrackQtyOnHand = true;
                                itemBody.QtyOnHand = context.payload.initialQuantity || 0;
                                itemBody.AssetAccountRef = { 
                                    "value": assetAccountId
                                };
                                itemBody.ExpenseAccountRef = {
                                    "value": expenseAccountId
                                };
                            }
                        }

                        const createConfig = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: `https://quickbooks.api.intuit.com/v3/company/${context.companyId}/item?minorversion=70`,
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'Authorization': `Bearer ${context.refreshed.access_token}`
                            },
                            data: itemBody
                        };
                        
                        const createResponse = await axios(createConfig);
                        const newItem = createResponse.data.Item;
                        
                        // Store item creation response for debugging
                        if (!context.data.createdItems) context.data.createdItems = [];
                        context.data.createdItems.push(createResponse.data);
                        
                        // Use the newly created item ID
                        salesLines[i].ItemRef = newItem.Id;
                    } catch (createErr) {
                        if (!context.data.itemCreateErrors) context.data.itemCreateErrors = [];
                        context.data.itemCreateErrors.push({
                            item: salesLines[i].$part$display,
                            error: createErr.message,
                            details: createErr.response ? createErr.response.data : ''
                        });
                        
                        // Mark missing items to stop further processing if item creation failed
                        context.missingItems = true;
                    }
                }
            }
        } catch (err) {
            // Capture any API error
            context.data.apierror = err.message;
        }
        try {
            if(context.err) return

            await $log.debug('queried class' + context.payload.className)
            $log.debug(context.refreshed)

            let response

            // Set companyId
            context.companyId = context.credentials.companyID

            if(!context.companyId) {
                $log('Company ID missing from API Credentials')
                context.err = true
                context.data.err = 'Company ID missing from API Credentials, please set it in API Credentials or hardcode it in the workflow'
            }

            try {
                // Retrieve class using api call
                let config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: `https://quickbooks.api.intuit.com/v3/company/${context.companyId}/query?query=select * from Class WHERE FullyQualifiedName = \'${salesLines[i].$class$display}\'`,
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Accept': 'application/json', 
                        'Authorization': `Bearer ${context.refreshed.access_token}`
                    }
                };
                response = await axios(config)
                response = response.data
                context.data.expiresAt = context.refreshed
                context.data.classapi = response
                if (response && response.QueryResponse && response.QueryResponse.Class && response.QueryResponse.Class.length > 0) {
                    let item = response.QueryResponse.Class[0];
                    // Update ItemRef value with QuickBooks Item ID
                    salesLines[i].ClassRef = item.Id;
                } 
            } catch(err) {
                context.data.err = err.response?.data || err;
                context.err = true
                context.data.errMessage = err.message
                context.class = false
                await $log.debug(err.message)
            }

            await $log.debug('after class query')
            
            if(response && response.QueryResponse && response.QueryResponse.Class && response.QueryResponse.Class.length > 0) {
                context.class = response.QueryResponse.Class[0]
                context.data.class = response.QueryResponse.Class[0]
            } else {
                context.class = false
            }
        } catch(err) {
            context.data.apierror = err.message
        }
    }

    // Set modified lines to prepare for creating an estimate
    context.estimateLines = salesLines.map(line => ({
        DetailType: 'SalesItemLineDetail',
        Amount: line.totalLineAmount,
        Description: line.name + ' - ' + line.description,
        SalesItemLineDetail: {
            ItemRef: {
                value: line.ItemRef
            },
            Qty: line.quantity,
            UnitPrice: line.unitPrice || null,
            ClassRef: {
                value: line.ClassRef
            }
        },
    }));
}

if (!context.missingItems) {
    // Check for existing estimate with the same DocNumber
    try {
        if (context.payload.name) {
            // Query to find an existing estimate with the same DocNumber
            let existingEstimateConfig = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `https://quickbooks.api.intuit.com/v3/company/${context.companyId}/query?query=select * from Estimate WHERE DocNumber = '${context.payload.name}'`,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${context.refreshed.access_token}`
                }
            };
            
            const existingEstimateResponse = await axios(existingEstimateConfig);
            const existingEstimateData = existingEstimateResponse.data;
            
            // If an estimate with this DocNumber already exists, delete it
            if (existingEstimateData.QueryResponse && 
                existingEstimateData.QueryResponse.Estimate && 
                existingEstimateData.QueryResponse.Estimate.length > 0) {
                
                const existingEstimate = existingEstimateData.QueryResponse.Estimate[0];
                context.data.existingEstimate = existingEstimate;
                
                // Delete the existing estimate
                let deleteConfig = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `https://quickbooks.api.intuit.com/v3/company/${context.companyId}/estimate?operation=delete`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${context.refreshed.access_token}`
                    },
                    data: {
                        "Id": existingEstimate.Id,
                        "SyncToken": existingEstimate.SyncToken
                    }
                };
                
                const deleteResponse = await axios(deleteConfig);
                context.data.deleteResponse = deleteResponse.data;
            }
        }
    } catch (err) {
        context.data.existingEstimateError = err.message;
        // Log error but continue with creating new estimate
    }

    // Construct the body for the estimate
    const body = {
        "Line": context.estimateLines,
        "CustomerRef": {
            "value": context.customer.Id
        },
        "TxnStatus": "Pending", 
        "SalesTermRef": {
            "value": context.customerTerms ? context.customerTerms : ''
        },
        "DocNumber": context.payload.name || '',
        "BillEmail": {
            "Address": context.payload.billingEmail || context.payload.billEmail || ''
        }, 
        "ShipDate": context.payload.shipDate || '',
        "DueDate": context.payload.dueDate || '',
        "BillAddr": {
            "Line1": context.payload.billToContact || '', // Add billToContact here
            "Line2": context.payload.billAddress1 || '',
            "Line3": context.payload.billAddress2 || '',
            "City": context.payload.billCity || '',
            "CountrySubDivisionCode": context.payload.billState || '',
            "PostalCode": context.payload.billZip || '',
            "Country": context.payload.billCountry || '',

        },
        "ShipAddr": {
            "Line1": context.payload.shipToContact || '', // Add shipToContact here
            "Line2": context.payload.address1 || '',
            "Line3": context.payload.address2 || '',
            "City": context.payload.city || '',
            "CountrySubDivisionCode": context.payload.state || '',
            "PostalCode": context.payload.zip || '',
            "Country": context.payload.country || '',
            "Note": context.payload.shippingEmail || ''
        },
        // Add custom field directly
        "CustomField": [
            {
            "DefinitionId": "1",
            "Name": "P.O. Number",
            "Type": "StringType",
            "StringValue": context.payload.PONumber || ''
            },
            {
                "DefinitionId":"3",
                "Name": "Sale Order",
                "Type": "StringType",
                "StringValue": context.payload.name
            },
            {
               "DefinitionId":"2",
                "Name": "Quote #",
                "Type": "StringType",
                "StringValue": context.payload.quote
            }
        ]
    };

    context.data.bodySent = body; // For debugging and verification

    try {
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://quickbooks.api.intuit.com/v3/company/${context.companyId}/estimate?minorversion=40`,
            headers: { 
                'Content-Type': 'application/json', 
                'Accept': 'application/json',
                'Authorization': `Bearer ${context.refreshed.access_token}`
            },
            data: body
        };

        let response = await axios(config);
        response = response.data;

        // Store the API response for debugging or further use
        context.data.apiresponseEstimate = response;
    } catch (err) {
        const errorResponse = err.response?.data;

        context.data.apierrorEstimate = err;
        context.data.estimateCreateError = err.message;

        // Add error response data to the context for debugging
        if (errorResponse) {
            context.data.estimateErrorResponse = errorResponse;
        }
    }
    // get the custom fields
await $log.debug('Querying available custom fields for estimates');
$log.debug(context.refreshed);

let response;

// Set companyId
context.companyId = context.credentials.companyID.replace(/\s+/g, '');

if (!context.companyId) {
  $log('Company ID missing from API Credentials');
  context.err = true;
  context.data.err = 'Company ID missing from API Credentials, please set it in API Credentials or hardcode it in the workflow';
}

try {
  // Retrieve a sample Estimate to get available custom fields
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://quickbooks.api.intuit.com/v3/company/${context.companyId}/query?query=${encodeURIComponent("SELECT * FROM Estimate MAXRESULTS 1")}`,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${context.refreshed.access_token}`
    }
  };

  response = await axios(config);
  response = response.data;

  context.data.estimateCustomFields = [];

  if (response && response.QueryResponse && response.QueryResponse.Estimate && response.QueryResponse.Estimate.length > 0) {
    const sampleEstimate = response.QueryResponse.Estimate[0];
    if (sampleEstimate.CustomField && sampleEstimate.CustomField.length > 0) {
      context.data.EstimateCustomFields = sampleEstimate.CustomField; // Save custom fields
      await $log.debug('Custom fields found:', sampleEstimate.CustomField);
    } else {
      await $log.debug('No custom fields found on the sample Estimate.');
    }
  } else {
    await $log.debug('No Estimates found or unable to fetch custom fields.');
  }

} catch (err) {
  context.data.err = true;
  context.err = true;
  context.data.errMessage = err.message;
  await $log.debug(err.message);
}

await $log.debug('Finished querying custom fields for Estimates');
// finish get custom fields
}