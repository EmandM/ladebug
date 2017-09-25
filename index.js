/* eslint-disable */
const express = require('express');
const app = express();
const port = (process.env.PORT || 3000)

app.set('port', port);
app.use(express.static(__dirname + '/dist'));

app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/dist/index.html');
});

app.listen(port, function () {
  console.log('Example app listening on port', port);
});
