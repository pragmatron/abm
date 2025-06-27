return async function (data) {
  // Retrieve purchase lines that are in edit mode
  let selectedPurchaseLines = Object.keys(this.$store.state.dgRowInEditMode)
    .filter((item) => item.startsWith('purchaseLines.'))
    .map((item) => item.split('.')[1])

  if (selectedPurchaseLines.length < 1) {
    alert('Please select at least 1 purchase line to receive')
    return
  } else {


    let receiptIndex = $getGlobalModel('receiptIndex') ? $getGlobalModel('receiptIndex') : 0001
  
    const nextId = `Receipt-${String(receiptIndex).padStart(4, '0')}`

    let newReceipt = await $dgAddRow('receipts', {
      name: nextId,
      
      purchaseOrder: data.rowKey,
    })
    $setGlobalModel('receiptIndex', receiptIndex+1)

    console.log('new receipt is', newReceipt)

    console.log('selectedPurchaseLines: ', selectedPurchaseLines)

    let filteredSelectedLines = $getGrid('purchaseLines').filter((line) =>
      selectedPurchaseLines.includes(line.rowKey)
    )
    console.log('filteredLines: ', filteredSelectedLines)

    for (const [index, line] of filteredSelectedLines.entries()) {
      console.log('add receipt line for ', line.rowKey)
      try {
        await new Promise((resolve) => setTimeout(resolve, index * 100))
        // let receiptName = data.pO

        let newReceiptLine = await $dgAddRow('receiptLines', {
          name: `${nextId}.0${index+1}`,
          quantity: 0,
          quantityOrdered: line.quantityRequired,
          price: line.totalPrice,
          purchaseOrder: line.purchaseOrder,
          purchaseLine: line.rowKey,
          part: line.part,
          puM: line.pUM,
          iuM: line.iUM,
          receipt: newReceipt,
          vendor: data.vendor,
      
          // ... your existing receipt line properties
        })

        
      } catch (err) {
        console.log(err)
        console.log('something went wrong creating a sales line')
      }
      $dgShowEditRowModal('receipts', newReceipt)
    }
  }
}
