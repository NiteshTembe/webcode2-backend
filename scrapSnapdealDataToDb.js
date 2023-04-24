import axios from 'axios';
import * as cheerio from 'cheerio';
import { addProductsData } from './helper.js';

const getProductUrl = () => `https://www.snapdeal.com/search`;

export async function runSnapdealScrapping(product_category){
    const productUrl = getProductUrl();
    const { data } = await axios.get(productUrl,{
        params: { keyword: product_category },
        headers : {
            Accept : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            Host :'www.snapdeal.com',
            'User-Agent' :	'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0',
            TE : 'trailers',
            'Sec-Fetch-Dest' : 'document',
            'Upgrade-Insecure-Requests' : 1
        },
    });
    storeProductsData(data)
}

// runSnapdealScrapping("electronics")

const storeProductsData = async(html) => {
    const arr = [];
    const $ = cheerio.load(html);   // create cheerio object from html text
 $('div.col-xs-6.favDp.product-tuple-listing.js-tuple').each((_idx, el) => {
           const product = $(el)
           const title = product.find('p.product-title').text() // Product Title
           const img_link = product.find('source.product-image').attr('srcset')    //Product Image Link
           const rating = product.find('div.filled-stars').attr("style")     //Rating
           const price = product.find('span.lfloat.product-desc-price.strike').text()      //Product price before discount
           const final_price = product.find('span.lfloat.product-price').text() // Discounted price
           const discount = product.find('div.product-discount>span').text() //Discount percentage
           
           if(title){
           const obj = {
            img_link : img_link,
            title : title.split(",")[0],
            rating : rating ?  (parseFloat( rating.replace("width:",""))/20).toFixed(1) : null,
            price: price,
            final_price:final_price,
            discount : discount.replace("(","").replace(")","")
                };
                arr.push(obj);

           }
            });
            
        // console.log(arr)
            if(arr.length){
                const addProduct = await addProductsData(arr);
                // console.log(addProduct)
            }
            
            return;
            
        }
