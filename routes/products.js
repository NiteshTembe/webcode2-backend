import express from "express";
import {
    deleteAllProducts,
  getAllProducts,
  getFilteredProducts,
} from "../helper.js";
import { runAmazonScrapping } from "../scrapAmazoneDataToDb.js";
import { runFlipkartScrapping } from "../scrapFlipkartDataToDb.js";
import { runSnapdealScrapping } from "../scrapSnapdealDataToDb.js";
const router = express.Router();

//when application is loaded below function will initiallize database with latesh data
router.get("/", async (req, res) => {
    // below code will delete all documents from products collection * comment it if not needed
    const deleteAll = await deleteAllProducts(); 
    console.log(deleteAll)

    await runAmazonScrapping('electronics');    // collect data from Amazon.in and add it to db
    await runFlipkartScrapping('electronics');  // collect data from flipkart and add it to db
    await runSnapdealScrapping('electronics');  // collect data from snapdeal and add it to db
  const products_data = await getAllProducts(); // get all product list from db and send response
  products_data.length ? res.send(products_data) : res.status(400).send({message:"no data found"});
});

//get filterd products from db without scrapping on search button click
router.post("/", async (req, res) => {
  const { search_text } = req.body;
  const products_data = await getFilteredProducts(search_text);
  console.log(products_data)
  products_data.length ? res.send(products_data) : res.status(400).send({message:"no data found"});
});

export const productsRouter = router;
