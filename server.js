'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const cors        = require('cors');
const compression = require('compression');
require('dotenv').config();

const apiRoutes = require('./routes/api.js');

const mongoose = require('mongoose');
let db = process.env.NODE_ENV === 'test' ? process.env.TEST_DB : process.env.DB;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();

app.use(compression());

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//Routing for API 
apiRoutes(app);  
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');    
  }
});

module.exports = app; //for unit/functional testing
