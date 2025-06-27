return async function (rowData) {
console.log('rowData: ', rowData)
function copyObjectWithoutExcludedProps(obj) {
  const newObj = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && !key.startsWith('$') && key !== '_id' && key !== 'rowKey' && key !== 'oldID' && key !== 'createdDate') {
      newObj[key] = obj[key];
    }
  }

  return newObj;
}
let newOrder = copyObjectWithoutExcludedProps(rowData)
newOrder.name = 'C' + newOrder.name
let newWorkOrder = await $dgAddRow('opportunityLines', newOrder)
console.log('new Work Order: ', newWorkOrder)

   const ops = $getGrid('workOrderOperations').filter((op) => {
        return op.workOrder === rowData.rowKey
    })

for (let o of ops) {

  let newOpObj = copyObjectWithoutExcludedProps(o)
  newOpObj.workOrder = newWorkOrder

let newOpId = await $dgAddRow('workOrderOperations', newOpObj)

}

   const mats = $getGrid('workOrderMaterials').filter((op) => {
        return op.workOrder === rowData.rowKey
    })

for (let m of mats) {

  let newOpObj = copyObjectWithoutExcludedProps(m)
  newOpObj.workOrder = newWorkOrder

let newOpId = await $dgAddRow('workOrderMaterials', newOpObj)

}




$dgShowEditRowModal('opportunityLines', newWorkOrder)

}