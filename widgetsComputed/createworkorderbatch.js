return async function(data) {
  
 

    // Set additional values for the new order
    await $dgSetRowVals('workOrderBatches', newOrder, {
        salesOrder: data.rowKey,
    });

    // Show an edit modal for the new sales order
    $dgShowEditRowModal('workOrderBatches', newOrder);
}




