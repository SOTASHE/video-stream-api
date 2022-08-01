module.exports = {
  tables: [
    {
      TableName: `userStreamsTestTable`,
      KeySchema: [{ AttributeName: "streamId", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "streamId", AttributeType: "S" }],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    },
    // etc
  ],
};
