async function sendSalesOrderToQb(salesOrder) {
    $setGlobalModel('sendingSoToQb', true)
    console.log('sending sales order, ', salesOrder, ' to qb');
    if(!salesOrder.dueDate) {
        alert('please select a ship date')
        return
    }
    // Extract customer details from salesOrder
    try {


        $dgSetRowVals('opportunities', salesOrder.rowKey, {status:'-NeJBdiMEZAMNarNxgEO'})


        const customer = salesOrder.$soldToCustomer;

        let salesLines= $getGrid('salesLines').filter(sline => {
            return sline.salesOrder === salesOrder.rowKey
        })

        const shipDateForQB = salesOrder?.dueDate ? new Date(salesOrder?.dueDate).toISOString().split('T')[0] : '';

const payload = {
  name: salesOrder.name,
  customerName: customer.name, // Full name for query
  contact: customer.contact, // Primary contact name
  email: salesOrder.billingEmail, // Customer email
  billToContact: salesOrder.$billToContact$display,
  phoneNumber: customer.phoneNumber, // Phone number
  PONumber: salesOrder.purchaseOrder,
  quote: salesOrder.$quote$display || '',
  // Billing address fields
  billAddress1: salesOrder.billAddress1,
  billAddress2: salesOrder.billAddress2 || '',
  billCity: salesOrder.billingCity || '',
  billState: salesOrder.billingStateProvince || '',
  billZip: salesOrder.billingPostalCode || '',
  billCountry: salesOrder.billingCountry || '',
  billEmail: salesOrder.billingEmail || '',
  shippingEmail: salesOrder.email || '',
  shipToContact: salesOrder.$contactName$display || '',
  // Shipping address fields
  address1: salesOrder.address1,
  address2: salesOrder.address2 || '',
  city: salesOrder.city || '',
  state: salesOrder.stateProvince || '',
  zip: salesOrder.postalCode || '',
  country: salesOrder.country || '',
  
  shipDate: shipDateForQB,
  salesLines
};

        console.log('Payload:', payload);

        // return

        // Send the payload to the workflow
        let result = await $vm.$wfGetData('-ODKagqppAREve26VyJC', payload);

        console.log('result is ', result);

        if(result && result.apiresponseEstimate && result.apiresponseEstimate.Estimate && result.apiresponseEstimate.Estimate.Id) {
            alert(`Estimate ${result.apiresponseEstimate.Estimate.Id} created from the sales order`)
        } else {
            alert(`Something went wrong sending the sales order to qb: `)
            
        }

        $setGlobalModel('sendingSoToQb', false)
    } catch(err) {
        alert('Something went wrong sending the sales order to qb')
        $setGlobalModel('sendingSoToQb', false)
    }
}

this.sendSalesOrderToQb = sendSalesOrderToQb;