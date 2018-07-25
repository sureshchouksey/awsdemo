
let express = require('express');
let app = express();
let mongoose = require('mongoose');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let port = process.env.PORT || 5000;
let config = require('config'); //we load the db location from the JSON files
let cors = require('cors');
let dotenv = require('dotenv');
let https = require('https');
var fs = require('fs');
//db options
let options = { 
				server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } 
              }; 

//db connection      
mongoose.connect(config.DBHost, options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
	//use morgan to log at command line
	app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

var sslOptions = {
  key: fs.readFileSync('key-20180329-122645.pem'),
  cert: fs.readFileSync('cert-20180329-122645.crt')
};

// app.use(function(req, res, next) {	
//     if (req.secure) {
//         next();
//     } else {
//         res.redirect('https://' + req.headers.host + req.url);
//     }
// });

//parse application/json and look for raw text
dotenv.load({ path: '.env' });                                     
app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));  
app.use(express.static('public'));
app.use(cors());
require('./routes/device.routes.js')(app);
require('./routes/user.routes.js')(app);
app.listen(port);
console.log("Listening on port " + port);

// var httpsServer = https.createServer(sslOptions, app);
// httpsServer.listen(port);

module.exports = app; // for testing