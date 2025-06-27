return async function (data) {
  $setGlobalModel('creatingWorkOrderFromPart', true)

  try {
  console.log('data: ', data)
  let part = data.rowKey

if (!part) {
  alert('no method selected')
  return
} 
 
  let ops = $getGrid('methodOperations')

  console.log('ops are ', ops)

  let filteredOps = ops.filter((row) => {
    return row.parentPart === part
  })

  console.log('operations are ', filteredOps)

  let mats = $getGrid('methodMaterials')

  let filteredMats = mats.filter((row) => {
    return row.parentPart === part
  })

  console.log('mats: ', filteredMats)

      let id = $getSharedModel("workOrderIndex")
      ? $getSharedModel("workOrderIndex")
      : 30202;
    let nextID = "WO" + String(id);

   let newWorkOrder = await $dgAddRow('opportunityLines', {
//    salesLine: data.rowKey,
   name: nextID,
   part: part
   })

$setSharedModel("workOrderIndex", id+1)
   await $dgSetRowVals('opportunityLines', newWorkOrder, {
    //  name: data.name.replace('S', 'W'),
    //  layout: "-NZk6yFQh-3_4uzxfAT6",
     stage: '-NZaTKczYyF8kPTfQbwP',
    //  workOrder: data.rowKey,
    open: true
   })
  await new Promise((resolve) => setTimeout(resolve, 10))

  for (let m of filteredMats) {
    let matsName = `${m.name}-${m.$part$display}`
    let newMat = await $dgAddRow('workOrderMaterials', {
    workOrder: newWorkOrder,
    name: matsName,
    })
    await $dgSetRowVals('workOrderMaterials', newMat, {
    sourceMethodMaterial: m.rowKey
    })    
  }
  for (let o of filteredOps) {
    let opName = `${o.sequence}-${o.name}`
    let newOpId = await $dgAddRow('workOrderOperations', {
      workOrder: newWorkOrder,
      name: opName,
      // part: part
    })
      await $dgSetRowVals('workOrderOperations', newOpId, {
      sourceMethodOperation: o.rowKey,

        })
  }
console.log('under ops')
    $dgShowEditRowModal('opportunityLines', newWorkOrder)

  $setGlobalModel('creatingWorkOrderFromPart', false)
  } catch (error) {
    console.log('Error caught: ', error)
      $setGlobalModel('creatingWorkOrderFromPart', false)

  }
}
