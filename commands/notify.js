const Discord = require('discord.js');
const auth = require('../auth.json');
const config = require('../config.json');
const colors = require('../colors.json');
const func = require('../functions.js');

//Main loop for executing command
module.exports.run = async(client, message, args) => {

  //date/time not entered
  if (args.length < 2) {
    message.channel.send("Please specify the date and time you want to be notified at");
    return;
  }

  var time = func.to24hour(args.pop());
  var date = args.join(" ");
  var dateTime = new Date(date + "T" + time);
  console.log(time, date, dateTime);
  console.log(date+"T"+time);
  //This is a determine if the date is invalid and reply appropriately
  if (isNaN(dateTime.getTime())) {
    message.channel.send("Sorry! That is not a vaild date/time format. See the help for more info.");
    return;
  }

  //sends a DM to the user that calls the command at the specified time
  var reply = "This is a notification.";
  message.channel.send("Okay! I will send you a notification at " + new Date(dateTime) + ".");
  console.log(func.calculateDelay(dateTime));
  setTimeout(function() {func.sendNotification(message.author, reply)}, func.calculateDelay(dateTime));


}

//Config for the command here
module.exports.config = {
    name: 'notify',
    aliases: ['remind'],
    description: 'notifies a user',
    usage: 'notify YYYY-MM-DD HH:MM',
    noalias: "No Aliases"
}
