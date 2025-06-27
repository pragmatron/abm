


// Use Alasql to sort the data by sortID in descending order and dueDate in ascending order
const sortedData = alasql(`
 SELECT op.*
  FROM ? as op, ? as wo
  where wo.released == true
`, [$getGrid('workOrderOperations'), $getGrid('workOrders')]);

//console.log(updatedData)

// Return the updated and sorted data
return sortedData;
