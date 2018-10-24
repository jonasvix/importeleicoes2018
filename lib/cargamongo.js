'use strict';

const mongoose = require('mongoose');
const config = require('../config/database');

module.exports.startMongo = function(callbackMongo) {
    const auth = config.username ? `${config.username}:${config.password}@` : '';

    const uri = `mongodb://${auth}${config.db.host}:${config.db.port}/${config.db.name}`;
    mongoose.connect(uri, config.db.options, (err, db) => {
        if(err) {
            console.error("Erro ao conectar ao Mongodb: ", uri, err);
            callbackMongo(err, db);
            return;
        }

        console.log('Connection succesful', uri);

        callbackMongo(null, db);

        /*db.dropCollection(config.db.turno1, function(err, result) {
            if(err) {
                console.log("Erro dropCollection:", err);
            } else {
                console.log('dropCollection succesful', result);
            }

            callbackMongo(null, db);
        });*/
    });
};
