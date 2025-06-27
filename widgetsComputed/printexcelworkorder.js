return async (rowData) => {
  console.log('running print excel wo', rowData)
      $setGlobalModel('printingWorkOrder', true)

  // *** PART 1 ***
  let convertToPDF = true
  let convertedFileName = 'converted-file'

  const dataPath = await prepareData.bind(this)(convertToPDF, rowData)

  // *** PART 2 ***
  const templatePath = getTemplatePath.bind(this)(
    'workorderexceltemplate',
    '-Nc7i2Em_8XwkTwaCOnl',
    'excelTemplate'
  )

  if (!dataPath) {
    this.$set(this.globalModels, 'getXlsxInProcess', false)
    alert('No tags!')
  }

  if (!templatePath) {
    this.$set(this.globalModels, 'getXlsxInProcess', false)
    alert('No template!')
  }

  this.$axios
    .get(
      'https://us-central1-tangledev00.cloudfunctions.net/yarlMetalsXlsxTemplate',

      // use the url below only for tanglestaging
      //'https://us-central1-tanglestaging-84686.cloudfunctions.net/yarlMetalsXlsxTemplate',
      {
        params: {
          templatePath,
          dataPath,
        },
        responseType: 'blob',
      }
    )
    .then(async (response) => {
      // This will upload the file to a field called pdf in the table customers1
      // and on a specified row

      response.data.name = convertedFileName
        ? convertedFileName + `${convertToPDF ? '.pdf' : '.xlsx'}`
        : 'basic-converted-file' + `${convertToPDF ? '.pdf' : '.xlsx'}`

      // *** PART 3 ***
      let newRow = await $dgAddRow('printedWorkOrder', {
        name: rowData.name,
        workOrder: rowData.rowKey,
      })
      console.log('newRow', newRow)
      console.log('res', [response.data])
        $dgFilesUpload({
            gridId: 'printedWorkOrder',
            rowKey: newRow,
            cellKey: 'pdf',
            filesToUpload: [response.data]
        })
      
      // END OF *** PART 3 ***

      // *** PART 4 ***
      // This part allows the file to open for download automatically
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        convertedFileName
          ? convertedFileName + `${convertToPDF ? '.pdf' : '.xlsx'}`
          : 'basic-converted-file' + `${convertToPDF ? '.pdf' : '.xlsx'}`
      )
      document.body.appendChild(link)
      link.click()
      $(link).remove()
              $setGlobalModel('printingWorkOrder', false)

      // END OF *** PART 4 ***
    })

}

async function prepareData(convertToPDF, rowData) {
  // Here we will prepare the data to needed to fill out the template
  // Any images in the dataOject should have a corresponding object in the pictures array

  // The id on the picture object should match the one in dataObject
  let pictures = []

  let rowDataNoCirc = window.removeCircularReferences(rowData)

  if(!rowDataNoCirc.workOrderOperations) {
    rowDataNoCirc.workOrderOperations = []
  }
  console.log('rowDataNoCirc: ', rowDataNoCirc)
// Convert workOrderOperations from an object of objects to an array of objects
const workOrderOperationsArray = [];
for (const operationKey in rowData.workOrderOperations) {
  if (rowData.workOrderOperations.hasOwnProperty(operationKey)) {
    const operation = rowData.workOrderOperations[operationKey];
    workOrderOperationsArray.push(operation);
  }
}

rowDataNoCirc.workOrderOperations = workOrderOperationsArray
  // Main data object will contain the data that will be passed to the template of find and replace,
  // It will contain arrays for loops etc.
  // *** PART 5 ***
  let dataObject = {
    rowData: rowDataNoCirc,
    // enteredBy: 'Someone Known',
    // contact: 'A Known Contact',
    // subObject: {
    //   enteredBy: 'Someone Nested',
    // },
    // workers: [
    //   {
    //     name: 'Some Worker',
    //     age: 25,
    //     position: 'Lawyer',
    //     visits: [
    //       {
    //         month: 'May',
    //       },
    //       {
    //         month: 'July',
    //       },
    //     ],
    //   },
    // ],
  }

  // This is the final object sent to the function
  let final = {
    convertToPDF,
    data: dataObject,
    pictures: pictures,
  }

  console.log(final)

  const json = JSON.stringify(final)
  const blob = new Blob([json], { type: 'text/json' })
  blob.name = 'tags.json'

  const fileName = await new Promise((resolve) => {
    this.$storageService.upload(this.currentDash, blob, (res) => {
      resolve(Object.keys(res)[0] + '_' + Object.values(res)[0])
    })
  })
  return `${this.currentDash}/${fileName}`
}

function getTemplatePath(gridId, rowKey, fieldName) {
  const data = $dataGrid(gridId)[`${rowKey}`]

  return `${this.currentDash}/${data[`${fieldName}`][0].id}`
}
