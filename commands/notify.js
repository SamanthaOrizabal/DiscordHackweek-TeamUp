const Discord = require('discord.js');
const auth = require('../auth.json');
const config = require('../config.json');
const colors = require('../colors.json');
const func = require('../functions.js');

//Main loop for executing command
module.exports.run = async(client, message, args) => {

  //convert timestamp to 24h format
  args[1] = args[1].split(':');
  if (args[1][1].endsWith('am')) {
    args[1][1] = args[1][1].slice(0, -2);
  } else if (args[1][1].endsWith('pm')) {
    args[1][0] = parseInt(args[1][0]) + 12;
    args[1][1] = args[1][1].slice(0, -2)
  }
  if (args[1][0].length == 1) {
    args[1][0] = '0' + args[1][0];
  }
  args[1] = args[1][0] + ":" + args[1][1] + ":00" //computer readable timestamp

  //sends a DM to the user that calls the command at the specified time
  setTimeout(function() {
    message.author.send('hello, this is a notification')
      .then(message => console.log(`Sent message: ${message.content}`))
      .catch(console.error);
  }, func.calculateDelay(args[0] + "T" + args[1]));

  message.channel.send("Okay! I will send you a notification on " + new Date(args[0] + "T" + args[1]) + ".");
}

//Config for the command here
module.exports.config = {
    name: 'notify',
    aliases: ['remind'],
    description: 'notifies a user',
    usage: 'notify YYYY-MM-DD HH:MM',
    noalias: "No Aliases"
}
