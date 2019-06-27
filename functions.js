module.exports.calculateDelay = function(date) {
  //calculate the number of milliseconds until the specified date
  console.log("calcuating...")
  var now = new Date();
  console.log(date);
  console.log(date-now);
  return date-now;
}

module.exports.to24hour = function(time) {
  //take input time and returns in 24h format

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

module.exports.sendNotification = function(recipient, message) {
  recipient.send(message)
    .then(message => console.log(`Sent message: ${message.content}`))
    .catch(console.error);
}
