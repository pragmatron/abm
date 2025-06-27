console.table(
  Object.keys($vm.$store.state.dataGrid_options)
    .map(gridId => {
      let grid = $getGrid(gridId);
      let records = grid.length;
      let firstRecordProperties = records > 0 ? Object.keys(grid[0]).length : 0;
      let totalSize = grid.reduce((sum, record) => sum + JSON.stringify(record).length, 0);
      return {
        gridId,
        records,
        firstRecordProperties,
        totalSize
      };
    })
    .sort((a, b) => b.records - a.records)
);