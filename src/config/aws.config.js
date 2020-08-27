const AWS = require('aws-sdk');



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
