return async function(rowData) {
  // call the workflow and get the resulting data
  console.log('data sent to templater', rowData)


 // rowDataNoCirc.opportunityLines = $getGrid('opportunityLines').filter((line) => line.salesOrder === rowData.rowKey  && !line.name.includes('W00'))

rowData.shipmentLines = $getGrid('shipmentLines').filter((line) => line.packingSlip === rowData.rowKey)
   let rowDataNoCirc = window.removeCircularReferences(rowData)
console.log('rowDatNoCirc: ', rowDataNoCirc)

  let d = await this.$wfGetData('-Nr5FMvOQKMJEBIcWTJf', rowDataNoCirc)

  alert('Email Sent')
}