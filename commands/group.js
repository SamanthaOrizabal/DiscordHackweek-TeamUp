const Discord = require('discord.js');
const auth = require('../auth.json');
const config = require('../config.json');
const colors = require('../colors.json');
const func = require('../functions.js');
const mongoose = require('mongoose');
const Models = require('../models.js');

const prefix = config.prefix;
//Main loop for executing command
module.exports.run = async (client, message, args) => {
  //group create [name] [game] [date] [time] [max players]
  //args[0] args[1] args[2] args[3] args[4] args[5] args[6]
  var server = message.guild.id;
  if (args[0] === "create") {

    var date = func.getDateFromMessage(args[3]);
    var dateTime = func.readUserDate(date, args[4]);
    //catch errors
    if (args[1] == null) {
      message.channel.send("Please specify the name of this group.");
      return;
    } else {
      args[1] = args[1].trim();
    }
    if (args[2] == null) {
      message.channel.send("Please specify the game this group will play.");
      return;
    } else {
      args[2] = args[2].trim();
    }
    if (dateTime === false) {
      message.channel.send("Please specify the date and time of your group's meeting time in YYYY-MM-DD HH:MM format.");
      return;
    }
    if (args[5] == null) {
      message.channel.send("Please specify the maximum number of players for this group.");
      return;
    } else if (isNaN(args[5])) {
      message.channel.send("Please specify the maximum number of players for this group.");
      return;
    }

    var group = new Models.Group({
      creator: message.author,
      name: args[1],
      game: args[2],
      date: dateTime,
      participants: [message.author],
      maxPlayers: args[5],
      server: server
    });

    //verify a group with the submitted name isn't already in db
    Models.Group.findOne({ name: args[1] }, function (error, result) {
      if (result != null) {
        message.channel.send("A group with this name already exists! Join them with `" + `${prefix}` + " group join " + args[1] + "`" + " or choose a different name.");
      } else {
        //save the group into mongodb
        group.save(function (error) {
          if (error) {
            console.error(error);
          } else {
            console.log("Group successfully saved into mongodb.");
            message.channel.send("Group created!");
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
      if (docs.participants.length >= docs.maxPlayers) {
        message.channel.send("This group is at maximum capacity.");
        return;
      }

      docs.participants.push(message.author);
      docs.save(function (error) {
        if (error) {
          console.error(error);
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
    Models.Group.findOne({ name: args[1], server: server }, function (err, docs) {
      if (err) {
        console.error(err)
        return;
      }
      if (docs == null) {
        message.channel.send("That group doesn't exist.");
        return;
      }

      if (docs.creator == "<@" + message.author.id + ">") {
        message.channel.send();
        var confirmationEmbed = new Discord.RichEmbed()
          .setColor(colors.red)
          .setTitle("Are you sure?")
          .setDescription("You cannot leave a group you created. \nYou can remove the group using ` " + `${prefix}` + " group disband " + args[1] + "`" + "\n If you **really** want to leave, click on the :white_check_mark: emote (this will delete your group).");

        message.channel.send(confirmationEmbed).then(msg => {
          msg.react('✅').then(r => {
            msg.react('❎');

            //Filter ensure variables are correct before running code
            const yesFilter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
            const noFilter = (reaction, user) => reaction.emoji.name === '❎' && user.id === message.author.id;

            //User will be able to react within 60seconds of requesting this embed
            const yes = msg.createReactionCollector(yesFilter, { time: 60000 });
            const no = msg.createReactionCollector(noFilter, { time: 60000 });

            yes.on('collect', r => {
              Models.Group.findOneAndDelete({ name: args[2], server: server }, function (error, result) {
                message.channel.send(":ok_hand: I've deleted the group for you.");
              });
              msg.reactions.get('✅').remove(message.author.id);
              msg.delete();
            });

            yes.on('stop', async () => {
              await message.clearReactions();
            });

            no.on('collect', r => {
              message.channel.send("Your group will not be deleted.");
              msg.reactions.get('❎').remove(message.author.id);
              msg.delete();
            });

            no.on('stop', async () => {
              await message.clearReactions();
            });
          });
        });
      } else {
        var index = docs.participants.indexOf(message.author);
        if (index > -1) {
          docs.participants.splice(index, 1);
          docs.save(function (error) {
            if (error) {
              console.error(error);
              return;
            } else {
              console.log("Group successfully saved into mongodb.");
              message.channel.send('You left the group.');
            }
          });
        } else {
          message.channel.send("You are not in that group!");
        }
      }

    });
  } else if (args[0] === "disband" || args[0] === "delete") { //group disband [name]
    //find group with name == args[1] in this server/message channel
    //confirm message.author is group creator
    //delete group

    Models.Group.findOneAndDelete({ name: args[1], creator: message.author, server: server }, function (err, docs) {
      if (err) {
        console.error(err);
        message.channel.send("An error occurred while trying to delete the group. Please try again.");
        return;
      }
      if (docs == null) {
        message.channel.send("You cannot delete that group.");
        return;
      }
      message.channel.send("Group deleted");
    });

  } else if (args[0] === "kick") { //group kick [username] [group name]
    //find group with name === args[2] in this server
    //confirm message.author is the group creator
    //confirm user being kicked is in the group
    //kick user

    var mentionedUserID = "<@" + message.mentions.users.first().id + ">";

    if (message.mentions.users.first().id === message.author.id) {
      message.channel.send("You cannot kick yourself from the group. If you want to delete a group, please use `" + `${prefix}` + " group disband " + `${args[2]}` + "`!");
      return;
    }

    Models.Group.findOne({ name: args[2], creator: message.author, server: server }, function (err, res) {
      if (err) {
        console.error(err);
        message.channel.send("An error occurred while trying to kick the user. Please try again.");
        return;
      } else if (res == null) {
        message.channel.send("You are not the creator of the group! You can't kick group members.");
        return;
      }
      else {
        var newParticipants = res.participants;
        //If index is > -1, then the user being kicked is in the group
        if (res.participants.indexOf(mentionedUserID) > -1) {
          newParticipants.splice(newParticipants.indexOf(mentionedUserID), 1);
        } else {
          message.channel.send("The selected user is not in the group.");
        }
      }
      Models.Group.findOneAndUpdate({ name: args[2], creator: message.author, server: server }, { $set: { participants: newParticipants } }, function (error, result) {
        if (error) {
          console.error(error);
          message.channel.send("An error occurred while trying to kick the user. Please try again.");
          return;
        }
        if (result) {
          message.channel.send("The selected user has been kicked from the group.");
        }
      });
    });
  } else if (args[0] === "info") { //group info [name]
    //find group with name == args[1] in this server/message channel
    //send message about the info of the group
    //name of group, time and date, game, participants, owner
    Models.Group.findOne({ server: server, name: args[1] }, function (error, result) {
      if (error){
        console.log(error);
        return;
      }
      if (result == null) {
        message.channel.send("I cant find that group!");
        return;
      }

      var creatorID = result.creator.substring(2, result.creator.length - 1);
      var creatorUsername = message.guild.members.get(creatorID).user.username;
      var creatorAvatarURL = message.guild.members.get(creatorID).user.displayAvatarURL;

      var participants = result.participants;
      var participantsAmount = result.participants.length;
      var maxParticipants = result.maxPlayers;
      var name = result.name;
      var game = result.game;
      var date = result.date;

      var groupInfoEmbed = new Discord.RichEmbed()
        .setColor(colors.orange)
        .setTitle(result.name)
        .setAuthor(creatorUsername + "'s " + game + " group", creatorAvatarURL)
        .setDescription(creatorUsername + " created this group with " + participantsAmount + " participants for \"" + game + "\"")
        .setThumbnail(creatorAvatarURL)
        .addField("Creator", creatorUsername, true)
        .addField("Name", "\""+name+"\"", true)
        .addField("Game", "\""+game+"\"", true)
        .addField("Date", date, true)
        .addField("Participants", participants, true)
        .addField("Maximum Participants", maxParticipants, true);

      message.channel.send(groupInfoEmbed);
    });
  } else if (args[0] === "list") { //group list
    var pages = [];
    var page = 1;

    //lists all the available groups in the server
    var result
    if (args[1] == null)
      result = await Models.Group.find({ server: server });
    else
      result = await Models.Group.find({ server: server, game: args[1] });

    if (result.length == 0) {
      message.channel.send("No groups to list! To make a group, check out `" + `${prefix}` + " ` help group`!");
      return;
    } else {

      for (var i = 0; i < result.length; i++) {
        var creatorID = result[i].creator.substring(2, result[i].creator.length - 1);
        var creatorUsername = message.guild.members.get(creatorID).user.username;
        var creatorAvatarURL = message.guild.members.get(creatorID).user.displayAvatarURL;

        var participants = result[i].participants;
        var participantsAmount = result[i].participants.length;
        var maxParticipants = result[i].maxPlayers;
        var name = result[i].name;
        var game = result[i].game;
        var date = result[i].date;

        var embed = new Discord.RichEmbed()
          .setColor(colors.orange)
          .setTitle(result[i].name)
          .setAuthor(creatorUsername + "'s " + game + " group", creatorAvatarURL)
          .setDescription(creatorUsername + " created this group with " + participantsAmount + " participants for \" + game + \" .")
          .setThumbnail(creatorAvatarURL)
          .addField("Creator", creatorUsername, true)
          .addField("Name", "\""+name+"\"", true)
          .addField("Game", "\""+game+"\"", true)
          .addField("Date", date, true)
          .addField("Participants", participants, true)
          .addField("Maximum Participants", maxParticipants, true)
          .setFooter(`Page ${i + 1} of ${result.length}`);

        pages.push(embed);
      }

      message.channel.send(pages[0]).then(msg => {
        msg.react('◀').then(r => {
          msg.react('▶');

          //Filter ensure variables are correct before running code
          const backwardsFilter = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id;
          const forwardsFilter = (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id;

          //User will be able to react within 60seconds of requesting this embed
          const backwards = msg.createReactionCollector(backwardsFilter, { time: 60000 });
          const forwards = msg.createReactionCollector(forwardsFilter, { time: 60000 });

          backwards.on('collect', r => {
            if (page === 1) { msg.reactions.get('◀').remove(message.author.id); return; }
            page--;
            msg.edit(pages[page - 1]);
            msg.reactions.get('◀').remove(message.author.id);
          });

          backwards.on('stop', async () => {
            await message.clearReactions();
          });

          forwards.on('collect', r => {
            if (page === pages.length) { msg.reactions.get('▶').remove(message.author.id); return; }
            page++;
            msg.edit(pages[page - 1]);
            msg.reactions.get('▶').remove(message.author.id);
          });

          forwards.on('stop', async () => {
            await message.clearReactions();
          });
        });
      });
    }
  } else {
    message.channel.send("I don't understand your request. Type `" + `${prefix}` + " help group` for a list of commands I can understand.");
  }
}

//Config for the command here
module.exports.config = {
  name: 'group',
  aliases: ['team', "teamup", "squad", "g"],
  description: 'Used to create or manage a group.',
  usage: 'group create [name] [game] [date] [time] [max players]\n group join [name]\n group leave [name]\n group disband [name]\n group info [name]\n group list (optional)[game]\n\n **[name]** and **[game]** must be placed inside double quotation marks \n **[date]** needs to be in YYYY-MM-DD format\n **[time]** should be in HH:MM format',//Time Doesn't need to be in 24h format.
  example: "`" + `${prefix}` + ' group create "Epic Game Night" "Super Smash Bros" 2019-06-28 20:00 10`' + '\n' + '`' + `${prefix}` + ' group info "Super Smash Bros"`',
  noalias: "No Aliases"
}
