// functionFile.js
return async function addToStock(rowData) {
      let allWorkOrderMats = $getGrid('workOrderMaterials')
    // Fetch the work order details from the opportunityLines grid to get the qtytoMfg value
    const allOpportunityLines = await $getGrid('opportunityLines');
    console.log('All Opportunity Lines:', allOpportunityLines);

    const workOrderDetails = allOpportunityLines.find(order => order.rowKey === rowData.rowKey);
    console.log('Work Order Details:', workOrderDetails);

    if (!workOrderDetails) {
        throw new Error('Work order not found');
    }

    const qtytoMfg = workOrderDetails.qtytoMfg;

    // Fetch all location inventory records related to the given workOrder
    const locationInventory = await $getGrid('locationInventory').find((inventory) => inventory.rowKey === rowData.locationInventory);
    
        $dgSetRowVals('locationInventory', rowData.locationInventory, {
            quantity: locationInventory.quantity + qtytoMfg // Increase the quantity by qtytoMfg
        });

      let workOrderMats = allWorkOrderMats.filter(
    (mat) => mat.workOrder === rowData.rowKey
  )

      for (const line of workOrderMats) {
    

      await $dgAddRow('inventoryTransaction', {
        locationInventory: line.locationInventory,
        quantity: 0 - line.quantityIssued,
        workOrder: rowData.rowKey,
        parts: line.part,
        workOrderMaterial: line.rowKey,
      })
    }


}

