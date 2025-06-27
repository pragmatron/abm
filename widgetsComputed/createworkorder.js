return async function (data, so) {
  $setGlobalModel('creatingWorkOrder', true)

  try {
  console.log('data: ', data)
  let method = data.productionMethod

if (!method) {
  alert('no method selected')
    $setGlobalModel('creatingWorkOrder', false)
  return
} 

  console.log('prod method is ', method)

 
  let ops = $getGrid('methodOperations')

  console.log('ops are ', ops)

  let filteredOps = ops.filter((row) => {
    return row.productionMethod === method
  })

  console.log('operations are ', filteredOps)

  let mats = $getGrid('methodMaterials')

  let filteredMats = mats.filter((row) => {
    return row.productionMethod === method
  })

  console.log('mats: ', filteredMats)

  let workOrdersGrid = $getGrid('opportunityLines')

  workOrdersGrid = workOrdersGrid.filter((wo) => {
    return wo.salesLine === data.rowKey
  })

  let workOrderIndex
  if (workOrdersGrid && workOrdersGrid.length > 0) {
    workOrderIndex = workOrdersGrid.length + 1
  } else {
    workOrderIndex = 1
  }

  workOrderIndex = workOrderIndex.toString()
  workOrderIndex = workOrderIndex.padStart(2, '0')

// get number of work orders already created from sales line so numbering increases and isn't same work order number each time.
    let newWorkOrderName = data.name.replace('S', 'W')
    const relatedWorkOrders = await $getGrid('opportunityLines').filter((w) => w.salesLine == data.rowKey)

    if (relatedWorkOrders.length) {
  // Calculate the new suffix
  let suffix = ('0' + relatedWorkOrders.length).slice(-2);
  
  // Replace the existing suffix with the new one
  newWorkOrderName = newWorkOrderName.replace(/-\d{2}$/, `-${suffix}`);
}

   let newWorkOrder = await $dgAddRow('opportunityLines', {
     name: newWorkOrderName,
   })

   await $dgSetRowVals('opportunityLines', newWorkOrder, {
    //  layout: '-NZk6yFQh-3_4uzxfAT6',
     stage: '-NZaTKczYyF8kPTfQbwP',
     workOrder: data.rowKey,
     workOrderTemplate: '-NbTrm8BEHLaLDCctQ4h',
     salesLine: data.rowKey,
     open: true
   })
  await new Promise((resolve) => setTimeout(resolve, 1000))

  for (let m of filteredMats) {
    let matsName = `${m.name}-${data.$part$display}`
    let newMat = await $dgAddRow('workOrderMaterials', {
      workOrder: newWorkOrder,
    })
    await $dgSetRowVals('workOrderMaterials', newMat, {
      name: matsName,
      sourceMethodMaterial: m.rowKey
    })
  }
  for (let o of filteredOps) {
    let opName = `${o.sequence}-${o.name}`
    let newOpId = await $dgAddRow('workOrderOperations', {
      workOrder: newWorkOrder,
    })
    await $dgSetRowVals('workOrderOperations', newOpId, {
      sequence: o.sequence,
      name: opName,
      sourceMethodOperation: o.rowKey,
      // quantityRequired: data.qtytoMfg,
      estProductionHours: o.estimatedProductionHours,
     
    })
  }
  // set rows instead of adding all at add row thing
    $dgShowEditRowModal('opportunityLines', newWorkOrder)

  $setGlobalModel('creatingWorkOrder', false)
  } catch (error) {
    console.log('Error caught: ', error)
      $setGlobalModel('creatingWorkOrder', false)

  }
}
