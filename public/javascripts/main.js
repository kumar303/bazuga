$(function() {

  var data = $('body').data();

  navigator.id.watch({
    //loggedInUser: data.email,
    onlogin: function(assertion) {
      console.log('nav.id onlogin');
      if (assertion) {
        $.post(data.login, {bid_assertion: assertion})
          .done(function(data, textStatus, jqXHR) {
            console.log('login success; status=' + jqXHR.status);
            $('#start').hide();
            $('#login-panel').hide();
            $('#game-panel').fadeIn();
          })
          .fail(function(jqXHR, textStatus, errorThrown) {
            console.log('login fail: ' + errorThrown);
          });
      }
    },
    onlogout: function() {
      console.log('nav.id onlogout');
      $('#start').hide();
      $('#game-panel').hide();
      $('#login-panel').fadeIn();
    }
  });

  $('#login').click(function() {
    navigator.id.request();
  });

  $('#buy button').click(function() {
    var $el = $(this);
    var kind = $el.attr('class');
    $.post('/jwt', {kind: kind})
      .done(function(data) {
        console.log(data.jwt);

        // navPay() currently does not support URL-safe base64.
        // See https://bugzilla.mozilla.org/show_bug.cgi?id=831524
        data.jwt = decodeURIComponent(data.jwt);

        var req = navigator.mozPay([data.jwt]);
        req.onsuccess = function() {
          console.log('navigator.mozPay() finished');
          // Product has not yet been bought! This needs to poll the server
          // to look for the signed JWT notice.
          addFruit(kind);
        };
        req.onerror = function() {
          console.log('navigator.mozPay() error: ' + this.error.name);
        };
      })
      .fail(function(xhr, textStatus, errorThrown) {
        console.log('ERROR', xhr, textStatus, errorThrown);
      });
  });

  function addFruit(kind) {
    var $stash =  $('#stash');
    $('p', $stash).hide();
    var pack = $($('#pack-tpl').html());
    for (var i=0; i < 4; i++) {
      pack.append($('#small-banana-tpl').html());
    }
    $stash.prepend(pack);
  }
});
