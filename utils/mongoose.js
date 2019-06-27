const config = require('../config.json');
const mongoose = require('mongoose');

module.exports = {
    //https://mongoosejs.com/docs/connections.html#options
    init: () => {
        const dbOptions = {
            useNewUrlParser: true,
            autoIndex: false,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 500,
            poolSize: 5,
            connectTimeoutMS: 10000,
            family: 4
        };

        mongoose.connect(`${config.mongodbURL}`, dbOptions);
        mongoose.set('useFindAndModify', false);
        mongoose.Promise = global.Promise;

        mongoose.connection.on('connected', () => {
            console.log('Mongoose connection successfully opened!');
        });

        mongoose.connection.on('err', err => {
            console.error(`Mongoose connection error: \n ${err.stack}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.log(`Mongoose disconnected.`);
        });
    }
};