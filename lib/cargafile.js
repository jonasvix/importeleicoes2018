'use strict';

var csvFilesGlobal = [];
var csvIndexGlobal = -1;

function nexFile(db, fileName, csvFiles, csvIndex) {
    console.log(Date(Date.now()), 'startFile.', csvIndex);

    csvFilesGlobal = csvFiles;
    csvIndexGlobal = csvIndex;

    const cargaimport = require('./cargaimport');

    if (csvFiles && csvIndex > -1) {
        if (csvIndex < csvFiles.length) {
            if (csvIndex < csvFiles.length-1)
              cargaimport.startImport(db, csvFiles[csvIndex], csvFiles, csvIndex, nexFile);
            else
              cargaimport.createIndice(db, csvFiles[csvIndex], csvFiles, csvIndex, nexFile);
        } else {
            console.log(Date(Date.now()), '\n\nend import.');
        }
    } else {
        if (fileName) {
            cargaimport.startImport(db, fileName, null, null, null);
        }
    }
};

module.exports.getConfig = function () {
    return {csvFiles: csvFilesGlobal, csvIndex: csvIndexGlobal};
};

module.exports.startFiles = function (db) {
    const fs = require('fs');

    fs.readdir('./data_tse/', function(err, files) {
        if(err) {
            console.error("Erro ao acessar os arquivos: " + err);
            return;
        }

        var csvFiles = files.filter(el => /\.csv$/.test(el)).sort();
        csvFiles.push('criar índice');

        var csvIndex = 0;

        var fileName = null;

        console.log(Date(Date.now()), 'Start...');
        console.log(csvFiles);

        setTimeout(function() {
            nexFile(db, fileName, csvFiles, csvIndex);
        }, 1000); //1seg
    });
};
