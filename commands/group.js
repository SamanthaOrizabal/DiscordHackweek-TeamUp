const Discord = require('discord.js');
const auth = require('../auth.json');
const config = require('../config.json');
const colors = require('../colors.json');
const func = require('../functions.js');

//Main loop for executing command
module.exports.run = async(client, message, args) => {
  if (args[1] === "create") { //group create [name] [game] [date] [time]

    var dateTime = func.readUserDate(args[3], args[4]);
    if (dateTime === false)
      return;

    var group = {
      creator: message.author,
      name: args[2],
      game: args[3],
      time: dateTime
    }
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
