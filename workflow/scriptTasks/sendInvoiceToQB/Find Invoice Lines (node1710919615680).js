
if(context.err) return
if(context.payload.lines && context.payload.lines.length) {
    let lines = context.payload.lines

    for(let i=0; i < lines.length; i++) {
        try {
          if(!context.missingItems) {

          let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://quickbooks.api.intuit.com/v3/company/${context.companyId}/query?query=select * from Item WHERE FullyQualifiedName = '${lines[i].SalesItemLineDetail.ItemRef.name}'`,
            headers: { 
              'Content-Type': 'application/json', 
              'Accept': 'application/json', 
              'Authorization': `Bearer ${context.refreshed.access_token}`
            }
          };

          let response = await axios(config)
          response = response.data

          if(response && response.QueryResponse && response.QueryResponse.Item && response.QueryResponse.Item.length > 0) {

            let item = response.QueryResponse.Item[0]

            lines[i].SalesItemLineDetail.ItemRef["value"] = item.Id

          } else {
            context.missingItems = true
          }


          }
          
        } catch(err) {
          context.data.apierror =err.message
        }
    }


    context.data.linesModified = lines
}