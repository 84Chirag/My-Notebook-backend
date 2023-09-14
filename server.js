const connecttodb = require('./db');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const port = 80

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`http://127.0.0.1:${port}`)
})

connecttodb();