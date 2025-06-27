return async function (data) {
  console.log('data for shipping func: ', data);

  if(!data.locationInventory) {
    alert('Please select a location for the work order')
    return
  }

  try {
    // Retrieve the current offset from the dashboard model
    const offset = $getDashboardModel('indexOffsets')["-NfI3PTwrFV-YkG2ad60"].offset;

    // Add a new row in the 'shipping' table with the current offset as the name
    let newShipping = await $dgAddRow('shipping', {
      name: offset
    });

    // Update the new 'shipping' row with the work order key from the input data, if it exists
    if (data.salesOrder) {
      await $dgSetRowVals('shipping', newShipping, {
        salesOrder: data.salesOrder
      });
    }
        
        let newShippingLines = await $dgAddRow('shipmentLines', {
          packingSlip: newShipping,
          salesOrder: data.salesOrder || null,
          salesLines: data.salesLine || null,
          name: offset + '.01',
          sourceWorkOrder: data.rowKey || null,
          locationInventory: data.locationInventory || null,
          part: data.part,
          quantitytoShip: data.qtytoMfg
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
};
