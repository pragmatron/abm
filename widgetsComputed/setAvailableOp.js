return async function (workOrder, currentOp) {
    const ops = await $getGrid('workOrderOperations').filter((op) => op.workOrder === workOrder && op.completed !== true);
    const materials = await $getGrid('workOrderMaterials').filter((material) => material.workOrder === workOrder);

    if (ops.length === 0) {
        // Handle the case where there are no matching ops with completed: false.
        $dgSetRowVals('opportunityLines', workOrder, {
            completed: true,
            open: false
        })
        return null; // or some other appropriate value
    }
    console.log('ops: ', ops)

    $dgSetRowVals('workOrderOperations', currentOp, {
        available: false
    })

        // Sort the ops array by sequence property in ascending order
    ops.sort((a, b) => a.sequence - b.sequence);

    console.log('ops[0]', ops[0])
    $dgSetRowVals('workOrderOperations', ops[0].rowKey, {
        available: true
    })
    $dgSetRowVals('opportunityLines', workOrder, {
        currentWorkCell: ops[0].$resourceGroup.$group.rowKey,
        operationStage: "-Nha4KNKbqueef4iB9L2"
    })
    // return ops[0]; // The first element will have the lowest sequence

}