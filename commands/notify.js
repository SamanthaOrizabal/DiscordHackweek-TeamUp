const Discord = require('discord.js');
const auth = require('../auth.json');
const config = require('../config.json');
const colors = require('../colors.json');

//Main loop for executing command
module.exports.run = async(client, message, args) => {
  //sends a DM to anyone that calls the command (currently just for testing)
  message.author.send('hello, this is a notification')
    .then(message => console.log(`Sent message: ${message.content}`))
    .catch(console.error);
}

//Config for the command here
module.exports.config = {
    name: 'notify',
    aliases: ['remind'],
    description: 'notifies a user',
    usage: 'usage here',
    noalias: "No Aliases"
}
