return async function (data) {
  console.log('data for shipping func: ', data)

  let selectedPartsLines = Object.keys(this.$store.state.dgRowInEditMode)
    .filter((item) => item.startsWith('parts.'))
    .map((item) => item.split('.')[1])

  // if no lines selected don't continue
  if (selectedPartsLines.length < 1) {
    alert('Please select at least 1 part')
    return
  }
  // get records matching selected rowkeys
  let filteredSelectedLines = $getGrid('parts').filter((line) =>
    selectedPartsLines.includes(line.rowKey)
  )

  console.log('partsFiltered filtered : ', filteredSelectedLines)

  // Group items by preferred vendor
  let itemsByVendor = {};
  for (let i = 0; i < filteredSelectedLines.length; i++) {
    let line = filteredSelectedLines[i];
    let vendorId = line.preferredVendor;
    if (!itemsByVendor.hasOwnProperty(vendorId)) {
      itemsByVendor[vendorId] = [];
    }
    itemsByVendor[vendorId].push(line);
  }

  // Process items grouped by preferred vendor
  for (let vendorId in itemsByVendor) {
    if (itemsByVendor.hasOwnProperty(vendorId)) {
      let itemsForVendor = itemsByVendor[vendorId];

      // Initialize purchase order variables
      let poIndexOffset = $getGrid('indexOffsets').filter((item) => {
        return item.rowKey === '-NbtkERmsTqXLRFi7kzi'
      })[0].offset;
      let nextID = 'PO' + String(poIndexOffset).padStart(5, '0');
      let newPurchaseOrder = await $dgAddRow('purchaseOrders', {
        name: nextID,
        vendor: vendorId,
      });
      let newOffset = poIndexOffset + 1;
      $dgSetRowVals('indexOffsets', '-NbtkERmsTqXLRFi7kzi', {
        offset: newOffset,
      });

      // Process items for this vendor
      for (let i = 0; i < itemsForVendor.length; i++) {
        let item = itemsForVendor[i];
        if (item.quantityToPurchase > 0) {
          let newPurchaseLines = await $dgAddRow('purchaseLines', {
            name: `${nextID}.0${i + 1}`,
            purchaseOrder: newPurchaseOrder,
            part: item.rowKey,
          });

          await $dgSetRowVals('purchaseLines', newPurchaseLines, {
            quantity: item.quantityToPurchase,
          });

          $dgSetRowVals('parts', item.rowKey, {
            quantityToPurchase: 0,
          });
        }
      }

      // Show the edit row modal for the purchase order
      $dgShowEditRowModal('purchaseOrders', newPurchaseOrder);
    }
  }
}
