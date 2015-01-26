var express = require('express')
var app = express()
var mongoose = require('mongoose')
var passport = require('passport')
var flash = require('connect-flash');

var morgan = require('morgan')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(express.static(__dirname));
var jsonParser = bodyParser.json();

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'staffDirectory' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport



/*
var staff = new staffMember({
  firstname : "Ellis",
  surname   : "Taylor",
  dob       : Date.now(),
  team      : "Web Development Team",
  department: "Marketing and Communications",
  image     : "files/ellis.jpg",
  qualifications: [
    {
      qualification: {
        level:"A Level",
        name :["Advanced English","Advanced Maths","Advanced Science"]
      }
    }
  ] 
});

staff.save(function(err,staff) {
  if(staff) {
    console.log("Save successful");
  } else {
    console.log(err);
  }
})*/




var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})

