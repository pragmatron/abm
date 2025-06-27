function compareMaterialLists(partAId, partBId) {
    const partAGrid = $getGrid(partAId);
    const partBGrid = $getGrid(partBId);

    const partAMaterials = partAGrid.map(row => row.material);
    const partBMaterials = partBGrid.map(row => row.material);

    const uniqueToA = partAMaterials.filter(mat => !partBMaterials.includes(mat));
    const uniqueToB = partBMaterials.filter(mat => !partAMaterials.includes(mat));

    return {
        uniqueToPartA: uniqueToA,
        uniqueToPartB: uniqueToB
    };
}
