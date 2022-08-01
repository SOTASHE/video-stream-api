
"use strict";

// working with our dynamoDB table from aws

const AWS = require("aws-sdk");

require("dotenv").config(); // load our .env file

const { v4: uuidv4 } = require("uuid");

// AWS.config.update({
//   // update our config with our access keys
//   region: process.env.AWS_DEFAULT_REGION,
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });

// // create a new dynamoDB client
// const dynamodb = new AWS.DynamoDB();

// AWS.config.update({
//   // update our config with our access keys
//   region: process.env.AWS_DEFAULT_REGION,
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });
let options = {};

if (process.env.IS_OFFLINE) {
  options = {
    region: "localhost",
    endpoint: "http://localhost:8000",
  };
}
else {
  options = {
    region: process.env.AWS_DEFAULT_REGION,
    ccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

const dynamodb = new AWS.DynamoDB(options);
const TABLE_NAME = "userStreams"; // name of our table
const response = (statusCode, message) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      statusCode: statusCode,
      message: message,
    }),
  };
};

const removeStream = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);

  const params = {
    TableName: TABLE_NAME,
    Key: {
      streamId: requestBody.streamId,
    },
    ConditionExpression: "#uid = :uid",
    ExpressionAttributeNames: {
      "#uid": "userId",
    },
    ExpressionAttributeValues: {
      ":uid": requestBody.userId,
    },
  };

  return dynamod
    .delete(params)
    .promise()
    .then(() => {
      callback(null, response(204));
    })
    .catch((error) => {
      callback(null, response(404, { error: error.message }));
    });
};


module.exports = {
  removeStream,

  dynamodb,
};
