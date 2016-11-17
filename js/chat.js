////////////////////////////////////////////////////
// This will hold the basic chat logic

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

