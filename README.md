## HOOLINGAN Coding challange

Build a service in Node.js that exposes an API which can be consumed from any client. This service must check how many video streams a given user is watching and prevent a user watching more than 3 video streams concurrently.

### URL

The api can be accessed at https://zad7tk21j2.execute-api.us-east-1.amazonaws.com/dev/stream

### Planning

My approach to this problem was one of simplicity but with scalability in mind. I knew I could have developed a backend server and crafted out the functionality to enable the consumer to check how many streams the user is watching and prohibit them to watch more than 3 at a time. However I felt that I needed to implement AWS to take advantage of the scalability of Lambda, API Gateway and DynamoDB.

I envisioned using two methods, POST and DELETE to manage stream logs once they're active - to POST, and once they're no longer inactive - to DELETE. This way there's no data in DynamoDB which doesn't need to be there. By using filter expressions I am able to determine how many current streams the user is viewing and limit them to only 3 at one time. Once they close the stream, an API call can be made to remove this log from the database, thus allowing them to open another stream if they wish.

After completing the challenge I reviewed my solution and found that the problem could be solved in a more efficient and elegant way (detailed at the bottom of this README).

### Building

- clone the repository into your chosen location.
- install the dependencies `npm install`.
- initialize the offline server `npm start .` (if you wish to test locally).
- utilise Postman or a similar service to send requests to the API.
- Docker run 'docker-compose up -d'   

### Valid requests

- POST

To log a stream in offline mode, send a POST request to http://localhost:3000/dev/stream (the live database can also be used to test the deployed version), an example request body is as follows:

```js
{
    "userId": "1234"
}
```

In a real world scenario, the streamId could be sent with the userId, however in this situation a uuid was used to mock a streamId for testing purposes.

- DELETE

To remove a stream log in offline mode, send a DELETE request to http://localhost:3000/dev/stream (the live database can also be used to test the deployed version), an example request body is as follows:

```js
{
    "userId": "1234",
    "streamId": "{validStreamId}"
}
```

I don't believe this was a necessity for the coding challenge, however I felt it was useful to test the ability to detect a decreased number of concurrent streams watched by a user, meaning they could view another stream.

### Scalability

- DynamoDB

In this challenge, throughput capacity was set to 1 however this can be adjusted accordingly. DynamoDB is also designed for scalability of resources to meet storage and throughput requirements.

- API Gateway

This allows up to 10,000 requests per second, which I feel is a great option for this kind of application and also scales responsively.

- Serverless

To my knowledge, even though these servers are not managed manually, they offer flexible scaling to meet demand requirements.

- Lambda

Lambda can scale up via parallel executions, however I'm unsure on the exact number of executions per second on each region. Nevertheless I'm aware it's pretty powerful at dealing with a heavy amount of executions. I feel with experience my Lambda functions can become more efficient and reduce the execution time - not applicable on small scale but on larger scales I can see it would be a huge difference.

### What I've learn from this coding challenge

- Testing

Testing proved to be difficult when when working with AWS and serverless and with more experience I will become more efficient at testing when working this way.
Throughout the challenge I implemented testing through the use of Postman, TDD and CloudWatch where applicable. In addition to this I used jest while mocking a dynamodb table to ensure that the data that was being inserted/removed was in the correct format and the responses received were valid. Using Postman was incredibly useful as I could ensure the endpoints were functioning and could provide a detailed rundown of the status codes and response bodies. I am happy I chose to broaden my horizons and try implement AWS and serverless for the experience alone - I feel this experience will serve me greatly in the future.

The 3 test files included in the test folder are my experiments with testing and dynamo.test.js threw up the best results as it enabled to ensure the data was getting sent and received in the correct format, ensuring that the components of the functions were working correctly.

- Commits

I feel my commits could have been more frequent. However I took a plunge into AWS and wasn't entirely sure where ideal milestones could be identified so there were times where I had the whole function written before committing. In the future I am more wise to where commit points could be and how I could more efficiently manage my code.

### Other solutions I had in mind

After reflecting on the current solution I found potentially a more elegant way to solve the problem.

By creating an API which uses only 1 route, the consumer can send a request in the following two forms:

```js
{userId: 12345, streamCountChange: 1}

// or

{userId: 12345, streamCountChange: -1}
```

These requests could be handled by a single function which would behave the following way:

```js
// scan for user in database

if (userInDatabase && streamCountChange === 1 && currentStreams < 3) {
  /*update userId's currentStreams + 1 in database*/
} else if (!userInDatabase && streamCountChange === 3) {
  /*throw error "too many concurrent streams"*/
} else if (userInDatabase && streamCountChange === -1 && currentStreams === 1) {
  /*delete row in database*/
} else if (userInDatabase && streamCountChange === -1 && currentStreams > 1) {
  /*update userId's currentStreams - 1 in database*/
}

// throw errors
```

Not only would this reduce the amount of items being held in the database leading to a reduction in costs. It would be more manageable and make the API requests easier to make, only having to send the userId and the increment needed.




I could also use s3 for this using signed URL, I would use Lambda and Dynamo to keep track of the amount of signed URLs each user has been assigned.

 also I coul make use of request and response headers to manage information you don’t want the user to see or http-only cookies to manage stream state if there’s a frontend - no Dynamo needed

There’s a lot of solutions...

Another smart solution is using JWTs signing them on the server and when a request is made, it’s included in the header params but anything could be in that JWT…









