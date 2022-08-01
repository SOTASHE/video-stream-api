const axios = require("axios");

/* initially I thought this would be a good idea to to test the API calls and ensure
the correct status codes were coming back however this proved to be more difficult 
than first imagined. Assuming that there's a method of reseeding a dynamodb database
either offline or live I can imagine this would work but still wouldn't be an optimal
solution */

xdescribe("API endpoint testing", () => {
  it("returns a 201 for a stream log being created", async () => {
    const response = await axios.post(
      "https://zad7tk21j2.execute-api.us-east-1.amazonaws.com/dev/stream",
      {
        userId: "1",
      }
    );

    expect(response.data.statusCode).toEqual(201);
  });
});
