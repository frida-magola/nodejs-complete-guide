const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const p = path.join(rootDir,'data','cart.json');

module.exports = class Cart {
    static addProduct (id, productPrice) {
        //fetch previous cart
        fs.readFile(p, (err,fileContent) => {
            let cart = { products:[], totalPrice:0 };
            
            if(!err) {
                cart = JSON.parse(fileContent);
            }
            // analyse the cart => find exixting  product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            
             // add new product / increase quantity
            if(existingProduct) {
                
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
                
            }else {
                
                updatedProduct = { id:id, qty:1 }
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice; // place + in front of productPrice to convert it in a number 
            //write in file cart json 
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            })
        })
         
       
    }
}