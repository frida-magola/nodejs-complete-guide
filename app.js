const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({extended:true}));

//app.use(adminRoutes); //path not filtered
app.use('/admin', adminRoutes); // path filtered

app.use(shopRoutes);

//route not found
app.use((req,res,next) => {
    res.status(404).send('<h1>Page not found</h1>');
})

app.listen(3000);