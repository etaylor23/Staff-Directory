var express = require('express')
var app = express()
var MongoClient = require('mongodb').MongoClient
var assert = require('assert')
var bodyParser = require('body-parser')

var url = 'mongodb://localhost:27017/myproject';

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  console.log("Beginning insert phase");
  insertQualfications(db,function() {
  	console.log("Insert phase finished, beginning find phase");
  	findDocuments(db, function() {
  		console.log("Find phase finished");
  		db.close();
  	})
  })
  /*
  insertDocuments(db, function() {
    updateDocument(db, function() {
        findDocuments(db, function() {
          db.close();
        });
    });
  });
*/
});

/*
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  insertDocuments(db, function() {
    updateDocument(db, function() {
        findDocuments(db, function() {
          db.close();
        });
    });
  });
});

var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insert([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the document collection");
    callback(result);
  });
}

var updateDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.update({ a : 2 }
    , { $set: { b : 1 } }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated the document with the field a equal to 2");
    callback(result);
  });  
}

var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    //assert.equal(2, docs.length);
    console.log("Found the following records");
    console.dir(docs)
    callback(docs);
  });      
}
*/



app.use(express.static(__dirname));
var jsonParser = bodyParser.json();

app.get('/', function (req, res) {
  res.sendfile('index.html')
})


var insertQualfications = function(db, callback) {
	console.log("Running insertQualfications");
	if(db !== undefined && callback !== undefined) {
		console.log("Both db and callback are defined");
	}
	/*
	app.post('/submit',jsonParser,function (req, res) {
		var qualification = req.body.name;
		var collection = db.collection('documents');
		  // Insert some documents
		collection.insert([
		  {a : qualification }
		], function(err, result) {
		  assert.equal(err, null);
		  console.log("Inserted all qualifications");
		  callback(result);
		});

	})*/
	app.put('/submit',jsonParser,function (req, res) {
		var qualification = req.body.name;
		var collection = db.collection('documents');
		console.log(qualification[0]);
	});

}



var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    //assert.equal(2, docs.length);
    console.log("Found the following records");
    console.dir(docs)
    callback(docs);
  });      
}


var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})
