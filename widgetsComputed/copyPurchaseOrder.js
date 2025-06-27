return async function (rowData) {
    console.log('Original Quote Data: ', rowData);

    function copyObjectWithoutExcludedProps(obj) {
        const newObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key) && !key.startsWith('$') && key !== '_id' && key !== 'rowKey' && key !== 'oldID' && key !== 'createdDate') {
                if(!Array.isArray(obj[key])) {
                newObj[key] = obj[key];
                }
            }
        }
        return newObj;
    }

    // Clone the main quote
    let newPo = copyObjectWithoutExcludedProps(rowData);
    newPo.name = 'C' + newPo.name;
    let newPoId = await $dgAddRow('purchaseOrders', newPo); // Adding the cloned quote
    console.log('Cloned Po ID: ', newPoId);

    // Correct way to filter quote lines related to the quote
    const purchaseLines = $getGrid('purchaseLines').filter((line) => {
        return line.purchaseOrder === rowData.rowKey;
    });
    console.log('purchaseLines: ', purchaseLines)

    for (let line of purchaseLines) {
        let newLineObj = copyObjectWithoutExcludedProps(line);
        newLineObj.name = 'C' + line.name; // Prefix the cloned quote line's name with "C"
        newLineObj.purchaseOrder = newPoId; // Linking the new line to the cloned quote

        let newLineId = await $dgAddRow('purchaseLines', newLineObj); // Add the cloned quote line

        // need to getgrid ops and mats first
     console.log('Cloned Quote Line ID: ', newLineId);
    }

    // Optionally, open the edit modal for the cloned quote
    $dgShowEditRowModal('purchaseOrders', newPoId);
};
