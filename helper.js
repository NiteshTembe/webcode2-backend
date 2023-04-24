import { client } from "./index.js";

export async function getAllProducts() {
  return await client.db("ecommerce_scrap").collection("products").find().toArray();
}
export async function getFilteredProducts(searchText) {
  return await client.db("ecommerce_scrap").collection("products").find({ title: { $regex:  searchText, $options: 'i'}}).toArray();
}

export async function deleteAllProducts() {
  return await client.db("ecommerce_scrap").collection("products").deleteMany();
}

export async function addProductsData(productsData) {
  return await client.db("ecommerce_scrap").collection("products").insertMany(productsData);
}
