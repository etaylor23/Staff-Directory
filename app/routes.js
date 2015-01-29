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

    var Qualifications = mongoose.Schema(
        {
          qualification: {
            level:String,
            name : Array
          }
        }
    );

    // define the schema for our user model
    var userSchema = mongoose.Schema({

        local            : {
            email        : String,
            password     : String,
        },
        facebook         : {
            id           : String,
            token        : String,
            email        : String,
            name         : String
        },
        twitter          : {
            id           : String,
            token        : String,
            displayName  : String,
            username     : String
        },
        google           : {
            id           : String,
            token        : String,
            email        : String,
            name         : String
        },
        details          : {
            firstname : String, 
            surname   : String, 
            dob       : Date, 
            team      : String, 
            department: String, 
            image     : String,
            permissions: String,
            qualifications: [Qualifications] 
        }

    });

    /* This now sort of works but doesnt update the front end, also the schema above needs moving out of routes */

    var staffMember = mongoose.model('staffmember', staffMember);
    var staffModel = mongoose.model('staffmember');
    var User = mongoose.model('user', userSchema);
    var userModel = mongoose.model('user');


    app.put('/editQualification/:newQual', function(req, res) {
        var id = req.body.id;
        var level = req.body.qualificationLevelID;
        var qualName = req.body.qualificationName;
        var editType = req.body.editType;

        console.log("Staff ID:" + id + ", qualification Level ID: " + level + ", Qualification Level Name: " + qualName + ", Add Or Remove? " + editType);

        if(editType === "add") {
            User.update(
                {
                  "details.qualifications._id": level
                },
                { $push: { "details.qualifications.$.qualification.name" : qualName } },
                function(err,proceed) {
                    if (proceed) {
                        console.log(proceed);
                        res.end("Qualification added");
                    } else {
                        console.log(err);
                        console.log("Nope");
                    }
                }
            )
        } else {
            User.update(
                {
                  "details.qualifications._id": level
                },
                { $pull: { "details.qualifications.$.qualification.name" : qualName } },
                function(err,proceed) {
                  if (proceed) {
                    console.log(proceed);
                    res.end("Qualification removed")
                  } else {
                    console.log(err);
                    console.log("Failed to remove qualification");
                  }
                }
            )
        }

    })

    app.get("/names", function(req,res) {

      userModel.find({},{"details.firstname":true,"details.surname":true},function(err,staffBasic){
        if(staffBasic) {
          res.end(JSON.stringify(staffBasic));
        } else {
          console.log(err);
        }
      })
    });

    app.post("/staffData",function(req,res) {

      var requestID = req.body.msg;

      userModel.findById(requestID, function(err, allDetails) {
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

