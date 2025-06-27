async function autoAssignWorkOrderOperations() {
    // Retrieve all unassigned work order operations from the operations table
    const operations = $getGrid('workOrderOperations')
       .filter(operation => operation.type)
        .sort((a, b) => b.skillLevel - a.skillLevel);  // Sort operations by skill level descending

    // Retrieve all resources with positive initial capacity
    const resources = $getGrid('resources')
        .filter(resource => resource.capacity > 0)
        .sort((a, b) => b.skillLevel - a.skillLevel)  // Sort resources by skill level descending
        .map(resource => ({
            rowKey: resource.rowKey,
            remainingCapacity: resource.capacity,
            skillLevel: resource.skillLevel
        }));

    // Assign operations to resources based on capacity and matching or exceeding skill level
    operations.forEach(operation => {
        let assigned = false;
        for (let resource of resources) {
            if (resource.remainingCapacity >= operation.hours ) {
                // Assign the operation
                operation.resource = resource.rowKey;
                resource.remainingCapacity -= operation.hours;

                // Update the operation in the grid with the assigned resource
                $dgSetRow('workOrderOperations', operation.rowKey, { resource: operation.resource });
                assigned = true;
                break; // Break out of the loop after assigning
            }
        }
        if (!assigned) {
            console.log(`No available capacity or skill match found for operation ${operation.rowKey}`);
        }
    });

    console.log('Auto-assignment of work order operations by skill complete.');
}

// You need to execute this function to apply the logic
window.autoAssignWorkOrderOperations = autoAssignWorkOrderOperations;
