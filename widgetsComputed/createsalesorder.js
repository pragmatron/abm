return async function(data){

    let newOrder = await $dgAddRow('opportunities', {
       
        
    })


        $dgSetRowVals('quotes', data.rowKey, {state:'-O5ylIfjKP4hFL2NYlj6'})





    let salesOrderId = $getSharedModel('salesOrderIndex')
    $setSharedModel('salesOrderIndex', salesOrderId+1) 
    let salesOrderName = 'SO' + String(salesOrderId)


    await $dgSetRowVals('opportunities',newOrder, {
        
        quote:data.rowKey,
        name: salesOrderName
    })
    await new Promise(resolve => setTimeout(resolve,  500));

// let retrievedSO = $getGrid('opportunities').filter(item =>  {return item.rowKey === newOrder})
    
    let quoteLines = $getGrid('quoteLines').filter((q) => q.quote === data.rowKey)

    console.log('quoteLines: ',quoteLines, 'data.rowKey: ', data.rowKey)

    for (const [index, line] of quoteLines.entries()) {


        console.log('index: ', index)
        try {

            await new Promise(resolve => setTimeout(resolve, index * 100));

            let newSalesLine = await $dgAddRow('salesLines',{
                name: `${salesOrderName}-0${index+1}`,
                salesOrder: newOrder,
               
                
                quote: line.quote,
            
            })

            await $dgSetRowVals('salesLines',newSalesLine, {
                quoteLine:line.rowKey,
            })

        const methodOps = await $getGrid('estimateOperations').filter((op) => op.quoteLine === line.rowKey)
        console.log('methodOps: ', methodOps)
        const methodMats = await $getGrid('estimateMaterials').filter((op) => op.quoteLine === line.rowKey)
        console.log('methodMats: ', methodMats)
        const partOptions = await $getGrid('partOptions').filter((option) => option.quoteLine === line.rowKey)

        for(let o of methodOps) {
            await $dgSetRowVals('estimateOperations', o.rowKey, {
                salesLine: newSalesLine
            })
        }
        for(let m of methodMats) {
            await $dgSetRowVals('estimateMaterials', m.rowKey, {
                salesLine: newSalesLine
            })
        }
        for(let po of partOptions) {
            await $dgSetRowVals('partOptions', po.rowKey, {
                salesLine: newSalesLine
            })
        }
            console.log(newSalesLine)
        } catch(err) {
            console.log(err)
            console.log('something went wrong creating a sales line')
        }

    }

    $dgShowEditRowModal('opportunities', newOrder)

    console.log("test")
}