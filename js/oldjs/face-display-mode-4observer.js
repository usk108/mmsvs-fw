// モーダルの定義の仕方
var FaceDisplayMode4Observer = {
	output_area : null,
	control_bar : null,
	room : null,
	receiving : false,

	client : new BinaryClient('ws://' + window.location.host + ':9001'),


	init : function(modeconfig) {
		//タグを知る
		this.output_area = modeconfig.output_area;
		this.control_bar = modeconfig.control_bar;

	},

	attachEvents : function() {

		var self = this;
		client.on('open', function(){
		  self.stream = self.client.createStream({room: room, type: 'read'});
		  self.stream.on('data', function(data) {
			if(self.receiving){
				console.log('in attachEvents receiving is '+self.receiving);
				self.receive(data);
			}
		  });
		});
	},

	finalize : function() {

	},

	run : function() {
		this.receiving = true;
		console.log('receiving is '+this.receiving);
	},

	stop : function() {
		this.receiving = false;
		//見るとこも消す？
	},

	receive : function(message) {
	    var t = this.context.getImageData(0,0, 200, 1600);
	    t.data.set(new Uint8ClampedArray(data));
	    this.context.putImageData(t, 0, 0);
		console.log('wrote image');
	},

	sendToAll : function(message) {
	}

};
