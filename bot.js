const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const config = require('./config.json');


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
});

client.on('message', async message => {

  //Ignore other bots
  if (message.author.bot) return;

  //Ignore messages not using our prefix
  if (message.content.indexOf(config.prefix) !== 0) return;

  //Separate arguments from the command
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "help") {
    message.channel.send("this is the help");
  }
});

client.login(auth.token);
