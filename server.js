// Get the packages we need
var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser');

var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Use routes as a module (see index.js)
require('./routes')(app, router);

const HOST = '0.0.0.0';
// Start the server
app.listen(port, HOST);
console.log(`Running on http://${HOST}:${port}`);


module.exports = app