const express = require('express');

const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/index');





const app = express();






// view engine setup
app.set('views', path.join(__dirname, 'views')); // this is the folder where we keep our pug files
app.set('view engine', 'pug'); // we use the engine pug, mustache or EJS work great too

// serve static assets from here
app.use(express.static(path.join(__dirname, 'public')));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 // parse application/json
app.use(bodyParser.json())


// After allllll that above middleware, we finally handle our own routes!
app.use('/', routes);

app.listen(3000, ()=> console.log('express listening'))



 


