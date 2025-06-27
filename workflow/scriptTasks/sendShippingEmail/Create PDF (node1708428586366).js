
let os = require('os')
let fs = require('fs')
// Null getter function for preventing undefines
function nullGetter(part, scopeManager) {
    /*
        If the template is {#users}{name}{/} and a value is undefined on the
        name property:

        - part.value will be the string "name"
        - scopeManager.scopePath will be ["users"] (for nested loops, you would have multiple values in this array, for example one could have ["companies", "users"])
        - scopeManager.scopePathItem will be equal to the array [2] if
          this happens for the third user in the array.
        - part.module would be empty in this case, but it could be "loop",
          "rawxml", or or any other module name that you use.
    */

    if (!part.module) {
        // part.value contains the content of the tag, eg "name" in our example
        // By returning '{' and part.value and '}', it will actually do no replacement in reality. You could also return the empty string if you prefered.
        return "";
    }
    if (part.module === "rawxml") {
        return "";
    }
    return "";
}
// Delete processed work order if it already exists
// The ID of your GCS bucket
const bucketName = 'tangledev00-processed';

// The ID of your GCS file
console.log('context.payload create pdf: ', context.payload)
const fileName = `${context.payload.PONO}.pdf`;

async function deleteFile() {

    const options = {
    };
    try {
        const storageFile = bucket(bucketName).file(fileName);
        storageFile
        .exists()
        .then(async (exists) => {
            if (exists[0]) {
                await admin.storage().bucket(bucketName).file(fileName).delete(options);
            } else {
            $log("File does not exist");
        }
    })
    } catch(err) {
        console.log(err)
        $log('Not found a file to delete / maybe its first time')
    }
}
await deleteFile().catch(console.error);

// Retrieve the mapping file  
context.data='here'

const files = await getFilesDataFromRecord({
    workspaceId: '-Nnj6gGspBmEsMcC7I1t',
    gridId: 'packingSlipTemplate',
    rowKey: '-Nb-KFnavL1Lhyz-adew',
    cellKey: 'file',
})

let templateData = files[0].data[0]
console.log('templateData: ', templateData)
fs.writeFileSync(os.tmpdir()+'/empty-template.docx', templateData);
// Load the docx file as binary content
const content = fs.readFileSync(os.tmpdir()+'/empty-template.docx');
const zip = new PizZip(content);
const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    parser: expressionParser,
    nullGetter: nullGetter
});
$log.debug('file template', templateData)
context.data.dataToFill = {
    ...context.payload
}
doc.render({
    ...context.payload
});

$log.debug('doc rendered')

const buf = doc.getZip().generate({
    type: "nodebuffer",
    // compression: DEFLATE adds a compression step.
    // For a 50MB output document, expect 500ms additional CPU time
    compression: "DEFLATE",
});

context.buffer = buf
console.log(context.payload)
    fs.writeFileSync(os.tmpdir()+`/${context.payload.PONO}.docx`, buf);
    let base64str = Buffer.from(buf).toString('base64')
    const bucket = admin.storage().bucket('tangledev00-upload')
    bucket.upload(os.tmpdir()+`/${context.payload.PONO}.docx`).then(function(data) {
        const file = data[0]
    })

    await new Promise(resolve => {
        setTimeout(async () => {

        // The path to which the file should be downloaded
        const destFileName = os.tmpdir()+ '/' + context.payload.PONO;
        async function downloadFile() {
            const options = {
                destination: destFileName,
            };
               try {
        // Downloads the file to the destination file path
        await admin.storage().bucket(bucketName).file(fileName).download(options);
    } catch (err) {
        console.error('Error downloading file:', err);
        // Handle the error or throw it again if needed
        throw err; // You can rethrow the error if you want to propagate it further
    }
        }

        await downloadFile().catch(console.error);
            let pdfFile = fs.readFileSync(os.tmpdir() + '/' + context.payload.PONO);
          
           let pdfEmail = pdfFile.toString('base64')
         
            context.pdf=pdfEmail
            $log.debug('file ready')
            context.data.success = 'file created'
            resolve()
        }, 8000)
})