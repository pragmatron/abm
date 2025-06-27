return async function (data) {
console.log('data: ', data)
  $setGlobalModel('opStarted', true);

  const timeCard = $getUser('card')
  console.log('timeCardForUser: ', timeCard)

// add a new time record and link up the operation 
let newEntry = await $dgAddRow('timeEntries', {
  name:data.name,
  employee: fbUser.uid,
  started: new Date().toISOString(), // Current date and time in ISO format
  workOrderOperation: data.rowKey, // Setting the operation to data.rowKey
  resource: data.resource, // Setting the resource from the data object
  resourceGroup: data.resourceGroup,
  timeCards: timeCard
});

await $dgSetRowVals('workOrderOperations', data.rowKey, {
  timeEntry: newEntry,
  activeUser: fbUser.uid, 
  started: new Date().toISOString()
});

  // get all ops
  const ops = await $getGrid('workOrderOperations').filter((op) => op.workOrder === data.workOrder && op.completed !== true);

  // Sort the ops array by sequence property in ascending order
  ops.sort((a, b) => a.sequence - b.sequence);
  // sets the one after the lowest as the 0 index is the current op
  const lastOp = ops[1]
  console.log('lastOp: ', lastOp)

await $dgSetRowVals('opportunityLines', data.workOrder, {
  lastOperationReported: data.rowKey,
  lastOperationReportedTimestamp: new Date().toISOString(),
  nextOperation: lastOp.rowKey,
  lastActiveUser: fbUser.uid,
  currentWorkCell: data.resourceGroup,
  operationStage: "-Nha4KNyiUPQD_Dfq2Xw"
})

  $setGlobalModel('opsChanged', true);
  $setGlobalModel('opStarted', false);

    
}