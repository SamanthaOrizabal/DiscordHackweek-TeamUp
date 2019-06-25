module.exports.calculateDelay = function(time) {
  //calculate the number of milliseconds until the specified date
  var now = new Date();
  var then = new Date(time);
  console.log(then);
  return then-now;
}
