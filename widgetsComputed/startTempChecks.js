return async function (rowData) {
    console.log('rowData: ', rowData)
    $setUser('tempCheckInProgress', true);

  while (true) {
    console.log('user temp progress', $getUser('tempCheckInProgress'))
    if (!$getUser('tempCheckInProgress')) {
      break; // Exit the loop if tempCheckInProgress is false
    }

    const numberOfChecks = $getGrid('temperatureAndWeightChecks').filter((checks) => checks.qualityAssessment === rowData.rowKey).length
    const numForNameSequence = numberOfChecks + 1
    const newCheck = await $dgAddRow('temperatureAndWeightChecks', {
        qualityAssessment: rowData.rowKey,
        sequence: numForNameSequence,
        name: rowData.name + ' - ' + numForNameSequence
    });
    $dgShowEditRowModal('temperatureAndWeightChecks', newCheck);
    await sleep(30000); // Wait for 30 seconds
  }

  // Helper function to pause execution
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}