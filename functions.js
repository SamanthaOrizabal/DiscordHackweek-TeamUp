const Discord = require('discord.js');
const mongoose = require('mongoose');
const Models = require('./models.js');
const chrono = require('chrono-node');
const colors = require('./colors.json');

module.exports.getDateFromMessage = function(message) {
  var date = chrono.parseDate(message);
  if (date == null){
    return null;
  }
  var year = date.getFullYear();
  var month = ('0' + (date.getMonth()+1)).slice(-2);
  var day = ('0' + date.getDate()).slice(-2);
  return year + '-' + month + '-' + day;
}

module.exports.calculateDelay = function(date) {
  //calculate the number of milliseconds until the specified date
  var now = new Date();
  return date-now;
}

module.exports.to24hour = function(time) {
  //take input time and returns in 24h format
  if (time == null)
    return false;

  time = time.split(':');

  if (time.length <= 1)//invalid time format
    return;

  var last = time.length-1;
  if (time[last].endsWith('am')) {
    time[last] = time[last].slice(0, -2);
  } else if (time[last].endsWith('pm')) {
    time[0] = parseInt(time[0]) + 12;
    time[last] = time[last].slice(0, -2)
  }
  if (time.length < 3) {
    time[2] = "00";
  }
  if (time[0].length == 1) {
    time[0] = '0' + time[0];
  }

  time = time[0] + ":" + time[1] + ":" + time[2] //computer readable timestamp
  return time
}

module.exports.readUserDate = function(date, time) {
  if (time == null || date == null) {
    return false;
  }
  time = module.exports.to24hour(time);
  var dateTime = new Date(date + "T" + time);
  //This is a determine if the date is invalid and reply appropriately
  if (isNaN(dateTime.getTime())) {
    //message.channel.send("Sorry! That is not a vaild date/time format. See `?help create` for more info."); // COMBAK: Maybe we need a help page specifically for dates
    return false;
  }
  return dateTime;
}

module.exports.sendNotification = function(recipient, message) {
  recipient.send(message)
    .catch(console.error);
}

module.exports.checkDates = function(client, interval) {
  var checkTo = new Date().setTime(new Date().getTime() + (interval));
  Models.Group.find({date:{$lte: checkTo}}, {_id:1, date:1}, function(err, docs) {//check for groups that need to be notified soon
    if (err) {
      console.error(err);
      return;
    }

    for (var group of docs) { //each group needing to be notified
      setTimeout(function() { //run at notification time
        Models.Group.findByIdAndRemove(group._id, function(err, team) { //remove from database once group has been notified
          if (err) {
            console.error(err);
            return;
          }
          if(team == null) {
            return;
          }
          if (team.participants.length > 0) {
            for (var person of team.participants) {
              var message = new Discord.RichEmbed()
                .setColor(colors.cyan)
                .setAuthor(team.name)
                .setDescription("It is time to play " + team.game + " with " + team.name + "!");
              const recipient = client.fetchUser(person.slice(2,-1)).then(function(res) {
                exports.sendNotification(res, message);
              });
            }
          }
        });
      }, exports.calculateDelay(group.date));
    }

  }).sort({date:1})

}
