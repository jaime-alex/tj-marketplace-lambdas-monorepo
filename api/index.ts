import express from "express";
import products from "./products"

const app = express()

app.get("/", (req, res) => res.send("Express on Vercel"));

app.use("/products", products)

app.listen(3000, () => console.log("Server ready on port 3000."));

export default app;