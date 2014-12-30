var express = require('express')
var app = express()
var MongoClient = require('mongodb').MongoClient
var assert = require('assert')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var session = require('express-session')

var url = 'mongodb://localhost:27017/myproject';






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
