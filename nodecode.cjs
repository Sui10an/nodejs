const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const svelteServerUrl = 'http://localhost:5173/api';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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