const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

//app.use(adminRoutes); //path not filtered
app.use('/admin', adminRoutes); // path filtered

app.use(shopRoutes);

//route not found
app.use((req,res,next) => {
    res.status(404).sendFile(path.join(__dirname,'views','404.html'));
})

app.listen(3000);