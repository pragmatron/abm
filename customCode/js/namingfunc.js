function createTestOrders() {
    const testOrders = [
        { product: "Laptop", quantity: 1, customer: "John Doe" },
        { product: "Smartphone", quantity: 2, customer: "Jane Smith" },
        { product: "Tablet", quantity: 3, customer: "Alice Johnson" }
    ];

    testOrders.forEach(order => {
        $dgAddRow('orders', order, function(rowKey) {
            console.log('Order added:', rowKey);
        });
    });
}


