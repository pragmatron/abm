return async function(data, grid, sourceRecord) {
  
 

    // Set additional values for the new order
 let newRecord = await $dgAddRow(grid,  {
        [sourceRecord]: data.rowKey,
    });

    // Show an edit modal for the new sales order
    $dgShowEditRowModal(grid, newRecord);
}