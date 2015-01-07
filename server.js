var express = require('express')
var app = express()
var MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose')
var assert = require('assert')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var session = require('express-session')


var url = 'mongodb://localhost:27017/myproject';


var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Qualifications = new Schema({ 
    level     : String, 
    subjects  : {} 
});
var staffMember = new Schema({ 
    staffID   : String, 
    firstname : String, 
    surname   : String, 
    dob       : Date, 
    team      : String, 
    department: String, 
    image     : String, 
    qualifications:[Qualifications] 
});


  var staffMember = mongoose.model('staffmember', staffMember);
//  var staff = new staffMember();
  var localStaffMember = mongoose.model('staffmember')

  var qualificationModel = mongoose.model('qualificationModel', Qualifications);
  var qual = new qualificationModel();
  var localQual = mongoose.model('qualificationModel')


  mongoose.connect('mongodb://localhost:27017/myproject');


app.use(function(req,res) {


  var staff = new staffMember({ 
    firstname: "Ellis",
    qualifications: [
      { 
        level:"Trying an update, please work",
        subjects:["One","Two"] 
      }
    ] 
  });

  localStaffMember.findById("54adacbc73d61e600350e50a", function (err, user) {
    if(user) {
      console.log("ID Found");
      console.log(user._id);
      console.log(staff.qualifications[0].level)
      //var update = { firstname:"Chloe" };
      /*staff.update({firstname: "Ellis"}, {$set:update}, {upsert:true},function(err, updateUser) {       
        if(updateUser) {
          console.log("Updated level successfully");
        } else {
          console.log("Error: " + err);
        }
      });*/
      user.firstname = "Ellis";
      user.qualifications[0].level = "Another level ;)";
      user.qualifications[0].subjects = ["One","Two"];
      user.save(function(err) {
        if(!err) {
          console.log("Updated")
        } else {
          console.log(err);
        }
      })
    } else {
      console.log("ID Not Found")
      console.log(err);
      staff.save(function(err, staff, numberAffected) {
        if(!err) {
          console.log(staff);
          console.log(numberAffected);
        } else {
          console.log(err);
        }
      })
    }
  });


/*
  var qual = new qualificationModel({ level:"Testing" });
  qual.save(function(err, qual, numberAffected) {
    if(!err) {
      console.log(qual);
      console.log(numberAffected);
    } else {
      console.log(err);
    }
  })
  localQual.find({}, function(err, localQual) {
    if(!err) {
      console.log(localQual);
    } else {
      console.log(err);
    }
  })


  staff.qualifications.push({
    level:"Hmmm"    
  })
  staff.save(function(err, staff, numberAffected) {
    if(!err) {
      console.log(staff);
      console.log(numberAffected);
    } else {
      console.log(err);
    }
  })

  localStaffMember.find({}, function(err, staff) {
    if(!err) {
      console.log(staff);
    } else {
      console.log(err);
    }
  })
*/





})




app.use(express.static(__dirname));
app.use(cookieParser())
var jsonParser = bodyParser.json();
app.use(session({ secret: 'secret', resave: false,saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());



app.get('/getNames', function (req, res) {

  var getNames = function(db, callback) {
    var collection = db.collection('staff');
    collection.find({},{"staffID":true,"firstname":true,"surname":true}).toArray(function(err,docs){
      callback(docs);
    })
  }

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    getNames(db, function(names) {
      console.log("Running getNames")
      console.log(names);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(names));
      db.close();
    })
  });
})

app.post('/getStaffData',jsonParser, function(req, res) {
  var staffID = req.body.msg;
  console.log("From the client: " + staffID);

  var getStaffData = function(db,callback) {
    var collection = db.collection('staff');
    collection.find({"staffID":staffID}).toArray(function(err,docs) {
      callback(docs);
    })
  }

  MongoClient.connect(url, function(err,db) {
    console.log("Beginning getStaffData for staffID: " + staffID);
    getStaffData(db, function(staffMember) {
      console.log(staffMember);
      res.setHeader('Content-Type','application/json');
      res.end(JSON.stringify(staffMember));
      console.log("getStaffData complete");
    })
  })

})

app.put('/addQualification/:newQual',jsonParser, function(req, res) {
  /*var id = req.body.id;
  var newQualificationStaffID = req.body.staffID;
  var newQualificationLevel = req.body.level;
  var newQualificationData = req.body.data;
  console.log(newQualificationStaffID+ newQualificationLevel+ newQualificationData);
  /*var addNewQualfication = function(db,callback) {
    /*var collection = db.collection('staff');
    console.log(id)
    collection.find({"staffID":newQualificationStaffID,"qualifications.0.qualification.level":newQualificationLevel},{"qualifications.qualification.subjects":true}).toArray(function(err,docs) {
     console.log(docs)
     docs.update({docs[0].qualifications:"Test"})
    })
    collection.find({"staffID":newQualificationStaffID,"qualifications.0.qualification.level":newQualificationLevel},{"qualifications.qualification.subjects":true}).toArray(function(err,docs) {
        console.log(docs[0].qualifications[0].qualification.subjects);
        docs[0].qualifications[0].qualification.subjects = newQualificationData;
        collection.save({docs.qualifications.qualification.subjects:"new"}, function(err) {
          if(!err) {
            console.log("Updated")
          } else {
            console.log(err);
          }
        })
        console.log("-------");
        console.log("Current: "+docs[0].staffID);
        docs.quals = docs[0].qualifications;
        console.log(docs[0].qualifications);
        console.log(err);
        console.log("-------");
        docs.save({"staffID":"5"},{"staffID":newQualificationStaffID}, function() {
          console.log("This ran");
        });
        //callback(finalDocs);
    //})
  }
  MongoClient.connect(url, function(err, db) {
    addNewQualfication(db, function(test) {
      console.log("Add new qual ran");
    })
  })*/
  res.end("This function hasn't been finished due to complex mongo procedures, extra research needs doing on embedded mongo documents and how to save updates");
});

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)


})




passport.serializeUser(function(user, done) {
  done(null, user);
});
 
passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {
    var collection = db.collection('staff');
    collection.find({
      'staffID': "0",
    }, function(err, user) {
      if (err) {
        return done(err);
      }
 
      if (!user) {
        return done(null, false);
      }
 
      if (user.password != password) {
        return done(null, false);
      }
 
      return done(null, user);
    });
  });
}));
