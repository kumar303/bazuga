$(function() {
  var socket = io.connect(location.protocol + '//' + location.hostname +
    (location.port ? ':' + location.port : ''));

  $('#login').click(function() {
    navigator.id.getVerifiedEmail(function(assertion) {
      if (assertion) {
        $('form.login input[name="bid_assertion"]').val(assertion);
        $('form.login').submit();
      }
    });
  });

  socket.on('connect', function () {
    socket.on('message', function (data) {
      updateMessage(data);
    });
  });
});
