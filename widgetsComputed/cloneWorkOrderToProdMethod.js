return async function (rowData) {
  console.log('rowData: ', rowData);

  let newProdMethod = await $dgAddRow('productionMethods', {
    name: 'copy of work order: ' + rowData.name
  });
  console.log('new Work Order: ', newProdMethod);

  const ops = await $getGrid('workOrderOperations').filter((op) => {
    return op.workOrder === rowData.rowKey;
  });

  console.log('ops: ', ops)

  for (let o of ops) {
     let opName = `${o.sequence}-${o.$name}`
    let newOpId = await $dgAddRow('methodOperations', {
      // workOrder: rowData.rowKey,
      productionMethod: newProdMethod,
      // type: o.operationType,
      sequence: o.sequence,
      name: opName,
      // resourceGroup: o.$operationType ? o.$operationType.resourceGroup : null,
      resourceGroup: o.resourceGroup,
      //     description:o.description,
      instructions: o.instructions,
      resource: o.resource,
      // quantityRequired: rowData.qtytoMfg,
      // rateSpeedperUnit: o.$operationType.rateperUnit,
      // estProductionHours: o.estimatedProductionHours,
      part: rowData.part
    })
    
  }

  $dgShowEditRowModal('productionMethods', newProdMethod);
}
