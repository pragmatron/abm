return async function (rowData) {
  try {
    // Fetch all materials from the grid
    const materials = await $getGrid('workOrderMaterials');
    console.log('Fetched materials:', materials);
    
    // Check if rowData.rowKey is defined
    if (!rowData || !rowData.rowKey) {
      console.error('Invalid rowData:', rowData);
      return;
    }
    
    console.log('Work order to filter by:', rowData.rowKey);
// Filter materials to get those associated with the specific work order
    const associatedMaterials = materials.filter(material => material.workOrder === rowData.rowKey);
    console.log('Associated materials:', associatedMaterials);

    if (associatedMaterials.length === 0) {
      console.log('No materials found for this work order');
      return;
    }
// Update each material's quantityIssued with remainingToAssign value
    for (const material of associatedMaterials) {
      console.log('Updating material:', material);

      if (!material._id || material.remainingToAssign === undefined) {
        console.error('Invalid material data:', material);
        continue;
      }
  const updatedFields = {
        quantityIssued: material.remainingToAssign,
        // remainingToAssign: 0 // Set remainingToAssign to 0 after assigning it to quantityIssued
      };

      const updateResult = await $dgSetRowVals('workOrderMaterials', material.rowKey, updatedFields);
      console.log('Update result for material:', material.id, updateResult);
    }

    console.log('All materials updated successfully!');
  } catch (error) {
    console.error('Error updating materials:', error);
  }
};



