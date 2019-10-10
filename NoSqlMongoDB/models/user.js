const mongodb = require('mongodb');

const getDb = require('../util/database').getDb;

class User {
    constructor(username,email,cart,id){
        this.username = username;
        this.email = email;
        this.cart = cart; // object with items array {items:[]}
        this._id = id;
    }
    
    save () {
       const db = getDb();
       return db
            .collection('users')
            .insertOne(this);
            // .then((user) => {
            //     console.log(user);
            // })
            // .catch(err => console.log(err));
    }
    
    //user add product to cart
    addToCart (product) {
       const cartProductIndex = this.cart.items.findIndex(cp => {
           return cp.productId.toString() === product._id.toString();
       });
       
       let newQuantity = 1;
       const updatedCartItems = [...this.cart.items];
       
       if (cartProductIndex >= 0) {
           
           newQuantity = this.cart.items[cartProductIndex].quantity + 1; 
           updatedCartItems[cartProductIndex].quantity = newQuantity;
           
       }else {
           
            updatedCartItems.push({productId: new mongodb.ObjectID(product._id), quantity: newQuantity});
       }
        //store all the product in items array
        //    const updateCart = {items:[{...product, quantity:1}]};
        //store only product id in items array and quantity
       const updateCart = {items: updatedCartItems};
       const db = getDb();
       return db
        .collection('users')
        .updateOne(
            { _id: new mongodb.ObjectID(this._id)},
            { $set:{ cart:updateCart }});

    }
    
    //getCArt
    getCart () {
        const db = getDb();
        const productIds = this.cart.items.map(i => {
            return i.productId
        })
        return db
        .collection('products')
        .find({ _id: {$in: productIds}}) //find all the products with this references id productIds
        .toArray() //to convert to a javascript array 
        .then(products => {
            // console.log(products);
            return products.map(p => {
                return {
                    ...p, 
                    quantity:this.cart.items
                    .find(i => {
                        return i.productId.toString() === p._id.toString()
                }).quantity
                };
            })
        })
        .catch(err => console.log(err));
    }
    
    //delete item from the cart 
    deleteItemFromCart (productId) {
        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
        });
        const db = getDb();
       return db
        .collection('users')
        .updateOne(
            { _id: new mongodb.ObjectID(this._id)},
            { $set:{ cart:{items: updatedCartItems} }});
    }
    
    //find user by id
    static findById(userId) {
        const db = getDb();
        return db
            .collection('users')
            .findOne({ _id: new mongodb.ObjectID(userId) })
            .then((user) => {
                console.log(user);
                return user;
            })
            .catch(err => console.log(err));
    }
    
    //user order product add already into the cart 
    // add orders to the current user
    addOrder () {
        const db = getDb();
        //get the products into the cart already and return it
        return this.getCart()
        .then(products => {
            //create the order
            const order = {
                items:products,
                user: {
                    _id:new mongodb.ObjectID(this._id),
                    username: this.username
                }
            };
            // inserting order into orders collection and return the result of that
            return db.collection('orders').insertOne(order);
        })
        .then(result => {
               this.cart = {items:[]}; //clean up the existing products in cart
               return db
                    .collection('users')
                    .updateOne(
                        { _id: new mongodb.ObjectID(this._id)},
                        { $set:{ cart:{ items: []} } }
                    );
        })
        .catch(err => console.log(err));
    }
    
    // display all the orders passe by the current user
    getOders () {
        const db = getDb();
        return db
            .collection('orders')
            .find({'user._id': new mongodb.ObjectID(this._id)})
            .toArray();
    }
}

module.exports = User;