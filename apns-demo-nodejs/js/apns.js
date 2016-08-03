//
//  apns.js
//  apns-demo
//
//  Created by Gaurav Singh on 02/08/16.
//  Copyright © 2016 Gaurav Singh. All rights reserved.
//


var lastBadageCount = 1

var apn = require('apn');

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
    //console.log("Connected");
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
    //console.log("Connection Timeout");
});

service.on("disconnected", function() {
    //console.log("Disconnected from APNS");
});

service.on("socketError", console.error);


exports.sendNotification = function (users, message) {

    if (users.length == 0) {
        console.log("Please set token to a valid device token for the push notification service");
        process.exit();
    }

    if (message == "") {
        message = "Hello, " + payload["name"]
    }

    lastBadageCount++

    //Finally Sending Notifications
    console.log("Sending a tailored notification to %d devices", users.length);
    users.forEach(function(payload, i) {

        var note = new apn.notification();
        note.setAlertText(message);
        note.badge = lastBadageCount;

        service.pushNotification(note, payload["uuid"]);

    });

}






