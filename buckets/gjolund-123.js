// var params = {
//   Bucket: 'STRING_VALUE', /* required */
//   ACL: 'private | public-read | public-read-write | authenticated-read',
//   CreateBucketConfiguration: {
//     LocationConstraint: 'EU | eu-west-1 | us-west-1 | us-west-2 | ap-southeast-1 | ap-southeast-2 | ap-northeast-1 | sa-east-1 | cn-north-1 | eu-central-1'
//   },
//   GrantFullControl: 'STRING_VALUE',
//   GrantRead: 'STRING_VALUE',
//   GrantReadACP: 'STRING_VALUE',
//   GrantWrite: 'STRING_VALUE',
//   GrantWriteACP: 'STRING_VALUE'
// };
// s3.createBucket(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });

module.exports = {
  Bucket: 'gjolund-123', /* required */
  ACL: 'public-read',
  CreateBucketConfiguration: {
    LocationConstraint: 'us-west-2'
  }
};
