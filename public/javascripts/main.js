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
      /*
      $.post('/jwt', {kind: kind})
       .success(function(data) {
           console.log(data);
       })
       .error(function() {
           console.log(arguments);
           console.log('error');
       });
       */
      addFruit(kind);
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
