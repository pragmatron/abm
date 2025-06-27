return async function (data) {
  // Retrieve purchase lines that are in edit mode
  let selectedPurchaseLines = Object.keys(this.$store.state.dgRowInEditMode)
    .filter((item) => item.startsWith('purchaseLines.'))
    .map((item) => item.split('.')[1])

  if (selectedPurchaseLines.length < 1) {
    alert('Please select at least 1 purchase line to receive')
  } else {

    await $dgAddRow('receipts', {
      // create a receipt index
    })

    // for each selected line create receipt line, quantity on that receipt line = quantityToReceive, .01,.02 etc



    // quantityToReceive set back to 0

  }
}