// app/routes.js
module.exports = function(app, passport) {

    var mongoose = require('mongoose')


    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    app.get('/my-staff-directory', isLoggedIn, function(req, res) {
        res.render("my-staff-directory.ejs")
    })

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/my-staff-directory', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/my-staff-directory', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });



    var Schema = mongoose.Schema;
    var ObjectId = Schema.ObjectId;


    var Qualifications = new Schema(
        {
          qualification: {
            level:String,
            name : Array
          }
        }
    );
    var staffMember = new Schema({ 
        staffID   : String, 
        firstname : String, 
        surname   : String, 
        dob       : Date, 
        team      : String, 
        department: String, 
        image     : String, 
        qualifications: [Qualifications] 
    });

    var user = new Schema({
      username: String,
      password: String
    });

    var staffMember = mongoose.model('staffmember', staffMember);
    var staffModel = mongoose.model('staffmember');
    var User = mongoose.model('user', user);
    var userModel = mongoose.model('user');


    app.put('/addQualification/:newQual', function(req, res) {
      var id = req.body.id;
      var level = req.body.qualificationLevelID;
      var qualName = req.body.qualificationName;
      console.log(id + " " + level + " " + qualName )
      staffMember.update(
        {
          "qualifications._id": level
        },
        { $push: { "qualifications.$.qualification.name" : qualName } },
        function(err,proceed) {

          if (proceed) {
            console.log("It ran yay");
            console.log(proceed);
            res.end("Qualification added")
          } else {
            console.log("Nope");
            console.log(err);
          }
        }
      )

    })

    app.get("/names", function(req,res) {
      staffModel.find({},{"staffID":true,"firstname":true,"surname":true},function(err,staffBasic){
        if(staffBasic) {
          res.end(JSON.stringify(staffBasic));
        } else {
          console.log(err);
        }
      })
    });

    app.post("/staffData",function(req,res) {
      var requestID = req.body.msg;
      staffModel.findById(requestID, function(err, allDetails) {
        if (allDetails) {
          res.end(JSON.stringify(allDetails));
        } else {
          console.log(err);
        }
      })

    })


};




// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

