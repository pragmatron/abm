return async function (rowData) {

    function copyObjectWithoutExcludedProps(obj) {
  const newObj = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && !key.startsWith('$') && key !== '_id' && key !== 'rowKey' && key !== 'oldID' && key !== 'createdDate') {
      newObj[key] = obj[key];
    }
  }

  return newObj;
}

let newProdObj = copyObjectWithoutExcludedProps(rowData)
newProdObj.name = 'clone of ' + newProdObj.name

    let newProdMethod = await $dgAddRow('productionMethods', newProdObj)
    
    const ops = $getGrid('methodOperations').filter((op) => {
        return op.productionMethod === rowData.rowKey
    })
    console.log('ops: ', ops)

      for (let o of ops) {

let newOpObj = copyObjectWithoutExcludedProps(o)
newOpObj.productionMethod = newProdMethod

    let newOpId = await $dgAddRow('methodOperations', newOpObj)
  }

    $dgShowEditRowModal('productionMethods', newProdMethod)
}