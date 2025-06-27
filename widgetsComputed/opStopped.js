return async function (data) {
  // Load the timeEntry record using the rowKey
  const timeEntryRecord = $getDashboardModel('timeEntries')[data.timeEntry];

  // Check if the timeEntryRecord exists
  if (timeEntryRecord) {
    // Get the started date and time from the loaded record
    const startedDateTime = new Date(timeEntryRecord.started);

    // Get the current date and time
    const currentDateTime = new Date();

    // Calculate the difference in hours
    const hours = (currentDateTime - startedDateTime) / (1000 * 60 * 60);

    // Update the timeEntry
    await $dgSetRowVals('timeEntries', data.timeEntry, {
      stopped: currentDateTime.toISOString(), // Current date and time in ISO format
      hours: hours, // Difference in hours, rounded to 2 decimal places
      activeUser:'',
      timeEntry:''
    });

    await $dgSetRowVals('workOrderOperations', data.rowKey, {
      stopped: currentDateTime.toISOString(), // Current date and time in ISO format
      timeEntry: '', // Clear the timeEntry field
      activeUser:''
    });
   $setGlobalModel('opsChanged', true);


  } else {
    console.error('Time entry record not found.');
  }
}
