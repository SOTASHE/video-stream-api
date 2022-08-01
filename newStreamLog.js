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

// Build a service in Node.js that exposes an API which can be consumed from any client. This
// service must check how many video streams a given user is watching and prevent a user from
// watching more than 3 video streams concurrently

// approach:
// use two methods, POST and DELETE to manage stream logs once they're active - to POST, and once they're no longer inactive - to DELETE. This way there's no data in DynamoDB which doesn't need to be there. By using filter expressions I am able to determine how many current streams the user is viewing and limit them to only 3 at one time.
// Once they close the stream, an API call can be made to remove this log from the database, thus allowing them to open another stream if they wish.

const response = (statusCode, body) => ({
  // create a response object to return to the client with the status code and body of the response (the body is a JSON object)
  statusCode, // status code of the response (200, 404, etc) (required) // body of the response (required)
  body: JSON.stringify(body), // body of the response (required)
});

const logStream = async (event, context, callback) => {
  callback(null, response(200, "success"));
  // callback(null, response(500, "error"));

  // create a new stream for a user (POST) - this is the function that is called by the client when they want to create a new stream (POST)
  const requestBody = JSON.parse(event.body); // parse the request body

  //stringify the request body to make it easier to read
  console.log(JSON.stringify(requestBody, null, 2));
  const params = {
    // create a params object to pass to our dynamoDB client
    TableName: TABLE_NAME, // name of our table

    ProjectionExpression: "#uid", // only return the user id
    FilterExpression: "#uid = :uid", // filter by user id
    ExpressionAttributeNames: {
      // name our attributes
      "#uid": "userId", // user id
    },

    ExpressionAttributeValues: {
      // value our attributes
      uid: requestBody.userId, // user id
    },
  };

  const stream = {
    // create a stream object to pass to our dynamoDB client to create a new stream log entry in our
    //table for the user with the given user id (userId) and a unique stream id (streamId) and a timestamp (timestamp)
    streamId: uuidv4(), // create a unique stream id for the stream log entry (streamId) using uuidv4() to generate a random uuid (https://www.npmjs.com/package/uuidv4)
    //                      and store it in the stream object (streamId) as a string //(https://www.npmjs.com/package/uuidv4#api) and store it in the stream object (streamId) as a string (https://www.npmjs.com/package/uuidv4#api) and store it in the stream object (streamId) as a string (https://www.npmjs.com/package/uuidv4#api)
    userId: requestBody.userId, // user id
  };

  if (!stream.userId) {
    // if the user id is not provided in the request body return a 400 error response with a message saying that the user id is required (userId is required)
    callback(null, response(400, { error: "Request missing userId" })); // callback(null, response(400, { error: "Request missing userId" }))  is a callback function that is called when the request is complete. It takes two arguments: an error and the response. The error argument is null if the request succeeded. The response argument is a JSON object with the following properties: statusCode, body. statusCode is the HTTP status code of the response. body is the body of the response.
  } else {
    //
    return dynamodb.scan(params, (error, data) => {
      //
      if (data.Items.length < 3) {
        // if the user is not currently watching more than 3 video streams, create a new stream log entry in our table for the user with the given user id (userId) and a unique stream id (streamId) and a timestamp (timestamp)
        dynamodb
          .put({
            // create a new stream log entry in our table for the user with the given user id (userId) and a unique stream id (streamId) and a timestamp (timestamp)
            TableName: TABLE_NAME, // name of our table (https://www.npmjs.com/package/uuidv4#api) and store it in the stream object (streamId) as a string (https://www.npmjs.com/package/uuidv4#api) and store it in the stream object (streamId) as a string (https://www.npmjs.com/package/uuidv4#api)
            Item: stream, // create a new stream log entry in our table for the user with the given user id (userId) and a unique stream id (streamId) and a timestamp (timestamp)
          })
          .promise() // create a new stream log entry in our table for the user with the given user id (userId) and a unique stream id (streamId) and a timestamp (timestamp)
          .then(() => {
            // create a new stream log entry in our table for the user with the given user id (userId) and a unique stream id (streamId) and a timestamp (timestamp)
            callback(null, response(201, stream)); //  callback(null, response(201, stream)) is a callback function that is called when the request is complete. It takes two arguments: an error and the response. The error argument is null if the request succeeded. The response argument is a JSON object with the following properties: statusCode, body. statusCode is the HTTP status code of the response. body is the body of the response.
          })
          .catch((error) => {
            // create a new stream log entry in our table for the user with the given user id (userId) and a unique stream id (streamId) and a timestamp (timestamp)
            callback(null, response(error.statusCode, { message: error })); // callback(null, response(error.statusCode, { message: error })) is a callback function that is called when the request is complete. It takes two arguments: an error and the response. The error argument is null if the request succeeded. The response argument is a JSON object with the following properties: statusCode, body. statusCode is the HTTP status code of the response. body is the body of the response.
          });
      } else {
        callback(
          null,
          response(400, {
            error: "Unable to start a new stream, maximum limit reached", // if the user is currently watching more than 3 video streams, return a 400 error response with a message saying that the user is currently watching more than 3 video streams (unable to start a new stream, maximum limit reached) and store it in the stream object (streamId) as a string (https://www.npmjs.com/package/uuidv4#api) and store it in the stream object (streamId) as a string (https://www.npmjs.com/package/uuidv4#api)
          })
        );
      }
    });
  }
};

