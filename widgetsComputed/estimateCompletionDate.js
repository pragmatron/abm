return async function (rowData) {
    const scheduledStart = new Date(rowData.scheduledStart); // Convert scheduledStart to a Date object
    const totalHours = rowData.totalEstimatedHours;

    // Calculate the number of days based on totalHours divided by 8
    const daysToAdd = Math.ceil(totalHours / 8);

    // Create a new Date object representing the scheduled end
    const scheduledEnd = new Date(scheduledStart);
    scheduledEnd.setDate(scheduledEnd.getDate() + daysToAdd);
    console.log('scheduledEnd: ', scheduledEnd)
    // Return the result
    await $dgSetRowVals('opportunityLines', rowData.rowKey, {
        estimatedCompletionDate: scheduledEnd.getTime()
    })
}