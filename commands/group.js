const Discord = require('discord.js');
const auth = require('../auth.json');
const config = require('../config.json');
const colors = require('../colors.json');
const func = require('../functions.js');

//Main loop for executing command
module.exports.run = async(client, message, args) => {
  if (args[1] === "create") {
    var group = {
      creator: message.author,
      name: args[2],
      game: args[3],
      time: args[4] + "T" + args[5]
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
