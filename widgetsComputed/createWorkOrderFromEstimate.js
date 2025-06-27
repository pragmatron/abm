return async function (data) {
  console.log('data: ', data)

  $setGlobalModel('creatingWorkOrderFromEstimate', true)

  try {

  let filteredOps = await $getGrid('estimateOperations').filter((op) => {
    return op.salesLine === data.rowKey
  })

  console.log('estimate operations are ', filteredOps)

  let filteredMats = await $getGrid('estimateMaterials').filter((material) => {
    return material.salesLine === data.rowKey
  })

  console.log('mats: ', filteredMats)

  let newWorkOrder = await $dgAddRow('opportunityLines')

   await $dgSetRowVals('opportunityLines', newWorkOrder, {
     name: data.name.replace('S', 'W'),
    //  layout: "-NZk6yFQh-3_4uzxfAT6",
     stage: '-NZaTKczYyF8kPTfQbwP',
     salesLine: data.rowKey
   })

  for (let m of filteredMats) {
    let matsName = `${m.name}`
    let newMatId = await $dgAddRow('workOrderMaterials', {
      // name: matsName,
      // part: m.part,
      // quantityRequired: data.quantity,
    
    })
    await $dgSetRowVals('workOrderMaterials', newMatId, {
      workOrder: newWorkOrder,
      name: matsName,
      sourceEstimateMaterial: m.rowKey,
      workOrderQuantity: data.quantity
    })
  }

  for (let o of filteredOps) {
    
    let newOpId = await $dgAddRow('workOrderOperations', {
      name: o.name,
      // quantityRequired: o.quantity,
      // part: o.part
    })

      await $dgSetRowVals('workOrderOperations', newOpId, {
      workOrder: newWorkOrder,
      sourceEstimateOperation: o.rowKey,
      type: o.operationType,
      resource: o.resource,
      resourceGroup: o.resourceGroup,
      quantityRequired: data.quantity
    })
  }

  $setGlobalModel('creatingWorkOrderFromEstimate', false)
$dgShowEditRowModal('opportunityLines', newWorkOrder)

  } catch (error) {
    console.log('Error caught: ', error)
      $setGlobalModel('creatingWorkOrderFromEstimate', false)

  }

}