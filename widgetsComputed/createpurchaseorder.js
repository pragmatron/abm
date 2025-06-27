return async function (rowData) {

    let id = $getGrid('indexOffsets').filter(item => {return item.rowKey === '-NbtkERmsTqXLRFi7kzi'} )[0].offset
    let nextID = 'PO' + String(id).padStart(5,'0')
  
  let newPurchaseOrder = await $dgAddRow('purchaseOrders', {
       name: nextID
    })    
    $dgSetRowVals( 'purchaseOrders', newPurchaseOrder, {
        vendor: rowData.vendor
    })
    let newOffset = id+1
     $dgSetRowVals( 'indexOffsets', '-NbtkERmsTqXLRFi7kzi', {
        offset: newOffset
    })

    let newPurchaseOrderLines = await $dgAddRow('purchaseLines', {
        name: nextID + '.01',
        purchaseOrder: newPurchaseOrder,
        workOrder: rowData.workOrder,
        operation:rowData.rowKey,
        // instructions: rowData.instructions,
        // quantity:rowData.quantityRequired,
        // unitPrice: rowData?.$part?.price
    })
    
    $dgShowEditRowModal('purchaseOrders', newPurchaseOrder)
}