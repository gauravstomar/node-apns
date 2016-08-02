//
//  index.js
//  apns-demo
//
//  Created by Gaurav Singh on 02/08/16.
//  Copyright © 2016 Gaurav Singh. All rights reserved.
//



var apn = require('apn');

var tokens = ["<6f63d232 950b3144 a83c5b2c 4b6f1533 943ae98b 84fc7f01 eca6c3ae f9f7eef6>", "6f63d232950b3144a83c5b2c4b6f1533943ae98b84fc7f01eca6c3aef9f7eef6"];


if(tokens.length == 0) {
	console.log("Please set token to a valid device token for the push notification service");
	process.exit();
}

var ca = ['certificates/entrust_2048_ca.cer'];

/* Connection Options */

var options = {
        cert: 'certificates/cert.pem',
        key: 'certificates/key.pem',
        ca: ca,
        passphrase: '1234567',
        production: false,
        connectionTimeout: 10000
};


var service = new apn.connection(options);

service.on("connected", function() {
    console.log("Connected");
});

service.on("transmitted", function(notification, device) {
    console.log("Notification transmitted to:" + device.token.toString("hex"));
});

service.on("transmissionError", function(errCode, notification, device) {
    console.error("Notification caused error: " + errCode + " for device ", device, notification);
    if (errCode === 8) {
        console.log("A error code of 8 indicates that the device token is invalid. This could be for a number of reasons - are you using the correct environment? i.e. Production vs. Sandbox");
    }
});

service.on("timeout", function () {
    console.log("Connection Timeout");
});

service.on("disconnected", function() {
    console.log("Disconnected from APNS");
});

service.on("socketError", console.error);


//Final Sending Notifications
console.log("Sending a tailored notification to %d devices", tokens.length);
tokens.forEach(function(token, i) {
    var note = new apn.notification();
    note.setAlertText("Hello, gauravs! You are number: " + i);
    note.badge = i;

    service.pushNotification(note, token);
});

