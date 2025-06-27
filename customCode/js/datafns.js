window.updateOpportunityLines = async () => {
  // Assume $getGrid and $dgSetRowVal are available
  const opportunityLines = $getGrid('opportunityLines');
  const workOrderOperations = $getGrid('workOrderOperations');

  // Initialize an empty array to hold opportunity lines without recent operations
  const opportunityLinesWithoutRecentOperations = [];
  const rowKeys = [];

  // Loop through each opportunity line and check if it has a corresponding work order operation
  for (const line of opportunityLines) {
    if (
      line.archived !== true &&
      line.name?.includes('W000') &&
      !workOrderOperations.some(op => op.workOrder === line.rowKey)
    ) {
     // console.log(line.rowKey)
      opportunityLinesWithoutRecentOperations.push(line);
      rowKeys.push(line.rowKey);
    }
  }

  // Update the selected opportunity lines
  for (const record of opportunityLinesWithoutRecentOperations) {
    //await $dgSetRowVal('opportunityLines', record.rowKey + '.archived', true);
  }
  console.log(opportunityLinesWithoutRecentOperations)
  // Output rowKeys as a string, one per line
  console.log(rowKeys.join('\n'));
};

// Now you can call this function from the console
// updateOpportunityLines();


