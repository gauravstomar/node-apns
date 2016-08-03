//
//  index.js
//  apns-demo
//
//  Created by Gaurav Singh on 02/08/16.
//  Copyright © 2016 Gaurav Singh. All rights reserved.
//


var apns = require(__dirname + '/js/apns.js');
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
	fs.readFile( jsonFile, 'utf8', function (err, rdata) {

		data = JSON.parse( rdata )
		console.log( data.length );
		if (data.length > 0) {
			rdata = []
			data.forEach( function(u, i) {
			console.log( u );
				u["id"] = i
				rdata.push(u)
			})
			console.log( rdata );
			res.end( JSON.stringify(rdata) );

		} else {

			res.end( rdata )

		}

	});

})


//Add device 	POST 	/addUser
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.post('/addUser', urlencodedParser, function (req, res) {

	console.log("Add device")

	user = {
		"name" : req.body.name.trim(),
		"uuid" : req.body.uuid.trim()
	}

	console.log(req.body)

	fs.readFile( jsonFile, 'utf8', function (err, data) {

		data = JSON.parse( data )
		data.push(user)
		updateData(data)

		resData = {"id": data.length-1}
	   	res.end( JSON.stringify(resData) );

	});

})


//Send notification 	GET 	:id
app.get('/notify/:id', function (req, res) {
   
   console.log( 'notify apns' );

   fs.readFile( jsonFile, 'utf8', function (err, data) {

   	users = JSON.parse( data );

	if (users.length > 0 && users.length > req.params.id) {

		var user = users[req.params.id] 
	   	apns.sendNotification([user])
	   	console.log( user );
		res.end( JSON.stringify(user));   	

   	} else {

		res.end( "No user found" );   	
		
   	}

   });

})



//Delete device 	DELETE 		/deleteUser
app.delete('/delete/:id', function (req, res) {
   
   fs.readFile( jsonFile, 'utf8', function (err, data) {

   	data = JSON.parse( data );

   	if (data.length > 0 && data.length > req.params.id) {

   		resData = data[req.params.id]
	   	data.splice(req.params.id, 1);
	   	updateData(data)
	   	console.log( "deleted" );
		resData["length"] = data.length
	   	res.end( JSON.stringify(resData) );

   	} else {

	   	res.end( "No device found" );

   	}


   });
})




//Brodcast 		GET 	/brodcast
app.get('/brodcast', function (req, res) {
   
   console.log( 'brodcast apns' );

   fs.readFile( jsonFile, 'utf8', function (err, data) {

    console.log( data );
   	users = JSON.parse( data );
   	console.log( users );

   	apns.sendNotification(users)

   	res.end( JSON.stringify({"total-devices": users.length}));

   });

})


//Update file
function updateData(data) {

	data = JSON.stringify(data)

	if (data == "") {
		data = "[]"
	}

	fs.writeFile(jsonFile, data, function (err) {

		if ( err ) {
			console.log( err );
		} else {
			console.log( "saved" );
		}

	});

}


//Assets handling
app.use(express.static('public'));


//Init Server
var server = app.listen(8081, function () {

	var host = server.address().address
	var port = server.address().port

	console.log("Example app listening at http://%s:%s", host, port)

})