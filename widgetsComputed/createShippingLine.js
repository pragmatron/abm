return async function (rowData) {
    
 //   let newPurchaseOrder = await $dgAddRow('purchaseOrders', {
  //      workOrder: rowData.workOrder,
  //      vendor: rowData.vendor
 //   })

    let newShipmentLine = await $dgAddRow('shipmentLines', {
    //    purchaseOrder: newPurchaseOrder,
        sourceWorkOrder: rowData.rowKey,
        part: rowData.part,
        pO: rowData.pO,
        
        // operation:rowData.rowKey,
        // instructions: rowData.instructions,
        // quantity:rowData.quantityRequired
    })
    
    $dgShowEditRowModal('shipmentLines', newShipmentLine)
}