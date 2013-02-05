var index = require('../routes/index.js');
var testapp = require('./testapp.js');

var settings = {options: {}};
var app = testapp(index, settings);

describe('/', function() {
  it('loads without errors :)', function() {
    var req = {
      session: {
        email: 'test@test.org'
      }
    };
    app.get('/', req, function(res) {
      //
    });
  });
});
