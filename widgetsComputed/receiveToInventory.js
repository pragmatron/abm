return async function (rowData) {
    console.log('rowData: ', rowData);
    try {
        const locationPartExists = $getGrid('locationInventory').find((locInv) => locInv.part === rowData.part && locInv.location === rowData.location);
        console.log('locationInventoryExists');
        let locationInventoryRowKey;
        if (locationPartExists) {
            const locationInventory = $getDashboardModel('locationInventory')[locationPartExists.rowKey];
            console.log('inside if', locationInventory);

            await $dgSetRowVals('locationInventory', locationInventory.rowKey, {
                quantity: rowData.quantityReceived + locationInventory.quantity,
            });
            locationInventoryRowKey = locationInventory.rowKey; // Use this rowKey for the inventoryTransaction
        } else {
            let newLocation = await $dgAddRow('locationInventory', {
                part: rowData.part, // Assuming you have part in rowData
                location: rowData.location, // Assuming you have location in rowData
                quantity: rowData.quantityReceived, // Set initial quantity
                receiptLine: rowData.rowKey,
                name: `${rowData.$location$display}-${rowData.$part$display}`,
            });
            locationInventoryRowKey = newLocation; // Use the newly created rowKey for the inventoryTransaction
        }

        // This part is outside the if/else block, so it executes regardless of the above condition.
        let newTran = await $dgAddRow('inventoryTransaction', {
            name: `${rowData.$part$display}-${rowData.name}`,
            quantity: rowData.quantityReceived,
            locationInventory: locationInventoryRowKey,
            receiptLine: rowData.rowKey,
        });

        await $setDataGridVal('receiptLines', rowData.rowKey + '.received', true);
        await $setDataGridVal('receiptLines', rowData.rowKey + '.receivedDate', Date.now());
        
        // Show edit row modal for the location inventory, whether it was just created or found.
        $dgShowEditRowModal('locationInventory', locationInventoryRowKey);
        
    } catch (error) {
        console.error('An error occurred:', error);
        // Handle the error appropriately
    }
};

