return async function (rowData) {

    console.log('rowData: ', rowData)

    // Get the assemblies that match the criteria
const filteredAssemblies = $getGrid('assemblies').filter(assembly =>
  (assembly.resourceGroup === '-Nlc4dgjnNkaHcZjJaYk' ||
   assembly.resourceGroup === '-Nlc4favjeos7eeR6hBI' ||
   assembly.resourceGroup === '-Nlc4i_S-PqXeRFsSZPo') &&
  assembly.mainAssembly === true
);
console.log('filteredAssemblies: ', filteredAssemblies)
// Extract rowKeys from the filtered assemblies
const rowKeys = filteredAssemblies.map(assembly => assembly.rowKey);

// Find subAssemblies that match the rowKeys
const filteredSubAssemblies = $getGrid('subAssemblies').filter(sub =>
  rowKeys.includes(sub.mainAssembly)
);

console.log('filteredSubAssemblies: ', filteredSubAssemblies)

// const firstMatchingSubAssembly = filteredSubAssemblies.find(sub => sub.part === rowData.part && sub.assignedAssembly === null);
const firstMatchingSubAssembly = filteredSubAssemblies
  .filter(sub => sub.part === rowData.part && sub.assignedAssembly === null)
  .sort((a, b) => a._id - b._id)[0];

console.log('firstMatchingSubAssembly: ', firstMatchingSubAssembly)
await $dgSetRowVals('subAssemblies', firstMatchingSubAssembly.rowKey, {
  assignedAssembly: rowData.rowKey
})

const areSubAssembliesFinished = $getGrid('subAssemblies').find((sub) => sub.mainAssembly === firstMatchingSubAssembly.mainAssembly && !sub.assignedAssembly)

if(!areSubAssembliesFinished) {
await $dgSetRowVals('assemblies', firstMatchingSubAssembly.mainAssembly, {
  subAssembliesFull: true
})
}



}