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
        console.log(newObj)
        return newObj;
    }

    // Clone the main quote
    let newQuote = copyObjectWithoutExcludedProps(rowData);
    newQuote.name = 'C' + newQuote.name;
    let newQuoteId = await $dgAddRow('quotes', newQuote); // Adding the cloned quote
    console.log('Cloned Quote ID: ', newQuoteId);

    // Correct way to filter quote lines related to the quote
    const quoteLines = $getGrid('quoteLines').filter((line) => {
        return line.quote === rowData.rowKey;
    });

    for (let line of quoteLines) {
        let newLineObj = copyObjectWithoutExcludedProps(line);
        newLineObj.name = 'C' + line.name; // Prefix the cloned quote line's name with "C"
        newLineObj.quote = newQuoteId; // Linking the new line to the cloned quote

        let newLineId = await $dgAddRow('quoteLines', newLineObj); // Add the cloned quote line

        // need to getgrid ops and mats first

        const estimateOps = $getGrid('estimateOperations').filter((op) => op.quoteLine === line.rowKey)

        for(let op of estimateOps) {
        
        let newOpObj = copyObjectWithoutExcludedProps(op)
        newOpObj.quoteLine = newLineId

        let newEstimateOp = await $dgAddRow('estimateOperations', newOpObj)    

        }

        const estimateMats = $getGrid('estimateMaterials').filter((mat) => mat.quoteLine === line.rowKey)

        for(let mat of estimateMats) {
        
        let newOpObj = copyObjectWithoutExcludedProps(mat)
        newOpObj.quoteLine = newLineId

        let newEstimateOp = await $dgAddRow('estimateMaterials', newOpObj)    

        }

        // Assuming Estimate Operations are nested within quote lines
        // if (line.estimateOperations && line.estimateOperations.length > 0) {
        //     newLineObj.estimateOperations = line.estimateOperations.map(operation => {
        //         let newOperation = copyObjectWithoutExcludedProps(operation);
        //         newOperation.name = 'C' + operation.name; // Optionally prefix the cloned operation's name
        //         // Update other references within newOperation as necessary
        //         return newOperation;
        //     });
        // }

        console.log('Cloned Quote Line ID: ', newLineId);
    }

    // Optionally, open the edit modal for the cloned quote
    $dgShowEditRowModal('quotes', newQuoteId);
};


