
import express from "express";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import { productsRouter } from "./routes/products.js";
import cron from 'node-cron';   // imported to do scheduled cron job
import { runAmazonScrapping } from "./scrapAmazoneDataToDb.js";
import { runFlipkartScrapping } from "./scrapFlipkartDataToDb.js";
import cors from 'cors';
import { runSnapdealScrapping } from "./scrapSnapdealDataToDb.js";

dotenv.config();
const app = express();
app.use(cors());
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

//Mongo connection
async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo is Connected");
  return client;
}

export const client = await createConnection();

//converting body to json
app.use(express.json());

//REST API Endpoints
app.get("/", (req, res) => {
  res.send("Welcome Ecommerce Data - API");
});

app.use("/products", productsRouter);


app.listen(PORT, () => console.log("Server started on the port", PORT));

// Code below will run every 12 hours to scrap data from Ecommerce website
cron.schedule('0 0 */12 * * *', () => {
    console.log('running a task every 12 hours');
    runAmazonScrapping('electronics');
    runFlipkartScrapping('electronics');
    runSnapdealScrapping('electronics');
});