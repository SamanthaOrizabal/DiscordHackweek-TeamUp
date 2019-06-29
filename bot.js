const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const config = require('./config.json');
const colors = require('./colors.json');
const fs = require('fs');
const func = require('./functions.js');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  var timeInterval = 60000; //1 minute
  setInterval(function() {
    func.checkDates(client, timeInterval);
  }, timeInterval)

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

client.mongoose = require('./utils/mongoose');
client.mongoose.init();

client.on('message', async message => {

  /*
  messages to the bot follow this basic structure:
  (prefix)(command)(arguments)
  e.g. ?help notifications
  */

  //Ignore other bots
  if (message.author.bot) return;

  //Ignore messages not using our prefix
  if (message.content.indexOf(config.prefix) !== 0) return;

  //Separate arguments from the command

  var regex = /"[^"]+"|[^\s]+/g;
  var messageContent = message.content.trim();
  var args = messageContent.slice(config.prefix.length).trim().match(regex).map(e => e.replace(/"(.+)"/, "$1"));


  const command = args.shift().toLowerCase();
  console.log(args);
  let commandfile = client.commands.get(command) || client.commands.get(client.aliases.get(command));

  if (commandfile) {
    commandfile.run(client, message, args);
  }
});

client.login(auth.token);
