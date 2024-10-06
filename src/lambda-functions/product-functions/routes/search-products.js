const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1" });

const searchProducts = async (req, res) => {
    let params = {
        TableName: 'tj-market-products',
        IndexName: 'title-enabled-index', // The name of your global secondary index
        FilterExpression: 'contains(title_search, :title_search)',
        ExpressionAttributeValues: {
            ':title_search': req.params.title.toString(),
        },
        Limit: 20,
        ProjectionExpression: 'id, title, enabled, category, images, title_search'
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
}

module.exports = {searchProducts}