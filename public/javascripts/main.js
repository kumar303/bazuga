$(function() {
  var trackItems = $('#tracks');
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

  var updateTrack = function(data) {
    var track = $('<li><div class="track-info"><img src=""><span class="artist-name">' +
      '</span><span class="track-title"></span></div><div class="user-info"><img src="">' +
      '<span class="posted"></span></div><audio controls="controls" preload="none" autobuffer>' +
      '<source src="" type="audio/ogg" /></audio></li>');
    track.find('.track-info img').attr('src', data.artistImage);
    track.find('.track-info .artist-name').text(data.artist);
    track.find('.track-info .track-title').text(data.trackTitle);
    track.find('.user-info img').attr('src', data.user);
    track.find('.user-info .posted').text(data.created);
    track.find('source').attr('src', data.trackSource);

    trackItems.prepend(track);
  };

  $.get('/track/1', function(data) {
    updateTrack(data);
  });
});
