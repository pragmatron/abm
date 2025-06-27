return async function (data) {
  console.log('data for shipping func: ', data);

  try {
    // Retrieve the current offset from the dashboard model
    const offset = $getDashboardModel('indexOffsets')["-NfI3PTwrFV-YkG2ad60"].offset;

    // Add a new row in the 'shipping' table with the current offset as the name
    let newShipping = await $dgAddRow('shipping', {
      name: offset
    });

    // Update the new 'shipping' row with the work order key from the input data, if it exists
    if (data.rowKey) {
      await $dgSetRowVals('shipping', newShipping, {
        workOrder: data.rowKey
      });
    }

    // Add a new row in the 'shipmentLines' table related to the new shipping row and source work order
    let newShippingLines = await $dgAddRow('shipmentLines', {
      packingSlip: newShipping,
      sourceWorkOrder: data.rowKey || '',
      name: offset + '.01'
    });

    // Increment the offset and update it in the 'indexOffsets' table
    const newOffset = offset + 1;
    await $dgSetRowVals('indexOffsets', "-NfI3PTwrFV-YkG2ad60", {
      offset: newOffset
    });

    // Display the edit row modal for the new shipping entry
    $dgShowEditRowModal('shipping', newShipping);
  } catch (err) {
    console.log(err);
  }
}

