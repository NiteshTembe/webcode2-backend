import axios from 'axios';
import * as cheerio from 'cheerio';
import { addProductsData } from './helper.js';

const getProductUrl = () => `https://www.amazon.in/s`;

export async function runAmazonScrapping(product_category){
    const productUrl = getProductUrl();
    const { data } = await axios.get(productUrl,{
        params: { k: product_category },
        headers : {
            Accept : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            Host : 'www.amazon.in',
            'User-Agent' :	'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0',
            TE : 'trailers',
            'Sec-Fetch-Dest' : 'document',
            'Upgrade-Insecure-Requests' : 1
        },
    });
    storeProductsData(data)
}

// runAmazonScrapping("electronics")

const storeProductsData = async(html) => {
    const arr = [];
    const $ = cheerio.load(html);   // create cheerio object from html text

 $('div.a-section.a-spacing-base').each((_idx, el) => {
           const product = $(el)
           const title = product.find('span.a-size-base-plus.a-color-base.a-text-normal').text() // Product Title
           const img_link = product.find('img.s-image').attr("src")     //Product Image Link
           const rating = product.find('span.a-icon-alt').text()      //Rating
           const price = product.find('span.a-price.a-text-price>span.a-offscreen').text()      //Product price before discount
           const final_price = product.find('span.a-price:nth-child(1)>span.a-offscreen').text() // Discounted price
           const discount = product.find('div.a-row.a-size-base.a-color-base>span').text() //Discount percentage
           
           if(title){
           const obj = {
            img_link : img_link,
            title : title.split(",")[0],
            rating : rating == "" ? null : parseFloat(rating),
            price: price,
            final_price:final_price,
            discount : discount.replace("(","").replace(")","")
                };
                arr.push(obj);
            }
            });
        
            if(arr.length){
                const addProduct = await addProductsData(arr);
                // console.log(addProduct)
            }
            
            return;
            
        }
