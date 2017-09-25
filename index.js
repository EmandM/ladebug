/* eslint-disable */

var express = require('express');
var path = require('path');

module.exports = {
    app: function () {
      const app = express();
      const indexPath = path.join(__dirname, '/dist/index.html');
      const publicPath = express.static(__dirname);
  
      app.use('/dist', publicPath)
      app.get('/', function (_, res) { res.sendFile(indexPath) });
  
      return app;
    },
  };
