return async function (rowData) {
  // console.log('in create shipping function')
  // console.log('salesOrderData for shipping func: ', salesOrderData)
  try {
    console.log('rowData:', rowData)
    // let id = rowData.name; // this.getNextId('packingSlip')
    let id = $getSharedModel('arInvoiceIndex') ? $getSharedModel('arInvoiceIndex') : 0
    $setSharedModel('arInvoiceIndex', id+1) 

    let invoiceName = 'IV' + String(id).padStart(5,'0')
    let salesLines = $getGrid("salesLines");

    const salesLinesFiltered = salesLines.filter((line) => line.salesOrder === rowData.rowKey);

    console.log("salesLinesFiltered: ", salesLinesFiltered);

   
    // let packingSlipsIndex = String(packingSlips.length + 1).padStart(2, "0");
    let newInvoice = await $dgAddRow("aRInvoices", {
      // this needs to get replaced out so we use some numbering system based on the actual record id values not the string name which is way too complext o manage
      name: invoiceName,
      salesOrder: rowData.rowKey
    });

    // let lineId = `${id}-${packingSlipsIndex}-${shipmentLinesIndex}`;
    for (const [index, line] of salesLinesFiltered.entries()) {

      try {
      let newInvoiceLine = await $dgAddRow("aRInvoiceLines", {
        name: `${invoiceName}-0${index+1}`,
        invoice: newInvoice,
        salesLine: line.rowKey
      });
    
    } catch(err) {
      console.log('error creating ar invoice line: ', err)
    }
  }

    $dgShowEditRowModal("aRInvoices", newInvoice);

  } catch (err) {
    console.error(err);
    throw err;
  }
};
