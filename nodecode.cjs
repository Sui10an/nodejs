// Node.js繧ｵ繝ｼ繝舌?ｼ繧ｳ繝ｼ繝?

const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const port = new SerialPort({ path: 'COM7', baudRate: 9600 }); // 繧ｷ繝ｪ繧｢繝ｫ繝昴?ｼ繝医?ｮ險ｭ螳?
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

const app = express();
const svelteServerUrl = 'http://localhost:5173/api'; // SvelteアプリケーションのエンドポイントURL

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Arduino縺九ｉ縺ｮ繝?繝ｼ繧ｿ繧貞女縺大叙繧?
parser.on('data', (data) => {
  console.log(`[node] Received data: ${data}`);
  axios.post(svelteServerUrl + "/update", { value: data.trim() })
    .then(response => {
      console.log('Data sent to Svelte:', response.data);
      if (response.data.body.message === "countup") {
        axios.post(svelteServerUrl + "/countup", { value: data.trim() })
        .then(response => {
          console.log("response")
        })
        .catch(error => {
          console.error("error sending data to /api/countup:", error)
        })
      }
    })
    .catch(error => {
      console.error('Error sending data to Svelte:', error);
    });
});

// Svelteアプリケーションからのデータを受け取る
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

// Arduinoからのカウントアップデータを受け取る
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

// サーバーサイドイベントのエンドポイント
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = () => {
    res.write(`data: ${JSON.stringify({ count })}\n\n`);
  };

  // イベントを定期的に送信する
  const intervalId = setInterval(sendEvent, 1000);

  // クリーンアップ
  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
