return function (rowData){

    let f = $getGrid('fileRef').filter(f => f.objectId == rowData.id);

    let v =  $getGrid('fileVersion')//.filter(f => f.id == '112231');

   let r = alasql(`select versions.uri, files.name, files.file from 
    
    ? as files, ? as versions
    where files.version::NUMBER =  versions.id::NUMBER
    
    `, [f,v])


 


    return r

}