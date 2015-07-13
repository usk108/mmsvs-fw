// モーダルの定義の仕方
var FaceDisplayMode4Speaker = {
	output_area : null,
	control_bar : null,
	room : null,
	video : null,
	//canvas : null,
	context : null,
	broadcasting : false,
	stream : null,

	client : new BinaryClient('ws://' + window.location.host + ':9001'),


	init : function(modeconfig) {
		//タグを知る
		this.output_area = modeconfig.output_area;
		this.control_bar = modeconfig.control_bar;

		this.room = "demoroom";

		this.video = document.getElementById('v');
		var canvas = document.getElementById('c');
		//console.log(canvas);
		this.context = canvas.getContext('2d');

		this.attachEvents();

	},

	attachEvents : function() {
		this.client.on('open', function(){
			this.stream = this.client.createStream({room: room, type: 'write'});
		});

		// Not showing vendor prefixes or code that works cross-browser.
		var self = this;
		navigator.webkitGetUserMedia({video: true}, function(stream) {
			self.video.src = window.webkitURL.createObjectURL(stream);
			console.log('in attachEvents broadcasting is '+self.broadcasting);
			//if(self.broadcasting){
			setInterval(self.sendToAll, 50);
			//}
		}, function() {alert('fail');});

	},

	finalize : function() {

	},

	run : function() {
		console.log('before, broadcasting is '+ this.broadcasting);
		this.broadcasting = true;
		console.log('after, broadcasting is '+ this.broadcasting);
	},

	stop : function() {
		this.broadcasting = false;
	},

	receive : function(message) {
	},

	//sendToAll : function(message) {
	sendToAll : function() {
		// console.log('streaming');
		// console.log(this);
		 var self = FaceDisplayMode4Speaker;
		 console.log('in streaming broadcasting is '+ self.broadcasting);
		if(self.broadcasting){
			self.context.drawImage(self.video, 0, 0, 200, 150);
			var data = self.context.getImageData(0,0, 200,150).data;
		    console.log(data);
			self.stream.write(data);
			console.log('wrote stream');
		}
	}

	//FWから呼ばれる
	stream : function() {
		// console.log('streaming');
		// console.log(this);
		 var self = FaceDisplayMode4Speaker;
		 console.log('in streaming broadcasting is '+ self.broadcasting);
		if(self.broadcasting){
			self.context.drawImage(self.video, 0, 0, 200, 150);
			var data = self.context.getImageData(0,0, 200,150).data;
		    console.log(data);
			stream.write(data);
			console.log('wrote stream');
		}
	}



};
