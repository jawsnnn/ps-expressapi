var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Book = require('./models/bookModel');
var bookrouter = require('./routes/bookRoutes')(Book);

// create a server
var app = express();
// connect to the database
var db = mongoose.connect('mongodb://localhost/bookAPI');
 // Take port from env variables, if not avail. then assign 3000
var port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Load middleware bookrouter into app as api
app.use('/api/books',bookrouter);

// Generic endpoint
app.get('/', (req,res) => {
    res.send('Hello Kannu');
    console.log('GET REQUEST');
});
// Start listening on pre-defined port
app.listen(port, () => {
    console.log('Gulp started server at PORT '+port+'!!!');
});