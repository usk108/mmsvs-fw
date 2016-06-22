var fs = require('fs');
var https = require('https');

var privateKey  = fs.readFileSync('.sslcert/key.pem', 'utf8');
var certificate = fs.readFileSync('.sslcert/cert.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();

//... bunch of other express stuff here ...

//pass in your express app and credentials to create an https server
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(443, '192.168.0.130');

// ����z�M�̂��߂�Websocket����̐ݒ�iBinaryJS�̐ݒ�j
var BinaryServer = require('binaryjs').BinaryServer;
var rooms = {};

// Start Binary.js server
var server = BinaryServer({
    server: httpsServer
});
// var server = BinaryServer({
//     port: 9001
// });

// Wait for new user connections
server.on('connection', function(client){
  console.log(client);
  client.on('error', function(e) {
    console.log(e.stack, e.message);
  });
  client.on('stream', function(stream, meta){
    console.log(meta);
    if(meta.type == 'write') {
	  //console.log(stream);
      rooms[meta.room] = stream;
      console.log('writing');
      //console.log(new Uint8Array(stream));
    } else if (meta.type == 'read' && rooms[meta.room]) {
      rooms[meta.room].pipe(stream);
      console.log('reading');
      //console.log(new Uint8Array(stream));
    }
 });
});
