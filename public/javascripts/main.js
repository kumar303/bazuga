$(function() {
  var trackItems = playlistSlide.find('#tracks');

  $('#login').click(function() {
    navigator.id.getVerifiedEmail(function(assertion) {
      if (assertion) {
        $('form.login input[name="bid_assertion"]').val(assertion);
        $('form.login').submit();
      }
    });
  });

  var updateTrack = function(data) {
    var track = $('<li data-track="' + data.trackSource + '" data-src="/track/detail/' + data.id + '"' +
      'data-album="' + data.album + '">' +
      '<div class="track-info"><div class="image-wrapper"><img src=""></div><div class="details">' +
      '<span class="artist-name"></span><span class="track-title"></span></div></div><span ' +
      'class="track-details">&gt;</span></li>');
    track.find('.track-info img').attr('src', data.artistImage);
    track.find('.track-info .artist-name').text(data.artist);
    track.find('.track-info .track-title').text(data.trackTitle);

    trackItems.prepend(track);

    if (trackItems.find('li').length > 20) {
      trackItems.find('li:last-child').remove();
    }
  };

  $.get('/tracks/list', function(data) {
    for (var i = 0; i < data.tracks.length; i ++) {
      updateTrack(data.tracks[i].track);
    }
  });
});
