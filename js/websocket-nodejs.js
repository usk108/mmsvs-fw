// var last;
// var ascii;

// var client = new BinaryClient('ws://' + window.location.host + ':9001');
// var stream;
// var room = "demoroom";

// client.on('open', function(){
//	stream = client.createStream({room: room, type: 'write'});
// });


// // Not showing vendor prefixes or code that works cross-browser.
// //? ここのstreamはもしかして，上のvar streamと関係ない？
// navigator.webkitGetUserMedia({video: true}, function(astream) {
//	video.src = window.webkitURL.createObjectURL(astream);
//     setInterval(myStreaming, 50);

// }, function() {alert('fail');});

// function myStreaming() {
//	ctx.drawImage(video, 0, 0, 200, 150);
//	var data = ctx.getImageData(0,0, 200,150).data;
//	stream.write(data);
//     //console.log(new Uint8Array(data));

// }
