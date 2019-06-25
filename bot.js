const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const config = require('./config.json');
const colors = require('./colors.json');
const fs = require('fs');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
});

//Create Collections for commands and commands aliases
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

//Look through the commands folder and find the command file needed
fs.readdir('./commands', (err, files) => {
  if (err) {
    console.log(err);
  }

  let jsfile = files.filter(f => f.split('.').pop() === 'js');

  if (jsfile.length <= 0) {
    return console.log("[LOGS] Couldn't find commands");
  }

  jsfile.forEach((f, i) => {
    let pull = require(`./commands/${f}`);
    client.commands.set(pull.config.name, pull);
    pull.config.aliases.forEach(alias => {
      client.aliases.set(alias, pull.config.name);
    });
  });
});

client.on('message', async message => {

  //Ignore other bots
  if (message.author.bot) return;

  //Ignore messages not using our prefix
  if (message.content.indexOf(config.prefix) !== 0) return;

  //Separate arguments from the command
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  let commandfile = client.commands.get(command) || client.commands.get(client.aliases.get(command));

  if (commandfile) {
    commandfile.run(client, message, args);
  }
});

client.login(auth.token);
