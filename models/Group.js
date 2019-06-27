const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let groupSchema = new Schema({
    creator: String,
    name: String,
    game: String,
    date: Date,
    participants: {
        type: [String]
    },
    server: String
});

module.exports.groupSchema = groupSchema;
