async function processMethodMaterials(selectedPart) {
  console.log('selectedPart: ', selectedPart);
  const importParts = $getGrid('testimport');

  // Sort by iTEMNO to ensure hierarchical order
  const sortedImportParts = importParts.sort((a, b) => a.iTEMNO.localeCompare(b.iTEMNO));

  // Map to track records by iTEMNO for parent lookups
  const itemNoMap = {};

  for (const record of sortedImportParts) {
    const cleanedPartNumber = record.pARTNUMBER?.replace(/\s+/g, '');

    // Match to part in parts grid
    const part = $getGrid('parts').find(d => d.name === cleanedPartNumber);

    if (part) {
      const mat = {
        description: record.dESCRIPTION,
        // Add more mappings here as needed
      };

      await $dgSetRow('parts', part.rowKey, mat);
    }

    const itemNo = record.iTEMNO;

    // Set topLevelPart based on hierarchy
    if (itemNo.includes('.')) {
      const parentItemNo = itemNo.split('.').slice(0, -1).join('.');
      const parentRecord = itemNoMap[parentItemNo];

      if (parentRecord) {
        record.topLevelPart = parentRecord.pARTNUMBER;
      }
    } else {
      // If it's the true top-level item (e.g., "1"), assign selectedPart
      record.topLevelPart = selectedPart;
    }

    itemNoMap[itemNo] = record;

    // Update the testimport row with resolved topLevelPart
    await $dgSetRow('testimport', record.rowKey, {
      topLevelPart: record.topLevelPart
    });
  }

  console.log('Top level parts updated successfully.');
}

window.processMethodMaterials = processMethodMaterials;
