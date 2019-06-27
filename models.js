const mongoose = require("mongoose");
const Groups = require('./models/Group');

// mongoose.connect("mongodb://localhost:27017/teamup");

// var db = mongoose.connection;

// db.on("error", console.error.bind(console, "Connection error:"));
// db.once("open", function(callback) {
//     console.log("Connection Succeeded.");
// });

var Group = mongoose.model("Group", Groups.groupSchema);

module.exports.Group = Group;