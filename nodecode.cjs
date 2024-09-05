// Node.js�T�[�o�[�R�[�h

const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const port = new SerialPort({ path: 'COM7', baudRate: 9600 }); // �V���A���|�[�g�̐ݒ�
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

const app = express();
const svelteServerUrl = 'http://localhost:5173/api/update'; // Svelte�A�v���P�[�V�����̃G���h�|�C���gURL

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Arduino����̃f�[�^���󂯎��
parser.on('data', (data) => {
  console.log(`Received data: ${data}`);
  axios.post(svelteServerUrl, { value: data.trim() })
    .then(response => {
      console.log('Data sent to Svelte:', response.data);
    })
    .catch(error => {
      console.error('Error sending data to Svelte:', error);
    });
});

// Svelte�A�v���P�[�V��������̃f�[�^���󂯎��
app.post('/data', (req, res) => {
  if (!req.body) {
    return res.status(400).send({ error: 'No data received' });
  }

  const { value } = req.body;

  if (!value) {
    return res.status(400).send({ error: 'No value in data' });
  }

  console.log('Data received from Svelte:', value);

  res.status(200).send({ message: 'Data received' });
});

let count = 0;

// Arduino����̃J�E���g�A�b�v�f�[�^���󂯎��
app.post('/update', (req, res) => {
  if (!req.body) {
    return res.status(400).send({ error: 'No data received' });
  }
  
  const { count: newCount } = req.body;

  if (newCount === undefined) {
    return res.status(400).send({ error: 'No count value in data' });
  }

  count = newCount;

  res.status(200).send({ message: 'Data received' });
});

// �T�[�o�[�T�C�h�C�x���g�̃G���h�|�C���g
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = () => {
    res.write(`data: ${JSON.stringify({ count })}\n\n`);
  };

  // �C�x���g�����I�ɑ��M����
  const intervalId = setInterval(sendEvent, 1000);

  // �N���[���A�b�v
  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
