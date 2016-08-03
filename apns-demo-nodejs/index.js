//
//  index.js
//  apns-demo
//
//  Created by Gaurav Singh on 02/08/16.
//  Copyright © 2016 Gaurav Singh. All rights reserved.
//


var express = require('express');
var fs = require("fs");

var app = express();

var jsonFile = __dirname + "/json/users.json"

//Request handling
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/html/index.html" );
})

//List devices 	GET/listUsers
app.get('/listUsers', function (req, res) {
	console.log("List devices")
   	fs.readFile( jsonFile, 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
   	});
})


//Add device 	POST 	/addUser
var user = {
   "user4" : {
      "name" : "mohit",
	  "uuid" : "password1",
      "id": 4
   }
}

app.post('/addUser', function (req, res) {
   console.log("Add device")
   fs.readFile( jsonFile, 'utf8', function (err, data) {
       data = JSON.parse( data );
       data["user4"] = user["user4"];
       console.log( data );
       res.end( JSON.stringify(data));
   });
})


//Delete device 	DELETE 		/deleteUser

app.get('/deleteUser', function (req, res) {

   // First read existing users.
   fs.readFile( jsonFile, 'utf8', function (err, data) {
       data = JSON.parse( data );
       delete data["user" + 2];
       
       console.log( data );
       res.end( JSON.stringify(data));
   });

})




//Send notification 	GET 	:id

app.get('/:id', function (req, res) {
   // First read existing users.
   fs.readFile( jsonFile, 'utf8', function (err, data) {
       users = JSON.parse( data );
       var user = users["user" + req.params.id] 
       console.log( user );
       res.end( JSON.stringify(user));
   });
})



//Send notification 	GET 	:id

app.delete('/:id', function (req, res) {
   // First read existing users.
   fs.readFile( jsonFile, 'utf8', function (err, data) {
       users = JSON.parse( data );
       var user = users["user" + req.params.id] 
       console.log( user );
       res.end( JSON.stringify(user));
   });
})




//Brodcast 		GET 	/brodcast





//Assets handling
app.use(express.static('public'));


//Init Server
var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})