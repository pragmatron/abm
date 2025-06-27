return async function (rowData) {
  // Grab the Sales Lines data using $getGrid and filter it using the current order rowKey
  
  let rowDataNoCirc = window.removeCircularReferences(rowData)
   $setGlobalModel('printing', true);
    rowDataNoCirc.str1 = 'hello'
    rowDataNoCirc.str2 = 'world'
      console.log('data sent to templater', rowDataNoCirc)

    try {
        await $printDocument(
          {
          workspaceId: this.currentDash, // Use currentDash to access your workspaceId
          gridId: 'purchaseOrderTemplate', // use the actual grid ID
          rowKey: rowDataNoCirc.purchaseOrderTemplate, // use the actual individ rowkey from url bar
          cellKey: 'file', // the actual name of the template field, whatever you've called it
          },
          'JS-Print',  // this will be the name of printed/downloaded file
          rowDataNoCirc,
          true,
          'printedDocs' //create a table and use the name of that table e.g. 'printedDocuments' where files will be stored. also add a files field (call it file field) and a date field to this table
        );
        // Once the promise returned by $printDocument resolves, set loading state to false.
        $setGlobalModel('printing', false);
    } catch (error) {
        console.error("There was an error in $printDocument:", error);
        $setGlobalModel('printing', false);
    }
}