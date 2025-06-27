return async function () {

    // let vendorId = this.globalModels.vendor.code

    // console.log('vendorId: ', vendorId)


  let selectedPurchaseLines = Object.keys(this.$store.state.dgRowInEditMode)
    .filter((item) => item.startsWith('purchaseLines.'))
    .map((item) => item.split('.')[1])
    console.log('selectedInvLines: ', selectedPurchaseLines)

    if(selectedPurchaseLines.length < 1) {
      alert('Select at least one purchase line')
      return
    }

    let receiptIndex = $getGlobalModel('receiptIndex') ? $getGlobalModel('receiptIndex') : 0001
      
    const nextId = `Receipt-${String(receiptIndex).padStart(4, '0')}`
      // get records matching selected rowkeys
  let filteredSelectedLines = $getGrid('purchaseLines').filter((line) =>
    selectedPurchaseLines.includes(line.rowKey)
  )

    let newReceipt = await $dgAddRow('receipts', {
      name: nextId,
      // vendor: vendorId
    })

    $setGlobalModel('receiptIndex', receiptIndex+1)

        for (let i = 0; i < filteredSelectedLines.length; i++) {    
      if(filteredSelectedLines[i].quantityToReceive > 0) {
        let receiptLine = await $dgAddRow('receiptLines', {
          name: `${nextId}.0${i+1}`,
          receipt: newReceipt,
          // vendor: vendorId,
          purchaseLine: filteredSelectedLines[i].rowKey
        })

        await $dgSetRowVals('receiptLines', receiptLine, {
          quantityReceived: filteredSelectedLines[i].quantityToReceive,
        })


        $dgSetRowVals('purchaseLines', filteredSelectedLines[i].rowKey, {
        //   quantityShipped: assembliesFiltered[i].quantityToShip + assembliesFiltered[i].quantityShipped,
          quantityToReceive: 0
          
        })
      }


    }
        $dgShowEditRowModal('receipts', newReceipt)



}