const Discord = require('discord.js');
const auth = require('../auth.json');
const config = require('../config.json');

module.exports.run = async(client, message, args) => {
    message.channel.send("this is the help");
}

module.exports.config = {
    name: 'help',
    aliases: ['h', 'commands']
}