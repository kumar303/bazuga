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
    var self = $(this);
    var audio = document.getElementsByTagName('audio')[0];
    audio.pause();

    self.parent().find('li').removeClass('listening');
    self.addClass('listening');
    $('audio').attr('src', self.data('track'));
    audio.play();
  });

  var updateTrack = function(data) {
    var track = $('<li data-track="' + data.trackSource + '" data-src="/track/detail/' + data.id + '">' +
      '<div class="track-info">' +
      '<div class="image-wrapper"><img src=""></div><div class="details"><span class="artist-name">' +
      '</span><span class="track-title"></span></div></div><div class="user-info"><img src="">' +
      '<span class="posted"></span></div></li>');
    track.find('.track-info img').attr('src', data.artistImage);
    track.find('.track-info .artist-name').text('Artist: ' + data.artist);
    track.find('.track-info .track-title').text('Title: ' + data.trackTitle);
    track.find('.user-info img').attr('src', data.user);
    track.find('.user-info .posted').text('Posted on: ' + data.created);

    trackItems.prepend(track);

    if (trackItems.find('li').length > 20) {
      trackItems.find('li:last-child').remove();
    }
  };

  $.get('/tracks/list', function() {
    console.log('received track list');
  });

  socket.on('connect', function () {
    socket.on('message', function (data) {
      for (var i = 0; i < data.length; i ++) {
        updateTrack(data[i].track);
      }
    });
  });
});

var mozApp = (function() {
  var manLink = document.querySelector('link[rel="app-manifest"]'),
      manifestURL = manLink.getAttribute('href');

  var self = false;

  var selfReq = navigator.mozApps.getSelf();
  selfReq.onsuccess = function() {
      self = selfReq.result;
  };

  function isRunning() {
      return !!self;
  }
  function install(success, error) {
      var r = navigator.mozApps.install(manifestURL);
      r.onsuccess = success;
      r.onerror = error;
      r.addEventListener('error', function() {
          alert('Installation Failed with Error: ' + this.error.name);
      });
      return r;
  }
  function uninstall() {
      if (self)
          return self.uninstall();
  }

  return {
      isRunning: isRunning,
      install: install,
      uninstall: uninstall,
      manifest: manifestURL
  };
})();
