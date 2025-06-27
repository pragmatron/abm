return async function () {

    try {
    const currentUser = fbUser.uid
    // console.log('currentuser: ',currentUser)
    const todayDate = new Date()

    
    let year = todayDate.getFullYear();
    let month = (1 + todayDate.getMonth()).toString().padStart(2, '0');
    let day = todayDate.getDate().toString().padStart(2, '0');
    
    const formattedDate = month + '/' + day + '/' + year

    console.log('formatted date:', formattedDate);

    const allOps = await $getGrid('workOrderOperations').filter((op) => op.activeUser === fbUser.uid && op.$started$Date == formattedDate)
    console.log('ops', allOps)
    return allOps
    } catch(error) {
        console.log('error: ', error);
        throw error
    }
    
   
}