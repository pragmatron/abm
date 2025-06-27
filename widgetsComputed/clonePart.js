return async function (rowData) {
  console.log('rowData: ', rowData)
  
  function copyObjectWithoutExcludedProps(obj) {
    const newObj = {};
    for (const key in obj) {
      if (
        obj.hasOwnProperty(key) && 
        !key.startsWith('$') && 
        key !== '_id' && 
        key !== 'rowKey' && 
        key !== 'oldID' && 
        key !== 'createdDate' && 
        key !== 'name' && 
        key !== 'partToClone' &&
        typeof obj[key] !== 'object' // Exclude objects
      ) {
        // Additional check to exclude arrays (which are also objects but typeof returns 'object')
        if (!Array.isArray(obj[key])) {
          newObj[key] = obj[key];
        }
      }
    }
    return newObj;
  }
  
  // Clone the part
  let newPartObj = copyObjectWithoutExcludedProps(rowData.$partToClone)
  // let newPart = await $dgAddRow('parts', newPartObj)
  await $dgSetRowVals('parts', rowData.rowKey, newPartObj)
  
  // Clone related materials
  if(!rowData.onlyOperations) {
    const snapshot = await this.$dbService
      .getRef("models/methodMaterials")
      .orderByChild("parentPart")
      .equalTo(rowData.partToClone)
      .once("value");
    const filteredMats = Object.values(snapshot.val() || {});
    console.log('materials: ', filteredMats)
    
    for (let m of filteredMats) {
      let newMatObj = copyObjectWithoutExcludedProps(m)
      newMatObj.parentPart = rowData.rowKey
      let newMatId = await $dgAddRow('methodMaterials', newMatObj)
    }
  }
  
  // Clone related operations
  if(!rowData.onlyMaterials) {
    const snapshotOps = await this.$dbService
      .getRef("models/methodOperations")
      .orderByChild("parentPart")
      .equalTo(rowData.partToClone)
      .once("value");
    const filteredOps = Object.values(snapshotOps.val() || {});
    console.log('operations: ', filteredOps)
    
    for (let op of filteredOps) {
      let newOpObj = copyObjectWithoutExcludedProps(op)
      newOpObj.parentPart = rowData.rowKey
      let newOpId = await $dgAddRow('methodOperations', newOpObj)
    }
  }
  
  // Show the edit modal for the new part
  // $dgShowEditRowModal('parts', newPart)
}