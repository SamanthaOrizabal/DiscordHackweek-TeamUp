const Discord = require('discord.js');
const auth = require('../auth.json');
const config = require('../config.json');
const colors = require('../colors.json');
const func = require('../functions.js');
const mongoose = require('mongoose');
const Models = require('../models.js');

//Main loop for executing command
module.exports.run = async (client, message, args) => {
  //group create [name] [game] [date] [time]
  //group args[0] args[1] args[2] args[3] args[4]
  var server = message.guild.id;
  if (args[0] === "create") {

    var dateTime = func.readUserDate(args[3], args[4]);

    if (dateTime === false) {
      message.channel.send("Please specify the date and time of your group's meeting time.");
      return;
    }

    var group = new Models.Group({
      creator: message.author,
      name: args[1],
      game: args[2],
      date: dateTime,
      participants: [message.author],
      server: server
    });

    //verify a group with the submitted name isn't already in db
    Models.Group.findOne({ name: args[1] }, function (error, result) {
      if (result != null) {
        message.channel.send("A group with this name already exists! Join them with `?group join " + args[1] + "` or choose a different name.");
      } else {
        //save the group into mongodb
        group.save(function (error) {
          if (error) {
            console.error(error);
          } else {
            console.log("Group successfully saved into mongodb.");
          }
        });
      }
    });
  } else if (args[0] === "join") { //group join [name]
    //find group with name == args[1] in this server/message channel
    //add message.author to participants list
    // COMBAK: We need to prevent players from joining if they are already in the group
    Models.Group.findOne({ name: args[1], server: server }, function (err, docs) {
      if (err) {
        console.error(err)
        return;
      }
      if (docs == null) {
        message.channel.send("That group doesn't exist.");
        return;
      }
      if (docs.participants.includes(message.author)) {
        message.channel.send("You are already in that group!");
        return;
      }
      docs.participants.push(message.author);
      docs.save(function (error) {
        if (error) {
          console.error(error);
          message.channel.send("**ERROR:** " + error.message);
          return;
        } else {
          console.log("Group successfully saved into mongodb.");
          message.channel.send('You joined the group.');
        }
      });
    });


  } else if (args[0] === "leave") { //group leave [name]
    //find group with name == args[1] in this server/message channel
    //remove message.author from participants list
    Models.Group.findOne({ name: args[1], server: message.guild.id }, function (err, docs) {
      if (err) {
        console.error(err)
        return;
      }
      if (docs == null) {
        message.channel.send("That group doesn't exist.");
        return;
      }

      var index = docs.participants.indexOf(message.author)
      if (index > -1) {
        docs.participants.splice(index, 1);
        docs.save(function (error) {
          if (error) {
            console.error(error);
            message.channel.send("**ERROR:** " + error.message);
            return;
          } else {
            console.log("Group successfully saved into mongodb.");
            message.channel.send('You left the group.');
          }
        });
      } else {
        message.channel.send("You are not in that group!");
      }

    });
  } else if (args[0] === "disband") { //group disband [name]
    //find group with name == args[1] in this server/message channel
    //confirm message.author is group creator
    //delete group
  } else if (args[0] === "info") { //group info [name]
    //find group with name == args[1] in this server/message channel
    //send message about the info of the group
    //name of group, time and date, game, participants, owner
    Models.Group.findOne({ server: server, name: args[1] }, function (error, result) {
      //console.log(result);
      var creatorID = result.creator.substring(2, result.creator.length - 1);
      var creatorUsername = message.guild.members.get(creatorID).user.username;
      var creatorAvatarURL = message.guild.members.get(creatorID).user.displayAvatarURL;

      var participants = result.participants;
      var participantsAmount = result.participants.length;
      var game = result.game;
      var date = result.date;

      var groupInfoEmbed = new Discord.RichEmbed()
        .setColor(colors.orange)
        .setTitle(result.name)
        .setAuthor(creatorUsername + "'s " + game + " group", creatorAvatarURL)
        .setDescription(creatorUsername + " created this group with " + participantsAmount + " participants for " + game + ".")
        .setThumbnail(creatorAvatarURL)
        .addField("Creator", creatorUsername, true)
        .addField("Game", game, true)
        .addField("Date", date, true)
        .addField("Participants", participants);

      message.channel.send(groupInfoEmbed);
    });
  } else if (args[0] === "list") { //group list
    //lists all the available groups in the server
    Models.Group.find({ server: server }, function (error, result) {
      console.log(result);
    });
  } else {
    message.channel.send("I don't understand your request. Type `?help group` for a list of commands I can understand.");
  }
}

//Config for the command here
module.exports.config = {
  name: 'group',
  aliases: ['team', "teamup", "squad"],
  description: 'Used to create or manage a group.',
  usage: 'group create [name] [game] [date] [time], group join [name], group leave [name], group disband [name] \n **[name] and [game] must not contain spaces** \n **[time] needs to be in 24 hour format** \n **[date] needs to be in YYYY-MM-DD format**',
  example: '?group create Friday-Game-Night Super-Smash-Bros 2019-06-28 20:00',
  noalias: "No Aliases"
}
