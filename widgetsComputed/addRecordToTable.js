return async function (rowData) {

    await $dgAddRow('testingAddRowSum', {
        anotherAddRowTable: rowData.rowKey,
        quantity: 2
    })


}