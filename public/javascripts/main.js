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
            console.log('login data:', data);

            $('#start').hide();
            $('#login-panel').hide();
            $('#game-panel').fadeIn();

            if (data.fruit) {
              addFruitData(data.fruit);
            }
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
    var kind = $el.data('kind');
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

  // On startup, re-up the logged in user's purchased fruit.
  if (data.fruit) {
    addFruitData(data.fruit);
  }

  function addFruitData(fruit) {
    for (var kind in fruit) {
      addFruit(kind, fruit[kind]);
    }
  }

  function addFruit(kind, num) {
    var pack;
    if (!num)
      num = 4;  // A pack of fruit.
    var $stash =  $('#stash');
    $('p', $stash).hide();
    var tplMap = {
      banana: '#small-banana-tpl',
      kiwi: '#small-kiwi-tpl'
    };
    var tpl = tplMap[kind];
    if (!tpl) {
      throw new Error('No template for kind: ' + kind);
    }

    // Add purchased fruit in packs for four.
    var numPacks = Math.ceil(num / 4);
    var total = num;
    for (var pk=0; pk < numPacks; pk++) {
      pack = $($('#pack-tpl').html());
      for (; total > 0; total--) {
        pack.append($(tpl).html());
      }
      $stash.prepend(pack);
    }
  }
});
