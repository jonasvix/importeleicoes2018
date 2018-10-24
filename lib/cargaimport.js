'use strict';

var config = require('../config/database');

function seedDB(db, fileName, csvFiles, csvIndex, callbackNextFile) {
  const readline = require('readline');
  const fs = require('fs');

  var cont = 0;

  var columns = [];

  var data = {};
  var group = 'rows';
  data[group] = [];

  var charSeparate = '\t';

  console.log(Date(Date.now()), 'seedDB', fileName, cont);

  const writeStream = fs.createWriteStream('./data_new/' + fileName + '.tsv', { encoding: "utf8"} );
  writeStream.on('open', function(fdw) {
    console.log('fdw', fdw);

    const readStream = fs.createReadStream('./data_tse/' + fileName, {encoding: "latin1"});
    readStream.on('open', function(fdr) {
      console.log('fdr', fdr);
    
      const rl = readline.createInterface({
        input: readStream,
        terminal: false,
        historySize: 0,
        crlfDelay: Infinity
      }).on('line', (line) => {
        cont++;

        if (!line || line.trim() == "") return;

        line = line.substring(1, line.length - 1);

        var itens = line.split('";"');
        if (itens==0) return;

        if (columns.length == 0) {
          for (let idx = 0; idx < itens.length; idx++) {
            var col = itens[idx].toLowerCase().replace(/\s/g,'');
            columns.push(col);
          }
        } else {
          var newLine = fileName + charSeparate + cont;
          for (let idx = 0; idx < columns.length; idx++) {
            let col = columns[idx];
            let val = itens[idx];

            if (val == null || val == undefined || val == "") {
              console.log('***************** Aviso: NULO NO IMPORT *****************', fileName, cont, group, col, val);
              val = (col.indexOf('qt_') != -1 ? '0': 'NULO NO IMPORT');
            } else {
              if (val == '#NULO#' && col.indexOf('qt_') != -1) {
                console.log('***************** Aviso: #NULO# e qt_ *****************', fileName, cont, group, col, val);
                val = '0';
              } else {
                //val = val.replace(/\"/g,"'").replace(/\,/g,".").trim();
                val = val.replace(/\"/g,'""');
              }
            }

            newLine = newLine + charSeparate + val;
          }

          writeStream.write(newLine + '\n');

          if (cont % 100000 == 0) {
            console.log('line', fileName, cont, group);
          }

          /*var newUrna = {};
          for (let idx = 0; idx < columns.length; idx++) {
            let col = columns[idx];
            let val = itens[idx];

            if (val == null || val == undefined || val == "") {
              console.log('NULO NO IMPORT', fileName, cont, group, val);

              val = 'NULO NO IMPORT';            
            }

            newUrna[col] = val;
          }

          newUrna._id = fileName + '.' + cont;

          data[group].push(newUrna);
          data[group].push(newUrna);

          if (cont % 50000 == 0) {
            console.log('line', fileName, cont, group);

            insertMany(db, data, group, fileName);

            group = 'rows' + (cont);
            data[group] = [];
          }*/

        }
      }).on('close', () => {
        console.log(Date(Date.now()), 'EndFile', fileName, cont);
        
        //insertMany(db, data, group, fileName, csvFiles, csvIndex, callbackNextFile);

        readStream.destroy();

        writeStream.end();
      });

    });

  })
  .on('close', function (err) {
    console.log('writeStream - Stream has been destroyed and file has been closed', fileName);

    console.log('\n\n');

    var fields = 'file_name.string(),file_line.string()';
    for (let idx = 0; idx < columns.length; idx++) {
      let col = columns[idx];
      fields = fields + ',' + col + (col.indexOf('qt_') != -1 ? '.int32()': '.string()');
    }

    let command = 'mongoimport --host '+config.db.host+' --port '+config.db.port+' --db '+config.db.name+' \
    --collection '+config.db.turno1+' --type tsv --columnsHaveTypes \
    --fields "'+fields+'" --file ./data_new/'+fileName+'.tsv';

    execCommand(db, fileName, csvFiles, csvIndex, callbackNextFile, command);
  });
};

function insertMany(db, data, group, fileName, csvFiles, csvIndex, callbackNextFile) {
  db.collection(config.db.turno1).insertMany(data[group], (err, ret) => {
    if(err) {
      if(err.message.match('ECONNREFUSED')) console.log('make sure you have started mongodb server');
      if(err.message.match('Authentication')) console.log('make sure the username/password pair is matched');
      console.log('=  done!', fileName, group, '\n');
      throw err.message + ', ' + fileName + ', ' + group;
    }

    console.log('%d records inserted', ret.insertedCount, fileName, group);
    
    data[group] = [];
    data[group] = null;
    delete data[group];

    if (csvFiles) {
      console.log('\n\n');

      setTimeout(function() {
        //proximo arquivo
        callbackNextFile(db, fileName, csvFiles, csvIndex+1);
      }, (1000));
    }
  });
};

function execCommand(db, fileName, csvFiles, csvIndex, callbackNextFile, command) {
  console.log('command', command);

  let exec = require('child_process').exec;
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.log('err', err);
      console.log('=  done!', fileName, '\n');
      throw err.message + ', ' + fileName;
    }

    if (stdout) {
      console.log('stdout', fileName, stdout);
    }

    console.log('stderr', stderr);

    console.log('\n\n');

    setTimeout(function() {
      //proximo arquivo
      callbackNextFile && callbackNextFile(db, fileName, csvFiles, csvIndex+1);
    }, 1000);
  });
};

module.exports.createIndice = function (db, fileName, csvFiles, csvIndex, callbackNextFile) {
  console.log(Date(Date.now()), '\n\criando índices...');

  let command = 'mongo '+config.db.name+' --host '+config.db.host+' --port '+config.db.port+' \
  --eval "\
  db.'+config.db.turno1+'.createIndex( { cd_cargo_pergunta: 1, nr_votavel: 1, sg_uf: 1 } ); \
  db.'+config.db.turno1+'.createIndex( { sg_uf: 1 } );"';

  execCommand(db, fileName, csvFiles, csvIndex, callbackNextFile, command);
};

module.exports.startImport = function (db, fileName, csvFiles, csvIndex, callbackNextFile) {
  seedDB(db, fileName, csvFiles, csvIndex, callbackNextFile);
};
