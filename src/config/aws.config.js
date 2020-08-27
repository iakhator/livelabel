const AWS = require('aws-sdk');

AWS.config.update({accessKeyId: 'AKIAVYWQOXIVCXJMWZNL', secretAccessKey: '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', region: 'us-east-2' });

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

const params = {
  Bucket: 'rushlabel',
  MaxKeys: 2147483647,
};

export {
  s3,
  params,
  dynamodb,
  docClient
}
