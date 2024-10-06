const compression = require('compression')
const express = require("express")
const serverless = require("serverless-http")

const {getAllProducts} = require('./routes/all-products')
const {searchProducts} = require('./routes/search-products')

const app = express();

app.use(compression())
app.use(express.json());

app.get("/products", getAllProducts);
app.get("/products/:title", searchProducts);

app.use((_, res, _) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
