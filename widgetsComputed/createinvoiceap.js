return async function (data) {
  try {
    let purchaseOrderName = data.name; // this.getNextId('packingSlip')
    let purchaseLines = $getGrid("purchaseLines");
    console.log("xxxx: ", purchaseLines);
    let purchaseLinesArray = [];

    for (const key in purchaseLines) {
      if (purchaseLines.hasOwnProperty(key)) {
        purchaseLinesArray.push(purchaseLines[key]);
      }
    }

    const purchaseLinesFiltered = purchaseLinesArray.filter(
      (line) => line.purchaseOrder === data.rowKey
    );
  
    let invoiceName = `${data.name.replace("PO", "IV")}`;
    // let packingSlipsIndex = String(packingSlips.length + 1).padStart(2, "0");
    let newInvoice = await $dgAddRow("aPInvoices", {
      // this needs to get replaced out so we use some numbering system based on the actual record id values not the string name which is way too complext o manage
      name: invoiceName,
      purchaseOrder: data.rowKey,
    });

    for (let i = 0; i < purchaseLinesFiltered.length; i++) {
      let newInvoiceLines = await $dgAddRow("aPInvoiceLines", {
        name: `${invoiceName}-0${i+1}`,
        invoice: newInvoice, 
        purchaseOrder: data.rowKey
      });
    }

    $dgShowEditRowModal("aPInvoices", newInvoice);
  } catch (err) {
    console.log(err);
  }
};
