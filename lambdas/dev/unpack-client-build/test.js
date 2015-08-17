var assert = require("assert");
var Lambda = require('./index');
var Events = require('./event');

describe("Lambda - dev/unpack-client-build", function(){

  it('should return an error if the event obj extension cannot be determined', function(done){

    var props = {
      key: 'test_no_extension'
    };

    var testContext = {
      fail: function (error) {
        assert.equal(error, 'Unable to infer file type for key ' + props.key)
        done();
      }
    };

    Lambda.handler(Events.create(props), testContext);

  })

  it('should return an error if the event obj extension is not zip', function(done){

    var props = {
      key: 'happy.jpg'
    };

    var testContext = {
      fail: function (error) {
        assert.equal(error, 'Expect file type zip, received jpg')
        done();
      }
    };

    Lambda.handler(Events.create(props), testContext);

  })

  it('should do things', function(done){

    var testContext = {
      done: function (error, message) {
        assert.equal(true, true)
        done();
      }
    };

    Lambda.handler(Events.create(), testContext);

  })


});
