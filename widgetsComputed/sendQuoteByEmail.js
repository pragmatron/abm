return async function(rowData) {
    $getGlobalModel('sendingQuote')
  // call the workflow and get the resulting data
  console.log('data sent to templater', rowData)


 // rowDataNoCirc.opportunityLines = $getGrid('opportunityLines').filter((line) => line.salesOrder === rowData.rowKey  && !line.name.includes('W00'))

rowData.quoteLines = $getGrid('quoteLines').filter((line) => line.quote === rowData.rowKey)
   let rowDataNoCirc = window.removeCircularReferences(rowData)
console.log('rowDatNoCirc: ', rowDataNoCirc)

  let d = await this.$wfGetData('-NhXh-hEPfoWak7xXdKc', rowDataNoCirc)
    // put the response into the global model
    // the global model is a browser memory store templates can render
    $setGlobalModel('sendingQuote', false)
    alert('Email Sent')
  // return d 
}