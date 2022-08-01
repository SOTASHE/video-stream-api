// working with our dynamoDB table from aws

const AWS = require('aws-sdk');

require('dotenv').config(); // load our .env file


AWS.config.update({     // update our config with our access keys
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
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





//GET



const getStreams = async ()=> {
    const params = {
        TableName: TABLE_NAME,
        FilterExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": {
                S: "user1"
            }
        }
    };
    const streams = await dynamodb.scan(params).promise();
    console.log(streams);
    return streams;


}
// call the getStreams function to get all the streams
getStreams();








// get all stream logs for a user

// const getStreamLogs = (userId) => {
//     const params = {
//         TableName: TABLE_NAME,
//         FilterExpression: "userId = :userId",
//         ExpressionAttributeValues: {
//             ":userId": {
//                 S: userId
//             }
//         }



// const createStreamLog = (userId, streamId) => {  
//     const params = {
//         TableName: TABLE_NAME, 
//         Item: {
//              userId: { S: userId },
//             streamId: { S: streamId }
//         }
//     };
//      console.log(params);
//     return dynamodb.putItem(params).promise(); // return a promise

// }

// //call the createStreamLog method
// createStreamLog();

//DELETE

// remove a stream log for a user
// const removeStreamLog = (userId, streamId) => {
//     const params = {
//         TableName: TABLE_NAME,
//         Key: {
//             // userId: { S: userId },
//             streamId: { S: streamId }
//         }
//     };
//      console.log(params);
//     return dynamodb.deleteItem(params).promise();
   
    
// }
// //call the removeStreamLog method
// removeStreamLog();


