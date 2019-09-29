const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

//configuration tell express what template engine must use 
app.set('view engine','pug');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

//app.use(adminRoutes); //path not filtered
app.use('/admin', adminData.routes); // path filtered

app.use(shopRoutes);

//route not found
app.use((req,res,next) => {
    // res.status(404).sendFile(path.join(__dirname,'views','404.html'));
    res.status(404).render('404',{pageTitle:'Page Not Found'})
})

app.listen(3000);