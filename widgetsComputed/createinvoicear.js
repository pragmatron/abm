return async function (data) {
  try {
    // let id = data.name // this.getNextId('packingSlip')
    let id = $getSharedModel('arInvoiceIndex') ? $getSharedModel('arInvoiceIndex') : 0
    $setSharedModel('arInvoiceIndex', id+1) 

    let invoiceName = 'IV' + String(id).padStart(5,'0')

    const shipmentLinesFiltered = $getGrid('shipmentLines').filter(
      (line) => line.packingSlip === data.rowKey
    )
    console.log('shipmentLinesFiltered: ', shipmentLinesFiltered)
    // let packingSlipsIndex = String(packingSlips.length + 1).padStart(2, "0");
    let newInvoice = await $dgAddRow('aRInvoices', {
      // this needs to get replaced out so we use some numbering system based on the actual record id values not the string name which is way too complext o manage
      name: invoiceName,
      soldToCustomer: data.soldToCustomer,
      packingSlip: data.rowKey,
    })

    for (const [index, line] of shipmentLinesFiltered.entries()) {
      console.log('index: ', index)
      try {
        let newInvoiceLines = await $dgAddRow('aRInvoiceLines', {
          name: `${invoiceName}-0${index + 1}`,
          invoice: newInvoice,
          shipmentLine: line.rowKey
        })
      } catch (err) {
        console.log('Error creating ar invoice: ', err)
      }
    }

    $dgShowEditRowModal('aRInvoices', newInvoice)
  } catch (err) {
    console.log(err)
  }
}
