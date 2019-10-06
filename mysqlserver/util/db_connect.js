const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'vigne_business',
    password: 'demwantambo89'
})
module.exports = pool.promise();