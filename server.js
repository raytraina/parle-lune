// Express initializes app to be a function handler that you can supply to http server instances
var app = require('express')();
var http = require('http').Server(app);
// Initialize a new instance of socket.io by passing http server object
var io = require('socket.io')(http);
var path = require('path');
 
// Initializes application routing, defines route handler at '/'
app.get('/', function(req, res){
  var express=require('express');
  app.use(express.static(path.join(__dirname)));
  res.sendFile(path.join(__dirname, '../parle-lune', './templates/index.html'));
});

// Online users list // Not currently used, here for future versions
var usernames = {};

// Registers events on socket connection and emits an event to connected clients
io.on('connection', function(socket){ 
  console.log('A user has connected\n');

  socket.on('chat message', function(from, msg){
    io.emit('chat message', from, msg);
    console.log(from + ' has sent a message')
  });

  // user handling

  // notify user

  socket.on('new message', function(user){
    io.emit('new message', user);
  });

  // messages

  // session handling
});
 
// Attaches server to engine.io instance bound to port 3000
// Listens for incoming sockets on port 3000
var server = http.listen(3000, function(){
  console.log('listening on port 3000\n');
});

module.exports = server;