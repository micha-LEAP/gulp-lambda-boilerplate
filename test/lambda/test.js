var assert = require("assert");
var getLambdaDestIndexAbsPath = require(process.cwd() + '/tasks/resolve-lambda-path').getLambdaDestIndexAbsPath;

describe("Gulp Lambda Boilerplate - Lambda", function(){
  it('should return a string', function(done){

    var Lambda = require(getLambdaDestIndexAbsPath());

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
