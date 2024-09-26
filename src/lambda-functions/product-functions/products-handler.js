const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand
} = require("@aws-sdk/lib-dynamodb");

const express = require("express");
const serverless = require("serverless-http");

const app = express();

const USERS_TABLE = process.env.USERS_TABLE;
const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

app.get("/products", async (req, res) => {
  const { LastEvaluatedKey } = req.query;  // Extract the LastEvaluatedKey from query parameters (if exists)
  
  let params = {
    TableName: 'tj-market-products',
    Limit: 2
  };

  // If the request contains LastEvaluatedKey, add it to params for pagination
  if (LastEvaluatedKey) {
    params.ExclusiveStartKey = JSON.parse(LastEvaluatedKey);  // Parse the stringified LastEvaluatedKey
  }

  try {
    const command = new ScanCommand(params);
    const response = await client.send(command);

    if (response) {
      // Send response along with the LastEvaluatedKey for client to fetch the next page if necessary
      res.json({
        Items: response.Items,
        LastEvaluatedKey: response.LastEvaluatedKey ? JSON.stringify(response.LastEvaluatedKey) : null
      });
    } else {
      res.status(404).json({ error: 'No products found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not retrieve products" });
  }
});

app.get("/products/:title", async (req, res) => {
  console.log("title param: ", req.params.title)
  let params = {
    TableName: 'tj-market-products',
    IndexName: 'title-index', // The name of your global secondary index
    FilterExpression: 'contains(title, :title)',
    ExpressionAttributeValues: {
      ':title': req.params.title.toString(),
    },
  };


  try {
    const command = new ScanCommand(params);
    const response = await client.send(command);
    if (response) {
      res.json(response);
    } else {
      res
        .status(404)
        .json({ error: 'Could not find user with provided "userId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retrieve user" });
  }
});

app.post("/users", async (req, res) => {
  const { userId, name } = req.body;
  if (typeof userId !== "string") {
    res.status(400).json({ error: '"userId" must be a string' });
  } else if (typeof name !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: USERS_TABLE,
    Item: { userId, name },
  };

  try {
    const command = new PutCommand(params);
    await docClient.send(command);
    res.json({ userId, name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create user" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
