var assert = require("assert");
var Lambda = require('../../dist/lambda/index');

describe("Gulp Lambda Boilerplate - Lambda", function(){
  it('should return a string', function(done){

    var testEvent = {};
    var testContext = {
      done: function(error, message) {
        assert.equal(error, null);
        assert.equal(typeof message, "string");
        done();
      }
    };

    Lambda.handler(testEvent, testContext);

  })
})
