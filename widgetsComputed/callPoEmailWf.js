return async function(rowData) {
  // call the workflow and get the resulting data

    rowData.purchaseLines = $getGrid('purchaseLines').filter((line) => line.purchaseOrder === rowData.rowKey)
    console.log('lines: ', rowData.purchaseLines)

  //   rowData.vendorAddress = {
  //   address1: rowData.$vendor.$defaultPurchasingAddress.address1,
  //   address2: rowData.$vendor.$defaultPurchasingAddress.address2,
  //   address2: rowData.$vendor.$defaultPurchasingAddress.address3,
  //   city: rowData.$vendor.$defaultPurchasingAddress.city,
  //   stateProvince: rowData.$vendor.$defaultPurchasingAddress.stateProvince,
  //   postalCode: rowData.$vendor.$defaultPurchasingAddress.postalCode,
  //   country: rowData.$vendor.$defaultPurchasingAddress.country,
  // }

// rowData.purchaseLines.forEach((line) => {
//   const prodMethod = $getGrid('productionMethods').filter((method) => {
//     return line.$workOrder?.sourceProductionMethod === method.rowKey;
//   });
//   console.log('prodMethod: ',prodMethod)
//   if (prodMethod[0]) line.manual = prodMethod[0]?.$manual?.name
//   if (prodMethod[0]) line.manualRevDateAndNumber = prodMethod[0].$manual.revisionNumberandDate
//   if (prodMethod[0]) line.partText = line.$workOrder.$part$display
//   if (prodMethod[0]) line.serialText = line.$workOrder.seralNumber

//   const serialTextForLine = line.$workOrder.seralNumber ? line.$workOrder.seralNumber : line.$workOrder.$salesOrder.serial
//   line.serialForPo = serialTextForLine
// });

// let totalPriceString = rowData.totalLinePrice;

// // Remove trailing ".00" and convert to an integer
// let totalPriceInteger = parseInt(totalPriceString);

// // Update the property with the new value
// rowData.totalLinePrice = totalPriceInteger;

    let rowDataNoCirc = window.removeCircularReferences(rowData)


  let d = await this.$wfGetData('-NhW2Bz-CGnmDsNaMRlS', rowDataNoCirc)
    // put the response into the global model
    // the global model is a browser memory store templates can render
  //   $setGlobalModel('data', d)
  // return d 
  alert('Email Sent')
}