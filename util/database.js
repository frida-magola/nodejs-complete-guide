//sequelize use mysql behind the scene
const Sequelize = require('sequelize');

//connect to the database
const sequelize = new Sequelize('vigne_business','root','demwantambo89',{
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;