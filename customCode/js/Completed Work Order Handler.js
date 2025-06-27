// New function to check if all operations are completed
const checkAndSetWorkOrderCompleted = async (rowData) => {
    const operations = $getGrid('workOrderOperations').filter(operation => operation.workOrder === rowData.rowKey);
    const allCompleted = operations.every(operation => operation.completed);

    if (allCompleted) {
        await $setDataGridVal('workOrder', `${workOrderRowKey}.completed`, true);
        // Call the handler with the updated work order data
        const workOrder = $getGrid('workOrder').find(wo => wo.rowKey === rowData.rowKey);
        if (workOrder) {
            workOrder.completed = true;
            window.completedWorkOrderHandler(workOrder);
        }
    }
};

// Existing handler
window.completedWorkOrderHandler = async (rowData) => {
    console.log(rowData.completed);
    console.log('this log works!');
    
    const materials = $getGrid('workOrderMaterials').filter(material => material.workOrder === rowData.rowKey);
    console.log(rowData);
    
    if (rowData.completed) {
        for (let i = 0; i < materials.length; i++) {
            const material = materials[i];
            await $setDataGridVal('workOrderMaterials', `${material.rowKey}.remainingToAssign`, 0);
        }

        await $setDataGridVal('workOrder', `${rowData.rowKey}.completedDate`, Date.now());
        console.log('test setting status to complete');
       

        const operations = $getGrid('workOrderOperations').filter(operation => operation.workOrder === rowData.rowKey);
        for (const operation of operations) {
            await $setDataGridVal('workOrderOperations', `${operation.rowKey}.completed`, true);
        }
    } else {
        await $setDataGridVal('workOrder', `${rowData.rowKey}.completedDate`, '');
        await $setDataGridVal('workOrder', `${rowData.rowKey}.workOrderStatus`, '');
        if (materials) {
            for (const material of materials) {
                const remaining = material.quantityRequired - material.quantityIssued;
                await $setDataGridVal('workOrderMaterials', `${material.rowKey}.remainingToAssign`, remaining);
            }
        }
    }

    const wos = $getGrid('workOrder').filter(f => f.salesOrder == rowData.salesOrder && !f.completed);
    if (!wos[0]) {
        console.log('set complete date');
        await $setDataGridVal('salesLines', `${rowData.salesLine}.completEDdate`, Date.now());
    } else {
        console.log('clear complete date');
        await $setDataGridVal('salesLines', `${rowData.salesLine}.completEDdate`, '');
    }
};

// Example usage of checkAndSetWorkOrderCompleted
const onOperationCompletedChange = async (operationRowKey, completed) => {
    await $setDataGridVal('workOrderOperations', `${operationRowKey}.completed`, completed);
    const operation = $getGrid('workOrderOperations').find(op => op.rowKey === operationRowKey);
    if (operation) {
        await checkAndSetWorkOrderCompleted(operation.workOrder);
    }
};
