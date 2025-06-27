return async function () {


const userConfirmed = confirm("Are you sure you want to end the day?");

if (userConfirmed) {
  // User pressed "OK"




  // Load the timeEntry record using the rowKey
  const card = $getDashboardModel('timeCards')[$getUser('card')];
  console.log('card: ', card)
  // Check if the timeEntryRecord exists
    if (card) {
      // Get the started date and time from the loaded record
      const startedDateTime = new Date(card.started);

      // Get the current date and time
      const currentDateTime = new Date();

  let hours = (currentDateTime - startedDateTime) / (1000 * 60 * 60);

    // Initialize payableHours to be the same as hours
    let payableHours = hours;

    // Adjust payableHours based on lunch and break times
    if (hours > 5) {
      payableHours -= 1; // Take off an hour for lunch
    } else if (hours > 3 && hours <= 5) {
      payableHours -= 0.25; // Take off 15 minutes
    }

      // Update the timeEntry
      await $dgSetRow('timeCards', card.rowKey, {
        stopped: currentDateTime.toISOString(), // Current date and time in ISO format
        hours: hours, // Difference in hours, rounded to 2 decimal places
        payableHours: payableHours,
        activeTimeCard: false
      });

    $setUser('card', null)


    } else {
      console.error('Time card not found.');
    }



} else {
  // User pressed "Cancel"
  
}





}
