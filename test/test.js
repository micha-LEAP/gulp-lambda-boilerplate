var assert = require("assert");
var DemoLambda = require('../dist/index');

describe("Gulp Lambda Boilerplate", function(){
  it('should return a string', function(done){

    var testEvent = {};
    var testContext = {
      done: function(error, message) {
        var markup = '<html><head><title>test-title</title></head><body><img src=\"https://raw.githubusercontent.com/jaws-stack/JAWS-graphics/master/jaws_logo_javascript_aws.png\"></body></html>';
        assert.equal(markup, message);
        done();
      }
    };

    DemoLambda.handler(testEvent, testContext);

  })
})
