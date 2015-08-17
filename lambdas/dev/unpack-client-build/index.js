// dependencies
var async = require('async');
var S3 = require('aws-sdk').S3;

// get reference to S3 client
var s3 = new S3();

var downloadObject = function (next) {

  var obj = {
    Bucket: this.srcBucket,
    Key: this.srcKey
  };

  s3.getObject(obj, next);

};

var transformObject = function (response, next) {

  next(null, response.ContentType, response.Body);

};

var uploadObject = function (contentType, data, next) {

  var obj = {
    Bucket: this.dstBucket,
    Key: this.dstKey,
    Body: data,
    ContentType: contentType
  };

  s3.putObject(obj, next);

};

exports.handler = function(event, context) {

  var srcBucket = event.Records[0].s3.bucket.name;
  var srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
  var dstBucket = srcBucket + "/unpacked";

  var self = {
    srcBucket: srcBucket,
    srcKey: srcKey,
    dstBucket: dstBucket
  };

  // Sanity check: validate that source and destination are different buckets.
  if (srcBucket == dstBucket) return context.fail("Destination bucket must not match source bucket.");

  // Infer the file type.
  var typeMatch = srcKey.match(/\.([^.]*)$/);
  if (!typeMatch) return context.fail('Unable to infer file type for key ' + srcKey);

  var fileType = typeMatch[1];
  if (fileType != "zip") return context.fail('Expect file type zip, received ' + fileType);

  async.waterfall([
    downloadObject.bind(self),
    transformObject.bind(self),
    uploadObject.bind(self)
  ],
  function (err) {

    context.done(err, srcBucket + ' : ' + srcKey + ' : ' + dstBucket );

  });

};
