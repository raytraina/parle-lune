////////////////////////////////////////////////////
// Server file for Parle Lune
////////////////////////////////////////////////////

// Express initializes app to be a function handler that you can supply to http server instances
var app = require('express')();
var http = require('http').Server(app);
// Initialize a new instance of socket.io by passing http server object
var io = require('socket.io')(http);
var path = require('path');

// Security measure to protect from common web vulnerabilities, including XSS
var helmet = require('helmet');
app.use(helmet());
app.use(helmet.xssFilter());

// Trust first proxy, remove for production // https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);

// For session management, replaces express builtin MemoryStore
var session = require('express-session');
// For temporary session file store since we aren't connected to a db
var FileStore = require('session-file-store')(session);

// Note: Using secret explicitly for dev purposes, remove for production and import
app.use(session({
  name: 'sessionId',
  secret: 'EsCCD972Mv8Um5qR8K8H5ty6ZH1zWRBG',
  cookie: {
    httpOnly: true,
    maxAge: 60000
  },
  saveUninitialized: true,
  resave: true,
  store: new FileStore()
}));
 
// Initializes application routing, defines route handler at '/'
app.get('/', function(req, res){
  var express=require('express');
  app.use(express.static(path.join(__dirname)));
  // For dev purposes, remove for production
  console.log('\nSession has been entered: \n' + req.sessionID);
  res.sendFile(path.join(__dirname, '../parle-lune', './templates/index.html'));
});

// Initializes count of views in session, could later be stored to database
// Currently session is being stored to ./sessions and is serialized as JSON
app.get('/', function(req, res, next) {
  var sess = req.session;
  if (sess.views) {
    sess.views++;
    res.setHeader('Content-Type', 'text/html');
    res.end();
  } else {
    sess.views = 1;
    res.end();
  }
});

////////////////////////////////////////////////////
// Future app routes, like '/login', can be easily added like so:
// app.get('/login', function(req, res){
//   var express=require('express');
//   app.use(express.static(path.join(__dirname)));
//   res.sendFile(path.join(__dirname, '../parle-lune', './templates/login.html'));
// });
////////////////////////////////////////////////////

// Online users list // Not currently used, here for future versions
var usernames = {};

// Registers events on socket connection and emits an event to connected clients
io.on('connection', function(socket){ 
  console.log('A user has connected\n');

  socket.on('chat message', function(from, msg){
    io.emit('chat message', from, msg);
    console.log(from + ' has sent a message')
  });

  // This can be leveraged to add active user to an online users list
  socket.on('add user', function(username) {
    socket.username = username;
    usernames[username] = username;
  });

  socket.on('notify user', function(user){
    io.emit('notify user', user);
  });

  socket.on('new message', function(user){
    io.emit('new message', user);
  });

  socket.on('messages', function(data){
    io.emit('new message', data.author, data.content, data.timestamp);
  });

  socket.on('disconnect', function(){
    console.log('\n------------------------\nUser ' + socket.username + ' has disconnected\n------------------------\n');
    delete usernames[socket.username];
  });
});
 
// Attaches server to engine.io instance bound to port 3000
// Listens for incoming sockets on port 3000
var server = http.listen(3000, function(){
  console.log('listening on port 3000\n');
});

module.exports = server;