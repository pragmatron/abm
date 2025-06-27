return async function (data) {

  // add a new time record and link up the operation 

  const userConfirmed = confirm("Are you sure you want to start the day?");

  if (userConfirmed) {
    // User pressed "OK"
    console.log("User confirmed the action.");

    let newEntry = await $dgAddRow('timeCards', {
      name:new Date().toISOString(),
      user: fbUser.uid,
      location: fbUser.location,
      started: new Date().toISOString(),
      activeTimeCard: true
    });

    $setUser('card', newEntry)


  } else {
    // User pressed "Cancel"
    console.log("User cancelled the action.");
  }






    

}