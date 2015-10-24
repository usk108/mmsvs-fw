
// 動画配信のためのWebsocket周りの設定（BinaryJSの設定）
var BinaryServer = require('binaryjs').BinaryServer;
var rooms = {};

// Start Binary.js server
var server = BinaryServer({port: 9001});

// Wait for new user connections
server.on('connection', function(client){
  client.on('error', function(e) {
    console.log(e.stack, e.message);
  });
  client.on('stream', function(stream, meta){
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
