return async function(data){
    // Use 'qtytoMfg' to determine the number of assemblies to create
    let quantity = data.qtytoMfg;
    let workOrderName = data.name; // Now using 'data.name' to get the work order's name

    let numOfAssemblies = $getGrid('assemblies').length

    // Check if workOrderName is defined
    if (typeof workOrderName === 'undefined') {
        console.error('The work order name is undefined.');
        return; // Exit the function if the work order name is not defined
    }

    const prodMethodMats = $getGrid('methodMaterials').filter((mat) => mat.productionMethod === data.sourceProductionMethod)
    console.log('method mats: ', prodMethodMats)
    // Loop to create the specified number of main assemblies from the work order quantity
    for (let i = 0; i < quantity; i++) {
        numOfAssemblies++
        // Add a new row to the 'assemblies' table that is the main assembly
        let newAssembly = await $dgAddRow('assemblies', {
            mainAssembly: true,
            stage: '-Nha4KNKbqueef4iB9L2'
        });

        // Generate a name for the assembly combining the work order name and a sequential number
        let assemblyName = `${workOrderName} Main Assembly-${i + 1}`;

        // Set the 'workOrders' field and 'name' for the new row in the 'assemblies' table
        await $dgSetRowVals('assemblies', newAssembly, {
            workOrders: data.rowKey,
            name: assemblyName,
        });

        // add an assembly for each prod method material.
        for(let j = 0; j < prodMethodMats.length; j++) {
            numOfAssemblies++
              let newPartAssembly = await $dgAddRow('assemblies', {
                 mainAssembly: false,
                 workOrders: data.rowKey,
                 stage: '-Nha4KNKbqueef4iB9L2'
            });
        // name the part for each assembly, just the part name + record id.
        let partAssemblyName = `${prodMethodMats[j].$part$display}-${numOfAssemblies}`

        await $dgSetRowVals('assemblies', newPartAssembly, {
            workOrders: data.rowKey,
            name: partAssemblyName,
            part: prodMethodMats[j].part
        });      
            let newSubAssembly = await $dgAddRow('subAssemblies', {
                mainAssembly: newAssembly,
                part: prodMethodMats[j].part
            })  

        }

    }

}






