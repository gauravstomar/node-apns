# node-apns
Node.js/iOS Sample Code for Apple Push Notification

# depedency
https://github.com/argon/node-apn (APNS module for Node.js)

# API
API | Description
------|------------
**List devices** | GET /listUsers
**Add device** | POST /addUser [name, uuid]
**Delete device** | DELETE /delete/:user-id
**Send notification** | POST /notify [id, message]
**Brodcast notification** | POST /brodcast [message]

