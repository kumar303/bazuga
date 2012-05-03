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

  $('#tracks.list').on('click', 'li', function() {
    document.location.href = $(this).data('src');
  });

  var updateTrack = function(data) {
    var track = $('<li data-src="/track/detail/' + data.id + '"><div class="track-info">' +
      '<div class="image-wrapper"><img src=""></div><div class="details"><span class="artist-name">' +
      '</span><span class="track-title"></span></div></div><div class="user-info"><img src="">' +
      '<span class="posted"></span><audio controls="controls" preload="none" autobuffer>' +
      '<source src="" type="audio/ogg" /></audio></div></li>');
    track.find('.track-info img').attr('src', data.artistImage);
    track.find('.track-info .artist-name').text('Artist: ' + data.artist);
    track.find('.track-info .track-title').text('Title: ' + data.trackTitle);
    track.find('.user-info img').attr('src', data.user);
    track.find('.user-info .posted').text('Posted on: ' + data.created);
    track.find('source').attr('src', data.trackSource);

    trackItems.prepend(track);
  };

  $.get('/track/1', function(data) {
    updateTrack(data);
  });

  socket.on('connect', function () {
    socket.on('message', function (data) {
      for (var i = 0; i < data.length; i ++) {
        updateTrack(data[i].track);
      }
    });
  });
});
