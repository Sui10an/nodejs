const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const express = require('express')
const axios = require('axios')
const cors = require('cors')

const port = new SerialPort({ path: 'COM7', baudRate: 9600 })
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }))

const app = express();
const svelteServerUrl = 'http://localhost:5173/api'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

parser.on('data', (data) => {
  console.log(`[node] Received data: ${data}`);
  console.log(data)
  if (data == '*') return
  axios.post(svelteServerUrl + "/countup", { value: data.trim() })
    .then(response => {
      console.log("response")
    })
    .catch(error => {
      console.error("error sending data to /api/countup:", error)
    })
});

app.listen(4000, () => {
  console.log('Server is running on port 4000')
})
