const mongodb = require('mongodb');

const getDb = require('../util/database').getDb;

class Product {
    constructor(id,title,price,imageUrl,description,userId){
        this._id = id ? new mongodb.ObjectID(id) : null;
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this.userId = userId;
    }
    
    save () { 
        const db = getDb();
        let dbOp;
        //chech _id is set
        if (this._id) {
            //update the existing product
            dbOp = db.collection("products")
                .updateOne({ _id:this._id },{ $set:this });
            
        } else {
            dbOp = db.collection("products").insertOne(this);
        }
        return dbOp
            .then(result => {
                console.log(result);
            })
            .catch(err => console.log(err));
    }
    
    static fetchAll () {
        const db = getDb();
        return db
            .collection('products')
            .find()
            .toArray()
            .then(products => {
                console.log(products);
                return products;
            })
            .catch(err => console.log(err)); 
    }
    
    static findById (prodId) {
       const db = getDb();
       return db
            .collection('products')
            .find({ _id: new mongodb.ObjectID(prodId) })
            .next()
            .then(product => {
                console.log(product);
                return product;
            })
            .catch(err => console.log(err))
    }
    
    static deleteById (prodId) {
        const db = getDb();
        return db
            .collection('products')
            .deleteOne({ _id:new mongodb.ObjectID(prodId) })
            .then(result => {
                console.log("Deleted!");
            })
            .catch(err => console.log(err));
    }
}

module.exports = Product;