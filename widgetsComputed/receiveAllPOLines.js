// Function to create a new receipt and associated receipt lines for each purchase line.
async function receiveAllPOLines(data) {
    // Add a new receipt using provided data.
    console.log('data: ', data)
    let receiptIndex = $getGlobalModel('receiptIndex') ? $getGlobalModel('receiptIndex') : 0001
        console.log('receiptIndex pre: ', receiptIndex)

    $setGlobalModel('receiptIndex', )
    console.log('receiptIndex post: ', receiptIndex)
    const nextId = `Receipt-${String(receiptIndex).padStart(4, '0')}`
    let newReceipt = await $dgAddRow('receipts', {
        name: nextId,
        purchaseOrder: data.rowKey,
    });
    console.log('new receipt is', newReceipt);
    $setGlobalModel('receiptIndex', receiptIndex+1)

    // Retrieve all purchase lines and filter them based on the current purchase order.
    let purchaseLines = $getGrid('purchaseLines').filter(line => line.purchaseOrder === data.rowKey);
    console.log('purchase lines are ', purchaseLines);

    // Sequentially process each purchase line to create associated receipt lines.
    for (const [index, line] of purchaseLines.entries()) {

        try {
        
        // Construct a receipt line name.
        // let receiptLineName = newName + '-' + (index + 1);

        // Add a new receipt line for each purchase line.
        await $dgAddRow('receiptLines', {
            name: `${nextId}.0${index+1}`,
            receipt: newReceipt,
            purchaseOrder: line.purchaseOrder,
            purchaseLine: line.rowKey,
        });

    } catch(err) {
        console.log('error creating receipt line: ', err)
    }
}

    // Optional: Show a modal to edit the new receipt.
    $dgShowEditRowModal('receipts', newReceipt);
}

// Async function to handle the creation of receipts and their lines based on purchase order data.
return async function(data) {
    try {
        // Call the function to process all purchase order lines and create receipt records.
        await receiveAllPOLines(data);
    } catch (error) {
        console.error('Error creating receipts:', error);
        // Optional: alert or handle the error appropriately.
    }
};

