var socket_io = require('socket.io');
var io = socket_io();
var socketApi = {};

socketApi.io = io;

// io.on('connection', function(socket){
//   console.log('A user connected');
// });

socketApi.sendNotification = function(data) {
  io.sockets.emit('notification', data);
};

socketApi.sendNotificationDashboard = function(noty) {
  io.sockets.emit('notification_dashboard', noty);
};

module.exports = socketApi;
