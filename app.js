'use strict';

const cargamongo = require('./lib/cargamongo');
const cargaserver = require('./lib/cargaserver');
const cargafile = require('./lib/cargafile');

function callbackMongo(err, db) {
  if (err || !db) return;

  cargaserver.startServer(db);

  cargafile.startFiles(db);
}

cargamongo.startMongo(callbackMongo);

process.on('exit', function(code) {
  console.log('About to exit with code:', code);
});

process.on('warning', (warning) => {
  console.warn('warning', warning.name, warning.message, warning.stack);
});

console.log("Program Started");
