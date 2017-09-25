/* eslint-disable */
const express = require('express');
const app = express();

app.set('port', (process.env.PORT || 3000));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port', app.get('port'));
});
