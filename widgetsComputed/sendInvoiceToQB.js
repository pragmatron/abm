return async (rowData) => {
    $setGlobalModel('sendingToQb', true);

    // Get lines
    let lines = $getGrid('aRInvoiceLines').filter(line => {
        return line.invoice == rowData.rowKey;
    }).flatMap((l, idx) => {
        let taxCode = "3"; // Default tax code

        // E
        if (l.taxCategory === '-Np_Vpp_-cetPgx3oDMl') {
            taxCode = "3";
        }
        // G
        if (l.taxCategory === '-Np_VmqR7yJBF9EtTsJj') {
            taxCode = "2";
        }
        // No tax?
        if (l.taxCategory === '-Ndjjx0GJp7RBCfyNzc7' || !l.taxCategory) {
            taxCode = "";
        }

        // Construct the primary line
        const primaryLine = {
            "Description": `${l.description}`,
            "DetailType": "SalesItemLineDetail",
            "SalesItemLineDetail": {
                "TaxCodeRef": {"value": taxCode},
                "Qty": l.quantity,
                "UnitPrice": l.unitPrice,
                "ItemRef": {"name": l.$part$display}
            },
            "LineNum": (idx * 2) + 1,
            "Amount": l.extendedAmount
        };

        // If $salesOrder and $salesOrder.title are present, add a blank sales line below each line
        if (rowData.$salesOrder && rowData.$salesOrder.name) {
            const blankLine = {
                "Description": `Blank Line for ${rowData.$salesOrder.name}`,
                "DetailType": "SalesItemLineDetail",
                "SalesItemLineDetail": {
                    "TaxCodeRef": {"value": ""},
                    "Qty": 0,
                    "UnitPrice": 0,
                    "ItemRef": {"name": ""}
                },
                "LineNum": (idx * 2) + 2,
                "Amount": 0
            };
            return [primaryLine, blankLine];
        } else {
            return [primaryLine];
        }
    }).flat(); // Flatten the array of arrays into a single array

    console.log('lines are', lines);

    let payload = {
        name: rowData.name,
        dueDate: moment(rowData.dueDate).format('YYYY-MM-DD'),
        lines,
        TxnDate: moment(rowData.invoiceDate).format('YYYY-MM-DD'),
        customerName: rowData.$soldToCustomer$display,
        trackingNum: rowData.salesOrder ? rowData.$salesOrder$display : '',
        terms: rowData.terms ? rowData.$terms$display : '',
        email: rowData.$soldToCustomer.emailAccount,
        customerPhone: rowData.$soldToCustomer.phoneNumber,
        billingAddress: rowData.$billToCustomer$display
    };

    console.log(payload);

    let d = await this.$wfGetData('-NtLsue_WP0rzbJohsab', payload);

    console.log('result is, ', d);

    if (d.customerMissing) {
        alert('Customer not found. Please assign a customer whose name matches a customer in QuickBooks');
        $setGlobalModel('sendingToQb', false);
    } else if (d.foundMissingItems) {
        alert('Line Product not found. Please assign a line product to each line whose name matches a product in QuickBooks');
        $setGlobalModel('sendingToQb', false);
    } else if (d.invoiceCreateError) {
        alert('Error creating an invoice, see the console for more info.');
        $setGlobalModel('sendingToQb', false);
    } else {
        let doc = d.apiresponseinv.Invoice.Id;
        $setGlobalModel('sendingToQb', false);
        alert('Invoice Created - ' + doc);
    }
}





