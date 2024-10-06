const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1" });

const getAllProducts = async (req, res) => {
    const { LastEvaluatedKey } = req.query;  // Extract the LastEvaluatedKey from query parameters (if exists)

    let params = {
        TableName: 'tj-market-products',
        IndexName: 'title-enabled-index',
        Limit: 20
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
}

module.exports = { getAllProducts }