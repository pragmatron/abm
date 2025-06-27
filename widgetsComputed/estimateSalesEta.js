return async function (rowData) {
    // Get the schedule weeks data
    const scheduleWeeks = await $getGrid('scheduleWeeks').filter(week => week.availableCapacity >= 40).sort((a, b) => a.name.localeCompare(b.name));
    
    // Sort the filtered weeks by week.name
    console.log('scheduleWeeks', scheduleWeeks)
    
    // If there are no weeks with availableCapacity >= 40, log a message and return
    if (scheduleWeeks.length === 0) {
        console.log('No weeks found with available capacity >= 40');
        alert('No weeks available with capacity >= 40')
        return;
    }
    
    // Get the most recent week from the sorted filtered weeks
    const mostRecentWeek = scheduleWeeks[0];
    
    // Log the most recent week
    console.log('Most recent week with available capacity >= 40:', mostRecentWeek);

    await $dgSetRowVals('salesLines', rowData.rowKey, {
        weeklySchedule: mostRecentWeek.rowKey,
        estimatedDeliveryDate: mostRecentWeek.weekStart
    })


}