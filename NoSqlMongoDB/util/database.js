//connect to the mongodb
const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

//connecting to the cluster mongodb and store the connection to the database

const mongoConnect = callback => {
    
    //local mongodb database connection 
    const uri = 'mongodb://localhost:27017/vigne_business';

   //connection mongodb database to the cluster
//    const uri = 'mongodb+srv://nyira:demwantambo89@cluster0-p79fv.mongodb.net/vigne_business?retryWrites=true&w=majority';

    MongoClient.connect(uri,{ useNewUrlParser: true,useUnifiedTopology: true })
    .then(client => { 
        //store my connection to the database in _db 
        console.log('connected!');
        _db = client.db();
        callback();
    })
    .catch(err => {
        console.log(err);
        // throw err;
    });
}

// return access to that connection
const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'Not database found!';
}


exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

