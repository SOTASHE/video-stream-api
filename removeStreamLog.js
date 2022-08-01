


"use strict";

// working with our dynamoDB table from aws

const AWS = require("aws-sdk");

require("dotenv").config(); // load our .env file

const { v4: uuidv4 } = require("uuid");

AWS.config.update({
  // update our config with our access keys
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// create a new dynamoDB client
const dynamodb = new AWS.DynamoDB();
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

module.exports.removeStream = (event, context, callback) => {
   callback(null, response(200, "success"));
  const requestBody = JSON.parse(event.body);

  console.log(JSON.stringify(requestBody, null, 2));

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

  return dynamodb
    .delete(params)
    .promise()
    .then(() => {
      callback(null, response(204));

      return;


    })
    .catch((error) => {
      callback(null, response(404, { error: error.message }));
    });
};
