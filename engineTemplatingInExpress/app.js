const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');


const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

//working with ejs template engine in express it does not need to importe like pug 
app.set('view engine', 'ejs');
app.set('views','views');



//handlebars template configuration after importing it above
// app.engine('hbs', expressHbs({
//     layoutDir:'views/layouts/', 
//     defaultLayout:'main-layout',
//     extname:'hbs' // tell handlebars which extension you are using
// }));
// app.set('view engine','hbs');
// app.set('views','views');

//configuration tell express what template engine must use pug
// app.set('view engine','pug');
// app.set('views','views');

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