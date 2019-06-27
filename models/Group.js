const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let groupSchema = new Schema({
    creator: String,
    name: String,
    game: String,
    time: Date,
    participants: Array,
    server: String
});

module.exports.groupSchema = groupSchema;
