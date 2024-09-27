const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const http = require('http')

const svelteServerUrl = 'http://localhost:5174/api';
const app = express();
const server = http.createServer(app)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const sendPostRequest = async (data) => {
  try {
    const response = await axios.post(`${svelteServerUrl}/countup`, { value: data.trim() });
    console.log("response:", response.data);
  } catch (error) {
    console.error("error sending data to /api/countup:", error);
  }
};

const openPort = () => {
  const port = new SerialPort({ path: 'COM7', baudRate: 9600 }, (error) => {
    if (error) {
      console.error('Error opening port:', error);
      setTimeout(() => {
        openPort();
        sendPostRequest('*');
      }, 1000);
    }
  });

  const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

  parser.on('data', (data) => {
    console.log(`[node] Received data: ${data}`);
    if (data === '*') return;
    sendPostRequest(data);
  });
};

openPort();

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});

server.listen(4001, () => {
  console.log('Server is running on port 4001');
});

app.post('/data', (req, res) => {
  console.log('Received POST request:', req.body);
  res.status(200).send('Data received');

  if (req.body.value === '*') {
    sendPostRequest('*');
  }
});