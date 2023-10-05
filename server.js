const connecttodb = require('./db');
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const port = 80


app.use(cors());
app.use(express.json());

// all available routes
app.use('/auth', require('./routes/auth'));
app.use('/book', require('./routes/book'));


// endpoints
app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})

connecttodb();