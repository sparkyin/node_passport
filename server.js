const express = require('express');
const app = express();
var port = process.env.port || 8080;
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');


const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

var configDB = require('./config/database');

//connect to mongodb
mongoose.connect(configDB.url);

//passport configuration
require('./config/passport')(passport);


//middlewar
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

//set view directory
app.set('view engine', 'ejs');

// require for passport 
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); //flash message for alert message

//routes 
require('./app/routes')(app, passport);

//server start

app.listen(port);
console.log('Server running on port http://localhost:' + port);