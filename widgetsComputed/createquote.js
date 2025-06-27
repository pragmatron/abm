return async function(data) {
    try {
console.log('data: ', data)
    
     let id = $getSharedModel('quoteIdIndex')
    let nextID = 'Q' + String(id).padStart(5,'0')
    // Create a new quote in the 'quotes' table using the opportunity rowKey from data
    let newQuote = await $dgAddRow('quotes', {
        name: nextID,
    });
    await $dgSetRowVals('quotes', newQuote, {
        opportunity: data.rowKey,
    })
  await new Promise((resolve) => setTimeout(resolve, 500))
    // Create a new quote line in the 'quoteLines' table
    let opportunityLines = await $getGrid('opportunityLine').filter((op) => op.opportunity === data.rowKey)
    console.log('opportunity Lines', opportunityLines)
     for (const [index, line] of opportunityLines.entries()) {
        try {
    await new Promise(resolve => setTimeout(resolve, index * 100));

    let newQuoteLine = await $dgAddRow('quoteLines', {
        name: `${nextID}-0${index+1}`,
       
        // Include other necessary fields for the quote line here
    });

    await $dgSetRowVals('quoteLines', newQuoteLine, {
        quote: newQuote, 
        opportunity: data.rowKey, 
        opportunityLine: line.rowKey
    })

    // Display the edit row modal for the new quote
        } catch(err) {
            console.log('error: ', err)

        }
     }
    $dgShowEditRowModal('quotes', newQuote);
    $setSharedModel('quoteIdIndex', id+1)
    } catch(err) {
        console.log('error creating quote: ', err)
    }
};


