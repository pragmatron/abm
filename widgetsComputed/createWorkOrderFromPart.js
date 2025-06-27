return async function (data, so) {
  $setGlobalModel('creatingWorkOrderFromPart', true)

  try {
  console.log('data: ', data)
  let part = data.part

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

    let newWorkOrderName = data.name.replace('S', 'W')
    const relatedWorkOrders = await $getGrid('opportunityLines').filter((w) => w.salesLine == data.rowKey)

    if (relatedWorkOrders.length) {
  // Calculate the new suffix
  let suffix = ('0' + relatedWorkOrders.length).slice(-2);
  
  // Replace the existing suffix with the new one
  newWorkOrderName = newWorkOrderName.replace(/-\d{2}$/, `-${suffix}`);
}

   let newWorkOrder = await $dgAddRow('opportunityLines', {
   salesLine: data.rowKey,
   name: newWorkOrderName
   })


   await $dgSetRowVals('opportunityLines', newWorkOrder, {
    //  name: data.name.replace('S', 'W'),
    //  layout: "-NZk6yFQh-3_4uzxfAT6",
     stage: '-NZaTKczYyF8kPTfQbwP',
    //  workOrder: data.rowKey,
    open: true
   })
  await new Promise((resolve) => setTimeout(resolve, 1000))

  for (let m of filteredMats) {
    let matsName = `${m.name}-${data.$part$display}`
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
