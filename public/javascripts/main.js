$(function() {

  $('#login').click(function() {
    // Move to id.watch() !
    navigator.id.getVerifiedEmail(function(assertion) {
      if (assertion) {
        $('form.login input[name="bid_assertion"]').val(assertion);
        $('form.login').submit();
      }
    });
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