// // deleteStream - delete a stream for a user (DELETE) - this is the function that is called by the client when they want to delete a stream (DELETE)

// //create deleteStream function
// const deleteStream = async (event) => {
//   // create a new stream for a user (POST) - this is the function that is called by the client when they want to create a new stream (POST)
//   const requestBody = JSON.parse(event.body); // parse the request body
//   const params = {
//     // create a params object to pass to our dynamoDB client
//     TableName: TABLE_NAME, // name of our table
//     ProjectionExpression: "#uid", // only return the user id
//     FilterExpression: "#uid = :uid", // filter by user id
//     ExpressionAttributeNames: {
//       // name our attributes
//       "#uid": "userId", // user id
//     },
//     ExpressionAttributeValues: {
//       // value our attributes
//       uid: requestBody.userId, // user id
//     },
//   };

//   const stream = {
//     // create a stream object to pass to our dynamoDB client to create a new stream log entry in our
//     //table for the user with the given user id (userId) and a unique stream id (streamId) and a timestamp (timestamp)
//     streamId: uuidv4(), // create a unique stream id for the stream log entry (streamId) using uuidv4() to generate a random uuid (https://www.npmjs.com/package/uuidv4)
//     //                      and store it in the stream object (streamId) as a string //(https://www.npmjs.com/package/uuidv4#api) and store it in the stream object (streamId) as a string (https://www.npmjs.com/package/uuidv4#api) and store it in the stream object (streamId) as a string (https://www.npmjs.com/package/uuidv4#api)
//     userId: requestBody.userId, // user id
//     timestamp: new Date().toISOString(), // timestamp
//   };

//   if (!stream.userId) {
//     // if the user id is not provided in the request body return a 400 error response with a message saying that the user id is required (userId is required)
//     callback(null, response(400, { error: "Request missing userId" })); // callback(null, response(400, { error: "Request missing userId" }))  is a callback function that is called when the request is complete. It takes two arguments: an error and the response. The error argument is null if the request succeeded. The response argument is a JSON object with the following properties: statusCode, body. statusCode is the HTTP status code of the response. body is the body of the response.
//   } else {
//     // if the user id is provided in the request body
//     return dynamodb.scan(params, (error, data) => {
//       //
//       if (data.Items.length > 0) {
//         // if the user is currently watching more than 0 video streams, delete the stream log entry in our table for the user with the given user id (userId) and a unique stream id (streamId) and a timestamp (timestamp)
//         dynamodb
//           .delete({
//             // delete the stream log entry in our table for the user with the given user id (userId) and a unique stream id (streamId) and a timestamp (timestamp)
//             TableName: TABLE_NAME, // name of our table
//             Key: {
//               // create a key object to pass to our dynamoDB client to delete the stream log entry in our table for the user with the given user id (userId) and a unique stream id (streamId) and a timestamp (timestamp)
//               userId: stream.userId, // user id
//               streamId: stream.streamId, // stream id
//             },
//           })
//           .promise() // delete the stream log entry in our table for the user with the given user id (userId) and a unique stream id (streamId) and a timestamp (timestamp)
//           .then(() => {
//             // delete the stream log entry in our table for the user with the given user id (userId) and a unique stream id (streamId) and a timestamp (timestamp)
//             callback(null, response(204, {})); // callback(null, response(204, {})) is a callback function that is called when the request is complete. It takes two arguments: an error and the response. The error argument is null if the request succeeded. The response argument is a JSON object with the following properties: statusCode, body. statusCode is the HTTP status code of the response. body is the body of the response.
//           })
//           .catch((error) => {
//             // delete the stream log entry in our table for the user with the given user id (userId) and a unique stream id (streamId) and a timestamp (timestamp)
//             callback(null, response(error.statusCode, { message: error })); // callback(null, response(error.statusCode, { message: error })) is a callback function that is called when the request is complete. It takes two arguments: an error and the response. The error argument is null if the request succeeded. The response argument is a JSON object with the following properties: statusCode, body. statusCode is the HTTP status code of the response. body is the body of the response.
//           });
//       } else {
//         // if the user is currently watching 0 video streams, return a 400 error response with a message saying that the user is currently watching 0 video streams (userId is required)
//         callback(
//           null,
//           response(400, {
//             error: "Unable to delete stream, user is not watching any streams", // if the user is currently watching 0 video streams, return a 400 error response with a message saying that the user is currently watching 0 video streams (userId is required) and store it in the stream object (streamId) as a string (https://www.npmjs.com/package/uuidv4#api) and store it in the stream object (streamId) as a string (https://www.npmjs.com/package/uuidv4#api) and store it in the stream object (streamId) as a string (https://www.npmjs.com/package/uuidv4#api)
//           })
//         );
//       }
//     });
//   }
// };

module.exports = {
  logStream,

  dynamodb,
};
