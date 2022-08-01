"use strict";

// working with our dynamoDB table from aws

const AWS = require("aws-sdk");

require("dotenv").config(); // load our .env file

const { v4: uuidv4 } = require("uuid"); // generate a unique id for each request
let options = {};

if (process.env.IS_OFFLINE) {  // if we are offline, we will use a local dynamoDB instance
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

// create a new dynamoDB client
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

const logStream = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);

  const params = {
    TableName: TABLE_NAME,
    ProjectionExpression: "#uid",
    FilterExpression: "#uid = :uid",
    ExpressionAttributeNames: {
      "#uid": "userId",
    },
    ExpressionAttributeValues: {
      ":uid": requestBody.userId,
    },
  };

  const stream = {
    streamId: uuidv4(),
    userId: requestBody.userId,
  };

  if (!stream.userId) {
    callback(null, response(400, { error: "Request missing userId" }));
  } else {
    return dynamodb.scan(params, (error, data) => {
      if (data.Items.length < 3) {
        dynamodb.put({
            TableName: userStreams,
            Item: stream,
          })
          .promise()
          .then(() => {
            callback(null, response(201, stream));
          })
          .catch((error) => {
            callback(null, response(error.statusCode, { message: error }));
          });
      } else {
        callback(
          null,
          response(400, {
            error: "Unable to start a new stream, maximum limit reached",
          })
        );
      }
    });
  }
};

module.exports = {
  logStream,

  dynamodb,
};
