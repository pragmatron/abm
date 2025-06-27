return async function (rowData) {

const workOrderOperations = $getGrid('workOrderOperations')
const result = alasql("SELECT * FROM ? WHERE workOrder = ?", [workOrderOperations, rowData.rowKey]);

  // Ask for confirmation
  const confirmed = window.confirm('Are you sure you want to delete these operations?');

  if (confirmed) {
    result.forEach((row) => {
      if (row.completed !== true) {
        $dgRemoveRow('workOrderOperations', row.rowKey);
      }
    });
  } else {
    console.log('Deletion canceled.');
  }
}