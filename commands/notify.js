const Discord = require('discord.js');
const auth = require('../auth.json');
const config = require('../config.json');
const colors = require('../colors.json');
const func = require('../functions.js');

//Main loop for executing command
module.exports.run = async(client, message, args) => {

  //date/time not entered
  if (args.length < 2) {
    message.channel.send("Please specify the date and time of when you want to be notified");
    return;
  }
  if (args.length == 2) {
    message.channel.send("Please specify the message you want the notification to contain.");
    return;
  }

  var dateTime = func.readUserDate(args[0], args[1])
  if (dateTime === false)
    return;

  //Remove date and time args to retain rest of message
  args.splice(0, 2);
  var msg = args.join(" ");

  //sends a DM to the user that calls the command at the specified time
  let reply = new Discord.RichEmbed()
  .setColor(colors.cyan)
  .setAuthor('Your notification is ready!', client.user.displayAvatarURL)
  .setDescription(msg);

  message.channel.send("Okay! I will send you a notification at " + new Date(dateTime) + ".");
  setTimeout(function() {func.sendNotification(message.author, reply)}, func.calculateDelay(dateTime));
}

//Config for the command here
module.exports.config = {
    name: 'notify',
    aliases: ['remind', 'setreminder', 'remindme', 'notifyme'],
    description: 'Set reminders for yourself and receive them by DM.',
    usage: 'notify [date] [time] [message] \n **[time] needs to be in 24 hour format.** \n **[date] needs to be in YYYY-MM-DD format** \n **[message] can have spaces**',
    example: '?notify 2019-06-28 23:59 :clap: Discord Hack Week deadline! Submit your bot!',
    noalias: "No Aliases"
}
