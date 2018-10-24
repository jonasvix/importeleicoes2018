'use strict';

const cargafile = require('./cargafile');

const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

module.exports.startServer = function(db) {
  const server = http.createServer((req, res) => {
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});

    var config = cargafile.getConfig();
  
    var pFile = [];
    for (let index = 0; index < config.csvFiles.length; index++) {
      var mark = index < config.csvIndex ? 'ok - ' : (index == config.csvIndex ? '>> - ' : '');
  
      pFile.push('<p>' + mark + config.csvFiles[index] + '<p/>');
    }
  
    var title = 'Eleições 2018: 1 turno\n';
    var body = title + pFile.join('\n');
  
    var code =  [
          '<!DOCTYPE html>',
          '<html>',
              '<head>',
                  '<meta charset="utf-8" />',
                  '<title>' + title + '</title>',
              '</head>',
              '<body>',
                  body,
              '</body>',
          '</html>'
      ].join('\n');
  
    res.write(code, "utf8");
    res.end();
  });
  
  server.listen(port, hostname, () => {
    var url = `http://${hostname}:${port}/`
    console.log(`Server running at `, url);
  
    const opn = require('opn');
    // Opens the url in the default browser
    opn(url);
  });
  
  server.on('error', function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;
    
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  return server;
};
