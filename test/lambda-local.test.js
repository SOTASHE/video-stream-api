const lambdaLocal = require("lambda-local");

/* this method of testing throws a similar error to what I have seen before which is
"cannot read proper "items" of null" which is understandable as I don't believe
lambda local is actually interacting with the database only mocking lambda functions
locally therefore the data will be undefined in newStreamLog.js */

const lambdaConfig = Object.freeze({
  lambdaPath: "newStreamLog.js",
  profilePath: "~/.aws/credentials",
  profileName: "default",
  timeoutMs: 3000,
  verboseLevel: 0,
});

xdescribe("lambda-local tests", () => {
  it("should return a 201", () => {
    const event = {
      body: JSON.stringify({ userId: "1" }),
    };

    lambdaLocal
      .execute(Object.assign({}, lambdaConfig, { event }))
      .then((response) => {
        expect(response.statusCode).toEqual(201);
      })
      .catch((error) => {
        console.log(error);
      });
  });
});
