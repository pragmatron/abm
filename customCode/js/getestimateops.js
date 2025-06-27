 async  function getEstimateops(data) {
  $setGlobalModel('creatingEstimates', true);

  try {
    console.log('data: ', data);
    let method = data.productionMethod;

    if (!method) {
      console.log('No production method selected');
      $setGlobalModel('creatingEstimates', false);
      return;
    }

    console.log('Production method is: ', method);

    // Fetch related method operations and materials
    let ops = $getGrid('methodOperations');
    let filteredOps = ops.filter((row) => row.productionMethod === method);
    console.log('Filtered operations: ', filteredOps);

    let mats = $getGrid('methodMaterials');
    let filteredMats = mats.filter((row) => row.productionMethod === method);
    console.log('Filtered materials: ', filteredMats);

    // Iterate through filtered materials and create estimate materials
    for (let m of filteredMats) {
      let estimateMatName = `${m.name}-Estimate`;

      // Add new row to estimate materials and associate it with the quote line
      let newEstimateMat = await $dgAddRow('estimateMaterials', {
        name: estimateMatName,
        sourceMethodMaterial: m.rowKey,
        quoteLine: data.rowKey  // **Associate with the specific quote line**
      });

      await $dgSetRowVals('estimateMaterials', newEstimateMat, {
        quantity: m.quantity,
        cost: m.cost,
        description: m.description,
        productionMethod: method,
        quoteLine: data.rowKey // **Ensure association is maintained**
      });
    }

    // Iterate through filtered operations and create estimate operations
    for (let o of filteredOps) {
      let estimateOpName = `${o.sequence}-${o.name}-Estimate`;

      // Add new row to estimate operations and associate it with the quote line
      let newEstimateOp = await $dgAddRow('estimateOperations', {
        name: estimateOpName,
        sourceMethodOperation: o.rowKey,
        operationType: o.operationType,
        quoteLine: data.rowKey,
        laborRate: o.laborRate,
        rateSpeedperUnitestimatedTimePerUnit: o.estimatedTimePerUnit,
      });

      await $dgSetRowVals('estimateOperations', newEstimateOp, {
        sequence: o.sequence,
        estimatedProductionHours: o.estimatedProductionHours,
        description: o.description,
        productionMethod: method,
        quoteLine: data.rowKey, // **Ensure association is maintained**
        rateSpeedperUnitestimatedTimePerUnit: o.estimatedTimePerUnit,
      });
    }

    // Log success and reset global model
    console.log('Estimates created successfully');
    $setGlobalModel('creatingEstimates', false);
  } catch (error) {
    console.log('Error caught: ', error);
    $setGlobalModel('creatingEstimates', false);
  }
};



window.getEstimateops = getEstimateops