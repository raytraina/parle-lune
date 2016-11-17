////////////////////////////////////////////////////
// This is the client file

// Inits socket then loads and connects to socket.io-client
var socket = io();

// Upon pageload, gets username and emits chat message event to send welcome message
$(document).ready(function(){
  var username = prompt('What is your name?');
  // Emits username
  socket.emit('add user', username);
  // Loads stored messages
  getMessages();
  $('#user').val(username);
  socket.emit('chat message', 'Bot', 'User <b style="font-weight:600; color: #D84315;">' + username + '</b> has joined');
  // Logs username to client console
  console.log('User ' + username + ' has joined');
});

// LATER - Add database handling here for archived messages

// On submit, get #user value and emit chat message event
function submitFunction() {
  var from = $('#user').val();
  var message = $('#m').val();
  if(message != '') {
  socket.emit('chat message', from, message);
  }
  // Note: Required for message submission
  $('#m').val('').focus();
    return false;
}

// Registers chat message evt, which listens to requests and appends chat messages to list
socket.on('chat message', function(from, msg){
  var me = $('#user').val();
  var color = (from == me) ? '#D84315' : '#69F0AE';
  var from = (from == me) ? 'Me' : from;
  $('#messages').append('<li><b style="color:' + color + '">' + from + '</b> : ' + msg + '</li>');
});

// On keypress in #user, emit notify user event
function notifyTyping() { 
  var user = $('#user').val();
  socket.emit('notify user', user);
}

// Registers notify user evt, which listens to requests for typing and displays a message
socket.on('notify user', function(user){
  var me = $('#user').val();
  if(user != me) {
    $('#notify-user').text(user + ' is typing ...');
  }
  // Sets timeout for clearing typing message
  setTimeout(function(){ $('#notify-user').text(''); }, 10000);;
});