return async function (selectedPart) {
  try {
    console.log('selectedPart: ', selectedPart);

    const importParts = $getGrid('methodMaterials').filter((f) => f.parentPart == selectedPart);
    console.log('importParts: ', importParts);

    const sortedImportParts = importParts.sort((a, b) =>
      String(a.iTEMNO).localeCompare(String(b.iTEMNO))
    );

    const itemNoMap = {};

    for (const record of sortedImportParts) {
        const mat = {
          description: record.dESCRIPTION,
        };
 
      await $dgSetRow('parts', record.pARTNUMBER, mat);

      const itemNo = String(record.iTEMNO);

      if (itemNo.includes('.')) {
        const parentItemNo = itemNo.split('.').slice(0, -1).join('.');
        const parentRecord = itemNoMap[parentItemNo];
        console.log('parentRecord: ', parentRecord)
        if (parentRecord) {
          record.parentPart = parentRecord.part;
        }
      } else {
        record.parentPart = selectedPart;
      }

      itemNoMap[itemNo] = record;
    console.log('record: ', record)
      await $dgSetRow('methodMaterials', record.rowKey, {
        parentPart: record.parentPart,
        part: record.pARTNUMBER
      });
    }

    console.log('Top level parts updated successfully.');
    this.$bvToast.toast('Mapping successful.', {
      title: 'Success',
      variant: 'success',
      solid: true
    });

  } catch (error) {
    console.error('Error during mapping:', error);
    this.$bvToast.toast('Mapping failed: ' + error.message, {
      title: 'Error',
      variant: 'danger',
      solid: true
    });
  }
}
