import axios from 'axios';
import * as cheerio from 'cheerio';
import { addProductsData } from './helper.js';

const getProductUrl = () => `https://www.flipkart.com/search`;

export async function runFlipkartScrapping(product_category){
    const productUrl = getProductUrl();
    const { data } = await axios.get(productUrl,{
        params: { q: product_category },
        headers : {
            Accept : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            Host : 'www.flipkart.com',
            'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0',
            'Upgrade-Insecure-Requests' : 1
        },
    });
    storeDataInDB(data)
}

// runFlipkartScrapping("electronics")

const storeDataInDB = async(html) => {
    const arr = [];
    const $ = cheerio.load(html); // create cheerio object from html text

    $('div._1YokD2._2GoDe3>div._1YokD2._3Mn1Gg>div._1AtVbE.col-12-12>div._13oc-S>div').each(function(index){
        const img_link = $(this).find('div.CXW8mj>img').attr('src'); //Product Image Link
        const title = $(this).find('a.s1Q9rs').attr('title'); // Product Title
        const rating = $(this).find('div._3LWZlK').text(); // Product Rating
        const price = $(this).find('div._30jeq3').text(); // Product Price
        const final_price = $(this).find('div._30jeq3').text(); // Product final Price
        const discount = $(this).find('div._3Ay6Sb').text(); // Product discount
        if(title){
        const obj = {
            img_link : img_link,
            title : title.split(",")[0],
            rating : parseFloat(rating),
            price: price,
            final_price:final_price,
            discount : discount
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
