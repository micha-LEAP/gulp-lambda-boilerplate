var assert = require("assert");
var DemoLambda = require('../dist/index');

describe("Gulp Lambda Boilerplate", function(){
  it('should return a string', function(done){

    var testEvent = {};
    var testContext = {
      done: function(error, message) {
        assert.equal(typeof message, "string");
        done();
      }
    };

    DemoLambda.handler(testEvent, testContext);

  })
})
