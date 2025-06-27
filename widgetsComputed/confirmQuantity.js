return async function (rowData, qty) {


await $dgSetRowVals('workOrderOperations', rowData.rowKey, {
    quantityRequired: qty
})

console.log('rowData: ', rowData)

console.log('skjksf: ', qty)
}
