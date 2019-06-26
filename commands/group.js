const Discord = require('discord.js');
const auth = require('../auth.json');
const config = require('../config.json');
const colors = require('../colors.json');
const func = require('../functions.js');

//Main loop for executing command
module.exports.run = async(client, message, args) => {
  if (args[1] === "create") {
    //need to save group creator
    //need to save group name
  }
}

//Config for the command here
module.exports.config = {
    name: 'group',
    aliases: ['team', "teamup", "squad"],
    description: 'used to create or manage a group.',
    usage: 'group create [name] [game] [time], group join [name], group leave [name], group disband [name]',
    noalias: "No Aliases"
}
