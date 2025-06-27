return async function (rowData) {
  const userConfirmed = window.confirm("Are you sure you want to import new operations?");


console.log('rowData: ', rowData)
  if (userConfirmed) {
const methodOperations = $getGrid('methodOperations');
const result = alasql("SELECT * FROM ? WHERE productionMethod = ?", [methodOperations, rowData.prodmethodfornewops]);
console.log('result', result)

const filteredResult = result.filter((item) => {
  const sequence = item.sequence;
  return sequence >= rowData.startSequence && sequence <= rowData.endSequence;
});

console.log('filtered result: ', filteredResult)

  for (let o of filteredResult) {
    let opName = `${o.sequence}-${o.$operationType$display}`
    let newOpId = await $dgAddRow('workOrderOperations', {
      workOrder: rowData.rowKey,
      type: o.operationType,
      sequence: o.sequence,
      name: opName,
      resourceGroup: o.$operationType ? o.$operationType.resourceGroup : null,
      //     description:o.description,
      instructions: o.instructions,
      resource: o.resource,
      quantityRequired: rowData.qtytoMfg,
      rateSpeedperUnit: o.$operationType.rateperUnit
    })
  }
  } else {
    console.log('User canceled the action');
  }

}
