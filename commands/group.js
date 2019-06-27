const Discord = require('discord.js');
const auth = require('../auth.json');
const config = require('../config.json');
const colors = require('../colors.json');
const func = require('../functions.js');

//Main loop for executing command
module.exports.run = async(client, message, args) => {
  //group create [name] [game] [date] [time]
  if (args[1] === "create") {

    var dateTime = func.readUserDate(args[3], args[4]);
    if (dateTime === false) {
      return;
    }

    var group = {
      creator: message.author,
      name: args[2],
      game: args[3],
      time: dateTime,
      participants: [message.author]
    }

    //save this to the database, and remember to include server it was created on

  } else if (args[1] === "join") { //group join [name]
    //find group with name == args[1] in this server/message channel
    //add message.author t0 participants list
  } else if (args[1] === "leave") { //group leave [name]
    //find group with name == args[1] in this server/message channel
    //remove message.author from participants list
  } else if (args[1] === "disband") { //group disband [name]
    //find group with name == args[1] in this server/message channel
    //confirm message.author is group creator
    //delete group
  }
}

//Config for the command here
module.exports.config = {
    name: 'group',
    aliases: ['team', "teamup", "squad"],
    description: 'used to create or manage a group.',
    usage: 'group create [name] [game] [date] [time], group join [name], group leave [name], group disband [name]',
    noalias: "No Aliases"
}
