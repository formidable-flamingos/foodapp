var express = require('express');
var request = require('request');
var app = express();

require('./middleware.js')(app, express);

// Send index.html on page load
app.get('/', function(req,res) {
  res.sendFile('index.html');
});

// Route to send npm dependencies
app.get('/node_modules', function(req,res) {
  res.sendFile(req.body.url);
});

// Using firebase databause so require firebase module
var firebase = require("firebase");

// Initialize the app with no authentication
firebase.initializeApp({
  databaseURL: "https://foodapp-8d3bd.firebaseio.com/"
});

// The app only has access to public data as defined in the Security Rules
var db = firebase.database();
var ref = db.ref("/Places");

// Logs what is in the database when the server starts
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});

// Route to post image link reference to database
app.post('/places', function(req,res){
  var now = new Date().valueOf();
  var filename = req.body.filename.split('.')[0];
  // child is the unique ID that is the key to the information for the image reference that is being stored in the database
  var child = now + filename;
  ref.child(child).set({
    id: req.body.id,
    name: req.body.name,
    address: req.body.address,
    url: req.body.url,
    likes: 0 // All photos start off with 0 likes
  })
  .then(function(response) {
    res.status(200).json({databaseID: child});
  })
  .catch(function(error) {
    console.error(error);
  });
});

// Update the number of likes for a particular photo
app.put('/places', function(req,res) {
  ref.child(req.body.databaseID).update({
    likes: req.body.likes
  })
  .then(function(response) {
    res.sendStatus(200);
  })
  .catch(function(error) {
    console.error(error);
  });
});

// Send all of the data in the database upon loading the trending page
app.get('/places', function(req,res){
  ref.once("value", function(snapshot) {
    res.json(snapshot.val());
  });
});

app.listen(process.env.PORT || 7777)