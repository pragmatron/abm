return async function(rowData) {
console.log('rowData: ', rowData)
  let id = $getGrid('indexOffsets').filter(item => {return item.rowKey === '-NbtkERmsTqXLRFi7kzi'} )[0].offset
  let nextID = 'PO' + String(id).padStart(5,'0')
  
  let newPurchaseOrder = await $dgAddRow('purchaseOrders', {
       name: nextID
    })    
    $dgSetRowVals( 'purchaseOrders', newPurchaseOrder, {
        vendor: rowData.autoReplenishVendor
    })
  let newOffset = id+1
     $dgSetRowVals( 'indexOffsets', '-NbtkERmsTqXLRFi7kzi', {
        offset: newOffset,
        vendor: rowData.autoReplenishVendor,
        totalAmount: rowData.totalCurrentUnitCost * rowData.autoReplenishAmount
    })

    let newPurchaseOrderLine = await $dgAddRow('purchaseLines', {
        name: nextID + '.01',
        purchaseOrder: newPurchaseOrder,
        quantity: rowData.autoReplenishAmount,
        part: rowData.rowKey,
        unitPrice: rowData.totalCurrentUnitCost,
        totalLinePrice: rowData.totalCurrentUnitCost * rowData.autoReplenishAmount
        // vendor: rowData.autoReplenishVendor
    })
    
    await new Promise(resolve => setTimeout(resolve,  500));

    $dgSetRowVals('parts', rowData.rowKey, {
        quantityOrdered: rowData.autoReplenishAmount
    })

  rowData.purchaseLines = $getGrid('purchaseLines').filter((line) => line.rowKey === newPurchaseOrderLine)
  console.log('lines: ', rowData.purchaseLines)

  let rowDataNoCirc = window.removeCircularReferences(rowData)

  let d = await this.$wfGetData('-NhW2Bz-CGnmDsNaMRlS', rowDataNoCirc)
  
}