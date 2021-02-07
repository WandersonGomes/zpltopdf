const remote = require('electron').remote
const dialog = remote.dialog
const path = require('path')
const fileSystem = require('fs')
const request = require('request')
const BrowserWindow = remote.BrowserWindow

const inputFileZPL = document.getElementById('input-file-zpl')
const inputDirectoryOutput = document.getElementById('input-directory-output')
const formInputPaths = document.getElementById('form-input-paths')

formInputPaths.addEventListener('submit', async (event) => {
    event.preventDefault()

    generatePDF()
})

async function setFileZPL() {
    const result = await dialog.showOpenDialog(remote.getCurrentWindow(), {
        properties: ["openFile"],
        defaultPath: path.resolve(".."),
        filters: [
            {name: "Text", extensions: ['txt']}
        ]
    })

    if (!result.canceled) {
        inputFileZPL.value = result.filePaths[0]
    }
}

async function setDirectoryOutput() {
    const result = await dialog.showOpenDialog(remote.getCurrentWindow(), {
        properties: ["openDirectory"],
        defaultPath: path.resolve("./output/")
    })

    if (!result.canceled) {
        inputDirectoryOutput.value = result.filePaths[0]
    }
}

async function generatePDF() {
    let zplContent = ''

    zplContent = fileSystem.readFileSync(inputFileZPL.value, 'utf8');

    var options = {
        encoding: null,
        formData: { file: zplContent },
        // omit this line to get PNG images back
        headers: { 'Accept': 'application/pdf' },
        // adjust print density (8dpmm), label width (4 inches), label height (6 inches), and label index (0) as necessary
        url: 'http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/'
    };

    await request.post(options, function(err, resp, body) {
      if (err) {
          return console.log(err);
      }
      let filename = inputDirectoryOutput.value + '/label.pdf'; // change file name for PNG images
      fileSystem.writeFileSync(filename, body, function(err) {
          if (err) {
              console.log(err);
          }
      });
      const pdfWindow = new BrowserWindow({
        width: 400,
        height: 600
      })
      pdfWindow.loadFile(filename)
      pdfWindow.removeMenu()
      pdfWindow.show()
    });
}