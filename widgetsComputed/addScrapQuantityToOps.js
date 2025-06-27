return async function (rowData) {
    const ops = $getGrid('workOrderOperations').filter((op) => {
       return (op.workOrder === rowData.workOrder && op.sequence > rowData.sequence)
    })

    ops.forEach((op) => {

       return op.scrapQuantity = rowData.scrapQuantity
    })
    
    for(o of ops) {
        await $dgSetRowVals('workOrderOperations', o.rowKey, {
            scrapQuantity: rowData.scrapQuantity
        })
    }
     $dgAddRow('notifications', {
        workOrder: rowData.workOrder,
        workOrderOperation: rowData.rowKey,
        notes: rowData.scrapNotes,
        name: `scrap: ${rowData.$displayName}`
    })
}
