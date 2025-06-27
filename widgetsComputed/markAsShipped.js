return async function (rowData) {

console.log('rowData: ', rowData)
await $dgSetRowVals('shipping', rowData.rowKey, {
    shipped: true
})

let shipmentLines = $getGrid('shipmentLines').filter((line) => line.packingSlip === rowData.rowKey)
console.log('shipmentLines: ', shipmentLines)

        for (const [index, line] of shipmentLines.entries()) {

            let newTransaction = await $dgAddRow('inventoryTransaction', {
                quantity: 0 - line.shippedQuantity,
                shipmentLine: line.rowKey,
                parts: line.part,
                workOrder: line.sourceWorkOrder
            })

        }

}