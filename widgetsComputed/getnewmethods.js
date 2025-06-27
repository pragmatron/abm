return async function (data) {

    console.log('data get methods: ', data)
    const method = data.sourceProductionMethod

    try {
    let ops = $getGrid("methodOperations");
    let filteredOps = ops.filter((row) => {
          return row.productionMethod === method;
        });

      for (let o of filteredOps) {
          let opName = `${o.sequence}-${o.$operationType$display}`;
          let newOpId = await $dgAddRow("workOrderOperations", {
            workOrder: data.rowKey,
            type: o.operationType,
            quantityRequired: data.qtytoMfg,
            sequence: o.sequence,
            instructions: o.instructions,
            name: opName,
            resourceGroup: o.$operationType
              ? o.$operationType.resourceGroup
              : null,
            //     description:o.description,
            resource: o.resource,
          });
        }
    } catch(err) {
        console.log('error getting new methods: ', err)
    }
}