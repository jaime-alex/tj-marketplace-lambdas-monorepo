
import { MongoClient, ServerApiVersion } from "mongodb";
const uri = `mongodb+srv://${process.env.db_username}:${process.env.db_password}@tj-marketplace.ftfie.mongodb.net/?retryWrites=true&w=majority&appName=tj-marketplace`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);

async function run() {
  try {
    console.log(uri)
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("sample_mflix").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    console.error("Error connecting to mongodb")
    await client.close();
  }
}

export { run }
